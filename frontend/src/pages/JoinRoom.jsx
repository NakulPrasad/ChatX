import { toast } from "react-toastify";
import { useCookie } from "../hooks/useCookie.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useChatRoomManager from "../hooks/useChatRoomManager.js";
import sideImage from "/join.gif";

const JoinRoom = () => {
  const navigate = useNavigate();
  const { setItem } = useCookie();
  const { joinRoom } = useChatRoomManager();
  const [userAndRoom, setUserAndRoom] = useState({ username: "", room: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserAndRoom((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const joined = joinRoom(userAndRoom);
      if (joined) {
        navigate("/");
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <section className="min-h-screen grid sm:grid-cols-2">
      <div className="flex justify-center items-center ">
        <div id="form" className="sm:w-8/12">
          <p className="font-bold text-2xl text-primary sm:mb-4 mb-4 block">
            Join Room
          </p>

          <form onSubmit={handleSubmit}>
            <fieldset>
              <div className="flex flex-col sm:my-4">
                <label htmlFor="username" className="mb-2">
                  Username
                </label>
                <input
                  type="text"
                  title="username"
                  name="username"
                  placeholder="John"
                  required
                  onChange={handleChange}
                  className="border-2 rounded border-slate-300 pl-1"
                />
              </div>
              <div className="flex flex-col sm:mb-4">
                <label htmlFor="password" className="mb-2">
                  Room
                </label>
                <input
                  type="text"
                  title="room"
                  name="room"
                  placeholder="React"
                  minLength={4}
                  onChange={handleChange}
                  maxLength={15}
                  className="border-2 rounded border-slate-300 pl-1"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-buttonPrimary rounded w-full text-white font-medium py-2 hover:bg-buttonPrimaryHover"
              >
                Join
              </button>
            </fieldset>
          </form>
        </div>
      </div>
      <div
        className="hidden sm:block bg-cover bg-center"
        style={{ backgroundImage: `url(${sideImage})` }}
      ></div>
    </section>
  );
};

export default JoinRoom;
