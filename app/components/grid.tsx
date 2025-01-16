'use client';

import React from 'react';

const einsaetze = [
    {
        number: 1,
        smallTitle: 'Gebäudebrand',
        location: 'Dornach',
        desc1: 'Donnerstag, 16.01.2025',
        desc2: '15:30 Uhr',
        desc3: 'Kommando, Einsatzgruppe 1'
    },
    {
        number: 2,
        smallTitle: 'Brandmeldeanlage',
        location: 'Dornach',
        desc1: 'Donnerstag, 16.01.2025',
        desc2: '15:30 Uhr',
        desc3: 'Kommando, Einsatzgruppe 1'
    },
    {
        number: 3,
        smallTitle: 'Hilfeleistung',
        location: 'Dornach',
        desc1: 'Donnerstag, 16.01.2025',
        desc2: '15:30 Uhr',
        desc3: 'Kommando, Einsatzgruppe 1'
    },
    {
        number: 4,
        smallTitle: 'Personentransport',
        location: 'Dornach',
        desc1: 'Donnerstag, 16.01.2025',
        desc2: '15:30 Uhr',
        desc3: 'Kommando, Einsatzgruppe 1'
    },
    {
        number: 5,
        smallTitle: 'Saalwache',
        location: 'Dornach',
        desc1: 'Donnerstag, 16.01.2025',
        desc2: '15:30 Uhr',
        desc3: 'Kommando, Einsatzgruppe 1'
    },
];

export default function Grid() {
    return (
        <div className="grid__container">
            <div className="grid__row">
                {einsaetze.map((einsatz) => (
                    <div className="grid__item" key={einsatz.number}>
                        <div className="grid__item-wrapper">
                            <div className="item__nr">{einsatz.number}</div>
                            <h3 className="item__smalltitle">{einsatz.smallTitle}</h3>
                            <p className="item__location">{einsatz.location}</p>
                            <p className="item__desc1">{einsatz.desc1}</p>
                            <p className="item__desc2">{einsatz.desc2}</p>
                            <p className="item__desc3">{einsatz.desc3}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}