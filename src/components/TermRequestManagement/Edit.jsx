import React, { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { updateTermInUserCollection } from "../../firebaseConfig/firestore";
import Swal from "sweetalert2";

const EditTerm = ({ userId, onClose, term, termId }) => {
  console.log("term:", term, termId, userId);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: term.bankName,
    interestRate: term.interestRate,
    logo: term.logo,
    minAmount: term.principalAmount,
    status: term.status,
    term: term.term,
    type: term.type,
  });

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (files.length > 0) {
        const selectedFile = files[0];
        handleUploadImage(selectedFile)
          .then((downloadURL) => {
            setFormData({
              ...formData,
              [name]: selectedFile,
              imagePreview: downloadURL,
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
      // Handle image upload logic here
    } else if (typeof imageFile === "string") {
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
      // Validate form data
      if (
        !formData.logo ||
        !formData.bankName ||
        !formData.minAmount ||
        !formData.interestRate ||
        !formData.term ||
        !formData.status ||
        !formData.type
      ) {
        throw new Error("All fields are required.");
      }

      const updatedData = {
        bankName: formData.bankName,
        date: getCurrentDate(),
        interestRate: parseFloat(formData.interestRate.replace(/,/g, "")),
        logo: formData.logo,
        principalAmount: parseFloat(formData.principalAmount.replace(/,/g, "")),
        status: formData.status,
        term: formData.term,
        type: formData.type,
        userId: userId.userId,
      };

      if (formData.logo) {
        const imageUrl = await handleUploadImage(formData.logo);
        updatedData.logo = imageUrl;
      }

      // Handle the update logic using termId
      const result = await updateTermInUserCollection(
        userId.userId,
        updatedData,
        termId
      );
      if (result.success) {
        if (formData.logo instanceof File) {
          // New image selected, upload it and update the image URL
          const imageUrl = await handleUploadImage(formData.logo);
          console.log(imageUrl);
          updatedData.image = imageUrl; // Update the image field with the Firebase Storage URL
          console.log(updatedData.logo, "clicked");
        } else if (!formData.logo) {
          // If formData.image is empty, use the original image data
          updatedData.image = originalImageData; // Replace 'originalImageData' with the actual original image data
          console.log(updatedData.logo, "clicked");
        }
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: `Term added successfully.`,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding term: ${error.message}`,
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
        <h3>Edit Term for {userId.userId}</h3>
        <label htmlFor="logo">Upload Logo:</label>
        {formData.imagePreview && (
          <img
            src={formData.imagePreview}
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
        <label htmlFor="term">Terms (e.g 24 Months or 1 Year):</label>
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
          value={formData.principalAmount} // Use the formData value here
          decimalsLimit={2}
          onValueChange={(value, name) => {
            setFormData({ ...formData, [name]: value });
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
        <label htmlFor="accountType">Term Type</label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="">--Select--</option>
          <option value="Deposit">Deposit</option>
          <option value="Withdrawal">Withdrawal</option>
        </select>
        <label htmlFor="accountType">Status</label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="">--Select--</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Declined">Declined</option>
        </select>
        <div style={{ marginTop: "30px" }}>
          <input type="submit" value="Add" />
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

export default EditTerm;
