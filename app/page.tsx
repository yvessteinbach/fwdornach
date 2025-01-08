"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import "./styles.css";

const StoryGenerator: React.FC = () => {
  const [number, setNumber] = useState("");
  const [smallTitle, setSmallTitle] = useState("Einsatzart auswählen");
  const [desc1, setDesc1] = useState("");
  const [desc2, setDesc2] = useState("");
  const [desc3, setDesc3] = useState("");
  const [background, setBackground] = useState("/assets/images/tlf.png");

  const updateText = () => {
    const numberElement = document.getElementById("number");
    const smallTitleElement = document.getElementById("small-title");
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
    if (desc1Element) desc1Element.textContent = formattedDate;
    if (desc2Element) desc2Element.textContent = desc2 + ` Uhr`;
    if (desc3Element) desc3Element.textContent = desc3;
  };

  const exportAsImage = () => {
    const storyContainer = document.getElementById("story-container");
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
    <div className="container">
      <div className="input__container">
        <img className="fwlogo" src="/assets/images/logo.png" alt="" />
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
          <option value="BRANDMELDE- ANLAGE">BRANDMELDEANLAGE</option>
          <option value="ETC">ETC</option>
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
        <button onClick={updateText}>Eingaben Aktualisieren</button>
        <button onClick={exportAsImage}>Exportieren als PNG</button>
      </div>

      <div className="story__container">
        <div
          id="story-container"
          className="story-container"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="einsatz__nummer">
            <div id="number" className="nummer"></div>
            <img className="bg" src="/assets/images/nmbr_bg.png" alt="" />
          </div>
          <div className="einsatz__tag">
            <h1>EIN-</h1>
            <h1>SATZ</h1>
          </div>
          <div className="einsatz__container">
            <div id="small-title" className="einsatz__art"></div>
            <div id="desc1" className="einsatz__datum"></div>
            <div id="desc2" className="einsatz__zeit"></div>
            <div id="desc3" className="einsatz__trupp"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;