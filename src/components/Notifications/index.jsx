import React, { useState, useEffect } from "react";
import {
  listenToUserLoginStatus,
  getNotifications,
  deleteAllNotifications,
  deleteNotification,
} from "../../firebaseConfig/firestore";
import Header from "./Header";
import { MdCancel } from "react-icons/md";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
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
      const userNotifications = await getNotifications();
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
          ) : 
          ( notifications.map((notification, index) => (
            <div className="notification_wrap" key={index}>
              <p className="notification">
                {notification.message} at {notification.time} on{" "}
                {notification.date}{" "}
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
          )))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
