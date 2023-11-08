import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebaseConfig/firebase";
import LoadingScreen from "../LoadingScreen";
import Swal from "sweetalert2";
import "./style.css";

export default function ChangeLogo() {
  const [whiteLogo, setWhiteLogo] = useState(null);
  const [whiteLogoUrl, setWhiteLogoUrl] = useState(null);

  const [darkLogo, setDarkLogo] = useState(null);
  const [darkLogoUrl, setDarkLogoUrl] = useState(null);

  const [favicon, setFavicon] = useState(null);
  const [faviconUrl, setFaviconUrl] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch an image from Firebase Storage
  const fetchImage = async (imageRef, setImageUrl) => {
    try {
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
    } catch (error) {
      console.error("Error fetching image:", error);
      // Handle errors as needed
    }
  };

  useEffect(() => {
    // Fetch the images when the component mounts
    fetchImage(
      ref(storage, "gs://bligh-db.appspot.com/logos/whiteLogo/"),
      setWhiteLogoUrl
    );
    fetchImage(
      ref(storage, "gs://bligh-db.appspot.com/logos/darkLogo/"),
      setDarkLogoUrl
    );
    fetchImage(
      ref(storage, "gs://bligh-db.appspot.com/logos/favicon/"),
      setFaviconUrl
    );
  }, []);

  const handleImageChange = (event, setImage) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleImageUpload = async (e, imageRef, setImageUrl, image) => {
    e.preventDefault();

    if (!image) {
      return;
    }

    const uploadTask = uploadBytes(imageRef, image);
    setIsLoading(true);

    try {
      await uploadTask;
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      Swal.fire({
        icon: "success",
        title: "Image Updated",
        text: "Your image has been updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while uploading your image",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="changeLogo_section">
      <div className="section_header">
        <h2 className="title">Change Logo</h2>
        <p className="logo_label">Select a new logo for your site</p>
      </div>

      {isLoading && <LoadingScreen />}

      <form className="changeLogo_form">
        <div className="changeLogo_form_group">
          <label htmlFor="whiteLogo" className="label">
            White Logo:
          </label>
          <div className="changeLogo_logo">
            {whiteLogoUrl && <img src={whiteLogoUrl} alt="White Logo" />}
          </div>
          <input
            type="file"
            accept="image/*"
            name="whiteLogo"
            id="whiteLogo"
            onChange={(e) => handleImageChange(e, setWhiteLogo)}
          />
        </div>

        <div className="changeLogo_form_group">
          <label htmlFor="darkLogo" className="label">
            Dark Logo:
          </label>
          <div className="changeLogo_logo">
            {darkLogoUrl && <img src={darkLogoUrl} alt="Dark Logo" />}
          </div>
          <input
            type="file"
            accept="image/*"
            name="darkLogo"
            id="darkLogo"
            onChange={(e) => handleImageChange(e, setDarkLogo)}
          />
        </div>

        <div className="changeLogo_form_group">
          <label htmlFor="favicon" className="label">
            Favicon:
          </label>
          <div className="changeLogo_logo">
            {faviconUrl && <img src={faviconUrl} alt="Favicon" />}
          </div>
          <input
            type="file"
            accept="image/*"
            name="favicon"
            id="favicon"
            onChange={(e) => handleImageChange(e, setFavicon)}
          />
        </div>

        <div className="changeLogo_form_group">
          <button
            className="submit_btn"
            onClick={async (e) => {
              await handleImageUpload(
                e,
                ref(storage, "gs://bligh-db.appspot.com/logos/whiteLogo/"),
                setWhiteLogoUrl,
                whiteLogo
              );
              await handleImageUpload(
                e,
                ref(storage, "gs://bligh-db.appspot.com/logos/darkLogo/"),
                setDarkLogoUrl,
                darkLogo
              );
              await handleImageUpload(
                e,
                ref(storage, "gs://bligh-db.appspot.com/logos/favicon/"),
                setFaviconUrl,
                favicon
              );
            }}
          >
            Upload Images
          </button>
        </div>
      </form>
    </section>
  );
}
