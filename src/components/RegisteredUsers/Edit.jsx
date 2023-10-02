import React, { useState } from "react";
import Swal from "sweetalert2";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

const Edit = ({ user, onClose }) => {
  const id = user.id;

  const [title, setTitle] = useState(user.title);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [mobile, setMobile] = useState(user.mobilePhone);
  const [home, setHome] = useState(user.homePhone);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [country, setCountry] = useState(user.country);
  const [postcode, setPostcode] = useState(user.postcode);
  if (!user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !mobile || !address) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    let updatedUser = {
      title,
      fullName,
      email,
      mobilePhone: mobile,
      homePhone: home,
      address,
      city,
      country,
      postcode,
    };

    // Filter out empty fields
    updatedUser = Object.fromEntries(
      Object.entries(updatedUser).filter(([_, value]) => value)
    );

    // If updatedUser is empty, exit the function
    if (Object.keys(updatedUser).length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "No changes were made.",
        showConfirmButton: true,
      });
      return;
    }

    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, updatedUser);
      // Notify the user of the successful update
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${updatedUser.fullName}'s data has been updated.`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Close the edit form
      onClose();
      // refreshUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an error updating the user.",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit User</h1>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="mobile">Mobile</label>
        <input
          id="mobile"
          type="text"
          name="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <label htmlFor="home">Home</label>
        <input
          id="home"
          type="text"
          name="home"
          value={home}
          onChange={(e) => setHome(e.target.value)}
        />

        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <label htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <label htmlFor="postcode">Postcode</label>
        <input
          id="postcode"
          type="text"
          name="postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />

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
      </form>
    </div>
  );
};

export default Edit;
