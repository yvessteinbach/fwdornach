'use client';

import React, { useState } from "react";
import html2canvas from "html2canvas";

import Breadcrumb from '../../components/breadcrumb';

export default function EinsaetzePage() {

    const [number, setNumber] = useState("");
    const [smallTitle, setSmallTitle] = useState("");
    const [desc1, setDesc1] = useState("");
    const [desc2, setDesc2] = useState("");
    const [desc3, setDesc3] = useState("");
    const [location, setLocation] = useState("");
    const [background, setBackground] = useState("/assets/images/tlf.png");

    const updateText = () => {
        const numberElement = document.getElementById("number");
        const smallTitleElement = document.getElementById("small-title");
        const locationElement = document.getElementById("location");
        const desc1Element = document.getElementById("desc1");
        const desc2Element = document.getElementById("desc2");
        const desc3Element = document.getElementById("desc3");

        let formattedDate = desc1;
        if (desc1) {
            const date = new Date(desc1);
            formattedDate = new Intl.DateTimeFormat("de-DE", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).format(date);
        }

        if (numberElement) numberElement.innerHTML = `Nr.<br>${number}`;
        if (smallTitleElement) smallTitleElement.textContent = smallTitle;
        if (locationElement) locationElement.textContent = `🌎 ` + location;
        if (desc1Element) desc1Element.textContent = `📅 ` + formattedDate;
        if (desc2Element) desc2Element.textContent = `🕑 ` + desc2 + ` Uhr`;
        if (desc3Element) desc3Element.textContent = `👨‍🚒 ` + desc3;
    };

    const exportAsImage = () => {
        const storyContainer = document.getElementById("render__container");
        if (storyContainer) {
            html2canvas(storyContainer).then((canvas) => {
                const link = document.createElement("a");
                link.download = `einsatz_${number || "default"}.png`;
                link.href = canvas.toDataURL();
                link.click();
            });
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
                            placeholder="Einsatznummer"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                        <select
                            value={smallTitle}
                            onChange={(e) => setSmallTitle(e.target.value)}
                        >
                            <option value="Einsatzart auswählen">Einsatzart auswählen</option>
                            <option value="Gebäude- brand">Gebäudebrand</option>
                            <option value="Fahrzeug- brand">Fahrzeugbrand</option>
                            <option value="Wald- und Flurbrand">Wald- und Flurbrand</option>
                            <option value="Personen- rettung">Personenrettung</option>
                            <option value="Notfall- rettungsdienst">Notfallrettungsdienst</option>
                            <option value="Elemtar- ereignis">Elemtarereignis</option>
                            <option value="C&nbsp;Ereigniss">C-Ereigniss</option>
                            <option value="BC Ereigniss">BC-Ereigniss</option>
                            <option value="A Ereigniss">A-Ereigniss</option>
                            <option value="Pionier- einsatz">Pioniereinsatz</option>
                            <option value="Technische Hilfeleistung">Technische Hilfeleistung</option>
                            <option value="Bienen/Wespen">Bienen/Wespen</option>
                            <option value="Brandmelde- anlage">Brandmelde- anlage</option>
                            <option value="Falschalarm">Falschalarm</option>
                            <option value="Diverse Einsätze">Diverse Einsätze</option>
                            <option value="Verkehrs- regelung">Verkehrsregelung</option>
                            <option value="Saalwache">Saalwache</option>
                        </select>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="Einsatzort auswählen">Einsatzort auswählen</option>
                            <option value="Dornach">Dornach</option>
                            <option value="Hochwald">Hochwald</option>
                            <option value="Hochwald">Gempen</option>
                            <option value="Hochwald">Seewen</option>
                        </select>
                        <input
                            type="date"
                            placeholder="Datum"
                            value={desc1}
                            onChange={(e) => setDesc1(e.target.value)}
                        ></input>
                        <input
                            type="time"
                            placeholder="Uhrzeit"
                            value={desc2}
                            onChange={(e) => setDesc2(e.target.value)}
                        ></input>
                        <textarea
                            placeholder="Einsatztrupp"
                            value={desc3}
                            onChange={(e) => setDesc3(e.target.value)}
                        ></textarea>
                        <select
                            onChange={(e) => setBackground(e.target.value)}
                            defaultValue="/assets/images/tlf.png"
                        >
                            <option value="/assets/images/tlf.png">Hintergrund auswählen</option>
                            <option value="/assets/images/tlf.png">TLF (BMA)</option>
                            <option value="/assets/images/adl.png">ADL</option>
                            <option value="/assets/images/rfz.png">RFZ</option>
                            <option value="/assets/images/kowa.png">KOWA</option>
                            <option value="/assets/images/vrf.png">VRF</option>
                            <option value="/assets/images/mtf.png">MTF</option>
                            <option value="/assets/images/mzf.png">MZF (Alt)</option>
                            <option value="/assets/images/asf.png">ASF (Alt)</option>
                        </select>
                        <button className="button" onClick={updateText}>Eingaben Aktualisieren</button>
                        <button className="button" onClick={exportAsImage}>Exportieren als PNG</button>
                    </div>
                    <div className="create__render">
                        <div id="render__container" className="render__container" style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center", }}>
                            <div className="render__container-wrapper">
                                <div className="render__top">
                                    <div className="render__title">
                                        <div>EIN-<br />SATZ</div>
                                    </div>
                                    <div className="render__number">
                                        <div id="number" className="number"></div>
                                        <img className="bg" src="/assets/images/nmbr_bg.png" alt="" />
                                    </div>
                                </div>
                                <div className="render__bottom">
                                    <div className="render__logo"></div>
                                    <div className="render__text__container">
                                        <div id="small-title" className="art"></div>
                                        <div id="location" className="standort"></div>
                                        <div id="desc1" className="datum"></div>
                                        <div id="desc2" className="zeit"></div>
                                        <div id="desc3" className="trupp"></div>
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