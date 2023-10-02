import React, { useState, useEffect } from "react";
import LoadingScreen from "../LoadingScreen";
import List from "./List";
import Modal from "../CustomsModal";
import Edit from "../BondsManagement/Edit";
import Add from "../RegisteredUsers/Add";
import Header from "./Header";

export default function IPOs() {
  const [ipos, setIpos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIpo, setSelectedIpo] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIpoId, setSelectedIpoId] = useState(null);

  // Function to handle edit button click
  const handleEditClick = (ipos) => {
    setSelectedIpo(ipos); // Set the selected ipos
    setIsEditPageOpen(true); // Open the Edit component
  };

  const fetchIpos = async () => {
    try {
      setIsLoading(true);
      const fetchedIpos = await getAllIpos();
      if (!fetchedIpos) {
        console.error("No bonds found");
      }
      setBonds(fetchedIpos);
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
      {isAdding && (
        <Add setIsAdding={setIsAdding} refreshIpos={fetchIpos} />
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
