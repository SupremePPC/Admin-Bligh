import React, { useState, useEffect } from 'react';
import {
  getDocs,
  collection,
  query,
} from "firebase/firestore";
import Header from "./Header";
import Table from "./Table";
import Edit from "./Edit";
import LoadingScreen from "../LoadingScreen";
import { getBankingDetails } from '../../firebaseConfig/firestore';
import { db } from '../../firebaseConfig/firebase';

const BankingDetails = () => {
  const [bankingDetails, setBankingDetails] = useState([]);  
  const [selectedBankingDetail, setSelectedBankingDetail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBankingDetailsForAllUsers = async () => {
    setIsLoading(true);
    try {

      // const bankingDetails = await getBankingDetails(uid);
      const usersQuery = query(collection(db, 'users'));
      const querySnapshot = await getDocs(usersQuery);
  
      const bankingDetailsByUser = [];
  
      if (!querySnapshot.empty) {
        querySnapshot.forEach((userDoc) => {
          const uid = userDoc.id;
  
          if (bankingDetails) {
            bankingDetailsByUser.push({
              userId: uid,
              details: bankingDetails,
            });
          }
        });
  
        // bankingDetailsByUser now contains banking details for all users
        // console.log("Banking details for all users:", bankingDetailsByUser);
      } else {
        console.error("No users found");
      }
    } catch (error) {
      console.error("Error fetching banking details for all users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankingDetailsForAllUsers();
  }, []);

  useEffect(() => {
  }, [bankingDetails]);

  const handleEdit = (id) => {
    console.log("handleEdit called with ID:", id);
    const selectedBankingDetail = bankingDetails.find(
      (bankingDetail) => bankingDetail.id === id
    );
    setSelectedBankingDetail(selectedBankingDetail);
    setIsEditing(true);
  };

  return (
    <div className="container">
      {!isEditing && (
          <>
          <Header />
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <Table
              bankingDetails={bankingDetails}
              handleEdit={handleEdit}
            />
          )}
          </>
        )}
      {isEditing && (
        <Edit
          bankingDetails={selectedBankingDetail}
          bankingDetailsId={selectedBankingDetail?.id}
          userId={selectedBankingDetail?.userId}
          onClose={() => {
            setSelectedBankingDetail(null);
            setIsEditing(false);
          }}
          refreshDetails={fetchBankingDetails}
        />
      )}
      
    </div>
  );
};

export default BankingDetails;
