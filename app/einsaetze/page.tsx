// app/einsaetze/page.tsx
import React from 'react';
import Header from '../components/header';
import Link from 'next/link';

export default async function EinsaetzePage() {

    return (
        <>
            <Header />
            <div className="main__container">
                <Link className="button" href="/einsaetze/create">Einsatz erstellen</Link>
            </div>
        </>
    );
}