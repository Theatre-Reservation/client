import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests

// Create Context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // This will store the user data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8500/api/v1/user-auth/profile', 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                setUser(response.data);
            } catch (err) {
                console.error('Failed to fetch user data', err);
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
