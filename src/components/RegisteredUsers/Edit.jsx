import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { updateUser } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";

const Edit = ({ user, onClose, refreshDetails, details }) => {
  const id = user.uid;
  const [formData, setFormData] = useState({
    title: details.title,
    fullName: details.fullName,
    jointAccount: details.jointAccount,
    secondaryAccountHolder: details.secondaryAccountHolder,
    secondaryTitle: details.secondaryTitle,
    email: details.email,
    mobile: details.mobilePhone,
    home: details.homePhone,
    address: details.address,
    city: details.city,
    country: details.country,
    postcode: details.postcode,
  });
  console.log('user', details.title)
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();

    const {
      title,
      fullName,
      jointAccount,
      secondaryAccountHolder,
      secondaryTitle,
      email,
      mobile,
      home,
      address,
      city,
      country,
      postcode,
    } = formData;

    // Check if required fields are filled
    if (!fullName || !email || !mobile || !address) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    // Filter out empty fields
    const updatedUser = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value)
    );

    // If no changes were made, exit the function
    if (Object.keys(updatedUser).length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Changes',
        text: 'No changes were made.',
        showConfirmButton: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      // Update the user in Firestore
      await updateUser(id, updatedUser);

      // Notify the user of the successful update
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `${updatedUser.fullName}'s data has been updated.`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Close the edit form
      refreshDetails();
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error updating the user.',
        showConfirmButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit User</h1>
        {isLoading && <LoadingScreen />}
        <div className="jointAcct_checkbox">
          <input
            id="jointAccount"
            type="checkbox"
            name="jointAccount"
            checked={formData.jointAccount || false}
            onChange={handleInputChange}
          />
          <label htmlFor="jointAccount">Joint Account</label>
        </div>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleInputChange}
        />

        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName || ''}
          onChange={handleInputChange}
        />

        {formData.jointAccount && (
          <>
            <label htmlFor="secondaryAccountHolder">
              Secondary Account Holder
            </label>
            <input
              id="secondaryAccountHolder"
              type="text"
              name="secondaryAccountHolder"
              value={formData.secondaryAccountHolder || ''}
              onChange={handleInputChange}
            />

            <label htmlFor="secondaryTitle">Secondary Title</label>
            <select
              id="secondaryTitle"
              name="secondaryTitle"
              value={formData.secondaryTitle || ''}
              onChange={handleInputChange}
            >
              <option value="">Select Title</option>
              <option value="Miss">Miss</option>
              <option value="Mrs">Mrs</option>
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
              <option value="Rev">Rev</option>
              <option value="Other">Other</option>
            </select>
          </>
        )}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
        />

        <label htmlFor="mobile">Mobile</label>
        <input
          id="mobile"
          type="text"
          name="mobile"
          value={formData.mobile || ''}
          onChange={handleInputChange}
        />

        <label htmlFor="home">Home</label>
        <input
          id="home"
          type="text"
          name="home"
          value={formData.home || ''}
          onChange={handleInputChange}
        />

        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          name="address"
          value={formData.address || ''}
          onChange={handleInputChange}
        />

        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          name="city"
          value={formData.city || ''}
          onChange={handleInputChange}
        />

        <label htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          name="country"
          value={formData.country || ''}
          onChange={handleInputChange}
        />

        <label htmlFor="postcode">Postcode</label>
        <input
          id="postcode"
          type="text"
          name="postcode"
          value={formData.postcode || ''}
          onChange={handleInputChange}
        />

        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Save" />
          <input
            style={{ marginLeft: '12px' }}
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


export default Edit;
