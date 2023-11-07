import React, { useState } from 'react';
import './style.css';

export default function ChangeLogo({ onLogoChange }) {
    const [logo, setLogo] = useState(null);
  
    const handleLogoChange = (event) => {
      const selectedLogo = event.target.files[0];
      setLogo(selectedLogo);
    };
  
    const handleLogoUpload = () => {
      // You can implement the logic to upload the new logo to your server or storage
      // Typically, you would use a service like Firebase Storage or an API endpoint to handle the upload.
  
      // After successfully uploading the logo, call the `onLogoChange` callback with the new logo URL.
      // For example:
      // onLogoChange(newLogoUrl);
    };
  
    return (
      <section className="changeLogo_section">
        <div className="section_header">
          <h2 className="title">Change Logo</h2>
          <p className="logo_label">Select a new logo for your site</p>
        </div>
  
        <form className="changeLogo_form">
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
              <button className="submit_btn" onClick={handleLogoUpload}>
                Upload New Logo
              </button>
            )}
          </div>
        </form>
      </section>
    );
  }