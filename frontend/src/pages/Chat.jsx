import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Message from "../components/Message.jsx";
import useChatRoomManger from "../hooks/useChatRoomManager.js";
import { UserContext } from "../context/UserContext.jsx";
import DateObject from "react-date-object";

const Chat = () => {
  const { socket, sendMessage, previousMessages } = useChatRoomManger();
  const [messages, setMessages] = useState([]);
  const [msgToSend, setMsgToSend] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      const { sender_name, content, roomId, createdAt } = data;
      // console.log("Receive Messages", data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender_name, content, roomId, createdAt },
      ]);
    });

    return () => {
      socket.off("join_room_greet");
      socket.off("receiveMessage");
    };
  }, [socket, user]);

  useEffect(() => {
    setMessages(previousMessages);
  }, [previousMessages]);

  const handleChange = (e) => {
    setMsgToSend(e.target.value);
  };

  const msgBodyToSend = {
    sender_name: user?.username,
    roomId: user?.roomId,
    createdAt: Date.now(),
    content: msgToSend,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(msgToSend);
    setMessages((prevMessages) => [...prevMessages, msgBodyToSend]);
    toast.success("msg send success");
    setMsgToSend("");
  };
  return (
    <section id="chatscreen" className="h-screen col-span-4 p-2 overflow-auto">
      <ul className=" pb-6">
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message?.content}
            timestamp={message?.createdAt}
            sender={message?.sender_name}
          />
        ))}
      </ul>

      <div
        id="chatInputField"
        className="absolute bottom-2 grid grid-cols-5 right-2 left-2 "
      >
        <form onSubmit={handleSubmit} className="col-span-4 col-start-2 flex">
          <input
            type="text"
            title="chatInput"
            value={msgToSend}
            name="chatInput"
            placeholder="Message ..."
            onChange={handleChange}
            className="border-2 bg-slate-200 px-2 py-1 w-full border-secondary rounded-full focus:ring-secondaryHover"
          />
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-8 mx-1 rounded-full"
            >
              <title>arrow-right-thin-circle-outline</title>
              <path d="M20.03 12C20.03 7.59 16.41 3.97 12 3.97C7.59 3.97 3.97 7.59 3.97 12C3.97 16.41 7.59 20.03 12 20.03C16.41 20.03 20.03 16.41 20.03 12M22 12C22 17.54 17.54 22 12 22C6.46 22 2 17.54 2 12C2 6.46 6.46 2 12 2C17.54 2 22 6.46 22 12M13.54 13V16L17.5 12L13.54 8V11H6.5V13" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
};

export default Chat;
