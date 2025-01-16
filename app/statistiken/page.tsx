import React from 'react';

import Header from '../components/header';
import Breadcrumb from '../components/breadcrumb';

export default async function StatistikenPage() {
    return (
        <>
            <Header />
            <div className="container">
                <div className="side">
                    <Breadcrumb />
                </div>
            </div>
        </>
    );
}