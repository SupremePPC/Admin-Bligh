import React, { useEffect, useRef, useState } from "react";
import chat_icon from "../../assets/live_chat.png";
import Header from "./Header";
import { BsCheckAll } from "react-icons/bs";
import Swal from "sweetalert2";
import { AiFillWechat } from "react-icons/ai";
import {
  fetchChats,
  closeChat,
  fetchChatMessages,
  sendMessage,
  subscribeToChatUpdates,
} from "../../firebaseConfig/firestore";
import ChatBox from "./Chat";
import LoadingScreen from "../LoadingScreen";
import "./styles.css";

// TODO
// When data is loading (e.g., fetching chats), only the exact chat that is clicked on should be loading or the exact element that is loading should be loading, not the entire page.
// When a chat is closed, the user should be moved to the next chat in the list.
// Handle send chat for admin
// Handle new message alert for admin
// Handle chat status for admin
// Handle chat status for user
// Handle new message alert for user
// Handle send chat for user
//Handle chat count for admin so that the admin can see how many chats are open
//Handle new unread messages count for admin so that the admin can see how many messages are new from all chats combined

export default function ChatWithUser() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const unsubscribeRef = useRef(null);

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
  const handleChatSelection = (userUid, chatId) => {
    if (!chatId) return;

    setLoading(true);

    // Unsubscribe from any previous chat updates
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe to the new chat's updates
    unsubscribeRef.current = fetchChatMessages(userUid, chatId, (chatData) => {
      setSelectedChat({ ...chatData, id: chatId });
      setLoading(false);
    });
  };

  useEffect(() => {
    return () => {
      // Cleanup: unsubscribe from the current chat when the component unmounts
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

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

    const userUid = selectedChat.userId; // Replace with the correct way to get userUid
    const chatId = selectedChat.chatId; // Replace with the correct way to get chatId

    const unsubscribe = subscribeToChatUpdates(
      userUid,
      chatId,
      (updatedMessages) => {
        setSelectedChat((currentSelectedChat) => {
          return { ...currentSelectedChat, messages: updatedMessages };
        });
      }
    );

    return () => unsubscribe();
  }, [selectedChat?.userUid, selectedChat?.id]);

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
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <div className="usersChat">
              <div className="usersChat_header">
                <h4>All messages</h4>
              </div>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="userName"
                  onClick={() => handleChatSelection(chat.id)}
                  title="Click to view chat"
                >
                  <p className="name">{chat.user}</p>
                  {/* Display New or Message alert based on chat status */}
                  {chat.newMessage ? (
                    <p className="newMsg_alert">New</p>
                  ) : (
                    <BsCheckAll className="msgAlert" />
                  )}
                </div>
              ))}
            </div>
            { selectedChat ? (
            <ChatBox
              selectedChat={selectedChat}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              user={selectedChat.userName}
              isLoading={loading}
            />
            ) : (
            <div className="chatBox_banner">
              <AiFillWechat size={50} />
              <h4>Click on a chat to start responding.</h4>
            </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
