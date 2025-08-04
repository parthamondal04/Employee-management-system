import React, { useState, useEffect } from 'react'

const AdminDashboard = ({ changeUser, data }) => {
  const [employees, setEmployees] = useState([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDate, setTaskDate] = useState('')
  const [assignTo, setAssignTo] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || []
    setEmployees(storedEmployees)
  }, [])

  const handleCreateTask = () => {
    if (!taskTitle || !taskDescription || !taskDate || !assignTo || !category) {
      alert('All fields are required!')
      return
    }

    const newTask = {
      taskTitle,
      taskDescription,
      taskDate,
      category,
      active: true,
      newTask: true,
      completed: false,
      failed: false,
    }

    const updatedEmployees = employees.map(emp => {
      if (emp.firstName === assignTo) {
        emp.tasks.push(newTask)
        emp.taskCounts.newTask += 1
        emp.taskCounts.active += 1
      }
      return emp
    })

    localStorage.setItem('employees', JSON.stringify(updatedEmployees))
    setEmployees(updatedEmployees)

    alert('Task assigned successfully!')

    // Reset form
    setTaskTitle('')
    setTaskDescription('')
    setTaskDate('')
    setAssignTo('')
    setCategory('')
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    changeUser(null)
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Hello <span className="text-yellow-400">{data?.firstName || 'Admin'}</span> 👋
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="date"
            value={taskDate}
            onChange={e => setTaskDate(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Assign to (employee name)"
            value={assignTo}
            onChange={e => setAssignTo(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Category (Design, Dev, etc)"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <textarea
            placeholder="Description"
            value={taskDescription}
            onChange={e => setTaskDescription(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white md:col-span-2"
            rows="4"
          ></textarea>
        </div>
        <button
          onClick={handleCreateTask}
          className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white"
        >
          Create Task
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Employee Overview</h3>
        <table className="w-full text-sm text-left text-white">
          <thead className="text-sm bg-red-600">
            <tr>
              <th className="py-2 px-3">Employee Name</th>
              <th className="py-2 px-3">New Task</th>
              <th className="py-2 px-3">Active Task</th>
              <th className="py-2 px-3">Completed</th>
              <th className="py-2 px-3">Failed</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-b border-gray-700 text-center">
                <td className="py-2">{emp.firstName}</td>
                <td className="py-2 text-blue-400">{emp.taskCounts?.newTask || 0}</td>
                <td className="py-2 text-yellow-400">{emp.taskCounts?.active || 0}</td>
                <td className="py-2 text-green-400">{emp.taskCounts?.completed || 0}</td>
                <td className="py-2 text-red-400">{emp.taskCounts?.failed || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard
