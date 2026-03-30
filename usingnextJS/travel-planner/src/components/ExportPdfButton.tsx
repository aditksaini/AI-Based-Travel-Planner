"use client";

import React, { useState } from "react";

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  estimated_cost: string;
}

interface ExportPdfButtonProps {
  destination: string;
  from: string;
  days: number;
  budget: number;
  passengers?: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  itinerary?: ItineraryDay[];
  weatherData?: {
    temperature?: number;
    humidity?: number;
    weather?: string;
    city?: string;
    country?: string;
    wind_speed?: number;
    icon?: string;
    travel_advice?: string;
  };
  sourceData?: { name: string; country: string; point: { lat: number; lng: number } };
  mapData?: { name: string; country: string; point: { lat: number; lng: number } };
  routeDistance?: number;
  routeTime?: number;
  variant?: "sidebar" | "floating";
}

// ─── Color Palette ───
const C = {
  primary:      [8, 145, 178]   as [number, number, number],   // teal
  primaryDark:  [14, 116, 144]  as [number, number, number],   // darker teal
  primaryBg:    [236, 254, 255] as [number, number, number],   // cyan-50
  accent:       [124, 58, 237]  as [number, number, number],   // violet
  accentBg:     [245, 243, 255] as [number, number, number],   // violet-50
  amber:        [217, 119, 6]   as [number, number, number],   // amber-600
  amberBg:      [255, 251, 235] as [number, number, number],   // amber-50
  amberBorder:  [253, 230, 138] as [number, number, number],   // amber-200
  green:        [22, 163, 74]   as [number, number, number],   // green-600
  greenBg:      [240, 253, 244] as [number, number, number],   // green-50
  red:          [220, 38, 38]   as [number, number, number],   // red-600
  indigo:       [99, 102, 241]  as [number, number, number],   // indigo
  indigoBg:     [224, 231, 255] as [number, number, number],   // indigo-100
  dark:         [15, 23, 42]    as [number, number, number],   // slate-900
  text:         [30, 41, 59]    as [number, number, number],   // slate-800
  textMed:      [71, 85, 105]   as [number, number, number],   // slate-600
  textLight:    [100, 116, 139] as [number, number, number],   // slate-500
  border:       [226, 232, 240] as [number, number, number],   // slate-200
  bg:           [248, 250, 252] as [number, number, number],   // slate-50
  bgCard:       [241, 245, 249] as [number, number, number],   // slate-100
  white:        [255, 255, 255] as [number, number, number],
  heroBg:       [30, 27, 75]    as [number, number, number],   // indigo-950
  heroAccent:   [79, 70, 229]   as [number, number, number],   // indigo-600
};

