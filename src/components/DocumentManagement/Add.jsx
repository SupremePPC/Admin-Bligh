import React, { useState } from "react";
import Swal from "sweetalert2";
import { uploadDocument } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";

const AddDocument = ({ setDocs, docs, userId, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileDescription, setFileDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (typeof fileDescription !== "string") {
        throw new Error("File description must be a string.");
      }

      const fileName = file.name;
      console.log(fileName )
      const docData = {
        fileDescription,
        file,
        fileName,
      };
      console.log(docData)
      // Now, add the new file to Firebase Storage and its metadata to Firestore
      await uploadDocument(userId, fileDescription, file);
      // Show a success message to the user
      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: `Document uploaded successfully!`,
        showConfirmButton: false,
        timer: 2000,
      });
      setDocs([...docs, docData]);
      // Clear the form fields for the next upload
      setFileDescription("");
      setFile(null);
    } catch (error) {
      console.error("Error during file upload or Firestore save:", error);

      // Show an error message to the user
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to save document. Please try again.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="small-container">
        {isLoading ? (
            <LoadingScreen/>
        ) :
    (  <form action="" className="info_form" onSubmit={handleUpload}>
        <h3>Add New Document for {userId.userId}</h3>
        <div className="form_group">
          <div className="input_group">
            <label htmlFor="file_description">
              File Description (i.e Passport):
            </label>
            <input
              type="text"
              name="file_description"
              className="input_field"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form_group">
          <div className="input_group">
            <input type="file" onChange={handleFileChange} required />
          </div>
        </div>
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
      </form>)
      }
    </div>
  );
};

export default AddDocument;
