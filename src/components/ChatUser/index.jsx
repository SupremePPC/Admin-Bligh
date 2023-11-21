import React from "react";
import chat_icon from "../../assets/live_chat.png";
import "./styles.css";
import Header from "./Header";

export default function ChatWithUser() {
  return (
    <section className="container chatPage_wrapper">
      <Header />
      <div className="chatPage_header">
        <div className="chatPage_icon">
          <img src={chat_icon} alt="chat icon" />
        </div>
        <div className="chatPage_title">
          <h4>
            You have messages from the following users!
            <br />
            Click on a chat to start responding.
          </h4>
        </div>
      </div>
      <div className="chatBox">
        <div className="usersChat">
          <div className="userName">
            <p>John Doe</p>
            <div className="msgAlert">1</div>
          </div>
        </div>
        <div className="chatUser">
          <div className="chatPage_chats">
            <p className="chat user">
              <span className="chatName">John Doe :</span>
              <span className="chatMsg">Hello, I need help!</span>
            </p>
            <p className="chat admin">
              <span className="chatName">Admin :</span>
              <span className="chatMsg">Yes, how can we help you?</span>
            </p>
          </div>
          <div className="chatPage_chatbox">
            <textarea
              className="chatbox_banner"
              placeholder="Write a reply..."
            />
            <input type="submit" value="Send" className="chatbox_button" />
          </div>
        </div>
      </div>
    </section>
  );
}
