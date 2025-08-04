import React, { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { AuthContext } from './context/AuthProvider'

const App = () => {
  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const [userData, setUserData] = useContext(AuthContext)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')

    if (loggedInUser) {
      const parsed = JSON.parse(loggedInUser)
      const role = parsed.role

      if (role === 'admin') {
        setUser('admin')
        setLoggedInUserData({ firstName: 'Partha', ...parsed.data }) // or pull from admin array
      } else if (role === 'employee') {
        // Always pull latest employee data
        const allEmployees = JSON.parse(localStorage.getItem('employees')) || []
        const latestEmployee = allEmployees.find(emp => emp.id === parsed.data.id)
        if (latestEmployee) {
          setUser('employee')
          setLoggedInUserData(latestEmployee)
        }
      }
    }
  }, [])

  const handleLogin = (email, password) => {
    if (email === 'admin@example.com' && password === '123') {
      const adminData = { firstName: 'Partha', email, password }
      setUser('admin')
      setLoggedInUserData(adminData)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin', data: adminData }))
    } else if (userData) {
      const employee = userData.find(e => email === e.email && e.password === password)
      if (employee) {
        setUser('employee')
        setLoggedInUserData(employee)
        localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', data: employee }))
      } else {
        alert('Invalid Credentials')
      }
    } else {
      alert('Invalid Credentials')
    }
  }

  return (
    <>
      {!user ? (
        <Login handleLogin={handleLogin} />
      ) : user === 'admin' ? (
        <AdminDashboard changeUser={setUser} data={loggedInUserData} />
      ) : user === 'employee' ? (
        <EmployeeDashboard changeUser={setUser} data={loggedInUserData} />
      ) : null}
    </>
  )
}

export default App
