import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useProfile, useLoginUser, useLogoutUser, useRegisterUser } from '../hooks/users.hook.tsx';
import type { User, LoginCredentials, RegisterData } from '../types/types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { data: profileData, isLoading: profileLoading } = useProfile();
    const loginMutation = useLoginUser();
    const logoutMutation = useLogoutUser();
    const registerMutation = useRegisterUser();

    // API returns the user object directly at `data` for /users/profile
    // whereas login returns { user, accessToken }. Normalize here.
    const user = (profileData?.data && (profileData.data as any).user === undefined)
        ? (profileData.data as any)
        : (profileData?.data as any)?.user || null;
    const isAuthenticated = !!user;
    // console.log(user);

    const login = async (credentials: LoginCredentials) => {
        return new Promise<void>((resolve, reject) => {
            if (!credentials.username || !credentials.password) {
                reject(new Error('Username and password are required'));
                return;
            }
            loginMutation.mutate({ username: credentials.username, password: credentials.password }, {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
            });
        });
    };

    const register = async (data: RegisterData) => {
        return new Promise<void>((resolve, reject) => {
            registerMutation.mutate(data, {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
            });
        });
    };

    const logout = async () => {
        return new Promise<void>((resolve, reject) => {
            logoutMutation.mutate(undefined, {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
            });
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading: profileLoading,
                isAuthenticated,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
