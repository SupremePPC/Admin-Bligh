import React, { useState, useEffect } from "react";
import { getAllBonds, deleteBond } from "../../firebaseConfig/firestore";
import List from "./List";
import Header from "./Header";
import AddNewBond from "./Add";
import LoadingScreen from "../LoadingScreen";
import Edit from "./Edit";
import Swal from "sweetalert2";
import Modal from "../CustomsModal";
import "./style.css";

export default function BondsPage() {
  const [bonds, setBonds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedBond, setSelectedBond] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBondId, setSelectedBondId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
 
  // Function to handle edit button click
  const handleEditClick = (bond) => {
    setSelectedBond(bond); // Set the selected bond
    setIsEditPageOpen(true); // Open the Edit component
  };

  const fetchBonds = async () => {
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

  useEffect(() => {
    fetchBonds();
  }, []);

  const handleDelete = (bondId) => {
    setSelectedBondId(bondId); // set the bond ID you want to delete
    setIsDeleteModalOpen(true); // open the delete confirmation modal
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteBond(selectedBondId);
      setBonds((bonds) => bonds.filter((bond) => bond.id !== selectedBondId));
  
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Bond deleted successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Failed to delete Bond:", error);
  
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error in deleting bond.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      setSelectedBondId(null); // Reset the selected bond ID
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
            <>
              <List
                handleDelete={handleDelete}
                bonds={bonds}
                setIsEditPageOpen={setIsEditPageOpen}
                handleEditClick={handleEditClick}
              />
              {isDeleteModalOpen && (
                 <Modal
                 isOpen={isDeleteModalOpen}
                 onClose={() => {
                   setIsDeleteModalOpen(false);
                   setSelectedBondId(null); // Reset the selected bond ID on modal close
                 }}
                 onPositiveAction={confirmDelete}
                 title="Delete Bond"
                 description="Are you sure you want to delete this bond?"
                 positiveLabel="Delete"
                 negativeLabel="Cancel"
               />
              )}
            </>
          )}
        </>
      )}
      {isAdding && <AddNewBond setIsAdding={setIsAdding} refreshBond={fetchBonds} />}
      {isEditPageOpen && (
        <Edit bondToEdit={selectedBond} setIsEditPageOpen={setIsEditPageOpen} refreshBonds={fetchBonds} />
      )}
    </div>
  );
}
