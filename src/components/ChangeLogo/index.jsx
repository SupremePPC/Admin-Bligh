import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import LoadingScreen from "../LoadingScreen";
import Swal from "sweetalert2";
import "./style.css";
import { storage } from "../../firebaseConfig/firebase";

export default function ChangeLogo() {
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoChange = (event) => {
    const selectedLogo = event.target.files[0];
    setLogo(selectedLogo);
  };

  const handleLogoUpload = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    if (!logo) {
      return;
    }
    console.log("Uploading logo...");
    const storageRef = ref(storage, "gs://bligh-db.appspot.com/logo/"); 
    const uploadTask = uploadBytes(storageRef, logo);
    setIsLoading(true);
  
    uploadTask
      .then(async () => {
        const logoUrl = await getDownloadURL(storageRef);
        setLogoUrl(logoUrl);
        Swal.fire({
          icon: "success",
          title: "Logo Updated",
          text: "Your logo has been updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("Logo uploaded successfully");
      })
      .catch((error) => {
        console.error("Error uploading logo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while uploading your logo",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("Error uploading logo:", error);
      })
      .finally(() => {
        setIsLoading(false); // Make sure to reset isLoading after upload completes or fails
      });
  };
  

  return (
    <section className="changeLogo_section">
      <div className="section_header">
        <h2 className="title">Change Logo</h2>
        <p className="logo_label">Select a new logo for your site</p>
      </div>
      
        {isLoading && <LoadingScreen />}

      <form className="changeLogo_form" onSubmit={handleLogoUpload}>
        <div className="changeLogo_form_group">
          <label htmlFor="logo">Select Logo:</label>
          <input
            type="file"
            accept="image/*"
            name="logo"
            id="logo"
            onChange={handleLogoChange}
          />
        </div>

        <div className="changeLogo_form_group">
          {logo && <img src={URL.createObjectURL(logo)} alt="Selected Logo" />}
        </div>

        <div className="changeLogo_form_group">
          {logo && (
            <button className="submit_btn" type="submit">
              Upload New Logo
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
