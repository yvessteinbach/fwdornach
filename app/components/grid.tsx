'use client';

import React from 'react';

type Einsatz = {
    number: number;
    smallTitle: string;
    desc1: string;
    desc2: string;
    desc3: string;
    location: string;
};

export default function Grid({ einsaetze }: { einsaetze: Einsatz[] }) {

    return (
        <>
            <div className="grid">
                {einsaetze.map((einsatz, index) => (
                    <div className="grid__item" key={index}>
                        <div className="grid__item__group">
                            <div className="grid__item__nr">{einsatz.number}</div>
                            <div className="grid__item__title">{einsatz.smallTitle}</div>
                        </div>
                        <div className="grid__item__location">{einsatz.location}</div>
                        <div className="grid__item__desc1">{einsatz.desc1}</div>
                        <div className="grid__item__desc2">{einsatz.desc2}</div>
                        <div className="grid__item__desc3">{einsatz.desc3}</div>
                    </div>
                ))}
            </div>
        </>
    );
}