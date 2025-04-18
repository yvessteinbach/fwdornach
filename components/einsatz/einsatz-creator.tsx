'use client';

import React, {
  useState,
  useRef,
  useEffect,
  RefObject,
} from "react";
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Import the database instance

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue as RadixSelectValue, // Alias the Radix SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const einsaetzeCollection = collection(db, 'einsaetze'); // Get the collection here

// Custom SelectValue component to handle text wrapping (attempt 3)
const CustomSelectValue = React.forwardRef<
  React.ElementRef<typeof RadixSelectValue>,
  React.ComponentPropsWithoutRef<typeof RadixSelectValue>
>(({ children, ...props }, forwardedRef) => (
  <RadixSelectValue
    ref={forwardedRef}
    {...props}
    className="whitespace-normal overflow-wrap-break break-words"
    style={{ whiteSpace: 'normal' }}
  >
    {children}
  </RadixSelectValue>
));
CustomSelectValue.displayName = 'CustomSelectValue';

export default function EinsatzCreator() {
  const router = useRouter();
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(null);
  const [einsatznummer, setEinsatznummer] = useState<string>("");
  const [einsatzart, setEinsatzart] = useState<string>("");
  const [einsatzort, setEinsatzort] = useState<string>("");
  const [datum, setDatum] = useState<string>("");
  const [uhrzeit, setUhrzeit] = useState<string>("");
  const [einsatztrupp, setEinsatztrupp] = useState<string>("");
  const [refreshCanvas, setRefreshCanvas] = useState(false);
  const [background, setSelectedBg] = useState("/kowa.png");
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [einsatznummerBgImage, setEinsatznummerBgImage] = useState<HTMLImageElement | null>(null);

  function drawMultilineText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    lineHeight: number
  ) {
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + i * lineHeight);
    });
  }

  useEffect(() => {
    const logo = new Image();
    logo.src = "/Logo.png";
    logo.onload = () => setLogoImage(logo);
    logo.onerror = (e) => console.error("Error loading logo image:", e);

    const einsatznummerBg = new Image();
    einsatznummerBg.src = "/Einsatznummer_bg.png";
    einsatznummerBg.onload = () => setEinsatznummerBgImage(einsatznummerBg);
    einsatznummerBg.onerror = (e) => console.error("Error loading einsatznummer background image:", e);

    let isCancelled = false;
    if (!background) return;
    const bg = new Image();
    bg.src = background;
    bg.onload = () => { if (!isCancelled) setBackgroundImage(bg); };
    bg.onerror = (e) => console.error("Error loading background image:", e);
    return () => { isCancelled = true; };
  }, [background]);

  const getFormattedDate = (rawDate: string): string => {
    if (!rawDate) return "";
    const parsed = new Date(rawDate);
    if (isNaN(parsed.getTime())) return "";
    return new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(parsed);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    ctx.font = "150px StretchPro";
    ctx.fillStyle = "#FFF";
    drawMultilineText(ctx, "EIN- \nSATZ", 50, 160, 120);

    if (einsatznummerBgImage) {
      ctx.drawImage(einsatznummerBgImage, 850, 80, 180, 180);
    }

    ctx.font = "32px Stretchpro";
    ctx.fillStyle = "#FFF";
    const textWithBreak = `Nr. \n${einsatznummer}`;
    const lines = textWithBreak.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, 910, 170 + i * 50);
    });

    ctx.font = "72px Stretchpro";
    ctx.fillStyle = "#FFF";
    ctx.fontKerning = "none";

    const einsatzartMaxWidth = canvas.width - 100;
    const einsatzartWords = einsatzart.split(' ');
    let einsatzartCurrentLine = '';
    const einsatzartYPositionSingleLine = 910; // Fixed Y for single line
    const einsatzartYPositionMultiLineStart = 840; // Fixed Y for the start of multi-line
    const einsatzartLineHeight = 70;
    let einsatzartYPosition = einsatzartYPositionSingleLine;
    let einsatzLineCount = 1;

    einsatzartWords.forEach((word, index) => {
      const testLine = einsatzartCurrentLine ? `${einsatzartCurrentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > einsatzartMaxWidth && einsatzartCurrentLine) {
        if (einsatzLineCount === 1) {
          einsatzartYPosition = einsatzartYPositionMultiLineStart; // Adjust to multi-line start
        }
        fillTextNoLigatures(ctx, einsatzartCurrentLine, 50, einsatzartYPosition);
        einsatzartCurrentLine = word;
        einsatzartYPosition += einsatzartLineHeight;
        einsatzLineCount++;
      } else {
        einsatzartCurrentLine = testLine;
      }

      if (index === einsatzartWords.length - 1 && einsatzartCurrentLine) {
        fillTextNoLigatures(ctx, einsatzartCurrentLine, 50, einsatzartYPosition);
      }
    });

    ctx.font = "bold 42px sans-serif";
    ctx.fillStyle = "#FFF";
    const formattedDate = getFormattedDate(datum);

    const fixedLocationYPosition = 980;
    ctx.fillText(`🌎 ${einsatzort}`, 50, fixedLocationYPosition);
    ctx.fillText(`📅 ${formattedDate}`, 50, 1060);
    ctx.fillText(`🕑 ${uhrzeit}`, 50, 1140);
    ctx.fillText(`👨‍🚒 ${einsatztrupp}`, 50, 1220);

    if (logoImage) {
      const logoWidth = 160;
      const logoHeight = 200;
      const x = canvas.width - logoWidth - 70;
      const y = canvas.height - logoHeight - 50;
      ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
    }
  };

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

  useEffect(() => {
    drawCanvas();
  }, [einsatznummer, einsatzart, einsatzort, datum, uhrzeit, einsatztrupp, refreshCanvas, backgroundImage, einsatznummerBgImage, logoImage]);

  const handleDownloadAndSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const filename = "einsatz_bericht.png";

    try {
      await addDoc(einsaetzeCollection, {
        einsatznummer: einsatznummer,
        einsatzart: einsatzart,
        einsatzort: einsatzort,
        datum: datum,
        uhrzeit: uhrzeit,
        einsatztrupp: einsatztrupp,
        imageUrl: dataURL,
        createdAt: new Date(),
      });
      console.log("Einsatz data saved to Firebase!");
    } catch (error) {
      console.error("Error saving einsatz data to Firebase:", error);
      // Optionally display an error message to the user
    }

    // Download the image
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);

    // Redirect to /dashboard/(einsatz) page
    router.push('/dashboard/(einsatz)');
  };

  return (
    <div className="relative h-fit flex flex-col max-w-2xl mx-8">

      <form className="flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <Label>Einsatznummer:</Label>
          <Input
            className="py-2 px-3 border rounded text-lg font-sans"
            type="text"
            placeholder="Einsatznummer"
            value={einsatznummer}
            onChange={(e) => setEinsatznummer(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label>Einsatzart:</Label>
          <Select value={einsatzart} onValueChange={setEinsatzart}>
            <SelectTrigger
              className="w-full py-2 px-3 border rounded text-lg font-sans flex-wrap"
              style={{ whiteSpace: 'normal' }}
            >
              <CustomSelectValue placeholder="Einsatzart auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gebäudebrand">Gebäudebrand</SelectItem>
              <SelectItem value="Fahrzeugbrand">Fahrzeugbrand</SelectItem>
              <SelectItem value="Wald- und Flurbrand">Wald- und Flurbrand</SelectItem>
              <SelectItem value="Personenrettung">Personenrettung</SelectItem>
              <SelectItem value="Notfallrettungs- dienst">Notfallrettungsdienst</SelectItem>
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
          <Label>Einsatzort:</Label>
          <Select value={einsatzort} onValueChange={setEinsatzort}>
            <SelectTrigger className="w-full py-2 px-3 border rounded text-lg font-sans">
              <RadixSelectValue placeholder="Einsatzort auswählen" />
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
          <Label>Datum:</Label>
          <Input
            className="py-2 px-3 border rounded text-lg font-sans"
            type="date"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label>Uhrzeit:</Label>
          <Input
            className="py-2 px-3 border rounded text-lg font-sans"
            type="time"
            value={uhrzeit}
            onChange={(e) => setUhrzeit(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label>Einsatztrupp:</Label>
          <Input
            className="py-2 px-3 border rounded text-lg font-sans"
            type="text"
            placeholder="Einsatztrupp"
            value={einsatztrupp}
            onChange={(e) => setEinsatztrupp(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label>Hintergrund auswählen:</Label>
          <Select value={background} onValueChange={setSelectedBg}>
            <SelectTrigger className="w-full py-2 px-3 border rounded text-lg font-sans">
              <RadixSelectValue placeholder="Hintergrund auswählen" />
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
          className="border block w-full h-auto"
        />
      </div>

      <div className="w-full flex flex-col gap-4 my-4">
        <Button className="py-6" variant="secondary" onClick={() => setRefreshCanvas(prev => !prev)}>
          Aktualisieren
        </Button>

        <Button className="py-6" onClick={handleDownloadAndSave}>
          Exportieren und Speichern
        </Button>
      </div>
    </div>
  );
}