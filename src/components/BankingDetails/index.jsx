import React, { useState, useEffect } from 'react';
import {
  getDocs,
  collection,
} from "firebase/firestore";
import Header from "./Header";
import Table from "./Table";
import Modal from "../CustomsModal";
import Edit from "./Edit";
import { db } from "../../firebaseConfig/firebase";
import LoadingScreen from "../LoadingScreen";

const BankingDetails = () => {
  const [bankingDetails, setBankingDetails] = useState([]);  
  const [selectedBankingDetail, setSelectedBankingDetail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBankingDetails = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        let allBankingDetails = [];
        setIsLoading(true);

        for (const userDoc of usersSnapshot.docs) {
          // const userName = userDoc.data().fullName;
          const bankingDetailsRef = collection(
            db,
            "users",
            userDoc.id,
            "bankingDetails"
          );
          const bankingDetailsSnapshot = await getDocs(bankingDetailsRef);
          const userBankingDetails = bankingDetailsSnapshot.docs.map(
            (bankingDetailDoc) => ({
              ...bankingDetailDoc.data(),
              id: bankingDetailDoc.id,
              userId: userDoc.id,
            })
            );
          allBankingDetails = allBankingDetails.concat(userBankingDetails);
        }

        setBankingDetails(allBankingDetails);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching banking details:", error);
      }
    };

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
          
        />
      )}
    </div>
  );
};

export default BankingDetails;
