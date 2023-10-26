import React, { useState } from "react";
import Swal from "sweetalert2";
import { db } from "../../firebaseConfig/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { addUser } from "../../store/userStore/userActions";
import LoadingScreen from "../LoadingScreen";

const Add = ({ setUsers, setIsAdding, refreshDetails }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState(123456)

  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    email: "",
    jointAccount: false,
    secondaryAccountHolder: "",
    secondaryTitle: "",
    password: password,
    mobile: "",
    home: "",
    address: "",
    city: "",
    country: "",
    postcode: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const {
      title,
      fullName,
      jointAccount,
      secondaryAccountHolder,
      secondaryTitle,
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
      const userEmail = user.email;

      // Send password reset email
      sendPasswordResetEmail(auth, userEmail)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Email Sent!",
            text: `Password reset email has been sent to ${userEmail}.`,
            showConfirmButton: false,
            timer: 2000,
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: `There was an error sending the password reset email. ${errorCode}: ${errorMessage}`,
            showConfirmButton: true,
          });
        });

      // Add user to Firestore using user.uid as the document ID
      const newUser = {
        uid: user.uid,
        title,
        fullName,
        jointAccount,
        secondaryAccountHolder,
        secondaryTitle,
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
      
      // Dispatch to Redux
      dispatch(addUser(newUser));

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `${fullName}'s data has been added.`,
        showConfirmButton: false,
        timer: 2000,
      });
      // Update state
      setUsers((prevUsers) => [...prevUsers, newUser]);
      refreshDetails();
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `There was an error adding the user. ${error.message}`,
        showConfirmButton: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="small-container">
      <h3>Add New User</h3>
      {isLoading && (
        <LoadingScreen /> )}
     
        <form onSubmit={handleAdd}>
          <div className="jointAcct_checkbox">
            <input
              id="jointAccount"
              type="checkbox"
              name="jointAccount"
              checked={formData.jointAccount}
              onChange={handleInputChange}
            />
            <label htmlFor="jointAccount">Joint Account</label>
          </div>
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
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
            <option value="Rev">Rev</option>
            <option value="Other">Other</option>
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

          {formData.jointAccount && (
            <>
              <label htmlFor="secondaryAccountHolder">
                Secondary Account Holder
              </label>
              <input
                id="secondaryAccountHolder"
                type="text"
                name="secondaryAccountHolder"
                value={formData.secondaryAccountHolder}
                onChange={handleInputChange}
              />

              <label htmlFor="secondaryTitle">Secondary Title</label>
              <select
                id="secondaryTitle"
                name="secondaryTitle"
                value={formData.secondaryTitle}
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

          {/* <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          /> */}

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
      
    </div>
  );
};

export default Add;
