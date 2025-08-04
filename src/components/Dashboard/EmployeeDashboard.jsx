import React, { useState, useEffect } from 'react'

const EmployeeDashboard = ({ data, changeUser }) => {
  const [userTasks, setUserTasks] = useState([])
  const [taskCounts, setTaskCounts] = useState({
    active: 0,
    newTask: 0,
    completed: 0,
    failed: 0,
  })

  useEffect(() => {
    if (data?.tasks) {
      setUserTasks(data.tasks)
      setTaskCounts(data.taskCounts || {})
    }
  }, [data])

  // Update task status and sync to localStorage
  const updateTaskStatus = (index, statusKey) => {
    const updatedTasks = [...userTasks]
    if (statusKey === 'completed') {
      updatedTasks[index].completed = true
      updatedTasks[index].active = false
      updatedTasks[index].newTask = false
    } else if (statusKey === 'failed') {
      updatedTasks[index].failed = true
      updatedTasks[index].active = false
      updatedTasks[index].newTask = false
    }

    setUserTasks(updatedTasks)

    // Update counts
    const updatedCounts = {
      active: 0,
      newTask: 0,
      completed: 0,
      failed: 0,
    }

    updatedTasks.forEach(task => {
      if (task.active) updatedCounts.active += 1
      if (task.newTask) updatedCounts.newTask += 1
      if (task.completed) updatedCounts.completed += 1
      if (task.failed) updatedCounts.failed += 1
    })

    setTaskCounts(updatedCounts)

    // Update localStorage
    const employees = JSON.parse(localStorage.getItem('employees')) || []
    const updatedEmployees = employees.map(emp => {
      if (emp.id === data.id) {
        emp.tasks = updatedTasks
        emp.taskCounts = updatedCounts
      }
      return emp
    })
    localStorage.setItem('employees', JSON.stringify(updatedEmployees))

    // Update loggedInUser as well
    localStorage.setItem(
      'loggedInUser',
      JSON.stringify({ role: 'employee', data: { ...data, tasks: updatedTasks, taskCounts: updatedCounts } })
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Hello <span className="font-bold">{data?.firstName || 'Employee'}</span> 👋
        </h2>
        <button
          onClick={() => {
            localStorage.removeItem('loggedInUser')
            changeUser(null)
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>

      {/* Task Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 rounded-lg p-4 text-center">
          <h3 className="text-2xl font-bold">{taskCounts.newTask}</h3>
          <p>New Task</p>
        </div>
        <div className="bg-green-500 rounded-lg p-4 text-center">
          <h3 className="text-2xl font-bold">{taskCounts.completed}</h3>
          <p>Completed Task</p>
        </div>
        <div className="bg-yellow-400 rounded-lg p-4 text-center">
          <h3 className="text-2xl font-bold">{taskCounts.active}</h3>
          <p>Accepted Task</p>
        </div>
        <div className="bg-red-500 rounded-lg p-4 text-center">
          <h3 className="text-2xl font-bold">{taskCounts.failed}</h3>
          <p>Failed Task</p>
        </div>
      </div>

      {/* Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userTasks.map((task, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="bg-red-600 text-sm px-2 py-1 rounded-full">
                {task.category || 'No Category'}
              </span>
              <span className="text-sm text-gray-300">
                {task.taskDate || 'No Date'}
              </span>
            </div>
            <h3 className="text-lg font-bold">{task.taskTitle || 'Untitled Task'}</h3>
            <p className="text-gray-300 mb-4">
              {task.taskDescription || 'No Description Provided'}
            </p>

            {task.completed ? (
              <span className="text-green-400 font-semibold">Completed</span>
            ) : task.failed ? (
              <span className="text-red-400 font-semibold">Failed</span>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => updateTaskStatus(index, 'completed')}
                  className="bg-green-600 px-3 py-1 text-sm rounded hover:bg-green-700"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => updateTaskStatus(index, 'failed')}
                  className="bg-red-600 px-3 py-1 text-sm rounded hover:bg-red-700"
                >
                  Mark as Failed
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmployeeDashboard
