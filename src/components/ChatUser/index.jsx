import React, { useEffect, useState } from "react";
import chat_icon from "../../assets/live_chat.png";
import Header from "./Header";
import { BsCheckAll } from "react-icons/bs";
import Swal from "sweetalert2";
import {
  fetchChats,
  closeChat,
  fetchChatMessages,
  sendMessage,
  subscribeToChatUpdates,
} from "../../firebaseConfig/firestore";
import ChatBox from "./Chat";
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
    setLoading(true);
    try {
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
          // await closeChat(chatId);\
          setLoading(true);
          await closeChat(chatId);
          Swal.fire("Closed!", "The chat has been closed.", "success");
          // Update chats in state
          setChats(chats.filter((chat) => chat.id !== chatId));
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Failed to close the chat", "error");
        } finally {
          setLoading(false);
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
  
    const unsubscribe = subscribeToChatUpdates(selectedChat.id, (updatedMessages) => {
      setSelectedChat(currentSelectedChat => {
        // Ensure we are updating the latest state
        return { ...currentSelectedChat, messages: updatedMessages };
      });
    });
  
    return () => unsubscribe();
  }, [selectedChat?.id]); // Depend on selectedChat.id instead of the entire selectedChat object
  

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
          <ChatBox
            selectedChat={selectedChat}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            user={selectedChat.userName}
          />
        )}
      </div>
    </section>
  );
}
