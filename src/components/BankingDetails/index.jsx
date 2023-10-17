import React, { useState, useEffect } from 'react';
import {
  getDocs,
  collection,
} from "firebase/firestore";
import Header from "./Header";
import Table from "./Table";
import Edit from "./Edit";
import LoadingScreen from "../LoadingScreen";
import { getBankingDetails } from '../../firebaseConfig/firestore';

const BankingDetails = () => {
  const [bankingDetails, setBankingDetails] = useState([]);  
  const [selectedBankingDetail, setSelectedBankingDetail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBankingDetails = async () => {
    setIsLoading(true);
    try {
      const uid = "your_user_id"; // Replace with the user's ID
      const allBankingDetails = await getBankingDetails(uid);

      if (allBankingDetails) {
        setBankingDetails(allBankingDetails);
      } else {
        console.error("No banking details found");
      }
    } catch (error) {
      console.error("Error fetching banking details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankingDetails();
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
