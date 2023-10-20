import React, { useState } from "react";
import { addTermToUserCollection } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import CurrencyInput from "react-currency-input-field";
import "firebase/firestore";
import Swal from "sweetalert2";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Edit from "./Edit";

const AddNewTerm = ({ setFixedTerm, fixedTerm, userId, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedTermId, setSelectedTermId] = useState(null); 
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    bankName: "",
    interestRate: 0,
    logo: "",
    minAmount: 0,
    status: "",
    term: "",
    type: "",
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
      // Validate form data
      if (!formData.logo || !formData.bankName || !formData.minAmount || !formData.interestRate || !formData.term || !formData.status || !formData.type) {
        throw new Error("All fields are required.");
      }
  
      const newData = {
        bankName: formData.bankName,
        date: getCurrentDate(),
        interestRate: parseFloat(formData.interestRate.replace(/,/g, "")),
        logo: formData.logo,
        principalAmount: parseFloat(formData.minAmount.replace(/,/g, "")),
        status: formData.status,
        term: formData.term,
        type: formData.type,
        userId: userId.userId,
      };
  
      // Handle image upload
      if (newData.logo) {
        const imageUrl = await handleUploadImage(newData.logo);
        newData.logo = imageUrl;
      }
  
      const result = await addTermToUserCollection(userId.userId, newData);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: `Term added successfully.`,
          showConfirmButton: false,
          timer: 2000,
        });
  
        // Reset the form data and update the state
        setFormData({
          bankName: "",
          interestRate: 0,
          logo: "",
          minAmount: "0.00",
          status: "",
          term: "",
          type: "",
        });
        setFixedTerm([...fixedTerm, { ...newData, id: result.id }]);
        setIsEditing(false);
        setSelectedTermId(result.id);
        setSelectedTerm(newData);
      } else {
        throw new Error(result.error);
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
    <>
    {
      !isEditing && (
    <div className="small-container">
      {isLoading && (
        <LoadingScreen />
      )}
        <form onSubmit={handleSubmit}>
          <h3>Add New Term for {userId.userId}</h3>
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
            value={formData.minAmount} // Use the formData value here
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
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
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
    )}
    {
      isEditing && (
        <Edit
          fixedTerm={fixedTerm}
          setFixedTerm={setFixedTerm}
          userId={userId}
          onClose={() => {
            setIsEditing(false);
          }}
          term={selectedTerm}
          termId={selectedTermId}
        />
    )}
    </>
  );
};

export default AddNewTerm;
