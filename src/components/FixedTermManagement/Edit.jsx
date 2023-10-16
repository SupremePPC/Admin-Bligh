import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { updateTerm } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const Edit = ({ termToEdit, setIsEditPageOpen, refreshTerms }) => {
  const [formData, setFormData] = useState(termToEdit);
  const [errors, setErrors] = useState({});
  const [isLoaing, setIsLoading] = useState(false);

  useEffect(() => {
    // Set the existing image URL in the formData
    setFormData({
      ...termToEdit,
      image: termToEdit.logo, // Set the existing image URL
    });
  }, [termToEdit]);

  useEffect(() => {
    const fetchData = async () => {
      // Check if the image URL starts with "gs://"
      if (formData.logo.startsWith("gs://")) {
        const storage = getStorage();
        const imageRef = ref(storage, formData.logo);

        try {
          const downloadURL = await getDownloadURL(imageRef);
          setFormData({
            ...termToEdit,
            image: downloadURL, // Set the existing image URL
          });
        } catch (error) {
          console.error("Error fetching download URL:", error);
        }
      } else {
        // Image URL is already a downloadable URL
        setFormData({
          ...termToEdit,
        });
      }
    };

    fetchData();
  }, [termToEdit]);

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
        console.log(updatedFormData.logo, "clicked");
      }
      await updateTerm(formData.id, updatedFormData);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Term has been updated.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error updating term: ${error}`,
        showConfirmButton: true,
        timer: 2000,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="small-container">
      {
        isLoaing ? (
          <LoadingScreen/>
        ): (
          <form onSubmit={handleSubmit}>
          <h1>Add New Term</h1>
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
          <label htmlFor="bankName">Bank Name:</label>
          <input
            type="text"
            name="bankName"
            onChange={handleChange}
            value={formData.bankName}
            required
          />
          <label htmlFor="term">Terms:</label>
          <input
            type="text"
            name="term"
            onChange={handleChange}
            value={formData.term}
            required
          />
          <label htmlFor="minimumAmount">Minimum Amount:</label>
          <input
            type="number"
            min={0}
            name="minAmount"
            onChange={handleChange}
            value={formData.minAmount}
            required
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
          <input type="submit" value="Save" />
          <input
            style={{ marginLeft: "12px" }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => {
              setIsEditPageOpen(false);
              refreshTerms();
            }}
          />
        </div>
          {errors.isin && <div>{errors.isin}</div>}
          {errors.issuerName && <div>{errors.issuerName}</div>}
        </form>
        )
      }
    </div>
  );
};

export default Edit;
