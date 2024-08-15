import { toast } from "react-toastify";
import socket from "../utils/socket";
import { useContext, useEffect, useRef } from "react";
import { useCookie } from "./useCookie";
import { UserContext } from "../context/UserContext";

export const useSocket = () => {
    const { getItem } = useCookie()
    const LoggedInUser = getItem('user')
    const { currentUsers, setCurrentUsers } = useContext(UserContext)
    const setCurrentUsersRef = useRef(setCurrentUsers)
    useEffect(() => {
        socket.on("connect", () => {
            toast.success("Server Connected");
        });

        socket.on("disconnect", () => {
            toast.error("Server Disconnected");
        });


        socket.on("chatroom_users", (data) => {
            setCurrentUsersRef.current(data);
        });


        return () => {
            socket.off('disconnect')
            socket.off('connect')
            socket.off('chatroom_users')
        }
    }, [])

    const fetchUsers = () => {
        socket.timeout(1000).emit("request_chatroom_users", LoggedInUser, (err, res) => {
            if (!res.success) toast.error(res.message | 'Error while fetching chatroom users')
            setCurrentUsers(res.users)
        });
    }


    return { socket, currentUsers, fetchUsers };
};
