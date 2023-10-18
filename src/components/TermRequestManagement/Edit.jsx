import React, { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field'; // Import any required libraries

const EditTerm = ({ setFixedTerm, fixedTerm, userId, onClose, term, termId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    bankName: term.bankName,
    interestRate: term.interestRate,
    logo: term.logo,
    minAmount: term.minAmount,
    status: term.status,
    term: term.term,
    type: term.type,
  });

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
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
      // Handle image upload logic here
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
        throw new Error('All fields are required.');
      }

      const updatedData = {
        bankName: formData.bankName,
        date: getCurrentDate(),
        interestRate: parseFloat(formData.interestRate.replace(/,/g, '')),
        logo: formData.logo,
        principalAmount: parseFloat(formData.minAmount.replace(/,/g, '')),
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
      // ...

      // Assuming the update is successful, display a success message and update the state
      // ...

    } catch (error) {
      console.error(error);
      // Handle error and display an error message
      // ...
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="small-container">
      {isLoading && (
        <LoadingScreen />
      )}
      <form onSubmit={handleSubmit}>
        <h3>Edit Term for {userId.userId}</h3>
        <label htmlFor="logo">Upload Logo:</label>
        {/* Include logic for image preview here */}
        <input
          type="file"
          name="logo"
          onChange={handleChange}
          accept="image/*"
          required
        />
        {/* Include other form fields here */}
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Update" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={onClose}
          />
        </div>
        {errors.isin && <div>{errors.isin}</div>}
        {errors.issuerName && <div>{errors.issuerName}</div>}
      </form>
    </div>
  );
};

export default EditTerm;
