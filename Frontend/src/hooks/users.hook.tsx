import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

type LoginCredentials =
  | { email: string; password: string; username?: never }
  | { username: string; password: string; email?: never };


const registerUser = () => {
    return useMutation({
        mutationKey: ['registerUser'],
        mutationFn: async (userData: {
            username: string;
            fullName: string;
            email: string;
            password: string;
        }) => {
            const res = await axios.post('/api/v1/users/', userData);
            return res.data;    
        },
        onSuccess: (data) => {
            console.log("User registered successfully:", data);
        },
        onError: (error) => {
            console.error("Error registering user:", error);
        }
    })
};
const loginUser = () => {
    return useMutation({
        mutationKey: ['loginUser'],
        mutationFn: async (credentials: LoginCredentials) => {
            const res = await axios.post('/api/v1/users/login', credentials);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("User logged in successfully:", data);
        },
        onError: (error) => {
            console.error("Error logging in user:", error);
        }
    });
};
const logoutUser = () => {
    return useMutation({
        mutationKey: ['logoutUser'],
        mutationFn: async () => {
            const res = await axios.post('/api/v1/users/logout');
            return res.data;
        },
        onSuccess: (data) => {
            console.log("User logged out successfully:", data);
        },
        onError: (error) => {
            console.error("Error logging out user:", error);
        }   
    });
};
const profile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const res = await axios.get('/api/v1/users/profile');
            return res.data;
        }
    })
};
const changePassword = () => {
    return useMutation({
        mutationKey: ['changePassword'],
        mutationFn: async (passwordData: {
            oldPassword: string;
            newPassword: string;
            confirmPassword: string;
        }) => {
            const res = await axios.post('/api/v1/users/change-password', passwordData);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("Password changed successfully:", data);
        },
        onError: (error) => {
            console.error("Error changing password:", error);
        }
    });
};
const refreshAccessToken = () => {
    return useMutation({
        mutationKey: ['refreshAccessToken'],
        mutationFn: async () => {
            const res = await axios.post('/api/v1/users/refresh-token');
            return res.data;
        }
    });
};
const updateProfile = () => {
    return useMutation({
        mutationKey: ['updateProfile'],
        mutationFn: async (profileData: {
            fullName?: string;
            email?: string;
            username?: string;
        }) => {
            const res = await axios.put('/api/v1/users/update-profile', profileData);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("Profile updated successfully:", data);
        },
        onError: (error) => {
            console.error("Error updating profile:", error);
        }
    });
};

export { registerUser, loginUser, logoutUser, profile, changePassword, refreshAccessToken, updateProfile };