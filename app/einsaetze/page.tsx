// app/einsaetze/page.tsx
import React from 'react';
import Header from '../components/header';
import Link from 'next/link';
import Grid from '../components/grid';
import { readEinsaetze } from './utils';

export default async function EinsaetzePage() {
    const einsaetze = await readEinsaetze();

    return (
        <>
            <Header />
            <div className="main__container">
                <Link className="button" href="/einsaetze/create">Einsatz erstellen</Link>
                <Grid einsaetze={einsaetze} />
            </div>
        </>
    );
}