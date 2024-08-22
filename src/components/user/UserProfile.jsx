import React, { useState } from 'react';
import '/src/styles/UserProfile.css';

export default function UserProfile() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Main St, Anytown, USA');
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    // Here you would typically also send the updated information to the server
    console.log('Profile Updated:', { name, email, phone, address });
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-info">
        <label>
          Name:
          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <span>{name}</span>
          )}
        </label>
      </div>
      <div className="profile-info">
        <label>
          Email:
          {editing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <span>{email}</span>
          )}
        </label>
      </div>
      <div className="profile-info">
        <label>
          Phone:
          {editing ? (
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            <span>{phone}</span>
          )}
        </label>
      </div>
      <div className="profile-info">
        <label>
          Address:
          {editing ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          ) : (
            <span>{address}</span>
          )}
        </label>
      </div>
      <div className="profile-actions">
        {editing ? (
          <>
            <button onClick={handleSave} className="save-button">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="cancel-button">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="edit-button">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
