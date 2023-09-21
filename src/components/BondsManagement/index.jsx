import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  runBond,
  getAllBonds
} from "firebase/firestore";
import List from "./List";
import Header from "./Header";
import AddNewBond from "./Add";
import LoadingScreen from "../LoadingScreen";
import Edit from "./Edit";

export default function BondsPage() {
  const [bonds, setBonds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedBonds = await getAllBonds();
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
      const result = await deleteBond(bondId);
      if (result.success) {
        // Remove the deleted bond from state
        setBonds(bonds.filter((bond) => bond.id !== bondId));
      }
    } catch (error) {
      console.error("Error deleting bond:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {!isAdding &&
        !isEditPageOpen(
          <>
          <Header/>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
            <List
              handleDelete= {handleDelete}
              bonds={bonds}
              isEditPageOpen={isEditPageOpen}
            />
            </>
          )}
          </>
        )}
        {
          isAdding && (
            <AddNewBond/>
          )
        }
        {
          isEditPageOpen && (
            <Edit/>
          )
        }
    </div>
  );
}
