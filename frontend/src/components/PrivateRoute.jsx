import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useCookie } from '../hooks/useCookie'

const PrivateRoute = ({ children, redirectTo }) => {
  const { getItem } = useCookie()
  return getItem('user') ? children : <Navigate to={redirectTo} />
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string.isRequired
}

export default PrivateRoute
