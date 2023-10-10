import React, { useState, useEffect } from 'react';
import { deleteDocument, updateDocumentInFirestore } from "../../firebaseConfig/firestore"
import Swal from 'sweetalert2';
import { getDownloadURL, ref, getStorage, getMetadata } from 'firebase/storage';

const EditDocument = ({ docs, setDocs, onClose, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileDescription, setFileDescription] = useState(docs?.fileDescription);
  const [file, setFile] = useState(docs?.file); // Store the file URL
  const [originalFileName, setOriginalFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');
  const [lastModified, setLastModified] = useState('');

  const storage = getStorage();
  const storageRef = ref(storage, `${userId.userId}/${docs?.name}/`);
  console.log(storageRef);
  // Fetch the file URL when the component mounts
  useEffect(() => {
    getDownloadURL(storageRef)
      .then((url) => {
        // Set the file URL in the state
        setFile(url);

        // Fetch metadata of the file
        getMetadata(storageRef)
          .then((metadata) => {
            setOriginalFileName(metadata.name || 'N/A');
            setFileSize(metadata.size || 0);
            setFileType(metadata.contentType || 'N/A');
            setLastModified(metadata.updated || 'N/A');
          })
          .catch((error) => {
            console.error('Error fetching file metadata:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching file from Firebase Storage:', error);
      });
  }, [storageRef]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const updateDocument = async () => {
    setIsLoading(true);

    try {
      if (!file) {
        throw new Error('Please select a new document file.');
      }

      // Call the updateDocumentInFirestore function
      await updateDocumentInFirestore(userId, docs, fileDescription, file);
      // Replace 'YOUR_DOCUMENT_ID' with the actual document ID

      // Show a success message to the user
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Document updated successfully!',
        showConfirmButton: false,
        timer: 2000,
      });

      // Clear the form fields and close the modal
      setFileDescription('');
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Error during document update:', error);

      // Show an error message to the user
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to update the document. Please try again.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDoc = async () => {
    setIsLoading(true);

    try {
      await deleteDocument(userId, docs);
    }catch (error) {
      console.error('Error during document deletion:', error);

      // Show an error message to the user
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to delete the document. Please try again.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="small-container">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <form action="" className="info_form" >
          <h3>Edit Document for {userId.userId}</h3>
          <div className="form_group">
            <div className="input_group">
              <label htmlFor="file_description">File Description:</label>
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
              <label>Original File Name: {originalFileName}</label>
              <label>File Size: {fileSize} bytes</label>
              <label>File Type: {fileType}</label>
              <label>Last Modified: {lastModified}</label>
            </div>
          </div>

          <div className="form_group">
            <div className="input_group">
              <input type="file" onChange={handleFileChange} required />
            </div>
          </div>
          <div style={{ marginTop: '30px' }}>
            <input type="submit" value="Save" onSubmit={updateDocument} />
            <input type="submit" value="Delete" onSubmit={deleteDoc} />
            <input
              style={{ marginLeft: '12px' }}
              className="muted-button"
              type="button"
              value="Cancel"
              onClick={onClose}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default EditDocument;
