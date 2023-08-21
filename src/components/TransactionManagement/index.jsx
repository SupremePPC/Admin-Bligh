import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getDocs, collection } from "firebase/firestore";
import Header from "./Header";
import Table from "./Table";
import Modal from "../CustomsModal";
import { db } from "../../firebase/firebase";

const TransactionDashboard = ({ setIsAuthenticated }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      let allTransactions = [];

      for (const userDoc of usersSnapshot.docs) {
        const userName = userDoc.data().fullName; // Assuming 'fullName' is the field name in 'users' collection
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

      setTransactions(allTransactions);
    };

    fetchTransactions();
  }, []);

  const handleTransaction = (id) => {
    const [transaction] = transactions.filter(
      (transaction) => transaction.id === id
    );
    setSelectedTransaction(transaction);
    setIsApproving(true); // This will open the modal. Adjust as per your needs
  };

  const handleApproval = async (id) => {
    const transactionsCopy = [...transactions];
    const transactionIndex = transactionsCopy.findIndex(
      (transaction) => transaction.id === id
    );
    transactionsCopy[transactionIndex].status = "Approved";

    // TODO: Update this in the database if needed.
    // For now, we're updating the local state and local storage.
    localStorage.setItem("transactions_data", JSON.stringify(transactionsCopy));
    setTransactions(transactionsCopy);
    setIsApproving(false); // Close the modal after approval

    Swal.fire({
      icon: "success",
      title: "Approved!",
      text: `Transaction with ID ${id} has been approved.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleRejection = async (id) => {
    const transactionsCopy = [...transactions];
    const transactionIndex = transactionsCopy.findIndex(
      (transaction) => transaction.id === id
    );
    transactionsCopy[transactionIndex].status = "Rejected";

    // TODO: Update this in the database if needed.
    // For now, we're updating the local state and local storage.
    localStorage.setItem("transactions_data", JSON.stringify(transactionsCopy));
    setTransactions(transactionsCopy);
    setIsDeclining(false); // Close the modal after decline

    Swal.fire({
      icon: "error",
      title: "Declined!",
      text: `Transaction with ID ${id} has been declined.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const showApprovalModal = (id) => {
    setSelectedTransaction(id);
    setIsApproving(true);
  };

  const showDeclineModal = (id) => {
    setSelectedTransaction(id);
    setIsDeclining(true);
  };

  return (
    <div className="container">
      {/* {!isApproving && !isDeclining && ( */}
      <>
        <Header setIsAuthenticated={setIsAuthenticated} />
        <Table
          transactions={transactions}
          handleReview={handleTransaction}
          handleApproval={showApprovalModal}
          handleRejection={showDeclineModal}
        />
      </>
      {isApproving && (
        <Modal
          transactions={transactions}
          selectedTransaction={selectedTransaction}
          setTransactions={setTransactions}
          setIsReviewing={setIsApproving}
          handleApproval={handleApproval}
          handleRejection={handleRejection}
          title="Approve Transaction"
          description="Are you sure you want to approve this transaction?"
          positiveLabel={"Approve"}
          negativeLabel={"Cancel"}
        />
      )}
      {isDeclining && (
        <Modal
          transactions={transactions}
          selectedTransaction={selectedTransaction}
          setTransactions={setTransactions}
          setIsReviewing={setIsDeclining}
          handleApproval={handleApproval}
          handleRejection={handleRejection}
          title="Decline Transaction"
          description="Are you sure you want to decline this transaction?"
          positiveLabel={"Decline"}
          negativeLabel={"Cancel"}
        />
      )}
    </div>
  );
};

export default TransactionDashboard;
