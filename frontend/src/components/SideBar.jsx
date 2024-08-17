import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const SideBar = () => {
  const { currentUsers, user } = useContext(UserContext);
  // console.log(currentUsers);
  return (
    <aside className="bg-primary hidden sm:block sm:flex flex-col text-white overflow-auto">
      <div className="flex flex-col h-screen justify-between">
        <div className="mb-14  ">
          <div id="title" className=" text-xl font-medium p-2 ">
            <p>Chat X</p>
          </div>
          <p className="font-medium pl-2">Users Online:</p>
          <ul className="overflow-auto">
            {currentUsers &&
              currentUsers.map((user, index) => {
                return (
                  <li
                    key={index}
                    className="pl-2 hover:bg-primaryHover p-2 flex justify-center cursor-pointer"
                  >
                    {user.username}
                  </li>
                );
              })}
          </ul>
        </div>
        <div id="userInfo">
          <button
            type="submit"
            className="bg-buttonPrimaryHover rounded w-full text-white font-medium py-2 hover:bg-buttonPrimaryHover2"
          >
            Join Room
          </button>
          <p className="font-medium pl-2 p-2">Username: {user?.username}</p>
          <p className="font-medium pl-2 p-2">Room: {user?.roomId}</p>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
