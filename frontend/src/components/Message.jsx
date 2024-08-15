import img from "../assets/user.jpg";
import { useCookie } from "../hooks/useCookie";

const Message = ({ content, timestamp, sender }) => {
  const { getItem } = useCookie();
  const currentUser = getItem("user");
  const styleParent = `flex  items-center flex-cols my-4 ${
    currentUser.username === sender && "flex-row-reverse"
  }`;
  const styleMsg = `mx-2  rounded p-2 ${
    currentUser.username === sender
      ? "bg-blue-400 hover:bg-blue-500"
      : "bg-blue-300 hover:bg-blue-400"
  }`;
  return (
    <div className={styleParent}>
      <img
        src={img}
        alt="userimg"
        className="w-8 rounded-full object-cover mx-2 hover:ring-1 ring-secondary"
      />
      <div>
        <div className={styleMsg}>
          <p className="font-medium inline">{sender}</p>
          <p className="text-textSecondary inline ml-2">{timestamp}</p>
          <p className="">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
