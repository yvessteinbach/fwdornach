'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
    const pathname = usePathname(); // Get the current path
    const segments = pathname.split('/').filter(Boolean); // Split and remove empty segments

    return (
        <div className="breadcrumb">
            {/* Home link */}
            <Link href="/" className="breadcrumb__item">Startseite</Link>

            {/* Dynamically generate breadcrumb items */}
            {segments.map((segment, index) => {
                // Create a link for each segment
                const path = '/' + segments.slice(0, index + 1).join('/');
                const isActive = index === segments.length - 1;

                return (
                    <React.Fragment key={index}>
                        <div className="breadcrumb__divider">\</div>
                        <Link
                            href={path}
                            className={`breadcrumb__item ${isActive ? 'active' : ''}`}
                        >
                            {segment.replace(/-/g, ' ')}
                        </Link>
                    </React.Fragment>
                );
            })}
        </div>
    );
}