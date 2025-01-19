'use client';

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';

interface GridProps {
    collectionName: string;
}

export default function Grid({ collectionName }: GridProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore(getApp());
                const querySnapshot = await getDocs(collection(db, collectionName));
                const fetchedData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collectionName]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (data.length === 0) {
        return <div>No data available in the {collectionName} collection.</div>;
    }

    return (
        <div className="grid-container">
            {data.map((item) => (
                <div className="grid__item" key={item.id}>
                    <div className="grid__item-wrapper">
                        <div className="item__nr">{item.number}</div>
                        <h3 className="item__smalltitle">{item.smallTitle}</h3>
                        <p className="item__location">{item.location}</p>
                        <p className="item__desc1">{item.desc1}</p>
                        <p className="item__desc2">{item.desc2}</p>
                        <p className="item__desc3">{item.desc3}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}