import React, { useState, useEffect } from "react";
import { getAllBonds, deleteBond } from "../../firebaseConfig/firestore";
// import { db } from "../../firebaseConfig/firebase";
import List from "./List";
import Header from "./Header";
import AddNewBond from "./Add";
import LoadingScreen from "../LoadingScreen";
import Edit from "./Edit";
import "./style.css";

export default function BondsPage() {
  const [bonds, setBonds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedBond, setSelectedBond] = useState(null); // New state to store selected bond data

  // Function to handle edit button click
  const handleEditClick = (bond) => {
    setSelectedBond(bond); // Set the selected bond
    setIsEditPageOpen(true); // Open the Edit component
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedBonds = await getAllBonds();
        if (!fetchedBonds) {
          console.error("No bonds found");
        }
        setBonds(fetchedBonds);
      } catch (error) {
        console.error("Error fetching bonds:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (bondId) => {
    try {
      await deleteBond(bondId);
      setBonds(bonds.filter((bond) => bond.id !== bondId));
    } catch (error) {
      console.error("Error deleting bond:", error);
    }
  };

  return (
    <div className="container">
      {!isAdding && !isEditPageOpen && (
        <>
          <Header setIsAdding={setIsAdding} />
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <List
              handleDelete={handleDelete}
              bonds={bonds}
              setIsEditPageOpen={setIsEditPageOpen}
              handleEditClick={handleEditClick}
            />
          )}
        </>
      )}
      {isAdding && <AddNewBond setIsAdding={setIsAdding} />}
      {isEditPageOpen && <Edit bondToEdit={selectedBond} setIsEditPageOpen={setIsEditPageOpen} />}
    </div>
  );
  
}
