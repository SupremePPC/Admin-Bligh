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

// TODO
//click on chat isn't working
// When a chat is closed, the user should be moved to the next chat in the list.
// Handle send chat for admin
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
  useEffect(() => {
    const fetchAndSetChats = async () => {
      try {
        const chatsData = await fetchChats();
        setChats(chatsData);
        console.log(chatsData);
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
              {chats.map((user) => (
                <div
                  key={user.userId}
                  className="userName"
                  onClick={() => handleChatSelection(user.userId)}
                  title="Click to view chat"
                >
                  <p className="name">{user.userName}</p>
                </div>
              ))}
            </div>
            {selectedChat ? (
              <ChatBox
                selectedChat={selectedChat}
                handleSendMessage={handleSendMessage}
                isLoading={loading}
                closeChat={() =>
                  closeChat(selectedChat.userId, selectedChat.id)
                }
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
