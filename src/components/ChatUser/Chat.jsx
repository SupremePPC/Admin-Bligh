import React from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";

export default function ChatBox({
  selectedChat,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isLoading,
  closeChat,
}) {
  return (
    <div className="chatUser">
      <div className="chatUser_header">
        <h4>
          You are now chatting with {selectedChat.user}
        </h4>
        <div className="chatUser_toolBox">
          <button className="close_btn" title="Delete Chat" onClick={closeChat}>
            <MdDelete size={20} />
          </button>
          <button className="view_btn" title="View Profile">
            <Link to={`/dashboard/user-overview/${selectedChat.id}`}>
              <IoPersonCircleOutline size={20} />
            </Link>
          </button>
        </div>
      </div>
      <div className="chatPage_chats">
        <p className="chat user">
          <span className="timeStamp">{selectedChat.timeStamp}</span>
          <span className="chatName">{selectedChat.user}</span>
          <span className="chatMsg">{selectedChat.chat}</span>
        </p>
        {/* <p className="chat admin">
              <span className="chatName">Admin</span>
              <span className="chatMsg">Yes, how can we help you?</span>
            </p> */}
      </div>
      <div className="chatPage_chatbox">
        <textarea
          className="chatbox_banner"
          placeholder="Write a reply..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <input
          type="submit"
          value="Send"
          className="chatbox_button"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
}
