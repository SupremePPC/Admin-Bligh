import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { format, isToday, isYesterday } from "date-fns";
import { fetchChatMessages } from "../../firebaseConfig/firestore";

export default function ChatBox({
  selectedChat,
  handleSendMessage,
  closeChat,
  newMessage,
  setNewMessage
}) {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedChat) {
      setIsLoading(true);
      const unsubscribe = fetchChatMessages(selectedChat.userId, (messages) => {
        setChats(messages);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [selectedChat]);

  const formatTimestamp = (timeStamp) => {
    if (!timeStamp) return "";

    const date = timeStamp.toDate(); // Convert Firestore timestamp to JavaScript Date object

    if (isToday(date)) {
      // If the message was sent today, return only the time
      return format(date, "p"); // 'p' is for the local time format
    } else if (isYesterday(date)) {
      // If the message was sent yesterday, return 'Yesterday'
      return "Yesterday";
    } else {
      // Otherwise, return the full date
      return format(date, "PPP"); // 'PPP' is for the longer date format, e.g., Jun 20, 2020
    }
  };

  return (
    <div className="chatUser">
      <div className="chatUser_header">
        <h4>You are now chatting with {selectedChat.userName}</h4>
        <div className="chatUser_toolBox">
          <button className="close_btn" title="Delete Chat" onClick={() =>
              closeChat(selectedChat.userId)
            }>
            <MdDelete size={20} />
          </button>
          <button className="view_btn" title="View Profile">
            <Link to={`/dashboard/user-overview/${selectedChat.userId}`}>
              <IoPersonCircleOutline size={20} />
            </Link>
          </button>
        </div>
      </div>
      <div className="chatPage_chats">
        {chats.map((message, index) => (
          <p
            key={index}
            className={`chat ${message.user === "client" ? "user" : "admin"}`}
          >
            <span className="timeStamp">
              {formatTimestamp(message.timeStamp)}
            </span>
            <span className="chatName">
              {message.user === "client" ? message.userName : "You"}:
            </span>
            <span className="chatMsg">{message.chat}</span>
          </p>
        ))}
      </div>
      <div className="chatPage_chatbox">
        <textarea
          className="chatbox_banner"
          placeholder="Write a reply..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="chatbox_button"
          onClick={handleSendMessage}
          type="submit"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
