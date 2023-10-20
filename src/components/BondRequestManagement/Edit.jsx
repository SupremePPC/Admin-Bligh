import React, { useState } from "react";
import Swal from "sweetalert2";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateBondUser } from "../../firebaseConfig/firestore";
import CurrencyInput from "react-currency-input-field";
import LoadingScreen from "../LoadingScreen";

const EditBond = ({
  selectedBond,
  selectedBondId,
  userId,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ ...selectedBond });

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
      return imageFile;
    } else {
      return null; // Handle other cases (e.g., null) as needed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData.issuerName ||
      !formData.isin ||
      !formData.image ||
      !formData.couponRate ||
      !formData.couponFrequency ||
      !formData.currentValue
    ) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    try {
      let updatedFormData = { ...formData }; // Create a copy of formData
      const result = await updateBondUser(
        userId.userId,
        selectedBondId,
        updatedFormData
      ); // Send updated data to your backend (optional)

      if (result.success) {
        if (formData.image instanceof File) {
          // New image selected, upload it and update the image URL
          const imageUrl = await handleUploadImage(formData.image);
          console.log(imageUrl);
          updatedFormData.image = imageUrl; // Update the image field with the Firebase Storage URL
          console.log(updatedFormData.image, "clicked");
        } else if (!formData.image) {
          // If formData.image is empty, use the original image data
          updatedFormData.image = originalImageData; // Replace 'originalImageData' with the actual original image data
          console.log(updatedFormData.image, "clicked");
        }
      }

      // setBond(updatedFormData);
      console.log(updatedFormData);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Bond updated successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });

      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error updating bond: ${error}`,
        showConfirmButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="small-container">
      {isLoading && <LoadingScreen />}
      <form onSubmit={handleSubmit}>
        <h3>Edit Bond for {userId.userId}</h3>
        <label htmlFor="image">Issuer Logo:</label>
        {formData.image && (
          <img
            src={formData.imagePreview}
            alt="Image Preview"
            width={100}
            className="image_preview"
          />
        )}
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
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

        <label htmlFor="companyWebsite">Company Website:</label>
        <input
          type="url"
          name="companyWebsite"
          onChange={handleChange}
          value={formData.companyWebsite}
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
          value={formData.minimumAmount}
          decimalsLimit={2}
          onValueChange={(value, name) => {
            setFormData({ ...formData, [name]: value });
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
        <label htmlFor="purchaseDate">Purchase Date:</label>
        <input
          type="date"
          name="purchaseDate"
          onChange={handleChange}
          value={formData.purchaseDate}
        />
        <div style={{ marginTop: "30px" }}>
          <input type="submit" value="Save" />
          <input
            style={{ marginLeft: "12px" }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={onClose}
          />
        </div>
      </form>
    </div>
  );
};

export default EditBond;