export default function ExportPdfButton({
  destination,
  from,
  days,
  budget,
  passengers,
  startDate,
  endDate,
  imageUrl,
  itinerary,
  weatherData,
  sourceData,
  mapData,
  routeDistance,
  routeTime,
  variant = "floating",
}: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const formatDistance = (meters: number) => (meters / 1000).toFixed(1) + " km";
  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  // ─── Load an image as data URL ───
  const loadImageAsDataUrl = (url: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  // ─── Capture live Leaflet map from DOM ───
  const captureMapFromDOM = async (): Promise<string | null> => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const mapEl = document.querySelector(".leaflet-container") as HTMLElement;
      if (!mapEl) return null;
      const canvas = await html2canvas(mapEl, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#e2e8f0",
        logging: false,
        scale: 2,
      });
      return canvas.toDataURL("image/png");
    } catch {
      return null;
    }
  };

  // ─── Main PDF Generation ───
  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF("p", "mm", "a4");

      // ─── Load Custom Fonts ───
      const loadFont = async (fileName: string, name: string, style: string) => {
        try {
          const res = await fetch(`/fonts/${fileName}`);
          const buffer = await res.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          let binary = "";
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);
          pdf.addFileToVFS(fileName, base64);
          pdf.addFont(fileName, name, style);
        } catch (err) {
          console.error(`Failed to load font ${fileName}`, err);
        }
      };

      await loadFont("Poppins-Regular.ttf", "Poppins", "normal");
      await loadFont("Poppins-Bold.ttf", "Poppins", "bold");
      await loadFont("Poppins-SemiBold.ttf", "Poppins", "semibold");

      pdf.setFont("Poppins", "normal");

      const PW = 210;                    // page width
      const PH = 297;                    // page height
      const M = 15;                      // margin
      const CW = PW - 2 * M;            // content width
      let y = 0;                         // current Y cursor

      // Helper: set fill color
      const fill = (c: [number, number, number]) => pdf.setFillColor(c[0], c[1], c[2]);
      // Helper: set text color
      const textColor = (c: [number, number, number]) => pdf.setTextColor(c[0], c[1], c[2]);
      // Helper: set draw color
      const drawColor = (c: [number, number, number]) => pdf.setDrawColor(c[0], c[1], c[2]);
      // Helper: rounded rect
      const roundRect = (x: number, ry: number, w: number, h: number, r: number, style: string = "F") => {
        pdf.roundedRect(x, ry, w, h, r, r, style);
      };
      // Helper: check page break and add new page if needed
      const checkBreak = (needed: number) => {
        if (y + needed > PH - M) {
          // Draw page border accent before breaking
          drawPageAccent();
          pdf.addPage();
          y = M;
          return true;
        }
        return false;
      };
      // Helper: draw subtle page accents
      const drawPageAccent = () => {
        // Top accent bar
        fill(C.primary);
        pdf.rect(0, 0, PW, 2, "F");
        // Bottom accent
        fill(C.accent);
        pdf.rect(0, PH - 1.5, PW, 1.5, "F");
      };

      // ╔══════════════════════════════════════╗
      // ║         1. HERO SECTION              ║
      // ╚══════════════════════════════════════╝
      const heroH = 65;
      // Gradient hero background
      fill(C.heroBg);
      pdf.rect(0, 0, PW, heroH, "F");
      // Accent gradient overlay
      fill(C.heroAccent);
      pdf.rect(0, 0, PW * 0.6, heroH, "F");
      // Diagonal cut
      fill(C.heroBg);
      // Draw the angled cutoff using a triangle
      const triX1 = PW * 0.45;
      const triX2 = PW * 0.65;
      // @ts-ignore - jsPDF triangle method
      pdf.triangle(triX1, 0, triX2, 0, triX2, heroH, "F");
      pdf.triangle(triX1, 0, triX2, heroH, triX1, heroH, "F");

      // Try to add destination image on right side
      let heroImageLoaded = false;
      if (imageUrl) {
        const imgData = await loadImageAsDataUrl(imageUrl);
        if (imgData) {
          try {
            const imgW = 75;
            const imgH = heroH - 10;
            const imgX = PW - imgW - 10;
            const imgY = 5;
            // Clip area background
            fill(C.dark);
            roundRect(imgX - 1, imgY - 1, imgW + 2, imgH + 2, 4);
            pdf.addImage(imgData, "JPEG", imgX, imgY, imgW, imgH);
            heroImageLoaded = true;
          } catch { /* ignore */ }
        }
      }

      // Hero text
      textColor(C.white);
      pdf.setFontSize(8);
      pdf.setFont("Poppins", "normal");
      pdf.text("TRAVEL ITINERARY", M + 2, 18);

      pdf.setFontSize(28);
      pdf.setFont("Poppins", "bold");
      const destText = destination.toUpperCase();
      const destLines = pdf.splitTextToSize(destText, heroImageLoaded ? PW * 0.5 : CW);
      pdf.text(destLines, M + 2, 32);

      // Subtle subtext
      pdf.setFontSize(9);
      pdf.setFont("Poppins", "normal");
      textColor([200, 200, 255]);
      if (from) {
        pdf.text(`From ${from}  •  ${days} Days  •  ₹${budget.toLocaleString()}`, M + 2, heroH - 10);
      }

      y = heroH + 4;

      // ╔══════════════════════════════════════╗
      // ║       2. METADATA CHIPS              ║
      // ╚══════════════════════════════════════╝
      const metaItems = [
        { label: "FROM", value: from || "—", color: C.green, bg: C.greenBg },
        { label: "TO", value: destination, color: C.primary, bg: C.primaryBg },
        { label: "DURATION", value: `${days} Days`, color: C.accent, bg: C.accentBg },
        { label: "BUDGET", value: `₹${budget.toLocaleString()}`, color: C.amber, bg: C.amberBg },
        ...(passengers ? [{ label: "TRAVELLERS", value: passengers, color: C.indigo, bg: C.indigoBg }] : []),
      ];

      const chipW = (CW - (metaItems.length - 1) * 3) / metaItems.length;
      const chipH = 18;

      metaItems.forEach((item, i) => {
        const cx = M + i * (chipW + 3);
        fill(item.bg as [number, number, number]);
        drawColor(item.bg as [number, number, number]);
        roundRect(cx, y, chipW, chipH, 3);

        // Label
        pdf.setFontSize(6);
        pdf.setFont("Poppins", "bold");
        textColor(item.color as [number, number, number]);
        pdf.text(item.label, cx + chipW / 2, y + 6, { align: "center" });

        // Value
        pdf.setFontSize(9);
        pdf.setFont("Poppins", "bold");
        textColor(C.text);
        const val = pdf.splitTextToSize(item.value, chipW - 4);
        pdf.text(val[0] || item.value, cx + chipW / 2, y + 13, { align: "center" });
      });

      y += chipH + 4;

      // Date row if available
      if (startDate || endDate) {
        pdf.setFontSize(8);
        pdf.setFont("Poppins", "normal");
        textColor(C.textLight);
        const dateStr = [
          startDate ? `Departure: ${startDate}` : "",
          endDate ? `Return: ${endDate}` : "",
        ].filter(Boolean).join("   •   ");
        pdf.text(dateStr, PW / 2, y + 3, { align: "center" });
        y += 8;
      }

      // Divider
      drawColor(C.border);
      pdf.setLineWidth(0.3);
      pdf.line(M, y, PW - M, y);
      y += 5;

      // ╔══════════════════════════════════════╗
      // ║       3. WEATHER CARD                ║
      // ╚══════════════════════════════════════╝
      if (weatherData && weatherData.temperature != null) {
        const weatherH = 28;
        checkBreak(weatherH + 5);

        // Section label
        pdf.setFontSize(7);
        pdf.setFont("Poppins", "bold");
        textColor(C.indigo);
        pdf.text("WEATHER FORECAST", M, y + 3);
        y += 7;

        // Weather card background
        fill(C.indigoBg);
        drawColor([199, 210, 254]);
        pdf.setLineWidth(0.4);
        roundRect(M, y, CW, weatherH, 4, "FD");

        // Location name
        pdf.setFontSize(11);
        pdf.setFont("Poppins", "bold");
        textColor(C.text);
        const weatherLoc = (weatherData.city || destination) + (weatherData.country ? `, ${weatherData.country}` : "");
        pdf.text(weatherLoc, M + 6, y + 8);

        // Weather description
        pdf.setFontSize(9);
        pdf.setFont("Poppins", "normal");
        textColor(C.textMed);
        const weatherDesc = weatherData.weather
          ? weatherData.weather.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
          : "—";
        pdf.text(weatherDesc, M + 6, y + 14);

        // Travel advice
        if (weatherData.travel_advice) {
          pdf.setFontSize(7);
          textColor(C.indigo);
          const adviceLines = pdf.splitTextToSize(weatherData.travel_advice, CW * 0.55);
          pdf.text(adviceLines[0], M + 6, y + 20);
        }

        // Humidity & wind
        pdf.setFontSize(7);
        textColor(C.textLight);
        const windStr = `Humidity: ${weatherData.humidity || "—"}%` + (weatherData.wind_speed ? `  •  Wind: ${weatherData.wind_speed} m/s` : "");
        pdf.text(windStr, M + 6, y + weatherH - 3);

        // Temperature (right side)
        pdf.setFontSize(32);
        pdf.setFont("Poppins", "bold");
        textColor(C.indigo);
        pdf.text(`${Math.round(weatherData.temperature)}°`, PW - M - 6, y + 16, { align: "right" });
        pdf.setFontSize(12);
        textColor(C.textLight);
        pdf.text("C", PW - M - 4, y + 10);

        y += weatherH + 6;
      }

      // ╔══════════════════════════════════════╗
      // ║       4. ROUTE MAP                   ║
      // ╚══════════════════════════════════════╝
      const mapDataUrl = await captureMapFromDOM();
      if (mapDataUrl) {
        const mapDisplayH = 55;
        checkBreak(mapDisplayH + 22);

        // Section label
        pdf.setFontSize(7);
        pdf.setFont("Poppins", "bold");
        textColor(C.primary);
        pdf.text("ROUTE MAP", M, y + 3);
        y += 7;

        // Map border
        drawColor(C.border);
        pdf.setLineWidth(0.4);
        fill(C.bgCard);
        roundRect(M, y, CW, mapDisplayH, 4, "FD");

        // Add map image
        try {
          pdf.addImage(mapDataUrl, "PNG", M + 0.5, y + 0.5, CW - 1, mapDisplayH - 1);
        } catch { /* ignore */ }

        // Route info overlay
        if (routeDistance || routeTime) {
          const routeStr = [
            routeDistance ? `Distance: ${formatDistance(routeDistance)}` : "",
            routeTime ? `ETA: ${formatTime(routeTime)}` : "",
          ].filter(Boolean).join("  •  ");

          fill(C.dark);
          const routeStrW = pdf.getTextWidth(routeStr) + 8;
          roundRect(PW - M - routeStrW - 4, y + mapDisplayH - 10, routeStrW + 4, 8, 2);
          pdf.setFontSize(7);
          pdf.setFont("Poppins", "bold");
          textColor(C.white);
          pdf.text(routeStr, PW - M - 6, y + mapDisplayH - 5, { align: "right" });
        }

        y += mapDisplayH + 3;

        // Source / Destination labels
        pdf.setFontSize(7.5);
        pdf.setFont("Poppins", "normal");
        if (sourceData) {
          textColor(C.green);
          pdf.text("●", M, y + 3);
          textColor(C.textLight);
          pdf.text(` ${sourceData.name}, ${sourceData.country}`, M + 3, y + 3);
        }
        if (mapData) {
          textColor(C.textLight);
          const destLabel = `${mapData.name}, ${mapData.country} `;
          const destLabelW = pdf.getTextWidth(destLabel);
          pdf.text(destLabel, PW - M - destLabelW - 4, y + 3);
          textColor(C.red);
          pdf.text("●", PW - M - 3, y + 3);
        }
        y += 8;

        // Divider
        drawColor(C.border);
        pdf.setLineWidth(0.3);
        pdf.line(M, y, PW - M, y);
        y += 5;
      }

      // ╔══════════════════════════════════════╗
      // ║    5. DAY-BY-DAY ITINERARY           ║
      // ╚══════════════════════════════════════╝
      // Section label
      pdf.setFontSize(7);
      pdf.setFont("Poppins", "bold");
      textColor(C.primary);
      pdf.text("DAY-BY-DAY ITINERARY", M, y + 3);
      y += 9;

      // Color cycle for day headers
      const dayColors: [number, number, number][] = [
        C.primary, C.accent, C.indigo, C.amber, C.green, C.red,
        [59, 130, 246],   // blue
        [236, 72, 153],   // pink
        [168, 85, 247],   // purple
        C.primaryDark,
      ];

      if (itinerary && itinerary.length > 0) {
        for (let i = 0; i < itinerary.length; i++) {
          const item = itinerary[i];
          const dayColor = dayColors[i % dayColors.length];

          // Pre-calculate total height for this day block
          // Day header: ~8mm, each activity: ~8-14mm, cost: ~8mm, padding: ~4mm
          let activityHeights = 0;
          const wrappedActivities: string[][] = [];
          for (const act of item.activities) {
            pdf.setFontSize(8);
            const wrapped = pdf.splitTextToSize(act, CW - 28);
            wrappedActivities.push(wrapped);
            activityHeights += wrapped.length * 3.5 + 5;
          }
          const costH = item.estimated_cost ? 10 : 0;
          const totalDayH = 10 + activityHeights + costH + 6;

          // If this day won't fit, break to next page
          checkBreak(Math.min(totalDayH, PH - 2 * M));

          // ── Day Header ──
          fill(dayColor);
          roundRect(M, y, CW, 9, 2.5);
          pdf.setFontSize(10);
          pdf.setFont("Poppins", "bold");
          textColor(C.white);
          pdf.text(`Day ${item.day}`, M + 5, y + 6.5);

          // Title
          pdf.setFontSize(9);
          pdf.setFont("Poppins", "normal");
          textColor([240, 240, 255]);
          const titleLines = pdf.splitTextToSize(item.title, CW - 35);
          pdf.text(titleLines[0], M + 25, y + 6.5);

          y += 12;

          // ── Timeline line ──
          const timelineX = M + 4;
          drawColor(dayColor);
          pdf.setLineWidth(0.6);

          // ── Activities ──
          for (let aIdx = 0; aIdx < item.activities.length; aIdx++) {
            const lines = wrappedActivities[aIdx];
            const blockH = lines.length * 3.5 + 4;

            // Check if this individual activity needs a page break
            if (y + blockH > PH - M) {
              // Continue timeline indicator
              drawPageAccent();
              pdf.addPage();
              y = M;
              // Continuation header
              fill(dayColor);
              const contAlpha = 0.7;
              roundRect(M, y, CW, 7, 2);
              pdf.setFontSize(7);
              pdf.setFont("Poppins", "bold");
              textColor(C.white);
              pdf.text(`Day ${item.day} (continued)`, M + 5, y + 5);
              y += 10;
            }

            // Timeline dot
            fill(dayColor);
            pdf.circle(timelineX, y + 2.5, 1.5, "F");
            // Timeline line segment
            if (aIdx < item.activities.length - 1 || item.estimated_cost) {
              pdf.line(timelineX, y + 4, timelineX, y + blockH);
            }

            // Activity card
            fill(C.bg);
            drawColor(C.border);
            pdf.setLineWidth(0.2);
            roundRect(M + 10, y, CW - 12, blockH, 2, "FD");

            // Activity bullet
            textColor(dayColor);
            pdf.setFontSize(8);
            pdf.text("▸", M + 12, y + 4);

            // Activity text
            pdf.setFontSize(8);
            pdf.setFont("Poppins", "normal");
            textColor(C.text);
            pdf.text(lines, M + 17, y + 4);

            y += blockH + 1.5;
          }

          // ── Estimated Cost ──
          if (item.estimated_cost) {
            if (y + 10 > PH - M) {
              drawPageAccent();
              pdf.addPage();
              y = M;
            }

            // Cost dot on timeline
            fill(C.amber);
            pdf.circle(timelineX, y + 3, 1.5, "F");

            // Cost card
            fill(C.amberBg);
            drawColor(C.amberBorder);
            pdf.setLineWidth(0.3);
            roundRect(M + 10, y, CW - 12, 8, 2, "FD");

            pdf.setFontSize(7);
            pdf.setFont("Poppins", "bold");
            textColor(C.amber);
            pdf.text("EST. COST:", M + 14, y + 5.5);
            textColor(C.text);
            pdf.setFont("Poppins", "bold");
            pdf.text(item.estimated_cost, M + 34, y + 5.5);

            y += 11;
          }

          y += 4; // gap between days
        }
      } else {
        // No itinerary
        fill(C.bg);
        roundRect(M, y, CW, 20, 4);
        pdf.setFontSize(10);
        textColor(C.textLight);
        pdf.text("No detailed itinerary data available.", PW / 2, y + 12, { align: "center" });
        y += 24;
      }

      // ╔══════════════════════════════════════╗
      // ║          6. FOOTER                   ║
      // ╚══════════════════════════════════════╝
      // Ensure footer is on last page
      if (y + 15 > PH - 5) {
        drawPageAccent();
        pdf.addPage();
        y = PH - 20;
      }

      // Footer line
      const footerY = PH - 12;
      drawColor(C.border);
      pdf.setLineWidth(0.3);
      pdf.line(M, footerY - 4, PW - M, footerY - 4);

      pdf.setFontSize(7);
      pdf.setFont("Poppins", "normal");
      textColor(C.textLight);
      pdf.text(
        `Generated on ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
        M,
        footerY
      );
      textColor(C.accent);
      pdf.setFont("Poppins", "bold");
      pdf.text("AI Travel Planner", PW - M, footerY, { align: "right" });

      // Draw page accents on the last page
      drawPageAccent();

      // ── Save ──
      const fileName = `${destination.replace(/\s+/g, "_")}_Itinerary.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // ─── Button Markup ───
  const buttonContent = variant === "sidebar" ? (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full py-3 mt-6 flex items-center justify-center gap-2 border border-cyber/60 text-cyber font-bold tracking-widest uppercase text-xs hover:bg-cyber hover:text-black transition-all duration-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {isExporting ? (
        <>
          <div className="w-4 h-4 border-2 border-cyber border-t-transparent rounded-full animate-spin group-hover:border-black group-hover:border-t-transparent"></div>
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export PDF</span>
        </>
      )}
    </button>
  ) : (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyber/20 to-violet/20 border border-cyber/40 text-cyber rounded-xl font-bold text-xs tracking-widest uppercase hover:from-cyber/30 hover:to-violet/30 hover:border-cyber/70 hover:shadow-[0_0_20px_rgba(0,245,255,0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
    >
      {isExporting ? (
        <>
          <div className="w-4 h-4 border-2 border-cyber border-t-transparent rounded-full animate-spin"></div>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export PDF</span>
        </>
      )}
    </button>
  );

  return <>{buttonContent}</>;
}
