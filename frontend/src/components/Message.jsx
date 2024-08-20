import { useContext } from "react";
import img from "../assets/user.jpg";
import PropTypes from "prop-types";
import { UserContext } from "../context/UserContext";
import DateObject from "react-date-object";

const Message = ({ content, timestamp, sender }) => {
  const { user } = useContext(UserContext);
  const styleParent = `flex  items-center flex-cols my-4 ${
    user.username === sender && "flex-row-reverse"
  }`;
  const styleMsg = `mx-2  rounded p-2 ${
    user.username === sender
      ? "bg-blue-400 hover:bg-blue-500"
      : "bg-blue-300 hover:bg-blue-400"
  }`;
  const date = new DateObject(timestamp);
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
          <p className="text-textSecondary inline ml-2">
            {date.format("DD/MM hh:mm a")}
          </p>
          <p className="">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;

Message.propTypes = {
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  sender: PropTypes.string.isRequired,
};
