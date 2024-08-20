import { toast } from 'react-toastify'
import socket from '../utils/socket'
import { useContext, useEffect, useRef, useState } from 'react'
import { useCookie } from './useCookie'
import { UserContext } from '../context/UserContext'

const useChatRoomManager = () => {
  const { getItem } = useCookie()
  const LoggedInUser = getItem('user')
  const LoggedInUserRef = useRef(LoggedInUser)
  const { currentUsers, setCurrentUsers } = useContext(UserContext)
  const setCurrentUsersRef = useRef(setCurrentUsers)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userJoinOrLeave, setUserJoinOrLeave] = useState(false)
  const [previousMessages, setPreviousMessages] = useState([])

  useEffect(() => {
    socket.on('connect', () => {
      toast.success('Server Connected')
      setIsLoggedIn(true)
    })

    socket.on('disconnect', () => {
      toast.error('Server Disconnected')
      setIsLoggedIn(false)
    })

    socket.on('userDisconnect', (data) => {
      toast.info(data.message)
      setUserJoinOrLeave(prev => !prev)
    })

    socket.on('joinRoomMsg', (data) => {
      toast.info(data.message)
      setUserJoinOrLeave(prev => !prev)
    })

    return () => {
      socket.off('disconnect')
      socket.off('connect')
      socket.off('userDisconnect')
      socket.off('joinRoomMsg')
    }
  }, [])

  useEffect(() => {
    socket.on('previousMessages', (data) => {
      setPreviousMessages(data)
    })
    return () => {
      socket.off('previousMessages')
    }
  }, [])

  useEffect(() => {
    if (LoggedInUserRef.current && isLoggedIn === true) {
      // console.log(LoggedInUserRef.current);
      socket.timeout(1000).emit('join_room', LoggedInUserRef.current, (err, res) => {
        if (res?.success) {
          toast.success(`Joined Room ${LoggedInUserRef.current.roomId}`)
        }
      })
      return () => {
        socket.off('join_room')
      }
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (LoggedInUserRef.current) {
      socket.timeout(1000).emit('requestChatroomUsers', LoggedInUserRef.current, (err, res) => {
        if (err) {
          toast.error('Error while fetching chatroom users')
          console.error('Error while fetching chatroom users', err)
        }

        setCurrentUsersRef.current(res.users)
      })
    }
  }, [userJoinOrLeave, isLoggedIn])

  const sendMessage = (message) => {
    const msgBodyToSend = {
      sender_name: LoggedInUserRef.current?.username,
      roomId: LoggedInUserRef.current?.roomId,
      createdAt: Date.now(),
      content: message
    }
    socket.timeout(1000).emit('sendMessage', msgBodyToSend, (err) => {
      if (err) {
        socket.emit('sendMessage', msgBodyToSend)
        console.error('Error Occured While Sending Message', err)
      }
    })
  }

  return { socket, currentUsers, previousMessages, sendMessage }
}

export default useChatRoomManager
