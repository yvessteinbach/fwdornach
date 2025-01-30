'use client';

import React from 'react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

function LogoutButton() {
    const handleLogout = async () => {
        await signOut(auth);
    };

    return <button className="button" onClick={handleLogout}>Abmelden</button>;
}

export default LogoutButton;