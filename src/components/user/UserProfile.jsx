import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import '/src/styles/UserProfile.css'; // Add this line at the top of your Profile.jsx

const Profile = () => {
    const [user, setUser] = useState(null); // Initially, the user is null until data is fetched
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ Name: '', Email: '' });
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [token, setToken] = useState(null); // Token state


    // Fetch user profile when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            setToken(localStorage.getItem('token'));
            console.log("Token: ", token);

            const newToken = localStorage.getItem('token');

            if (!newToken) {
                setError('No newToken found. Please log in.');
                return;
            }
            

            try {
                const response = await axios.get('http://localhost:8500/api/v1/user-auth/profile', 
                    {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        }
                    }
                 );
                setUser(response.data); // Set the user data returned from the backend
                setFormData({ Name: response.data.Name, Email: response.data.Email });
            } catch (err) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false); // Stop loading when request completes
            }
        };
        fetchUserProfile();
    }, [token]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log("AWA WAWA")
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
            const token = localStorage.getItem('token'); // Fetch token from localStorage
            console.log("Form data: " + JSON.stringify(formData));
            if (token) {
                const response = await axios.put('http://localhost:8500/api/v1/user-auth/profile', 
                    formData, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                console.log("Response: ", response.data);
                setFormData(response.data);
                setUser(response.data);
            } else {
                console.log("No token found in localStorage.");
            }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {isEditing ? (
                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <div>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="Name"
                                value={formData.Name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={handleEditToggle}>Cancel</button>
                </form>
            ) : (
                <div className="profile-info">
                    <p><strong>Name:</strong> {user.Name}</p>
                    <p><strong>Email:</strong> {user.Email}</p>
                    <p><strong>Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}</p>
                    <button onClick={handleEditToggle}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
