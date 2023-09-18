import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { getDocs, collection, doc, updateDoc, runBond } from "firebase/firestore";
import Header from "./Header";
import Table from "./Table";
import Modal from "../CustomsModal";
import { db } from "../../firebaseConfig/firebase";
import LoadingScreen from "../LoadingScreen";


export default function BondsDashboard() {
  const [bonds, setBonds] = useState([]);
  const [selectedBond, setSelectedBond] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchBonds = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        let allBonds = [];
        setIsLoading(true);

        for (const userDoc of usersSnapshot.docs) {
          const userName = userDoc.data().fullName;
          const bondsRef = collection(
            db,
            "users",
            userDoc.id,
            "bonds"
          );
          const bondsSnapshot = await getDocs(bondsRef);
          const userBonds = bondsSnapshot.docs.map(
            (bondDoc) => ({
              ...bondDoc.data(),
              id: bondDoc.id,
              userId: userDoc.id,
              userName: userName,
            })
          );
          allBonds = allBonds.concat(userBonds);
        }

        setBonds(allBonds);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bonds:", error);
      }
    };

    fetchBonds();
  }, []);

  const showApprovalModal = (id) => {
    const selected = bonds.find((bond) => bond.id === id);
    setSelectedBond(selected);
    setIsApproving(true);
  };

  const showDeclineModal = (id) => {
    const selected = bonds.find((bond) => bond.id === id);
    setSelectedBond(selected);
    setIsDeclining(true);
  };

  return (
    <div className="container">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header />
          <Table
            bonds={bonds}
            />
            
        </>
      )}
    </div>
  )
}
