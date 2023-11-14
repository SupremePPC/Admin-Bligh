import React, { useEffect, useState } from "react";
import { fetchMetaData, fetchTitleData, updateMetaData, updateTitleText } from "../../firebaseConfig/firestore";
import Swal from "sweetalert2";
import "./style.css";


export default function ChangeMetaData() {
  const [newMeta, setNewMeta] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingMeta, setExistingMeta] = useState("");
  const [existingTitle, setExistingTitle] = useState("");

  const fetchExistingMetaData = async () => {
    try {
      const existingMeta = await fetchMetaData();
      setExistingMeta(existingMeta);
    } catch (error) {
      console.error("Error fetching existing meta data:", error);
    }
  };

  const fetchExistingTitleData = async () => {
    try {
      const existingTitle = await fetchTitleData();
      setExistingTitle(existingTitle)
    } catch (error) {
      console.error("Error fetching existing title data:", error);
    }
  };

  useEffect(() => {
    // Fetch existing meta data when the component mounts
    fetchExistingTitleData();
    fetchExistingMetaData();
  }, []); // Run only once when the component mounts

  const handleChange = async (e) => {
    e.preventDefault();
  
    try {
      setIsLoading(true);
  
      // Fetch existing data
      const existingMetaData = await fetchMetaData();
      const existingTitle = await fetchTitleData();
  
      // Use existing values if new values are empty
      const updatedMetaData = newMeta.trim() !== "" ? newMeta : existingMetaData;
      const updatedTitle = newTitle.trim() !== "" ? newTitle : existingTitle;
  
      // Update meta data and title
      await updateMetaData(updatedMetaData);
      await updateTitleText(updatedTitle);
  
      Swal.fire({
        icon: "success",
        title: "Data Updated",
        text: "Your data has been updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
  
      // Fetch updated data
      fetchExistingMetaData();
      fetchExistingTitleData();
    } catch (error) {
      console.error("Error updating data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating your data",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <section className="changeMeta_section">
      <div className="section_header">
        <h2 className="title">Change Meta Data and Title</h2>
        <p className="meta_label">Be sure of your spellings before updating.</p>
      </div>

      <form onSubmit={handleChange} className="changeMeta_form">
        <div className="changeMeta_group">
          <label htmlFor="new_meta">Existing Meta Data:</label>
          <textarea
            type="text"
            name="new_meta"
            className="text_field"
            value={existingMeta}
            disabled
          />
        </div>
        <div className="changeMeta_group">
          <label htmlFor="new_meta">Input New Meta Data:</label>
          <textarea
            type="text"
            name="new_meta"
            className="text_field"
            value={newMeta}
            onChange={(e) => setNewMeta(e.target.value)}
          />
        </div>
        <div className="changeMeta_group">
          <label htmlFor="new_title">Existing Title:</label>
          <textarea
            type="text"
            name="new_title"
            className="text_field"
            value={existingTitle}
            disabled
          />
        </div>
        <div className="changeMeta_group">
          <label htmlFor="new_meta">Input New Title:</label>
          <textarea
            type="text"
            name="new_title"
            className="text_field"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        {isLoading ? (
          <button className="submit_btn" disabled>
            <div className="spinner"></div>
          </button>
        ) : (
          <button className="submit_btn" type="submit">
            Update Meta
          </button>
        )}
      </form>
    </section>
  );
}
