import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { addNewIpos } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import CurrencyInput from 'react-currency-input-field';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const AddNewIpos = ({ setIsAdding, refreshIpos }) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logo: null,
    description: "",
    expListingPrice: 0,
    expectedDate: "",
    minInvestment: 0,
    preAllocation: "",
    preSharePrice: 0,
    sharePrice: 0,
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
   
    try {
      if (formData.logo) {
        const imageUrl = await handleUploadImage(formData.logo);
        formData.logo = imageUrl; // Update the image field with the Firebase Storage URL
      }
      await addNewIpos(formData);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `IPOs added succesfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setFormData({
        name: "",
        logo: null,
        description: "",
        expListingPrice: 0,
        expectedate: "",
        minInvestment: 0,
        preAllocation: "",
        preSharePrice: 0,
        sharePrice: 0,
      });
      setIsAdding(false);
      refreshIpos();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding IPOs: ${error}`,
        showConfirmButton: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="small-container">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Add New IPOs</h1>
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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
          />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            onChange={handleChange}
            value={formData.description}
          />
          <label htmlFor="expListingPrice">Expected Listing Price:</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="$"
            name="expListingPrice"
            placeholder="0.00"
            value={formData.expListingPrice} 
            onValueChange={(value) => {
              const formattedValue = parseFloat(value).toFixed(2);
              handleCurrencyChange(formattedValue, "expListingPrice");
            }}
          />
          <label htmlFor="expectedDate">Expected Date:</label>
          <input
            type="text"
            name="expectedDate"
            onChange={handleChange}
            value={formData.expectedDate}
          />
          <label htmlFor="minInvestment">Minimum Investment:</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="$"
            name="minInvestment"
            placeholder="0.00"
            value={formData.minInvestment} 
            onValueChange={(value) => {
              const formattedValue = parseFloat(value).toFixed(2);
              handleCurrencyChange(formattedValue, "minInvestment");
            }}
          />
          <label htmlFor="preAllocation">Pre Allocation:</label>
          <input
            type="text"
            name="preAllocation"
            onChange={handleChange}
            value={formData.preAllocation}
          />
          <label htmlFor="preSharePrice">Pre Share Price:</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="$"
            name="preSharePrice"
            placeholder="0.00"
            defaultValue={0.00}
            value={formData.preSharePrice} 
            onValueChange={(value) => {
              const formattedValue = parseFloat(value).toFixed(2);
              handleCurrencyChange(formattedValue, "preSharePrice");
            }}
          />
          <label htmlFor="sharePrice">Share Price:</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="$"
            name="sharePrice"
            placeholder="0.00"
            defaultValue={0.00}
            value={formData.sharePrice} 
            onValueChange={(value) => {
              const formattedValue = parseFloat(value).toFixed(2);
              handleCurrencyChange(formattedValue, "sharePrice");
            }}
          />
          <div style={{ marginTop: "30px" }}>
            <input type="submit" value="Save" />
            <input
              style={{ marginLeft: "12px" }}
              className="muted-button"
              type="button"
              value="Cancel"
              onClick={() => {
                setIsAdding(false);
                refreshIpos();
              }}
            />
          </div>
          {errors.isin && <div>{errors.isin}</div>}
          {errors.issuerName && <div>{errors.issuerName}</div>}
        </form>
      )}
    </div>
  );
};

export default AddNewIpos;
