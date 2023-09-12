import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Header from "./Header";
import Table from "./Table";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import {
  getStorage,
  ref,
  deleteObject,
} from "firebase/storage";
import LoadingScreen from "../LoadingScreen";

const DocumentDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);

      try {
      const usersCollection = collection(db, "users");
      const userDocs = await getDocs(usersCollection);
      const allDocuments = [];
      for (const userDoc of userDocs.docs) {
        const user = userDoc.data();
        const docCollection = collection(userDoc.ref, "docs");
        const docDocs = await getDocs(docCollection);
        docDocs.docs.forEach((docDoc) => {
          allDocuments.push({
            userId: userDoc.id,
            ...docDoc.data(),
            fullName: user.fullName,
            docId: docDoc.id,
          });
        });
      }
      setUsers(allDocuments);
    } catch (error) {
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


  const storage = getStorage();

  const handleView = (docURL) => {
    window.open(docURL, "_blank"); // This will open the document in a new tab
  };

  const handleDelete = async (userId, docId, docPath) => {
    // Delete from Firebase Storage
    const storageRef = ref(storage, docPath);
    await deleteObject(storageRef);

    // Delete the reference in Firestore
    const docRef = doc(db, "users", userId, "doc", docId);
    await deleteDoc(docRef);

    setUsers((prevUsers) => prevUsers.filter((user) => user.docId !== docId));
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
      {
        isLoading ? (
          <LoadingScreen />
        ) : (
          <Table
            users={users}
            handleView={handleView}
            handleDelete={handleDelete}
            handleDownload={handleDownload}
          />
        )
      }
    </div>
  );
};

export default DocumentDashboard;
