import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Header from "./Header";
import Table from "./Table";
import LoadingScreen from "../LoadingScreen";
import { getCashDeposits, updateCashDeposit, deleteCashDeposits, addCashDeposit  } from "../../firebaseConfig/firestore";

const CashDeposits = () => {
  const [cashDeposits, setCashDeposits] = useState([]);
  const [selectedCashDeposits, setSelectedCashDeposits] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [depositForEdit, setDepositForEdit] = useState(false);
  const [isSortToggled, setIsSortToggled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("userName"); // 'userName' or 'amount'
  const [statusFilter, setStatusFilter] = useState("All"); // 'All', 'Approved', 'Declined'

  // Function to toggle sorting
   // Function to toggle sorting
   const toggleSort = () => {
    setIsSortToggled(!isSortToggled);
  };

  // Function to load cash deposits from Firestore
  const loadCashDeposits = async () => {
    setIsLoading(true);
    try {
      const deposits = await getCashDeposits(); // Replace with your Firestore function
      setCashDeposits(deposits);
    } catch (error) {
      console.error("Error fetching cash deposits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCashDeposits();
  }, [statusFilter]);


  // Function to handle status filtering
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  // Function to handle sorting
  const handleSort = (sortOption) => {
    const [field, direction] = sortOption.split("_"); // field will be 'userName' or 'amount'; direction will be 'ascend' or 'descend'

    const sortedTransactions = [...transactions].sort((a, b) => {
      if (field === "userName") {
        const nameA = a.userName.toLowerCase();
        const nameB = b.userName.toLowerCase();
        return direction === "ascend"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (field === "amount") {
        return direction === "ascend"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });

    setTransactions(sortedTransactions);
  };

  // Function to handle search
  const handleSearch = () => {
    const filteredTransactions = transactions.filter((transaction) => {
      if (searchField === "userName") {
        return transaction.userName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      } else if (searchField === "amount") {
        return transaction.amount === parseFloat(searchQuery);
      }
      return true;
    });
    setTransactions(filteredTransactions);
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
      const result = await deleteFunction({ userId: selectedUserId });

      console.log(result.data);

      // Update the local state
      setUsers((users) => users.filter((user) => user.id !== selectedUserId));

      // Close the modal and reset the selected user ID
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      setSelectedUserId(null);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Bond deleted successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Failed to delete bond:", error);
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error in deleting bond.`,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="container">
      {!isEditPageOpen && (
        <>
          <Header
            setIsAdding={setIsAdding}
            isSortToggled={isSortToggled}
            toggleSort={toggleSort}
            onSort={handleSort}
            handleSearch={handleSearch}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            setSearchField={setSearchField}
            handleFilter={handleStatusFilter}
            statusFilter={statusFilter}
          />
          {isLoading && <LoadingScreen />}

          <Table
            cashDeposits={cashDeposits}
          />
        </>
      )}
      {isEditPageOpen && (
        <EditCashDeposits
          cashDeposit={depositForEditForEdit}
          onClose={() => {
            setIsEditPageOpen(false);
            setDepositForEdit(null);
          }}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default CashDeposits;
