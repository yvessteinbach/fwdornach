'use client';

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';

interface GridItem {
    id: string;
    number: string;
    smallTitle: string;
    desc1: string;
    desc2: string;
    desc3: string;
    location: string;
    background: string;
}

interface GridProps {
    collectionName: string;
}

export default function Grid({ collectionName }: GridProps) {
    const [data, setData] = useState<GridItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore(getApp());
                const querySnapshot = await getDocs(collection(db, collectionName));
                const fetchedData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as GridItem[];
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
        return <div className="lds-ripple">
            <div></div>
            <div></div>
        </div>;
    }

    if (data.length === 0) {
        return <div>No data available in the {collectionName} collection.</div>;
    }

    return (
        <div className="grid__container">
            <div className="grid__row">
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
        </div>
    );
}