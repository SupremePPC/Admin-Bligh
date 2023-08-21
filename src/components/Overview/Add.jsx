import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { db } from '../../firebase/firebase';
import { addDoc, collection } from 'firebase/firestore';

const Add = ({ setUsers, setIsAdding }) => {
  const [title, setTitle] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [home, setHome] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postcode, setPostcode] = useState('');

  const handleAdd = async e => {
    e.preventDefault();

    if (!title || !fullName || !email || !mobile || !address || !city || !country || !postcode) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const newUser = {
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

    try {
      const usersRef = collection(db, "users");
      const docRef = await addDoc(usersRef, newUser);

      // Update state with the new user including the generated ID
      setUsers(prevUsers => [...prevUsers, { ...newUser, id: docRef.id }]);
      setIsAdding(false);

      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: `${fullName}'s data has been added.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error adding the user.',
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="small-container">
      <form onSubmit={handleAdd}>
        <h1>Add User</h1>
        
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label htmlFor="mobile">Mobile</label>
        <input
          id="mobile"
          type="text"
          name="mobile"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
        />

        <label htmlFor="home">Home</label>
        <input
          id="home"
          type="text"
          name="home"
          value={home}
          onChange={e => setHome(e.target.value)}
        />

        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          name="address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />

        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          name="city"
          value={city}
          onChange={e => setCity(e.target.value)}
        />

        <label htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          name="country"
          value={country}
          onChange={e => setCountry(e.target.value)}
        />

        <label htmlFor="postcode">Postcode</label>
        <input
          id="postcode"
          type="text"
          name="postcode"
          value={postcode}
          onChange={e => setPostcode(e.target.value)}
        />

        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: '12px' }}
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
