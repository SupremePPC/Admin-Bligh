import React, { useEffect, useState } from "react";
import Header from "./Header";
import Table from "./Table";
import "./style.css";
import { db } from "../../firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Modal from "../CustomsModal";
import Edit from "./Edit";
import Add from "./Add";

export default function DashboardOverview() {
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const userDocs = await getDocs(usersCollection);
      const usersData = userDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    setSelectedUserId(userId); // set the user ID you want to delete
    setIsDeleteModalOpen(true); // open the delete confirmation modal
  };

  const confirmDelete = async () => {
    const userRef = doc(db, "users", selectedUserId);
    await deleteDoc(userRef);
    setUsers((users) => users.filter((user) => user.id !== selectedUserId));
    setIsDeleteModalOpen(false); // close the modal
    setSelectedUserId(null); // reset the selected user ID
  };

  const handleEdit = (user) => {
    // Set the selected user and open the edit modal
    setSelectedUserForEdit(user);
    setIsEditPageOpen(true);
  };

  return (
    <div className="container">
      <Header setIsAdding={setIsAdding} />
      {isAdding && (
        <Add onClose={() => setIsAdding(false)} setIsAdding={setIsAdding}
        setUsers={setUsers} />
      )}
      {isEditPageOpen && (
        <Edit
          user={selectedUserForEdit}
          onClose={() => {
            setIsEditPageOpen(false);
            setSelectedUserForEdit(null);
          }}
        />
      )}
      {!isAdding && !isEditPageOpen && (
        <>
          <Table
            users={users}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onPositiveAction={confirmDelete}
            onNegativeAction={() => setIsDeleteModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}
