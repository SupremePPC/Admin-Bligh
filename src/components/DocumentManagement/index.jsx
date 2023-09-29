import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Header from "./Header";
import Table from "./Table";
import LoadingScreen from "../LoadingScreen";
import { deleteDocument, fetchDocument } from "../../firebaseConfig/firestore";

const DocumentDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const allDocuments = await fetchDocument();
        setUsers(allDocuments);
      } catch (error) {
        // Handle Error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleDelete = async (userId, docId, fileDescription) => {
    setIsLoading(true);
    try {
      await deleteDocument(userId, docId, fileDescription);
    setUsers((prevUsers) => prevUsers.filter((user) => user.docId !== docId));
    Swal.fire({
      icon: "success",
      title: "Delete Document",
      text: "Document deleted successfully.",
      timer: 3000,
      showConfirmButton: false,
    });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        timer: 3000,
        showConfirmButton: false,
      });
      console.error("Error during deletion:", error);
    }
    setIsLoading(false);
  };

  const handleView = (docURL) => {
    window.open(docURL, "_blank");
  };

  const handleDownload = (docURL, docName) => {
    const a = document.createElement("a");
    a.href = docURL;
    a.download = docName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container">
      <Header />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Table
          users={users}
          handleView={handleView}
          handleDelete={handleDelete}
          handleDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default DocumentDashboard;
