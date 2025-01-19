import React from 'react';
import Link from 'next/link';

import Breadcrumb from '../components/breadcrumb';

export default async function UebungenPage() {
    return (
        <>
            <div className="container">
                <div className="side" style={{ backgroundImage: `linear-gradient(to right, rgba(13, 13, 13, 1), rgba(13, 13, 13, 0.15)), url("/assets/images/uebungen_banner.jpg")` }}>
                    <Breadcrumb />
                    <div className="side__group">
                        <Link className="button" href="/uebungen/create">Übung erfassen</Link>
                    </div>
                </div>
            </div>
        </>
    );
}