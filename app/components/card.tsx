// app/components/Card.tsx
import React from 'react';
import Link from 'next/link';

interface CardProps {
    title: string;
    description: string;
    link: string;
    linkname: string;
    image: string;
}

export default function Card({ title, description, link, linkname, image }: CardProps) {
    return (
        <div className="card">
            <div className="card__overlay">
                <div className="card__title">{title}</div>
                <div className="card__description">{description}</div>
                <div className="card__cta">
                    <Link href={link}>
                        <button>{linkname}</button>
                    </Link>
                </div>
            </div>
            <div
                className="background__splash"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.75)), url(${image})`
                }}
            ></div>
        </div>
    );
}