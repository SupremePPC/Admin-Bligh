import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  deleteField,
  addDoc,
} from "firebase/firestore";
import Header from "./Header";
import Table from "./Table";
import Modal from "../CustomsModal";
import { db } from "../../firebase/firebase";
import LoadingScreen from "../LoadingScreen";

const TransactionDashboard = ({ setIsAuthenticated }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log("Fetching transactions...");
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

        setTransactions(allTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleTransaction = (id) => {
    console.log("handleTransaction called with ID:", id);
    const [transaction] = transactions.filter(
      (transaction) => transaction.id === id
    );
    setSelectedTransaction(transaction);
    setIsApproving(true);
  };

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
      // Update the local state and local storage
      const transactionsCopy = [...transactions];
      const transactionIndex = transactionsCopy.findIndex(
        (transaction) => transaction.id === selectedTransaction.id
      );

      transactionsCopy[transactionIndex].status = "Approved";

      const transactionRef = doc(
        db,
        "users",
        selectedTransaction.userId,
        "transactions",
        selectedTransaction.id
      );

      await updateDoc(transactionRef, {
        status: "Approved",
      });

      // Update state
      setTransactions(transactionsCopy);
      setIsApproving(false); // Close the modal after approval

      console.log("selectedTransaction:", selectedTransaction);
      console.log("transactionsCopy:", transactionsCopy);
      console.log("transactionIndex:", transactionIndex);
      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: `Transaction has been approved.`,
        showConfirmButton: false,
        timer: 1500,
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
      const transactionIndex = transactionsCopy.findIndex(transaction => transaction.id === selectedTransaction.id);

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
      setIsDeclining(false); // Close the modal after rejection

      console.log("selectedTransaction:", selectedTransaction);
      console.log("transactionsCopy:", transactionsCopy);
      console.log("transactionIndex:", transactionIndex);
      Swal.fire({
        icon: "success",
        title: "Declined!",
        text: `Transaction has been declined.`,
        showConfirmButton: false,
        timer: 1500,
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


  return (
    <div className="container">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header setIsAuthenticated={setIsAuthenticated} />
          <Table
            transactions={transactions}
            handleReview={handleTransaction}
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
    </div>
  );
};
export default TransactionDashboard;
