import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../utils/axios-utils.tsx'

type LoginCredentials =
    | { email: string; password: string; username?: never }
    | { username: string; password: string; email?: never };

const userKey = ['currentUser'];

const useRegisterUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['registerUser'],
        mutationFn: async (userData: {
            username: string;
            fullName: string;
            email: string;
            password: string;
        }) => {
            const res = await api.post('/users/', userData);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("User registered successfully:", data);
            queryClient.invalidateQueries({ queryKey: userKey });
        },
        onError: (error) => {
            console.error("Error registering user:", error);
        }
    })
};
const useLoginUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['loginUser'],
        mutationFn: async (credentials: LoginCredentials) => {
            const res = await api.post('/users/login', credentials);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("User logged in successfully:", data);
            try { window.localStorage.setItem('isAuthenticated', 'true'); } catch {}
            queryClient.invalidateQueries({ queryKey: userKey });
        },
        onError: (error) => {
            console.error("Error logging in user:", error);
        }
    });
};
const useLogoutUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['logoutUser'],
        mutationFn: async () => {
            const res = await api.post('/users/logout');
            return res.data;
        },
        onSuccess: (data) => {
            console.log("User logged out successfully:", data);
            // Clear auth state immediately so UI reflects logged-out status
            queryClient.setQueryData(userKey, null);
            // Also clear any cached queries/history so guests don't see old data
            queryClient.removeQueries({ queryKey: ['queries'] });
            queryClient.removeQueries({ queryKey: ['conversations'] });
            queryClient.removeQueries({ queryKey: ['conversation'] });
            try { window.localStorage.removeItem('isAuthenticated'); } catch {}
            queryClient.invalidateQueries({ queryKey: userKey });
        },
        onError: (error) => {
            console.error("Error logging out user:", error);
        }
    });
};
const useProfile = () => {
    return useQuery({
        queryKey: userKey,
        queryFn: async () => {
            const res = await api.get('/users/profile');
            return res.data;
        },
        retry: false,
    })
};
const useChangePassword = () => {
    return useMutation({
        mutationKey: ['changePassword'],
        mutationFn: async (passwordData: {
            oldPassword: string;
            newPassword: string;
            confirmPassword: string;
        }) => {
            const res = await api.post('/users/change-password', passwordData);
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
const useRefreshAccessToken = () => {
    return useMutation({
        mutationKey: ['refreshAccessToken'],
        mutationFn: async () => {
            const res = await api.post('/users/refresh-token');
            return res.data;
        }
    });
};
const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['updateProfile'],
        mutationFn: async (profileData: {
            fullName?: string;
            email?: string;
            username?: string;
        }) => {
            const res = await api.patch('/users/update-profile', profileData);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("Profile updated successfully:", data);
            queryClient.invalidateQueries({ queryKey: userKey });
        },
        onError: (error) => {
            console.error("Error updating profile:", error);
        }
    });
};

export { useRegisterUser, useLoginUser, useLogoutUser, useProfile, useChangePassword, useRefreshAccessToken, useUpdateProfile };