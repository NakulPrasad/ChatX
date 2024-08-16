import { toast } from "react-toastify";
import socket from "../utils/socket";
import { useContext, useEffect, useRef, useState } from "react";
import { useCookie } from "./useCookie";
import { UserContext } from "../context/UserContext";

const useChatRoomManager = () => {
    const { getItem, setItem } = useCookie()
    const LoggedInUser = getItem('user')
    const LoggedInUserRef = useRef(LoggedInUser)
    const { currentUsers, setCurrentUsers } = useContext(UserContext)
    const setCurrentUsersRef = useRef(setCurrentUsers)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userJoinOrLeave, setUserJoinOrLeave] = useState(false)
    useEffect(() => {
        socket.on("connect", () => {
            toast.success("Server Connected");
            setIsLoggedIn(true)
        });

        socket.on("disconnect", () => {
            toast.error("Server Disconnected");
            setIsLoggedIn(false)
        });

        socket.on("user_disconnect", () => {
            setUserJoinOrLeave(prev => !prev)
        });

        socket.on("join_room_greet", () => {
            setUserJoinOrLeave(prev => !prev)
        });

        return () => {
            socket.off('disconnect')
            socket.off('connect')
            socket.off('user_disconnect')
            socket.off("join_room_greet")
        }
    }, [])

    useEffect(() => {
        socket.timeout(1000).emit("join_room", LoggedInUserRef.current, (err, res) => {
            if (res?.success) {
                toast.success(`Joined Room ${LoggedInUserRef.current.room}`);
            }
        });
    }, [isLoggedIn])

    useEffect(() => {
        socket.timeout(1000).emit("request_chatroom_users", LoggedInUserRef.current, (err, res) => {
            if (!res.success) toast.error(res.message | 'Error while fetching chatroom users')
            setCurrentUsersRef.current(res.users)
        });
    }, [userJoinOrLeave, isLoggedIn])

    const joinRoom = (userAndRoom) => {
        socket.timeout(1000).emit("join_room", userAndRoom, (err, res) => {
            if (!res?.success) {
                toast.error(res?.message);
                return false
            } else if (res?.success) {
                toast.success(res?.message);
                setItem("user", res?.user);
                return true
            }
        });
    }

    const sendMessage = (message) => {
        const msgBodyToSend = {
            sender_name: LoggedInUserRef.current?.username,
            room: LoggedInUserRef.current?.room,
            createdAt: Date.now(),
            content: message,
        };
        socket.timeout(1000).emit("send_message", msgBodyToSend, (err, res) => {
            if (err) {
                socket.emit("send_message", msgBodyToSend);
            }
        });
    }



    return { socket, currentUsers, sendMessage, joinRoom };
};

export default useChatRoomManager