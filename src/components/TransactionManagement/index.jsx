import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import Header from "./Header";
import Table from "./Table";
import Modal from "../CustomsModal";
import { db } from "../../firebaseConfig/firebase";
import LoadingScreen from "../LoadingScreen";
import AddTransaction from "../UserOverview/AddTransaction";

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [transactionForEdit, setTransactionForEdit] = useState(false);
  const [isSortToggled, setIsSortToggled] = useState(false);
  // const [sortField, setSortField] = useState("userName"); // 'userName' or 'amount'
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("userName"); // 'userName' or 'amount'
  const [statusFilter, setStatusFilter] = useState("All"); // 'All', 'Approved', 'Declined'

  // Function to toggle sorting
  const toggleSort = () => {
    setIsSortToggled(!isSortToggled);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        let allTransactions = [];
        setIsLoading(true);

        for (const userDoc of usersSnapshot.docs) {
          const userName = userDoc.data().fullName;
          const transactionsRef = collection(
            db,
            "users",
            userDoc.id,
            "transactions"
          );
          const transactionsSnapshot = await getDocs(transactionsRef);
          const userTransactions = transactionsSnapshot.docs.map(
            (transactionDoc) => ({
              ...transactionDoc.data(),
              id: transactionDoc.id,
              userId: userDoc.id,
              userName: userName,
            })
          );
          allTransactions = allTransactions.concat(userTransactions);
        }

        const filteredTransactions =
          statusFilter === "All"
            ? allTransactions
            : allTransactions.filter(
                (transaction) => transaction.status === statusFilter
              );

        setTransactions(filteredTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [statusFilter]);

  const showApprovalModal = (id) => {
    const selected = transactions.find((transaction) => transaction.id === id);
    setSelectedTransaction(selected);
    setIsApproving(true);
  };

  const showDeclineModal = (id) => {
    const selected = transactions.find((transaction) => transaction.id === id);
    setSelectedTransaction(selected);
    setIsDeclining(true);
  };

  const handleApproval = async () => {
    try {
      // Initialize Firestore references
      const userId = selectedTransaction.userId;
      const transactionId = selectedTransaction.id;
      const accountType = selectedTransaction.accountType; // Assuming this field exists
      const amount = parseFloat(selectedTransaction.amount);
      const transactionType = selectedTransaction.type; // Assuming this is either "Deposit" or "Withdrawal"

      // Transaction Firestore Reference
      const transactionRef = doc(
        db,
        "users",
        userId,
        "transactions",
        transactionId
      );

      // Account Type Firestore Reference
      const accountTypeRef = doc(
        db,
        "users",
        userId,
        "accountTypes",
        accountType
      );

      // Start a Firestore transaction
      await runTransaction(db, async (transaction) => {
        // 1. Fetch the existing balance and type
        const accountTypeDoc = await transaction.get(accountTypeRef);
        let currentBalance = 0;
        let type = ""; // Initialize type variable
        if (accountTypeDoc.exists()) {
          currentBalance = parseFloat(accountTypeDoc.data().balance || 0);
          type = accountTypeDoc.data().type; // Fetch existing type
        }

        // 2. Update the balance based on the transaction type
        let newBalance = currentBalance;
        if (transactionType === "Deposit") {
          newBalance = currentBalance + amount;
        } else if (transactionType === "Withdrawal") {
          newBalance = currentBalance - amount;
        }

        // Check if the new balance is negative (in case of withdrawal)
        if (newBalance < 0) {
          throw new Error("Insufficient funds for withdrawal");
        }

        // 3. Update the balance and type in Firestore
        transaction.set(accountTypeRef, {
          balance: newBalance.toFixed(2),
          type: type,
        });

        // 4. Mark the transaction as "Approved"
        transaction.update(transactionRef, { status: "Approved" });

        // 5. Here you can also update the "Total Account Value" if needed
      });

      // Update the local state
      const transactionsCopy = [...transactions];
      const transactionIndex = transactionsCopy.findIndex(
        (transaction) => transaction.id === transactionId
      );
      transactionsCopy[transactionIndex].status = "Approved";
      setTransactions(transactionsCopy);

      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: `Transaction has been approved.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to update the transaction.`,
        showConfirmButton: true,
      });
    }
  };

  const handleRejection = async () => {
    try {
      // Update the local state and local storage
      const transactionsCopy = [...transactions];
      const transactionIndex = transactionsCopy.findIndex(
        (transaction) => transaction.id === selectedTransaction.id
      );

      transactionsCopy[transactionIndex].status = "Rejected";

      const transactionRef = doc(
        db,
        "users",
        selectedTransaction.userId,
        "transactions",
        selectedTransaction.id
      );

      await updateDoc(transactionRef, {
        status: "Rejected",
      });

      // Update state
      setTransactions(transactionsCopy);
      setIsDeclining(false);

      Swal.fire({
        icon: "success",
        title: "Declined!",
        text: `Transaction has been declined.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to update the transaction.`,
        showConfirmButton: true,
      });
    }
  };

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
            setSearchField={setSearchField}
            handleFilter={handleStatusFilter}
            statusFilter={statusFilter}
          />
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              <Table
                transactions={transactions}
                handleApproval={showApprovalModal}
                handleRejection={showDeclineModal}
              />

              {isApproving && (
                <Modal
                  isOpen={isApproving}
                  onClose={() => setIsApproving(false)}
                  title="Approve Transaction"
                  description="Are you sure you want to approve this transaction?"
                  onPositiveAction={() => handleApproval(selectedTransaction)}
                  positiveLabel={"Approve"}
                  negativeLabel={"Cancel"}
                />
              )}

              {isDeclining && (
                <Modal
                  isOpen={isDeclining}
                  onClose={() => setIsDeclining(false)}
                  onPositiveAction={handleRejection}
                  title="Decline Transaction"
                  description="Are you sure you want to decline this transaction?"
                  positiveLabel={"Decline"}
                  negativeLabel={"Cancel"}
                />
              )}
            </>
          )}
        </>
      )}
      {/* {isAdding && (
        <AddTransaction
          onClose={() => setIsAdding(false)}
          setIsAdding={setIsAdding}
          setTransactions={setTransactions}
        />
      )} */}
      {isEditPageOpen && (
        <Edit
          transaction={transactionForEdit}
          onClose={() => {
            setIsEditPageOpen(false);
            setTransactionForEdit(null);
          }}
        />
      )}
    </div>
  );
};
export default TransactionDashboard;
