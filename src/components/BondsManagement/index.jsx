import React, { useState, useEffect } from "react";
import { getAllBonds, deleteBond } from "../../firebaseConfig/firestore";
// import { db } from "../../firebaseConfig/firebase";
import List from "./List";
import Header from "./Header";
import AddNewBond from "./Add";
import LoadingScreen from "../LoadingScreen";
import Edit from "./Edit";
import "./style.css";
import Modal from "../CustomsModal";

export default function BondsPage() {
  const [bonds, setBonds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedBond, setSelectedBond] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBondId, setSelectedBondId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false)
  // Function to handle edit button click
  const handleEditClick = (bond) => {
    setSelectedBond(bond); // Set the selected bond
    setIsEditPageOpen(true); // Open the Edit component
  };

  const fetchBonds = async () => {
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

  useEffect(() => {
    fetchBonds();
  }, []);

  const handleDelete = async (bondId) => {
    try {
      await deleteBond(bondId);
      setBonds(bonds.filter((bond) => bond.id !== bondId));
    } catch (error) {
      console.error("Error deleting bond:", error);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);

    try {
      // Initialize the Cloud Function
      const functionsInstance = getFunctions();
      const deleteFunction = httpsCallable(
        functionsInstance,
        "deleteBondAccount"
      );

      // Call the Cloud Function to delete the Bond from Firestore and Authentication
      const result = await deleteFunction({ bondId: selectedBondId });

      console.log(result.data);

      // Update the local state
      setBonds((bonds) => bonds.filter((bond) => bond.id !== selectedBondId));

      // Close the modal and reset the selected Bond ID
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      setSelectedBondId(null);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Bond deleted successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Failed to delete Bond:", error);
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error in deleting bond.`,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const showDeleteModal = (id) => {
    const selected = bonds.find((bond) => bond.id === id);
    selectedBond(selected);
    setIsDeleting(true);
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
      {isAdding && <AddNewBond setIsAdding={setIsAdding} />}
      {isEditPageOpen && (
        <Edit bondToEdit={selectedBond} setIsEditPageOpen={setIsEditPageOpen} refreshBonds={fetchBonds} />
      )}
    </div>
  );
}
