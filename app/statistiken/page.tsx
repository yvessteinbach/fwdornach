'use client';

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';

import Breadcrumb from '../components/breadcrumb';
import Loading from '../components/loading';

interface Einsatz {
    id?: string; // Optional if needed
    smallTitle: string; // Category
    desc2: string; // Time
}

export default function StatsPage() {
    const [einsaetzeCount, setEinsaetzeCount] = useState<number | null>(null);
    const [uebungenCount, setUebungenCount] = useState<number | null>(null);
    const [mostCommonCategory, setMostCommonCategory] = useState<string | null>(null);
    const [mostCommonTime, setMostCommonTime] = useState<string | null>(null);
    const [averageTime, setAverageTime] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocumentCountsAndStats = async () => {
            try {
                const app = getApp(); // Get the default Firebase app
                const db = getFirestore(app); // Initialize Firestore using the app

                // Fetch document counts for "einsaetze" collection
                const einsaetzeCollection = collection(db, 'einsaetze');
                const einsaetzeSnapshot = await getDocs(einsaetzeCollection);
                setEinsaetzeCount(einsaetzeSnapshot.size);

                // Analyze stats for most common `smallTitle` and `desc2`
                const einsaetzeData: Einsatz[] = einsaetzeSnapshot.docs.map((doc) =>
                    doc.data()
                ) as Einsatz[];

                // Helper function to count occurrences
                const countOccurrences = (items: Einsatz[], key: keyof Einsatz) => {
                    return items.reduce((acc, item) => {
                        const value = item[key];
                        if (value) {
                            acc[value] = (acc[value] || 0) + 1;
                        }
                        return acc;
                    }, {} as Record<string, number>);
                };

                // Most common category (smallTitle)
                const categoryCounts = countOccurrences(einsaetzeData, 'smallTitle');
                const topCategory = Object.entries(categoryCounts).reduce(
                    (a, b) => (b[1] > a[1] ? b : a),
                    ['', 0]
                )[0] as string;

                setMostCommonCategory(topCategory || 'N/A');

                // Most common time (desc2)
                const timeCounts = countOccurrences(einsaetzeData, 'desc2');
                const topTime = Object.entries(timeCounts).reduce(
                    (a, b) => (b[1] > a[1] ? b : a),
                    ['', 0]
                )[0] as string;

                setMostCommonTime(topTime || 'N/A');

                // Calculate average time (desc2)
                const calculateAverageTime = (items: Einsatz[]) => {
                    const parseTimeToMinutes = (time: string): number => {
                        const [hours, minutes] = time.split(':').map(Number);
                        return hours * 60 + minutes;
                    };

                    const formatMinutesToTime = (totalMinutes: number): string => {
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        return `${hours.toString().padStart(2, '0')}:${minutes
                            .toString()
                            .padStart(2, '0')}`;
                    };

                    const validTimes = items
                        .map((item) => item.desc2)
                        .filter((time) => /^\d{1,2}:\d{2}$/.test(time)); // Ensure valid time format like "10:30"

                    if (validTimes.length === 0) {
                        return 'N/A'; // Handle case with no valid times
                    }

                    const totalMinutes = validTimes
                        .map(parseTimeToMinutes)
                        .reduce((sum, minutes) => sum + minutes, 0);

                    const averageMinutes = Math.round(totalMinutes / validTimes.length);
                    return formatMinutesToTime(averageMinutes);
                };

                const avgTime = calculateAverageTime(einsaetzeData);
                setAverageTime(avgTime || 'N/A');

                // Fetch document counts for "uebungen" collection
                const uebungenCollection = collection(db, 'uebungen');
                const uebungenSnapshot = await getDocs(uebungenCollection);
                setUebungenCount(uebungenSnapshot.size);
            } catch (error) {
                console.error('Error fetching data:', error);
                setEinsaetzeCount(null); // Handle error case
                setUebungenCount(null); // Handle error case
                setMostCommonCategory(null);
                setMostCommonTime(null);
                setAverageTime(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentCountsAndStats();
    }, []);

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
                        <div className="color">
                            <div className="color__item">
                                <div className="text gray">Allgemein</div>
                            </div>
                            <div className="color__item">
                                <div className="text red">Einsatz</div>
                            </div>
                            <div className="color__item">
                                <div className="text blue">Übung</div>
                            </div>
                        </div>
                        <div className="grid__container">
                            <div className="grid__row">
                                {/* Total Count */}
                                <div className="grid__item">
                                    <div className="grid__item-wrapper">
                                        <div className="item__nr__small">Gesamt</div>
                                        <h3 className="item__smalltitle stat">{totalCount}</h3>
                                    </div>
                                </div>

                                {/* Einsätze Count */}
                                <div className="grid__item">
                                    <div className="grid__item-wrapper einsatz">
                                        <div className="item__nr__small">Einsätze</div>
                                        <h3 className="item__smalltitle stat">{einsaetzeCount ?? 'Error'}</h3>
                                    </div>
                                </div>

                                {/* Most Common Category */}
                                <div className="grid__item">
                                    <div className="grid__item-wrapper einsatz">
                                        <div className="item__nr__small">Top Einsatzart</div>
                                        <h3 className="item__smalltitle stat">
                                            {mostCommonCategory ?? 'N/A'}
                                        </h3>
                                    </div>
                                </div>

                                {/* Most Common Time */}
                                <div className="grid__item">
                                    <div className="grid__item-wrapper einsatz">
                                        <div className="item__nr__small">Häufigste Uhrzeit</div>
                                        <h3 className="item__smalltitle stat">{mostCommonTime ?? 'N/A'}</h3>
                                    </div>
                                </div>

                                {/* Average Time */}
                                <div className="grid__item">
                                    <div className="grid__item-wrapper einsatz">
                                        <div className="item__nr__small">⌀ Uhrzeit</div>
                                        <h3 className="item__smalltitle stat">{averageTime ?? 'N/A'}</h3>
                                    </div>
                                </div>

                                {/* Übungen Count */}
                                <div className="grid__item">
                                    <div className="grid__item-wrapper uebung">
                                        <div className="item__nr__small">Übungen</div>
                                        <h3 className="item__smalltitle stat">{uebungenCount ?? 'Error'}</h3>
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