import React, { useEffect, useState } from "react";
import Header from "./Header";
import Table from "./Table";
import "./style.css";
import { db } from "../../firebase/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Modal from "../CustomsModal";
import Edit from "./Edit";
import Add from "./Add";
import LoadingScreen from "../LoadingScreen";

export default function DashboardOverview() {
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [toggleSort, setToggleSort] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersCollection = collection(db, "users");
        const userDocs = await getDocs(usersCollection);
        const usersData = userDocs.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUsers(usersData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
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

  const isSortToggled = () => {
    setToggleSort(!toggleSort);
  };

  // Sort by Username - Ascending
  const sortByFullNameAscending = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const nameA = a.fullName || "";
      const nameB = b.fullName || "";
      return nameA.localeCompare(nameB);
    });
    setUsers(sortedUsers);
  };

  // Sort by Username - Descending
  const sortByFullNameDescending = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const nameA = a.fullName || "";
      const nameB = b.fullName || "";
      return nameB.localeCompare(nameA); // Note the order change
    });
    setUsers(sortedUsers);
  };

  // Sort by Email - Ascending
  const sortByEmailAscending = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const emailA = a.email || "";
      const emailB = b.email || "";
      return emailA.localeCompare(emailB);
    });
    setUsers(sortedUsers);
  };

  // Sort by Email - Descending
  const sortByEmailDescending = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const emailA = a.email || "";
      const emailB = b.email || "";
      return emailB.localeCompare(emailA); // Note the order change
    });
    setUsers(sortedUsers);
  };

  const handleSort = (sortType) => {
    switch (sortType) {
      case "name_ascend":
        sortByFullNameAscending();
        break;
      case "name_descend":
        sortByFullNameDescending();
        break;
      case "email_ascend":
        sortByEmailAscending();
        break;
      case "email_descend":
        sortByEmailDescending();
        break;
      default:
        break;
    }
  };

  return (
    <div className="container">
      {!isAdding && !isEditPageOpen && (
        <>
          <Header
            setIsAdding={setIsAdding}
            isSortToggled={isSortToggled}
            toggleSort={toggleSort}
            onSort={handleSort}
          />
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <Table
              users={users}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          )}
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
      {isAdding && (
        <Add
          onClose={() => setIsAdding(false)}
          setIsAdding={setIsAdding}
          setUsers={setUsers}
        />
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
    </div>
  );
}
