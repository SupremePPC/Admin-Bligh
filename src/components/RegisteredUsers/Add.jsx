import React, { useState } from "react";
import Swal from "sweetalert2";
import { db } from "../../firebaseConfig/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { addUser } from "../../store/userStore/userActions";
import LoadingScreen from "../LoadingScreen";

const Add = ({ setUsers, setIsAdding }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    home: "",
    address: "",
    city: "",
    country: "",
    postcode: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const {
      title,
      fullName,
      email,
      password,
      mobile,
      home,
      address,
      city,
      country,
      postcode,
    } = formData;

    // Validation
    if (
      !title ||
      !fullName ||
      !email ||
      !password ||
      !mobile ||
      !address ||
      !city ||
      !country ||
      !postcode
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }
    setIsLoading(true);
    try {
      // Create user in Firebase Authentication
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Send email verification
      await sendEmailVerification(user);

      // Add user to Firestore using user.uid as the document ID
      const newUser = {
        uid: user.uid,
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
      const usersRef = doc(db, "users", newUser.uid);
      await setDoc(usersRef, newUser);
      console.log("User added to Firestore");
      // Update state
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setIsAdding(false);

      // Dispatch to Redux
      dispatch(addUser(newUser));

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `${fullName}'s data has been added.`,
        showConfirmButton: false,
        timer: 2000,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `There was an error adding the user. ${error}`,
        showConfirmButton: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="small-container">
      <h3>Add New User</h3>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <form onSubmit={handleAdd}>
          <label htmlFor="title">Title</label>
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Title</option>
            <option value="Miss">Miss</option>
            <option value="Mrs">Mrs</option>
            <option value="Mr">Mr</option>
          </select>

          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="mobile">Mobile</label>
          <input
            id="mobile"
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="home">Home</label>
          <input
            id="home"
            type="text"
            name="home"
            value={formData.home}
            onChange={handleInputChange}
            
          />

          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="postcode">Postcode</label>
          <input
            id="postcode"
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            // pattern="^[A-Za-z0-9]{3} [A-Za-z0-9]{4}$"
            maxLength="8"
            required
              title="Postcode must be in the format like D02X88"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <div style={{ marginTop: "30px" }}>
            <input type="submit" value="Add" />
            <input
              style={{ marginLeft: "12px" }}
              className="muted-button"
              type="button"
              value="Cancel"
              onClick={() => setIsAdding(false)}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Add;
