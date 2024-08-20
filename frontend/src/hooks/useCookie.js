import Cookies from 'js-cookie'
export const useCookie = () => {
  const setItem = (name, value) => {
    try {
      Cookies.set(name, JSON.stringify(value), { expires: 1 })
    } catch (error) {
      console.error(error)
    }
  }
  const getItem = (name) => {
    try {
      const value = Cookies.get(name)
      return JSON.parse(value) || null
    } catch (error) {
      console.error(error)
    }
  }
  const removeItem = (name) => {
    try {
      Cookies.remove(name)
    } catch (error) {
      console.error(error)
    }
  }
  return { setItem, getItem, removeItem }
}
