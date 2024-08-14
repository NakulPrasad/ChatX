import { useState } from "react";
import socket from "../utils/socket.js";
import { toast } from "react-toastify";
import { useCookie } from "../hooks/useCookie.js";

import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const { getItem, setItem } = useCookie();
  const navigate = useNavigate();
  const [userAndRoom, setUserAndRoom] = useState({ username: "", room: "" });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserAndRoom((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      socket.timeout(5000).emit("join_room", userAndRoom, (err, res) => {
        if (res.success) {
          toast.success(res.message);
          // console.log(res.user);
          setItem("user", res.user);

          navigate("/");
        }
      });
    } catch (e) {
      toast.error(e);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          title="username"
          name="username"
          placeholder="username"
          onChange={handleChange}
          className="border-2 border-red-500 rounded"
        />
        <input
          type="text"
          title="room"
          name="room"
          placeholder="room"
          onChange={handleChange}
          className="border-2 border-red-500 rounded"
        />
        <button
          type="submit"
          className="bg-primary text-white px-3 py-1 rounded hover:bg-primaryHover"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;
