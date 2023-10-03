import React, { useState, useEffect } from "react";
import LoadingScreen from "../LoadingScreen";
import List from "./List";
import Modal from "../CustomsModal";
import Header from "./Header";
import { getAllIpos } from "../../firebaseConfig/firestore";
import Edit from "./Edit";
import "./style.css";
import AddNewIpos from "./Add";

export default function IPOs() {
  const [ipos, setIpos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIpo, setSelectedIpo] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIpoId, setSelectedIpoId] = useState(null);

  // Function to handle edit button click
  const handleEditClick = (ipo) => {
    console.log(ipo); // Log the IPO data to verify it's correct
    setSelectedIpo(ipo);
    setIsEditPageOpen(true);
  };
  
  const fetchIpos = async () => {
    try {
      setIsLoading(true);
      const fetchedIpos = await getAllIpos();
      if (!fetchedIpos) {
        console.error("No bonds found");
      }
      setIpos(fetchedIpos);
    } catch (error) {
      console.error("Error fetching ipos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIpos();
  }, []);

  const handleDelete = (iposId) => {
    setSelectedIpo(iposId); // set the bond ID you want to delete
    setIsDeleteModalOpen(true); // open the delete confirmation modal
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteIpo(selectedIpoId);
      setIpos((ipos) => ipos.filter((ipo) => ipo.id !== selectedIpoId));
  
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Ipo deleted successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Failed to delete Ipo:", error);
  
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error in deleting ipo.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      setSelectedIpoId(null); // Reset the selected ipo ID
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
                ipos={ipos}
                setIsEditPageOpen={setIsEditPageOpen}
                handleEditClick={handleEditClick}
              />
              {isDeleteModalOpen && (
                <Modal
                  isOpen={isDeleteModalOpen}
                  onClose={() => {
                    setIsDeleteModalOpen(false);
                    selectedIpoId(null); // Reset the selected bond ID on modal close
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
      {isAdding && (
        <AddNewIpos setIsAdding={setIsAdding} refreshIpos={fetchIpos} />
      )}
      {isEditPageOpen && (
        <Edit
          ipoToEdit={selectedIpo}
          setIsEditPageOpen={setIsEditPageOpen}
          refreshIpos={fetchIpos}
        />
      )}
    </div>
  );
}
