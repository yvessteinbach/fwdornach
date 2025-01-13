"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import "./styles.css";

const StoryGenerator: React.FC = () => {
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
      <h1>Einsatz</h1>
      <a href="/einsatz">
        <button>Get me there</button>
      </a>
    </div>
  );
};

export default StoryGenerator;