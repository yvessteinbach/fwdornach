'use client';

import React, {
  useState,
  useRef,
  useEffect,
  RefObject,
  ChangeEvent,
} from "react";
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Import the database instance

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const uebungenCollection = collection(db, 'uebungen');

export default function UebungCreator() {
  const router = useRouter();
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(null);
  const [impressionenText, setImpressionenText] = useState<string>("");
  const [datum, setDatum] = useState<string>("");
  const [refreshCanvas, setRefreshCanvas] = useState(false);
  const [background, setSelectedBg] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const logo = new Image();
    logo.src = "/Logo.png";
    logo.onload = () => setLogoImage(logo);

    let isCancelled = false;
    if (!background) {
      setBackgroundImage(null);
      return;
    }
    const bg = new Image();
    bg.src = background;
    bg.onload = () => {
      if (!isCancelled) setBackgroundImage(bg);
    };
    return () => {
      isCancelled = true;
    };
  }, [background]);

  const getFormattedDate = (rawDate: string): string => {
    if (!rawDate) return "";
    const parsed = new Date(rawDate);
    if (isNaN(parsed.getTime())) return "";
    return new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(parsed);
  };

  const handleBackgroundUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedBg(reader.result as string);
      reader.readAsDataURL(file);
    }
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
      const imageAspectRatio = backgroundImage.width / backgroundImage.height;
      const canvasAspectRatio = canvas.width / canvas.height;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = backgroundImage.width;
      let sourceHeight = backgroundImage.height;
      let destX = 0;
      let destY = 0;
      let destWidth = canvas.width;
      let destHeight = canvas.height;

      if (imageAspectRatio > canvasAspectRatio) {
        sourceWidth = backgroundImage.height * canvasAspectRatio;
        sourceX = (backgroundImage.width - sourceWidth) / 2;
      } else {
        sourceHeight = backgroundImage.width / canvasAspectRatio;
        sourceY = (backgroundImage.height - sourceHeight) / 2;
      }

      ctx.drawImage(backgroundImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    }

    ctx.font = "72px StretchPro";
    ctx.fillStyle = "#FFF";
    ctx.fontKerning = "none";
    const maxLines = 3;
    const lines = impressionenText.split('\n').slice(0, maxLines);
    const lineHeight = 70;
    let currentY = canvas.height - 70 - (lines.length - 1) * lineHeight;
    const impressionLines: string[] = [];
    lines.forEach((line) => {
      let currentX = 50;
      let drawnLine = "";
      for (const char of line) {
        const testWidth = ctx.measureText(drawnLine + char).width;
        if (testWidth <= canvas.width - 100) {
          ctx.fillText(char, currentX, currentY);
          currentX += ctx.measureText(char).width;
          drawnLine += char;
        } else {
          break;
        }
      }
      impressionLines.push(drawnLine);
      currentY += lineHeight;
    });

    ctx.fillStyle = "#FFF";
    const labelText = "IMPRESSIONEN";
    const labelFont = "bold 26px sans-serif";
    ctx.font = labelFont;
    const labelWidth = ctx.measureText(labelText).width;
    const labelHeight = 18;
    const labelBgPadding = 24;
    const labelBgRadius = 16;
    const labelBgX = 74 - labelBgPadding;
    const labelBgY = canvas.height - 130 - (impressionLines.length * 70) - labelBgPadding;
    const labelBgWidth = labelWidth + 2 * labelBgPadding + 60;
    const labelBgHeight = labelHeight + 2 * labelBgPadding;
    const labelTextX = labelBgX + labelBgPadding;
    const labelTextY = labelBgY + labelBgPadding + labelHeight;

    ctx.beginPath();
    ctx.roundRect(labelBgX, labelBgY, labelBgWidth, labelBgHeight, labelBgRadius);
    ctx.fill();

    ctx.fillStyle = "#202020";
    ctx.fillText(labelText, labelTextX, labelTextY);

    const chevronY = labelTextY - 1;
    const chevronStartX = labelBgX + labelBgWidth - 10 - (6 * 10);

    ctx.font = "40px sans-serif";
    ctx.globalAlpha = 1;
    ctx.fillText("›", chevronStartX, chevronY);
    ctx.globalAlpha = 0.7;
    ctx.fillText("›", chevronStartX + 20, chevronY);
    ctx.globalAlpha = 0.3;
    ctx.fillText("›", chevronStartX + 40, chevronY);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#FFF";
    const formattedDate = getFormattedDate(datum);
    const dateFont = "bold 26px sans-serif";
    ctx.font = dateFont;
    const dateWidth = ctx.measureText(formattedDate).width;
    const dateHeight = 26;
    const dateBgPadding = 16;
    const dateBgRadius = 16;
    const dateBgX = canvas.width - dateWidth - 50 - dateBgPadding;
    const dateBgY = 70 - dateBgPadding;
    const dateBgWidth = dateWidth + 2 * dateBgPadding;
    const dateBgHeight = dateHeight + 2 * dateBgPadding;
    const dateTextX = dateBgX + dateBgWidth / 2 - dateWidth / 2;
    const dateTextY = dateBgY + dateBgHeight / 2 + dateHeight / 2 - 2;

    ctx.beginPath();
    ctx.roundRect(dateBgX, dateBgY, dateBgWidth, dateBgHeight, dateBgRadius);
    ctx.fill();

    ctx.fillStyle = "#202020";
    ctx.fillText(formattedDate, dateTextX, dateTextY);

    if (logoImage) {
      const logoWidth = 160;
      const logoHeight = 200;
      ctx.drawImage(logoImage, 50, 50, logoWidth, logoHeight);
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [impressionenText, datum, refreshCanvas, background, backgroundImage, logoImage]);

  const handleDownloadAndSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const filename = "uebung_impressionen.png";

    try {
      await addDoc(uebungenCollection, {
        impressionenText: impressionenText,
        datum: datum,
        imageUrl: dataURL,
        createdAt: new Date(),
      });
      console.log("Uebung data saved to Firebase!");
    } catch (error) {
      console.error("Error saving uebung data to Firebase:", error);
      // Optionally display an error message to the user
    }

    // Download the image
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);

    // Redirect to /dashboard/(uebung) page
    router.push('/dashboard/uebung');
  };

  return (
    <div className="relative h-fit flex flex-col max-w-2xl mx-8">
      <form className="flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <Label>Übungstitel:</Label>
          <Textarea
            placeholder="Übungstitel eingeben"
            value={impressionenText}
            onChange={(e) => setImpressionenText(e.target.value)}
            rows={3}
          />
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
          <Label>Hintergrund hochladen:</Label>
          <Input
            className="py-2 px-3 border rounded text-lg font-sans"
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
          />
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