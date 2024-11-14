import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './components/Root.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import { UserProvider } from './context/UserContext.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index:true,
        element: <Home />
      },{
        path: 'signup',
        element: <Signup />
      },{
        path: '/login',
        element: <Login />
      },{
        path: '/logout',
        element: <Home />
      },{
        path: '/profile',
        element: <Profile />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
    <RouterProvider router={router}/>
    </UserProvider>
  </StrictMode>,
)
