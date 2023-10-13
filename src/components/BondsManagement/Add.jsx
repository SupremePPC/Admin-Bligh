import React, { useEffect, useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { addNewBond } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import CurrencyInput from "react-currency-input-field";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const AddNewBond = ({ setIsAdding, refreshBond }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    companyWebsite: "",
    couponFrequency: 0,
    couponRate: 0,
    currentValue: 0,
    image: null,
    imagePreview: "",
    isin: "",
    issuerName: "",
    maturityDate: "",
    minimumAmount: 0.0,
    purchaseDate: "",
    quantity: 0,
    sector: "",
    // ticker: "",
    type: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (formData.image) {
        const imageUrl = await handleUploadImage(formData.image);
        formData.image = imageUrl; // Update the image field with the Firebase Storage URL
      }
      await addNewBond(formData);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `Bond added successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setFormData({
        companyWebsite: "",
        couponFrequency: 0,
        couponRate: 0,
        currentValue: 0,
        image: null,
        isin: "",
        issuerName: "",
        maturityDate: "",
        minimumAmount: 0,
        purchaseDate: "",
        quantity: 0,
        sector: "",
        type: "",
      });
      setIsAdding(false);
      refreshBond();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding bond: ${error}`,
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
          <h1>Add New Bond</h1>
          {formData.imagePreview && (
            <img src={formData.imagePreview} alt="Image Preview" width={100} className="img_preview" />
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
            prefix="$"
            name="minimumAmount"
            placeholder="0.00"
            defaultValue={0.0}
            decimalsLimit={2}
            onValueChange={(value) => {
              setFormData({
                ...formData,
                minimumAmount: parseFloat(value), // Convert the value to a float
              });
            }}
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
            title="Please enter a url that starts with http:// or https://"
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
            min={0}
            value={formData.couponFrequency}
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
                refreshBond();
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

export default AddNewBond;
