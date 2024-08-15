import { useEffect, useState } from "react";
import socket from "./utils/socket.js";
import Chat from "./pages/Chat.jsx";
import SideBar from "./components/SideBar.jsx";

const App = () => {
  const [currentUsers, setCurrentUsers] = useState([]);

  useEffect(() => {
    socket.on("chatroom_users", (data) => {
      setCurrentUsers(data);
    });
    return () => {
      socket.off("chatroom_users");
    };
  }, [currentUsers]);
  return (
    <div className="grid grid-cols-5 min-h-screen">
      <SideBar currentUsers={currentUsers} />
      <Chat currentUsers={currentUsers} />
    </div>
  );
};

export default App;
