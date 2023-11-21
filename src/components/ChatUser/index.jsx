import React, { useEffect, useState } from "react";
import chat_icon from "../../assets/live_chat.png";
import Header from "./Header";
import { BsCheckAll } from "react-icons/bs";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  fetchChats,
  fetchChatMessages,
  closeChat,
  sendMessage,
  subscribeToChatUpdates,
} from "../../firebaseConfig/firestore";
import "./styles.css";

export default function ChatWithUser() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");

  //Fetch chats
  useEffect(() => {
    const fetchAndSetChats = async () => {
      try {
        const chatsData = await fetchChats();
        setChats(chatsData);
        setSelectedChat(chatsData[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetChats();
  }, []);

  //Handle chat selection
  const handleChatSelection = async (chatId) => {
    try {
      setLoading(true);
      const chatData = await fetchChatMessages(chatId);
      setSelectedChat({ ...chatData, id: chatId });
    } catch (err) {
      console.error(err);
      setError("Failed to load chat messages");
    } finally {
      setLoading(false);
    }
  };

  // Close chat/ delete chat
  const closeChat = async (chatId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to close this chat?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, close it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await closeChat(chatId);
          Swal.fire("Closed!", "The chat has been closed.", "success");
          // Update chats in state
          setChats(chats.filter((chat) => chat.id !== chatId));
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Failed to close the chat", "error");
        }
      }
    });
  };

  // Send message
  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await sendMessage(selectedChat.id, newMessage);
      // Update the chat in state
      const updatedMessages = [
        ...selectedChat.messages,
        { user: "admin", chat: newMessage },
      ];
      setSelectedChat({ ...selectedChat, messages: updatedMessages });
      setNewMessage(""); // Clear the input field
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
    }
  };

  // Real-time chat updates
  useEffect(() => {
    if (!selectedChat) return undefined;

    const unsubscribe = subscribeToChatUpdates(
      selectedChat.id,
      (updatedMessages) => {
        setSelectedChat({ ...selectedChat, messages: updatedMessages });
      }
    );

    return () => unsubscribe();
  }, [selectedChat]);

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
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="userName"
              onClick={() => handleChatSelection(chat.id)}
            >
              <p className="name">{chat.userName}</p>
              {/* Display New or Message alert based on chat status */}
              {chat.newMessage ? (
                <p className="newMsg_alert">New</p>
              ) : (
                <BsCheckAll className="msgAlert" />
              )}
            </div>
          ))}
        </div>
        {selectedChat && (
          <div className="chatUser">
            <div className="chatUser_header">
              <h4>You are now chatting with John Doe</h4>
            </div>
            <div className="chatUser_toolBox">
              <button className="close_btn">Close chat</button>
              {/* <Link to={`/dashboard/user-overview/${user.id}`}> */}
              <button className="view_btn">View profile</button>
              {/* </Link> */}
            </div>
            <div className="chatPage_chats">
              <p className="chat user">
                <span className="chatName">John Doe</span>
                <span className="chatMsg">Hello, I need help!</span>
              </p>
              <p className="chat admin">
                <span className="chatName">Admin</span>
                <span className="chatMsg">Yes, how can we help you?</span>
              </p>
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
        )}
      </div>
    </section>
  );
}
