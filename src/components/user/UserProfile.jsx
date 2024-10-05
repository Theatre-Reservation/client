import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import '/src/styles/UserProfile.css'; // Add this line at the top of your Profile.jsx

const Profile = () => {
    const [user, setUser] = useState(null); // Initially, the user is null until data is fetched
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ Name: '', Email: '' });
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch user profile when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/user-auth/profile', { withCredentials: true });
                console.log("Fetched user data:", response.data); // <-- Add this line to check the response
                setUser(response.data); // Set the user data returned from the backend
                setFormData({ Name: response.data.Name, Email: response.data.Email });
            } catch (err) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false); // Stop loading when request completes
            }
        };
        fetchUserProfile();
    }, []);
    

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('/user-auth/profile', formData, { withCredentials: true });
            setUser(response.data); // Update user data after successful save
            setIsEditing(false); // Exit edit mode after saving changes
        } catch (err) {
            setError('Failed to update profile');
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
