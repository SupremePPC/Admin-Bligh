import React, { useState, useEffect } from "react";
import {
  getLoginNotifications,
  deleteAllNotifications,
  deleteNotification,
} from "../../firebaseConfig/firestore";
import Header from "./Header";
import { MdCancel } from "react-icons/md";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingScreen from "../LoadingScreen";
import "./style.css";

const NotificationPage = () => {
  const { userId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchNotifications = async () => {
    setIsLoading(true);
    try {
      // Fetch notifications for the specified user (userId) and set them in the component's state
      const userNotifications = await getLoginNotifications();
      setNotifications(userNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsLoading(true);
    try {
      // Call the deleteAllNotifications function to remove all notifications from Firestore
      await deleteAllNotifications();
      Swal.fire({
        title: "Success!",
        text: "All notifications have been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      // Update the component's state to remove all notifications
      setNotifications([]);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete all notifications.",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error("Failed to delete all notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId, isLoggedIn) => {
    setIsLoading(true);
    try {
      // Call the deleteNotification function to remove the notification from Firestore
      await deleteNotification(notificationId, isLoggedIn);

      // Update the component's state to reflect the changes
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
      Swal.fire({
        title: "Success!",
        text: "Notification has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete notification.",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error("Failed to delete notification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function getHumanReadableTimestamp(timestamp) {
    if (!timestamp) {
      return 'Invalid timestamp';
    }
  
    const now = new Date();
    const timestampDate = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
  
    const diff = now - timestampDate;
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days >= 2) {
      // More than 2 days, show the month and time
      const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return timestampDate.toLocaleDateString(undefined, options);
    } else if (days >= 1) {
      // Yesterday
      const options = { hour: '2-digit', minute: '2-digit' };
      return `Yesterday at ${timestampDate.toLocaleTimeString(undefined, options)}`;
    } else if (hours >= 1) {
      // Hours ago
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes >= 1) {
      // Minutes ago
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      // Seconds ago
      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    }
  }
  
  

  useEffect(() => {
    // Fetch notifications when the component mounts
    handleFetchNotifications();
  }, []);

  return (
    <div className="container">
      <Header handleDeleteAll={handleDeleteAll} notifications={notifications} />
      {isLoading && <LoadingScreen />}
      <div className="notification_page">
        <div className="notifications_container">
          {notifications.length === 0 || notifications === undefined ? (
            <small>No notifications available.</small>
          ) : (
            notifications.map((notification, index) => (
              <div className="notification_wrap" key={index}>
                <p className="notification">
                  {notification.message} {" "}
                  {getHumanReadableTimestamp(notification.timeStamp)}.
                </p>
                <div className="delete_btn">
                  <MdCancel
                    onClick={() =>
                      handleDeleteNotification(
                        notification.id,
                        notification.isLoggedIn
                      )
                    }
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
