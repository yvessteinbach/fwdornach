'use client';

import React, { useState } from "react";
import html2canvas from "html2canvas";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

import Breadcrumb from '../../components/breadcrumb';

export default function UebungenPage() {

    const [number, setNumber] = useState("");
    const [title, setTitle] = useState("");
    const [date1, setDate] = useState("");
    const [time, setTime] = useState("");
    const [background, setBackground] = useState<string>("");

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setBackground(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateText = () => {
        const titleElement = document.getElementById("title");
        const dateElement = document.getElementById("date1");
        const timeElement = document.getElementById("time");

        let formattedDate = date1;
        if (date1) {
            const date = new Date(date1);
            formattedDate = new Intl.DateTimeFormat("de-DE", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).format(date);
        }

        if (titleElement) titleElement.textContent = title;
        if (dateElement) dateElement.textContent = formattedDate;
        if (timeElement) timeElement.textContent = time + ` Uhr`;
    };

    const exportAsImage = async () => {
        const storyContainer = document.getElementById("render__container");
        if (!storyContainer) {
            console.error("Render container not found");
            return;
        }

        try {
            const canvas = await html2canvas(storyContainer);

            const link = document.createElement("a");
            link.download = `einsatz_${number || "default"}.png`;
            link.href = canvas.toDataURL();
            link.click();

            const db = getFirestore(getApp());
            const docRef = await addDoc(collection(db, "uebungen"), {
                number,
                title,
                date1,
                time,
                background,
                timestamp: new Date().toISOString(),
            });

            console.log("Document written with ID:", docRef.id);
        } catch (error) {
            console.error("Error exporting or saving the canvas:", error);
        }
    };

    return (
        <>
            <div className="container">
                <div className="side">
                    <Breadcrumb />
                </div>
                <div className="create__container">
                    <div className="create__side">
                        <input
                            type="number"
                            placeholder="Übungsnummer"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                        <textarea
                            placeholder="Übungsart"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        ></textarea>
                        <input
                            type="date"
                            placeholder="Datum"
                            value={date1}
                            onChange={(e) => setDate(e.target.value)}
                        ></input>
                        <input
                            type="time"
                            placeholder="Uhrzeit"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        ></input>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <button className="button" onClick={updateText}>Eingaben Aktualisieren</button>
                        <button className="button" onClick={exportAsImage}>Exportieren als PNG</button>
                    </div>
                    <div className="create__render">
                        <div id="render__container" className="render__container" style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center", }}>
                            <div className="render__container-wrapper">
                                <div className="render2__top">
                                    <div className="render2__logo"></div>
                                    <div className="render2__date">
                                        <div id="date1" className="bubble"></div>
                                    </div>
                                </div>
                                <div className="render2__bottom">
                                    <div className="render__text__container">
                                        <div className="render2__tag">
                                            <div className="bubble">
                                                <div className="text">IMPRESSIONEN</div>
                                                <div className="chev one">
                                                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div className="chev two">
                                                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div className="chev three">
                                                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="title" className="render2__title"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};