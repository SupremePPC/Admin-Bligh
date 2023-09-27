import React, { useState, useEffect } from "react";
import { getAllTerms, deleteTerm } from "../../firebaseConfig/firestore";
import List from "./List";
import Header from "./Header";
import AddNewTerm from "./Add";
import LoadingScreen from "../LoadingScreen";
import Edit from "./Edit";
import Modal from "../CustomsModal";
import Swal from "sweetalert2";
import "./style.css";

export default function TermsPage() {
  const [terms, setTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Function to handle edit button click
  const handleEditClick = (term) => {
    setSelectedTerm(term); // Set the selected term
    setIsEditPageOpen(true); // Open the Edit component
  };

  const fetchTerms = async () => {
    try {
      setIsLoading(true);
      const fetchedTerms = await getAllTerms();
      if (!fetchedTerms) {
        console.error("No terms found");
      }
      setTerms(fetchedTerms);
    } catch (error) {
      console.error("Error fetching terms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleDelete = (termId) => {
    setSelectedTermId(termId); // set the term ID you want to delete
    setIsDeleteModalOpen(true); // open the delete confirmation modal
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteTerm(selectedTermId);
      setTerms((terms) => terms.filter((term) => term.id !== selectedTermId));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Term deleted successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Failed to delete Term:", error);

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error in deleting term.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      setSelectedTermId(null); // Reset the selected term ID
    }
  };

  const showDeleteModal = (id) => {
    const selected = terms.find((term) => term.id === id);
    selectedTerm(selected);
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
                fixedTerms={terms}
                setIsEditPageOpen={setIsEditPageOpen}
                handleEditClick={handleEditClick}
              />
              {isDeleteModalOpen && (
                <Modal
                  isOpen={isDeleteModalOpen}
                  onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedTermId(null); // Reset the selected term ID on modal close
                  }}
                  onPositiveAction={confirmDelete}
                  title="Delete Term"
                  description="Are you sure you want to delete this term?"
                  positiveLabel="Delete"
                  negativeLabel="Cancel"
                />
              )}
            </>
          )}
        </>
      )}
      {isAdding && <AddNewTerm setIsAdding={setIsAdding} refreshTerm={fetchTerms} />}
      {isEditPageOpen && (
        <Edit
          termToEdit={selectedTerm}
          setIsEditPageOpen={setIsEditPageOpen}
          refreshTerms={fetchTerms}
        />
      )}
    </div>
  );
}
