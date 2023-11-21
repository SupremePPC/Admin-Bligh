import React from "react";
import chat_icon from "../../assets/live_chat.png";
import "./styles.css";

export default function ChatWithUser() {
  return (
    <section className="container chatPage_wrapper">
      <div className="header_banner">
        <h4>Live Chat</h4>
      </div>
      <div className="chatPage_header">
        <div className="chatPage_icon">
          <img src={chat_icon} alt="chat icon" />
        </div>
        <div className="chatPage_title">
          <h4>
            Respond to user's messages in real time.
            <br />
            Use a friendly tone!
          </h4>
        </div>
      </div>
      <div className="chatPage_chats">
        <p className="chat user">
            <span className="chatName">John Doe:</span>
            <span className="chatMsg">Hello, I need help!</span>
        </p>
        <p className="chat admin">
            <span className="chatName">Admin:</span>
            <span className="chatMsg">Yes, how can we help you?</span>
        </p>
      </div>
      <div className="chatPage_chatbox">
        <textarea className="chatbox_banner" placeholder="Type here..."/>
        <input type="submit" value="Send" className="chatbox_button" />
      </div>
    </section>
  );
}
