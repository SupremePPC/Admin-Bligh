import React, { useEffect, useState } from "react";
import "firebase/firestore";
import { updateBond } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import CurrencyInput from "react-currency-input-field";
import Swal from "sweetalert2";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const Edit = ({ bondToEdit, setIsEditPageOpen, refreshBonds }) => {
  const [formData, setFormData] = useState(bondToEdit);
  const [errors, setErrors] = useState({});
  const [isLoaing, setIsLoading] = useState(false);

  console.log(formData.image)
  console.log(formData.imagePreview)
  useEffect(() => {
    // Set the existing image URL in the formData
    setFormData({
      ...bondToEdit,
      image: bondToEdit.image, // Set the existing image URL
    });
  }, [bondToEdit]);
  
  useEffect(() => {
    const fetchData = async () => {
      // Check if the image URL starts with "gs://"
      if (formData.image.startsWith("gs://")) {
        const storage = getStorage();
        const imageRef = ref(storage, formData.image);
        
        try {
          const downloadURL = await getDownloadURL(imageRef);
          setFormData({
            ...bondToEdit,
            image: downloadURL, // Set the existing image URL
          });
          console.log(bondToEdit.imagePreview, bondToEdit.image)
          
        } catch (error) {
          console.error("Error fetching download URL:", error);
        }
      } else {
        // Image URL is already a downloadable URL
        setFormData({
          ...bondToEdit,
        });
      }
    };
  
    fetchData();
  }, [bondToEdit]);
  

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
      // return imageFile;
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
      if (formData.image instanceof File) {
        // New image selected, upload it and update the image URL
        const imageUrl = await handleUploadImage(formData.image);
        formData.image = imageUrl; // Update the image field with the Firebase Storage URL
      }

      await updateBond(formData.id, formData);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Bond has been updated.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setIsLoading(false);
      setIsEditPageOpen(false);
      refreshBonds();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error updating bond: ${error}`,
        showConfirmButton: true,
        timer: 2000,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="small-container">
      {isLoaing ? (
        <LoadingScreen />
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Edit Bond</h1>
          <label htmlFor="image">Issuer Logo:</label>
          {formData.image && (
            <img src={formData.image} alt="Image Preview" width={100} />
          )}
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            required
          />
          <label htmlFor="issuerName">Issuer Name:</label>
          <input
            type="text"
            name="issuerName"
            onChange={handleChange}
            value={formData.issuerName}
          />
          <label htmlFor="type">Type:</label>
          <input
            type="text"
            name="type"
            onChange={handleChange}
            value={formData.type}
          />
          <label htmlFor="isin">ISIN:</label>
          <input
            type="text"
            name="isin"
            onChange={handleChange}
            value={formData.isin}
          />
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            min={0}
            name="quantity"
            onChange={handleChange}
            value={formData.quantity}
          />
          <label htmlFor="sector">Sector:</label>
          <input
            type="text"
            name="sector"
            onChange={handleChange}
            value={formData.sector}
          />
          <label htmlFor="maturityDate">Maturity Date:</label>
          <input
            type="date"
            name="maturityDate"
            onChange={handleChange}
            value={formData.maturityDate}
          />
          <label htmlFor="minimumAmount">Minimum Amount:</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="€"
            name="minimumAmount"
            placeholder="0.00"
            value={formData.minimumAmount}
            decimalsLimit={2}
            onValueChange={(value, name) => handleCurrencyChange(value, name)}
          />
          <label htmlFor="currentValue">Current Value:</label>
          <input
            type="number"
            min={0}
            name="currentValue"
            onChange={handleChange}
            value={formData.currentValue}
          />
          <label htmlFor="companyWebsite">Company Website:</label>
          <input
            type="url"
            name="companyWebsite"
            onChange={handleChange}
            value={formData.companyWebsite}
          />
          <label htmlFor="couponRate">Coupon Rate:</label>
          <input
            type="number"
            name="couponRate"
            onChange={handleChange}
            value={formData.couponRate}
          />
          <label htmlFor="couponFrequency">Coupon Frequency:</label>
          <input
            type="number"
            name="couponFrequency"
            onChange={handleChange}
            value={formData.couponFrequency}
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
                refreshBonds();
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

export default Edit;
