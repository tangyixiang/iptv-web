import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ALayout from './components/ALayout'
import IptvPlan from './pages/IptvPlan'
import Devices from './pages/Devices'
import DeviceConfig from './pages/DeviceConfig'
import Location from './pages/Location'
import Rom from './pages/Rom'
import Login from './pages/Login'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ALayout />,
    children: [
      {
        path: '/devices',
        element: <Devices />,
      },
      {
        path: '/device/config',
        element: <DeviceConfig />,
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
