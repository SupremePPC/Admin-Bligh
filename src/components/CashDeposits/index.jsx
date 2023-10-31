import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Header from "./Header";
import Table from "./Table";
import LoadingScreen from "../LoadingScreen";
import { deleteCashDeposit, getCashDeposits } from "../../firebaseConfig/firestore";
import Modal from "../CustomsModal";

const CashDeposits = () => {
  const [cashDeposits, setCashDeposits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [depositForEdit, setDepositForEdit] = useState(false);
  const [isSortToggled, setIsSortToggled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("userName");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDepositId, setSelectedDepositId] = useState(null);

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

  const handleDelete = (depositId) => {
    setSelectedDepositId(depositId); // set the user ID you want to delete
    setIsDeleting(true); // open the delete confirmation modal
  };

  const confirmDelete = async () => {
    setIsLoading(true);

    try {
      
      // Call the Cloud Function to delete the user from Firestore and Authentication
      const result = await deleteCashDeposit({ depositId: selectedDepositId });

      console.log(result.data);

      // Update the local state
      setUsers((users) => users.filter((user) => user.id !== selectedUserId));

      // Close the modal and reset the selected user ID
      setIsDeleting(false);
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
            openEdit={isEditPageOpen}
            handleDelete={handleDelete}
            // selectedUserId={set}
          />

          {isDeleting && (
            <Modal
              isOpen={isDeleting}
              onClose={() => setIsDeleting(false)}
              onPositiveAction={confirmDelete}
              title="Delete Deposit"
              description="Are you sure you want to delete this deposit?"
              positiveLabel={"Delete"}
              negativeLabel={"Cancel"}
            />
          )}
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
          openEdit={isEditPageOpen}
        />
      )}
    </div>
  );
};

export default CashDeposits;
