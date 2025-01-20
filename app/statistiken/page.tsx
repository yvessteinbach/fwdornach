'use client';

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';

import Breadcrumb from '../components/breadcrumb';
import Loading from '../components/loading';

export default function StatsPage() {
    const [einsaetzeCount, setEinsaetzeCount] = useState<number | null>(null);
    const [uebungenCount, setUebungenCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocumentCounts = async () => {
            try {
                const app = getApp(); // Get the default Firebase app
                const db = getFirestore(app); // Initialize Firestore using the app

                // Fetch document counts for "einsaetze" collection
                const einsaetzeCollection = collection(db, 'einsaetze');
                const einsaetzeSnapshot = await getDocs(einsaetzeCollection);
                setEinsaetzeCount(einsaetzeSnapshot.size);

                // Fetch document counts for "uebungen" collection
                const uebungenCollection = collection(db, 'uebungen');
                const uebungenSnapshot = await getDocs(uebungenCollection);
                setUebungenCount(uebungenSnapshot.size);
            } catch (error) {
                console.error('Error fetching document counts:', error);
                setEinsaetzeCount(null); // Handle error case
                setUebungenCount(null); // Handle error case
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentCounts();
    }, []);

    // Calculate total count
    const totalCount = (einsaetzeCount ?? 0) + (uebungenCount ?? 0);

    return (
        <>
            <div className="container">
                <div className="side">
                    <Breadcrumb />
                </div>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="grid__container">
                            <div className="grid__row">
                                <div className="grid__item">
                                    <div className="grid__item-wrapper">
                                        <div className="item__nr">Anzahl Post's</div>
                                        <h3 className="item__smalltitle">{totalCount}</h3>
                                    </div>
                                </div>

                                <div className="grid__item">
                                    <div className="grid__item-wrapper">
                                        <div className="item__nr">Anzahl Einsätze</div>
                                        <h3 className="item__smalltitle">{einsaetzeCount ?? 'Error'}</h3>
                                    </div>
                                </div>

                                <div className="grid__item">
                                    <div className="grid__item-wrapper">
                                        <div className="item__nr">Anzahl Übungen</div>
                                        <h3 className="item__smalltitle">{uebungenCount ?? 'Error'}</h3>
                                    </div>
                                </div>

                                <div className="grid__item">
                                    <div className="grid__item-wrapper">
                                        <div className="item__nr">Top Einsatzkategorie</div>
                                        <h3 className="item__smalltitle">000</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}