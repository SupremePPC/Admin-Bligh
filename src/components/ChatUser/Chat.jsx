import React from "react";
import { Link } from "react-router-dom";

export default function ChatBox({
  selectedChat,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isLoading,
}) {
  return (
    <div className="chatUser">
      <div className="chatUser_header">
        <h4>You are now chatting with {selectedChat.user}</h4>
      </div>
      <div className="chatUser_toolBox">
        <button className="close_btn">Close chat</button>
        <button className="view_btn">
          <Link to={`/dashboard/user-overview/${selectedChat.id}`}>
            View profile
          </Link>
        </button>
      </div>
      <div className="chatPage_chats">
        {isLoading ? (
         <></>
        ) : (
          <>
            <p className="chat user">
              <span className="timeStamp">{selectedChat.timeStamp}</span>
              <span className="chatName">{selectedChat.user}</span>
              <span className="chatMsg">{selectedChat.chat}</span>
            </p>
            {/* <p className="chat admin">
              <span className="chatName">Admin</span>
              <span className="chatMsg">Yes, how can we help you?</span>
            </p> */}
          </>
        )}
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
