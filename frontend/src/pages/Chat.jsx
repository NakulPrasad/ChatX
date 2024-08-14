import React, { useEffect, useState } from "react";
import socket from "../utils/socket.js";
import { toast } from "react-toastify";
import img from "../assets/user.jpg";
import { useCookie } from "../hooks/useCookie.js";
import Message from "../components/Message.jsx";
const Chat = () => {
  const { getItem } = useCookie();
  const [messages, setMessages] = useState([]);
  const LoggedInUser = getItem("user");
  console.log(LoggedInUser);

  useEffect(() => {
    socket.on("join_room_greet", (data) => {
      toast.info(data.message);
    });

    socket.on("receive_message", (data) => {
      const { sender_name, content, room, created_time } = data;
      console.log(data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender_name, content, room, created_time },
      ]);
    });

    return () => {
      socket.off("join_room_greet");
      socket.off("receive_message");
    };
  }, []);

  let msgToSend = "";
  const handleChange = (e) => {
    msgToSend = e.target.value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("send_message", {
      sender_name: LoggedInUser?.username,
      room: LoggedInUser?.room,
      created_time: Date.now(),
      content: msgToSend,
    });
  };
  return (
    <section id="chatscreen" className="h-screen col-span-4 p-2 overflow-auto">
      <ul className=" pb-6">
        {/* {Object.entries(messages).map(([date, messagesForDate]) => (
              <React.Fragment key={date}>
                <li>
                  <p className="text-center text-textSecondary text-sm">{date}</p>
                </li>
                {messagesForDate.map((message) => (
                  <Message
                    key={message.id}
                    content={message.content}
                    timestamp={message.timestamp}
                    sender={message.sender}
                  />
                ))}
              </React.Fragment>
            ))} */}
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message?.content}
            timestamp={message?.created_time}
            sender={message?.sender_name}
          />
        ))}
      </ul>

      <div
        id="chatInputField"
        className="absolute bottom-2 grid grid-cols-5 right-2 left-2 "
      >
        <div className="flex items-center">
          <p className="flex-1">Id : {LoggedInUser?.id | ""}</p>
          <p className="flex-1">
            Username : {LoggedInUser?.username | ""}
          </p>{" "}
          <p className="flex-1">Room : {LoggedInUser?.room | ""}</p>
        </div>
        <div className="col-span-4 col-start-2 flex">
          <input
            type="text"
            title="chatInput"
            name="chatInput"
            placeholder="Message ..."
            onChange={handleChange}
            className="border-2 bg-slate-200 px-2 py-1 w-full border-secondary rounded-full focus:ring-secondaryHover"
          />
          <button type="submit" onClick={handleSubmit}>
            <img src={img} alt="sendButton" className="w-8 mx-1 rounded-full" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Chat;
