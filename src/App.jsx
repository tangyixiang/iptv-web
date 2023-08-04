import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BaseLayout from './components/BaseLayout'
import IptvPlan from './pages/IptvPlan'
import Devices from './pages/Devices'
import Location from './pages/Location'
import Rom from './pages/Rom'
import Login from './pages/Login'
import RequireAuth from './components/RequireAuth'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <BaseLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: '/devices',
        element: <Devices />,
      },
      {
        path: '/location',
        element: <Location />,
      },
      {
        path: '/rom',
        element: <Rom />,
      },
      {
        path: '/iptv/plan',
        element: <IptvPlan />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
  // return <ALayout />
}

export default App
