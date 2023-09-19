import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { db } from "../../firebaseConfig/firebase";
import { Link } from "react-router-dom";
import AddTransaction from "./AddTransaction";

const UserOverview = ({ user }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [accountTypes, setAccountTypes] = useState([]);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [bondsHoldings, setBondsHoldings] = useState([]);
  const [bondsRequest, setBondsRequest] = useState([]);
  const [docs, setDocs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);

  const fetchSubCollection = async (subCollectionName, setFunction) => {
    const subCollectionRef = collection(
      db,
      "users",
      user.id,
      subCollectionName
    );
    const subCollectionSnapshot = await getDocs(subCollectionRef);
    const subCollectionData = subCollectionSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setFunction(subCollectionData);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userRef = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        setUserDetails(userSnapshot.data());
      } else {
        Swal.fire({
          icon: "error",
          title: "User not found",
          text: "The specified user does not exist.",
        });
      }
    };

    fetchUserDetails();
    fetchSubCollection("accountTypes", setAccountTypes);
    fetchSubCollection("bankingDetails", setBankingDetails);
    fetchSubCollection("bondsHoldings", setBondsHoldings);
    fetchSubCollection("bondsRequest", setBondsRequest);
    fetchSubCollection("docs", setDocs);
    fetchSubCollection("transactions", setTransactions);
  }, [user.id]);

  return (
    <div className="container">
      <h1>Overview for {user.id}</h1>
      {userDetails && (
        <div className="user-details">
          <h2>{userDetails.fullName}</h2>
          <p>Email: {userDetails.email}</p>
          <p>Address: {userDetails.address}</p>
          <p>City: {userDetails.city}</p>
          <p>Country: {userDetails.country}</p>
          <p>Home Phone: {userDetails.homePhone}</p>
          <p>Mobile Phone: {userDetails.mobilePhone}</p>
          <p>Postcode: {userDetails.postcode}</p>
          <p>Title: {userDetails.title}</p>
        </div>
      )}

      <h3>Account Types</h3>
      {/* Display account types here */}

      <h3>Banking Details</h3>
      {/* Display banking details here */}

      <h3>Bonds Holdings</h3>
      {/* Display bonds holdings here */}

      <h3>Bonds Requests</h3>
      {/* Display bonds requests here */}

      <h3>Documents</h3>
      {/* Display docs here */}

      <h3>Transactions</h3>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.type} - {transaction.amount}
          </li>
        ))}
      </ul>

      <button onClick={() => setIsAddTransactionModalOpen(true)}>
        Add Transaction
      </button>

      {isAddTransactionModalOpen && (
        <AddTransaction
          onClose={() => setIsAddTransactionModalOpen(false)}
          transactions={transactions}
          setTransactions={setTransactions}
          userId={user.id}
        />
      )}
    </div>
  );
};

export default UserOverview;
