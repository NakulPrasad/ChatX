import { createContext, useState } from 'react'
import PropTypes from 'prop-types'
export const UserContext = createContext({
  currentUsers: [],
  user: {},
  setCurrentUsers: () => {},
  setUser: () => {}
})

export const UserProvider = ({ children }) => {
  const [currentUsers, setCurrentUsers] = useState()
  const [user, setUser] = useState()
  const values = {
    currentUsers,
    user,
    setCurrentUsers,
    setUser
  }
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>
}

UserProvider.propTypes = {
  children: PropTypes.array
}
