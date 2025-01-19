import React from 'react';
import Link from 'next/link';

import Breadcrumb from '../components/breadcrumb';
import Grid from '../components/grid';

export default async function EinsaetzePage() {
    return (
        <>
            <div className="container">
                <div className="side" style={{ backgroundImage: `linear-gradient(to right, rgba(13, 13, 13, 1), rgba(13, 13, 13, 0.15)), url("/assets/images/einsaetze_banner.jpg")` }}>
                    <Breadcrumb />
                    <div className="side__group">
                        <Link className="button" href="/einsaetze/create">Einsatz erfassen</Link>
                    </div>
                </div>
                <Grid collectionName="einsaetze" />
            </div >
        </>
    );
}