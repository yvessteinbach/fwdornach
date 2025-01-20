'use client';

import React from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // For managing cookies
import { auth } from '../../lib/firebase';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Sign out the user from Firebase
            await signOut(auth);

            // Remove the auth token cookie
            Cookies.remove('authToken');

            // Redirect to the login page
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <button onClick={handleLogout} className="button">
            Abmelden
        </button>
    );
}