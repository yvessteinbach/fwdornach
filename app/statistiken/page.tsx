'use client';

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import Breadcrumb from '../components/breadcrumb';
import Loading from '../components/loading';

export default function StatsPage() {
    const [docCount, setDocCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocumentCount = async () => {
            try {
                const app = getApp(); // Get the default Firebase app
                const db = getFirestore(app); // Initialize Firestore using the app
                const einsaetzeCollection = collection(db, 'einsaetze');
                const snapshot = await getDocs(einsaetzeCollection);
                setDocCount(snapshot.size); // Get document count
            } catch (error) {
                console.error('Error fetching document count:', error);
                setDocCount(null); // Handle error case
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentCount();
    }, []);

    return (
        <>
            <div className="container">
                <div className="side">
                    <Breadcrumb />
                </div>
                {loading ? (
                    <Loading />
                ) : docCount !== null ? (
                    <p>Total documents in the &quot;Einsätze&quot; collection: {docCount}</p>
                ) : (
                    <p>Failed to load data. Please try again.</p>
                )}
            </div>
        </>
    );
}