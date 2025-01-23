'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

import LogoutButton from './logoutbutton';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuContainerRef = useRef<HTMLDivElement>(null);
    const menuLinksRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Timeline | null>(null);

    const toggleMenu = () => {
        if (menuOpen) {
            animationRef.current = gsap.timeline({
                onComplete: () => setMenuOpen(false),
            });

            const links = menuLinksRef.current?.querySelectorAll('.menu__link');

            if (links) {
                animationRef.current
                    .to(links, {
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        stagger: 0.1,
                        ease: 'power3.in',
                    })
                    .to(
                        menuContainerRef.current,
                        {
                            opacity: 0,
                            duration: 0.5,
                            ease: 'power3.inOut',
                        },
                        '<'
                    );
                setTimeout(() => {
                    document.querySelectorAll('.bar').forEach((bar) => {
                        bar.classList.remove('bar-transform-top', 'bar-transform-bottom', 'bar-hidden');
                    });
                }, 100)
            }
        } else {
            setMenuOpen(true);
        }
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        if (menuOpen) {
            animationRef.current = gsap.timeline();

            animationRef.current
                .fromTo(
                    menuContainerRef.current,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power3.out',
                    }
                );

            const links = menuLinksRef.current?.querySelectorAll('.menu__link');
            if (links) {
                animationRef.current.fromTo(
                    links,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power3.out',
                    },
                    '<'
                );
            }
        }
    }, [menuOpen]);


    return (
        <div className="header">
            <div className="header__navigation">
                <div className="navigation__group">
                    <Link href="/" className="navigation__link anim">Startseite</Link>
                    <Link href="/statistiken" className="navigation__link anim">Statistiken</Link>
                    <Link href="/einsaetze" className="navigation__link anim">Einsätze</Link>
                    <Link href="/uebungen" className="navigation__link anim">Übungen</Link>
                    <Link href="/sonstiges" className="navigation__link anim">Sonstiges</Link>
                </div>
                <div className="navigation__group">
                    <form action="" className="navigation__search">
                        <input type="text" placeholder="Suchen.." />
                        <button className="search__btn" type="submit">
                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                    <LogoutButton />
                </div>
            </div>
            <div className="menu__navigation">
                <img src="/assets/images/logo.png" alt="" className="menu__logo" />
                <div className="menu__icon" onClick={toggleMenu}>
                    <div className={`bar ${menuOpen ? 'bar-transform-top' : ''}`}></div>
                    <div className={`bar ${menuOpen ? 'bar-transform-bottom' : ''}`}></div>
                </div>
            </div>
            {menuOpen && (
                <div className="menu" ref={menuContainerRef}>
                    <div className="menu__links" ref={menuLinksRef}>
                        <Link href="/" className="menu__link anim" onClick={closeMenu}>Startseite</Link>
                        <Link href="/statistiken" className="menu__link anim" onClick={closeMenu}>Statistiken</Link>
                        <Link href="/einsaetze" className="menu__link anim" onClick={closeMenu}>Einsätze</Link>
                        <Link href="/uebungen" className="menu__link anim" onClick={closeMenu}>Übungen</Link>
                        <Link href="/sonstiges" className="menu__link anim" onClick={closeMenu}>Sonstiges</Link>
                    </div>
                </div>
            )}
        </div>
    );
}