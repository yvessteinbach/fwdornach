'use client';

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  RefObject,
} from "react";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function EinsatzCreator() {
  
  // Form states
  const [einsatznummer, setEinsatznummer] = useState<string>("");
  const [einsatzart, setEinsatzart] = useState<string>("");
  const [einsatzort, setEinsatzort] = useState<string>("");
  const [datum, setDatum] = useState<string>("");
  const [uhrzeit, setUhrzeit] = useState<string>("");
  const [einsatztrupp, setEinsatztrupp] = useState<string>("");

  function drawMultilineText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    lineHeight: number
  ) {
    // Split on actual newline characters. If your input is literally “\\n”,
    // use text.split("\\n") instead.
    const lines = text.split("\n");
  
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + i * lineHeight);
    });
  }

  const [refreshCanvas, setRefreshCanvas] = useState(false);

  const [background, setSelectedBg] = useState("/kowa.png");
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  // Fixed images for logo and einsatznummer background
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [einsatznummerBgImage, setEinsatznummerBgImage] =
    useState<HTMLImageElement | null>(null);

  // Canvas ref
  const canvasRef: RefObject<HTMLCanvasElement | null> =
    useRef<HTMLCanvasElement | null>(null);

  // Load the fixed images (logo & einsatznummer background)
  useEffect(() => {
    const logo = new Image();
    logo.src = "/Logo.png";
    logo.onload = () => {
      console.log("Logo image loaded successfully");
      setLogoImage(logo);
    };
    logo.onerror = (e) => {
      console.error("Error loading logo image:", e);
    };

    const einsatznummerBg = new Image();
    einsatznummerBg.src = "/Einsatznummer_bg.png";
    einsatznummerBg.onload = () => {
      console.log("Einsatznummer background image loaded successfully");
      setEinsatznummerBgImage(einsatznummerBg);
    };
    einsatznummerBg.onerror = (e) => {
      console.error("Error loading einsatznummer background image:", e);
    };
    
    let isCancelled = false;

  if (!background) return; // Ensure a background is selected

  const bg = new Image();
  bg.src = background;

  bg.onload = () => {
    if (!isCancelled) setBackgroundImage(bg);
  };

  bg.onerror = (e) => {
    console.error("Error loading background image:", e);
  };

  return () => {
    isCancelled = true;
  };
  }, [background]);

  // Format date like "Dienstag, 01.04.2025"
  const getFormattedDate = (rawDate: string): string => {
    if (!rawDate) return "";
    const parsed = new Date(rawDate);
    if (isNaN(parsed.getTime())) return "";

    return new Intl.DateTimeFormat("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(parsed);
  };

  // Draw everything on the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear old content
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // White background
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw main background
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    // Fixed top-left title
    ctx.font = "150px StretchPro";
    ctx.fillStyle = "#FFF";
    drawMultilineText(ctx, "EIN- \nSATZ", 50, 160, 120);

    // Draw the einsatznummer background behind the text
    // Example: place it near top-right
    if (einsatznummerBgImage) {
      // x=700, y=20, sized to 300x100
      ctx.drawImage(einsatznummerBgImage, 850, 80, 180, 180);
    }

    // Different font for “Einsatznummer” + “Einsatzart”
    ctx.font = "32px Stretchpro";
    ctx.fillStyle = "#FFF";
    const textWithBreak = `Nr. \n${einsatznummer}`;
    const lines = textWithBreak.split('\n');

    lines.forEach((line, i) => {
      ctx.fillText(line, 910, 170 + i * 50);
    });

    /**
     * Draw text, one character at a time, to avoid ligatures.
     * @param ctx - The canvas 2D context
     * @param text - The text to draw
     * @param x - Starting x-coordinate
     * @param y - Y-coordinate (unchanged for each char)
     */
    function fillTextNoLigatures(
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number
    ): void {
      let currentX = x;
      for (const char of text) {
        ctx.fillText(char, currentX, y);
        currentX += ctx.measureText(char).width;
      }
    }
    ctx.font = "72px Stretchpro";
    ctx.fillStyle = "#FFF";
    ctx.fontKerning = "none";
    fillTextNoLigatures(ctx, einsatzart, 50, 915  );

    // Normal font for the rest
    ctx.font = "bold 42px sans-serif";
    ctx.fillStyle = "#FFF";

    const formattedDate = getFormattedDate(datum);

    // Choose positions for these
    ctx.fillText(`🌎 ${einsatzort}`, 50, 1000);
    ctx.fillText(`📅 ${formattedDate}`, 50, 1075);
    ctx.fillText(`🕑 ${uhrzeit}`, 50, 1150);
    ctx.fillText(`👨‍🚒 ${einsatztrupp}`, 50, 1225);

    // Draw the fixed logo in bottom-right corner
    if (logoImage) {
      const logoWidth = 160;  // scale as needed
      const logoHeight = 200; // scale as needed
      const x = canvas.width - logoWidth - 70;
      const y = canvas.height - logoHeight - 50;
      ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
    }
  };

  // Redraw whenever relevant data changes
  useEffect(() => {
    drawCanvas();
  }, [einsatznummer, einsatzart, einsatzort, datum, uhrzeit, einsatztrupp, refreshCanvas]);

  // Download as PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "instagram_post.png";
    link.click();
  };

  return (
    <div className="relative h-fit flex flex-col max-w-2xl mx-8">

      <form className="flex flex-col gap-2">
        <div className="w-full flex flex-col gap-2">
          <label style={styles.label}>Einsatznummer:</label>
          <Input
            style={styles.input}
            type="text"
            placeholder="Einsatznummer"
            value={einsatznummer}
            onChange={(e) => setEinsatznummer(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label style={styles.label}>Einsatzart:</label>
          <Select value={einsatzart} onValueChange={setEinsatzart}>
            <SelectTrigger className="w-full" style={styles.input}>
              <SelectValue placeholder="Einsatzart auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gebäudebrand">Gebäudebrand</SelectItem>
              <SelectItem value="Fahrzeugbrand">Fahrzeugbrand</SelectItem>
              <SelectItem value="Wald- und Flurbrand">Wald- und Flurbrand</SelectItem>
              <SelectItem value="Personenrettung">Personenrettung</SelectItem>
              <SelectItem value="Notfallrettungsdienst">Notfallrettungsdienst</SelectItem>
              <SelectItem value="Elemtarereignis">Elemtarereignis</SelectItem>
              <SelectItem value="C-Ereignis">C-Ereignis</SelectItem>
              <SelectItem value="BC-Ereignis">BC-Ereignis</SelectItem>
              <SelectItem value="A-Ereignis">A-Ereignis</SelectItem>
              <SelectItem value="Ölspur">Ölspur</SelectItem>
              <SelectItem value="Pioniereinsatz">Pioniereinsatz</SelectItem>
              <SelectItem value="Technische Hilfeleistung">Technische Hilfeleistung</SelectItem>
              <SelectItem value="Hilfeleistung Sanität">Hilfeleistung Sanität</SelectItem>
              <SelectItem value="Bienen/Wespen">Bienen/Wespen</SelectItem>
              <SelectItem value="Brandmeldeanlage">Brandmeldeanlage</SelectItem>
              <SelectItem value="Falschalarm">Falschalarm</SelectItem>
              <SelectItem value="Diverse Einsätze">Diverse Einsätze</SelectItem>
              <SelectItem value="Verkehrsregelung">Verkehrsregelung</SelectItem>
              <SelectItem value="SAALWACHE">Saalwache</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex flex-col gap-2">
          <label style={styles.label}>Einsatzort:</label>
          <Select value={einsatzort} onValueChange={setEinsatzort}>
            <SelectTrigger className="w-full" style={styles.input}>
              <SelectValue placeholder="Einsatzort auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dornach">Dornach</SelectItem>
              <SelectItem value="Hochwald">Hochwald</SelectItem>
              <SelectItem value="Seewen">Seewen</SelectItem>
              <SelectItem value="Gempen">Gempen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex flex-col gap-2">
          <label style={styles.label}>Datum:</label>
          <Input
            style={styles.input}
            type="date"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label style={styles.label}>Uhrzeit:</label>
          <Input
            style={styles.input}
            type="time"
            value={uhrzeit}
            onChange={(e) => setUhrzeit(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label style={styles.label}>Einsatztrupp:</label>
          <Input
            style={styles.input}
            type="text"
            placeholder="Einsatztrupp"
            value={einsatztrupp}
            onChange={(e) => setEinsatztrupp(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label style={styles.label}>Hintergrund auswählen:</label>
          <Select value={background} onValueChange={setSelectedBg}>
            <SelectTrigger className="w-full" style={styles.input}>
              <SelectValue placeholder="Hintergrund auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="/kowa.png">KOWA</SelectItem>
              <SelectItem value="/adl.png">ADL</SelectItem>
              <SelectItem value="/tlf.png">TLF</SelectItem>
              <SelectItem value="/rfz.png">RFZ</SelectItem>
              <SelectItem value="/vrf.png">VRF</SelectItem>
              <SelectItem value="/mtf.png">MTF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>

      <div className="w-full my-4">
        <canvas
          ref={canvasRef}
          width={1080}
          height={1280}
          style={styles.canvas}
        />
      </div>

      <div className="w-full flex flex-col gap-4 my-4">
        <Button className="py-6" variant="secondary" onClick={() => setRefreshCanvas(prev => !prev)}>
          Aktualisieren
        </Button>

        <Button className="py-6" onClick={handleDownload}>
          Download als PNG
        </Button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  canvas: {
    border: "1px solid #ccc",
    display: "block",
    width: "100%", // Let the canvas scale to the container width
    height: "auto", // Maintain aspect ratio
  }
};