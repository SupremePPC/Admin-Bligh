import React, { useState, useEffect } from "react";
import "./style.css";
import Header from "./Header";

const NotificationPage = () => {
  // Assuming notifications are fetched from some source like API
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications here if needed
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="notification_page">
        <div className="notifications_container">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification ${notification.type}`}
            >
              <p>{notification.message}</p>
            </div>
          ))}
          {notifications.length === 0 && <small>No notification available.</small>}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
