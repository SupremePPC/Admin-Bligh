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
import { format, isToday, isYesterday } from "date-fns";
import "./styles.css";
import { db } from "../../firebaseConfig/firebase";

// TODO
// When a chat is closed, the user should be moved to the next chat in the list.
// Handle new message alert for admin
// Handle chat status for admin
// Handle chat status for user
// Handle new message alert for user
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
  const loadChats = async () => {
    try {
      fetchChats(db, setChats);
    } catch (error) {
      console.error(error);
      setError("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadChats();
  }, []);

  //Handle chat selection
  const handleChatSelection = (userUid, userName) => {
    setLoading(true);

    // Unsubscribe from any previous chat updates
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe to the new chat's updates
    unsubscribeRef.current = fetchChatMessages(
      userUid,
      (chats) => {
        if (chats.length > 0) {
          setSelectedChat({
            userId: userUid,
            messages: newMessage,
            userName: userName,
            chatId: chats[0].chatId,
          });
        } else {
          setSelectedChat(null); // Handle case where there are no chats
        }
        setLoading(false);
      },
      (error) => {
        console.error("Failed to fetch chat messages:", error);
        setError(error.message);
        setLoading(false);
      }
    );
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
  const handleCloseChat = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to close this chat?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Close it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await closeChat(db, userId);

          Swal.fire("Closed!", "The chat has been closed.", "success");

          // Update chats in state and reset selected chat
          setChats(chats.filter((chat) => chat.id !== chat.chatId));
          setSelectedChat(null);
          loadChats();
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

    try {
      setLoading(true);
      await sendMessage(selectedChat.userId, newMessage);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  // Real-time chat updates
  useEffect(() => {
    if (!selectedChat) return undefined;

    const userUid = selectedChat.userId;
    const chatId = selectedChat.chatId;

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
      {chats.length === 0 ? (
        <div className="chatPage_header">
          <div className="chatPage_icon">
            <img src={chat_icon} alt="chat icon" />
          </div>
          <div className="chatPage_title">
            <h4>You have messages no messages!</h4>
          </div>
        </div>
      ) : (
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
      )}

      {chats.length === 0 ? (
        <div className="chatBox_banner" style={{ height: "72%" }}>
          <AiFillWechat size={80} />
          <h4>No messages.</h4>
        </div>
      ) : (
        <div className="chatBox">
          <div className="usersChat">
            <div className="usersChat_header">
              <h4>All messages</h4>
            </div>
            {chats.map((user) => (
              <div
                key={user.userId}
                className="userName"
                onClick={() => handleChatSelection(user.userId, user.userName)}
                title="Click to view chat"
              >
                <p className="name">{user.userName} </p>
              </div>
            ))}
          </div>

          {loading ? (
            <LoadingScreen />
          ) : (
            selectedChat ? (
              <ChatBox
                selectedChat={selectedChat}
                handleSendMessage={handleSendMessage}
                loading={loading}
                closeChat={() => handleCloseChat(selectedChat.userId)}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
              />
            ) : (
              <div className="chatBox_banner">
                <AiFillWechat size={80} />
                <h4>Click on a chat to start responding.</h4>
              </div>
            )
          )}

          {/* {selectedChat ? (
            <ChatBox
              selectedChat={selectedChat}
              handleSendMessage={handleSendMessage}
              loading={loading}
              closeChat={() => handleCloseChat(selectedChat.userId)}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
            />
          ) : (
            <div className="chatBox_banner">
              <AiFillWechat size={80} />
              <h4>Click on a chat to start responding.</h4>
            </div>
          )} */}
        </div>
      )}
    </section>
  );
}

// const formatTimestamp = (timeStamp) => {
//   console.log(timeStamp);
//   if (!timeStamp) return "";

//   const date = timeStamp.toDate(); // Convert Firestore timestamp to JavaScript Date object

//   if (isToday(date)) {
//     // If the message was sent today, return only the time
//     return format(date, "p"); // 'p' is for the local time format
//   } else if (isYesterday(date)) {
//     // If the message was sent yesterday, return 'Yesterday'
//     return "Yesterday";
//   } else {
//     // Otherwise, return the full date
//     return format(date, "PPP"); // 'PPP' is for the longer date format, e.g., Jun 20, 2020
//   }
// };
{
  /* <p className="newMsg_alert">
                    {formatTimestamp(user.timeStamp)}
                  </p> */
}
{
  /* {user.read ? (
                    <p className="newMsg_alert">New</p>
                  ) : (
                    <BsCheckAll className="msgAlert" />
                  )} */
}
