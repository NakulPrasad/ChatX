import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'
import JoinRoom from './pages/JoinRoom.jsx'
import ErrorPage from './pages/Error.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { UserProvider } from './context/UserContext.jsx'
import PropTypes from 'prop-types'
import PrivateRoute from './components/PrivateRoute.jsx'
import { ROUTES } from './utils/routes.js'
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <PrivateRoute redirectTo='/join'>
        <App />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: ROUTES.JOIN,
    element: <JoinRoom />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
)

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired
}
