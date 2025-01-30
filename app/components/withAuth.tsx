'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
    return function WithAuthWrapper(props: P) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push('/login');
            }
        }, [user, loading, router]);

        if (loading || !user) return <div>Loading...</div>;

        return <Component {...props} />;
    };
};