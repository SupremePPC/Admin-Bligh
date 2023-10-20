import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { addNewTerm } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import CurrencyInput from 'react-currency-input-field';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import EditTerm from "../TermRequestManagement/Edit";

const AddNewTerm = ({ setIsAdding, refreshTerm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    logo: "",
    bankName: "",
    minAmount: 0,
    interestRate: 0,
    term: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === 'file') {
      // Make sure files[0] exists
      if (files.length > 0) {
        const selectedFile = files[0];
        handleUploadImage(selectedFile)
          .then((downloadURL) => {
            setFormData({
              ...formData,
              [name]: selectedFile,
              imagePreview: downloadURL, // Update imagePreview with the download URL
            });
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
          });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUploadImage = async (imageFile) => {
    if (imageFile instanceof File) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${imageFile.name}`);
      try {
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef); // Get the download URL
        return downloadURL;
      } catch (error) {
        console.error('Error uploading image to Firebase Storage:', error);
        throw error;
      }
    } else if (typeof imageFile === 'string') {
      // Image is already a URL, no need to re-upload
      return imageFile;
    } else {
      return null; // Handle other cases (e.g., null) as needed
    }
  };

  const handleCurrencyChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData);
    
    try {
      if (formData.logo) {
        const imageUrl = await handleUploadImage(formData.logo);
        formData.logo = imageUrl; // Update the image field with the Firebase Storage URL
      }
      await addNewTerm(formData);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `Term added succesfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setFormData({
        logo: "",
        bankName: "",
        minAmount: 0,
        interestRate: 0,
        term: "",
      });
      setIsAdding(false);
      refreshTerm();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding term: ${error}`,
        showConfirmButton: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
     {!isEditing && (
     <div className="small-container">
        {isLoading && (
          <LoadingScreen />
        )}
          <form onSubmit={handleSubmit}>
            <h1>Add New Term</h1>
            <label htmlFor="logo">Upload Logo:</label>
            {formData.imagePreview && (
              <img src={formData.imagePreview} alt="Image Preview" width={100} className="img_preview" />
            )}
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              accept="image/*"
              required
            />
            <label htmlFor="bankName">Bank Name:</label>
            <input
              type="text"
              name="bankName"
              onChange={handleChange}
              value={formData.bankName}
              required
            />
            <label htmlFor="term">Terms(e.g 24 Months or 1 Year):</label>
            <input
              type="text"
              name="term"
              onChange={handleChange}
              value={formData.term}
              required
            />
            <label htmlFor="minAmount">Minimum Amount:</label>
            <CurrencyInput
              decimalSeparator="."
              prefix="$"
              name="minAmount"
              placeholder="0.00"
              defaultValue={0.00}
              decimalsLimit={2}
              onValueChange={(value) => {
                const formattedValue = parseFloat(value).toFixed(2);
                handleCurrencyChange(formattedValue, "minAmount");
              }}
            />
            <label htmlFor="interestRate">Interest Rate:</label>
            <input
              type="number"
              name="interestRate"
              onChange={handleChange}
              value={formData.interestRate}
              required
            />
            <div style={{ marginTop: "30px" }}>
              <input type="submit" value="Add" />
              <input
                style={{ marginLeft: "12px" }}
                className="muted-button"
                type="button"
                value="Cancel"
                onClick={() => {
                  setIsAdding(false);
                  refreshTerm();
                }}
              />
            </div>
          </form>
      </div>
      )}
      {
        isEditing && (
          <EditTerm />
      )}
    </>
  );
};

export default AddNewTerm;
