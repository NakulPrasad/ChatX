import { useEffect, useState } from "react";
import socket from "./utils/Socket.js";
import Chat from "./pages/Chat.jsx";

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
    <div>
      <Chat currentUsers={currentUsers} />
    </div>
  );
};

export default App;
