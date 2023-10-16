import React, { useEffect, useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { updateIpo } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import CurrencyInput from "react-currency-input-field";

const Edit = ({ ipoToEdit, setIsEditPageOpen, refreshIpos }) => {
  const [formData, setFormData] = useState(ipoToEdit || {});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set the existing image URL in the formData
    setFormData({
      ...ipoToEdit,
      image: ipoToEdit.logo, // Set the existing image URL
    });
  }, [ipoToEdit]);

  useEffect(() => {
    const fetchData = async () => {
      // Check if the image URL starts with "gs://"
      if (formData.logo.startsWith("gs://")) {
        const storage = getStorage();
        const imageRef = ref(storage, formData.logo);

        try {
          const downloadURL = await getDownloadURL(imageRef);
          setFormData({
            ...ipoToEdit,
            image: downloadURL, // Set the existing image URL
          });
        } catch (error) {
          console.error("Error fetching download URL:", error);
        }
      } else {
        // Image URL is already a downloadable URL
        setFormData({
          ...ipoToEdit,
        });
      }
    };

    fetchData();
  }, [ipoToEdit]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
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
            console.error("Error uploading image:", error);
          });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCurrencyChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
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
        console.error("Error uploading image to Firebase Storage:", error);
        throw error;
      }
    } else if (typeof imageFile === "string") {
      // Image is already a URL, no need to re-upload
      // return imageFile;
    } else {
      return null; // Handle other cases (e.g., null) as needed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let updatedFormData = { ...formData }; // Create a copy of formData
      if (formData.logo instanceof File) {
        // New image selected, upload it and update the image URL
        const imageUrl = await handleUploadImage(formData.logo);
        updatedFormData.logo = imageUrl; // Update the image field with the Firebase Storage URL
      } else if (!formData.logo) {
        // If formData.logo is empty, use the original image data
        updatedFormData.logo = originalImageData; // Replace 'originalImageData' with the actual original image data
      }
      await updateIpo(formData.id, updatedFormData);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `IPOs has been updated.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setIsEditPageOpen(false);
      refreshIpos();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error updating IPOs: ${error}`,
        showConfirmButton: true,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="small-container">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Edit IPO</h1>
          <label htmlFor="logo">Upload Logo:</label>
          {formData.logo && (
            <img
              src={formData.logo}
              alt="Image Preview"
              width={100}
              className="img_preview"
            />
          )}
          <input
            type="file"
            name="logo"
            onChange={handleChange}
            accept="image/*"
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
          <label htmlFor="expectedDate">Expected IPO Date:</label>
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
                setIsEditPageOpen(false);
                refreshIpos();
              }}
            />
          </div>
          {errors.isin && <div>{errors.isin}</div>}
          {errors.name && <div>{errors.name}</div>}
        </form>
      )}
    </div>
  );
};

export default Edit;
