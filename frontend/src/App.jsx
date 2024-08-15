import { useContext, useEffect, useRef } from "react";
import Chat from "./pages/Chat.jsx";
import SideBar from "./components/SideBar.jsx";
import { UserContext } from "./context/UserContext.jsx";
import { useCookie } from "./hooks/useCookie.js";

const App = () => {
  const { getItem } = useCookie();
  const LoggedInUser = getItem("user");
  const LoggedInUserRef = useRef(LoggedInUser);
  const { user, setUser, currentUsers, setCurrentUsers } =
    useContext(UserContext);

  const setUserRef = useRef(setUser);

  useEffect(() => {
    if (LoggedInUserRef.current) {
      setUserRef.current(LoggedInUserRef.current);
    }
  }, []);

  const values = {
    user,
    currentUsers,
    setCurrentUsers,
    setUser,
  };

  // console.log(currentUsers);
  return (
    <div className="grid grid-cols-5 h-screen">
      <UserContext.Provider value={values}>
        <SideBar />
        <Chat />
      </UserContext.Provider>
    </div>
  );
};

export default App;
