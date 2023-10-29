import React, { useEffect, useState } from "react";
import Header from "./Header";
import Table from "./Table";
import { app, db } from "../../firebaseConfig/firebase";
import { collection, getDocs } from "firebase/firestore";
import Modal from "../CustomsModal";
import Edit from "./Edit";
import Add from "./Add";
import LoadingScreen from "../LoadingScreen";
import Swal from "sweetalert2";
import { getFunctions, httpsCallable } from "firebase/functions";
import "./style.css";

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [toggleSort, setToggleSort] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
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

  useEffect(() => {

    fetchUsers();
    handleSearch();
  }, [searchQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If searchQuery is empty, reset the search results to show all users
      setSearchResults(users);
      return;
    }
    
    // Convert the searchQuery to lowercase for case-insensitive comparison
    const lowerCaseQuery = searchQuery.toLowerCase();
  
    const results = users.filter(user =>
      user.fullName.toLowerCase().includes(lowerCaseQuery)
    );
    setSearchResults(results);
  };

  const handleDelete = (userId) => {
    setSelectedUserId(userId); // set the user ID you want to delete
    setIsDeleteModalOpen(true); // open the delete confirmation modal
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      // Initialize the Cloud Function
      const functionsInstance = getFunctions();
      const deleteFunction = httpsCallable(
        functionsInstance,
        "deleteUserAccount"
      );
      // Call the Cloud Function to delete the user from Firestore and Authentication
      await deleteFunction({ userId: selectedUserId });

      // Update the local state
      setUsers((users) => users.filter((user) => user.id !== selectedUserId));
      
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `User deleted successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error in deleting user.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
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
            handleSearch={handleSearch}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <Table
              users={users}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              searchResults={searchResults}
              />
              )}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onPositiveAction={confirmDelete}
            onNegativeAction={() => setIsDeleteModalOpen(false)}
            positiveLabel={"Delete"}
            negativeLabel={"Cancel"}
            />
        </>
      )}
      {isAdding && (
        <Add
        onClose={() => setIsAdding(false)}
        setIsAdding={setIsAdding}
        setUsers={setUsers}
        refreshDetails={fetchUsers}
        />
      )}
      {isEditPageOpen && (
        <Edit
          details={selectedUserForEdit}
          onClose={() => {
            setIsEditPageOpen(false);
            setSelectedUserForEdit(null);
          }}
          refreshDetails={fetchUsers}
        />
      )}
    </div>
  );
}
