import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const SideBar = () => {
  const { currentUsers, user } = useContext(UserContext);
  return (
    <aside className="bg-primary hidden sm:block sm:flex flex-col text-white">
      <div id="title" className=" text-xl font-medium p-2 ">
        <p>Chat X</p>
      </div>
      <p className="font-medium pl-2">Users Online:</p>
      <div className="shrink overflow-auto mb-14 basis-1/3 ">
        <ul className="overflow-auto">
          {currentUsers &&
            currentUsers.map((user, index) => {
              return (
                <li
                  key={index}
                  className="pl-2 hover:bg-primaryHover p-2 flex justify-center"
                >
                  {user.username}
                </li>
              );
            })}
        </ul>
      </div>
      <p className="font-medium pl-2 p-2">Username: {user?.username}</p>
      <p className="font-medium pl-2 p-2">Room: {user?.room}</p>
    </aside>
  );
};

export default SideBar;
