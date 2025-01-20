'use client';

import React from 'react';
import '../css/main.css';

export default function Loading() {
    return (
        <div className="loading__container">
            <div className="lds-ripple">
                <div></div>
                <div></div>
            </div>
        </div>
    );
}