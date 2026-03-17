"use client";

export const visualParams = {
  bg: "bg-pink-50",
  text: "text-pink-900",
  font: "font-kawaii",
  accent:
    "bg-pink-300 text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.2)] transition-all",
  border: "border-2 border-black",
  extraClasses: "antialiased",
};

import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";

// --- Icons ---
const HeartIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 2H10V6H14V2H22V14H18V18H14V22H10V18H6V14H2V2Z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M0 0H4V4H8V0H12V4H8V8H12V12H8V8H4V12H0V8H4V4H0V0Z" />
  </svg>
);

// --- Pixel Paint Component ---
const PixelPaint = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#cc99ff");
  const [isDrawing, setIsDrawing] = useState(false);
  const GRID_SIZE = 32;
  const PIXEL_SIZE = 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pre-draw cute image (Heart)
    const centerX = Math.floor(GRID_SIZE / 2);
    const centerY = Math.floor(GRID_SIZE / 2);
    const heartPixels = [
      { x: 0, y: -2 },
      { x: 1, y: -3 },
      { x: 2, y: -3 },
      { x: 3, y: -2 },
      { x: 4, y: -1 },
      { x: 4, y: 0 },
      { x: 3, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 3 },
      { x: 0, y: 4 },
      { x: -1, y: 3 },
      { x: -2, y: 2 },
      { x: -3, y: 1 },
      { x: -4, y: 0 },
      { x: -4, y: -1 },
      { x: -3, y: -2 },
      { x: -2, y: -3 },
      { x: -1, y: -3 },
    ];

    ctx.fillStyle = "#ff99cc";
    heartPixels.forEach((p) => {
      ctx.fillRect(
        (centerX + p.x) * PIXEL_SIZE,
        (centerY + p.y) * PIXEL_SIZE,
        PIXEL_SIZE,
        PIXEL_SIZE
      );
    });

    // Draw Grid
    drawGrid(ctx, canvas.width, canvas.height);
  }, []);

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += PIXEL_SIZE) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += PIXEL_SIZE) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE) * PIXEL_SIZE;
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE) * PIXEL_SIZE;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);

    // Re-draw grid border for this pixel to maintain grid look
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
  };

  const colors = [
    "#000000",
    "#ffffff",
    "#ff99cc",
    "#cc99ff",
    "#99ccff",
    "#99ffcc",
    "#ffff99",
    "#ffcc99",
    "#ff0000",
    "#00ff00",
    "#0000ff",
  ];

  return (
    <div className="flex flex-col gap-2 p-1 bg-white">
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * PIXEL_SIZE}
        height={GRID_SIZE * PIXEL_SIZE}
        className="border-2 border-stone-200 cursor-crosshair"
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
        onMouseMove={draw}
        onClick={(e) => {
          setIsDrawing(true);
          draw(e);
          setIsDrawing(false);
        }}
      />
      <div className="flex flex-wrap gap-1">
        {colors.map((c) => (
          <button
            key={c}
            className={`w-6 h-6 border-2 ${
              color === c ? "border-black" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
    </div>
  );
};

// --- Window Component ---
interface WindowProps {
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
  bgColor?: string;
}

const Window: React.FC<WindowProps> = ({
  title,
  children,
  initialPosition = { x: 0, y: 0 },
  onClose,
  zIndex,
  onFocus,
  bgColor = "bg-pink-100",
}) => {
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-header"
      defaultPosition={initialPosition}
      onMouseDown={onFocus}
    >
      <div
        ref={nodeRef}
        className={`absolute flex flex-col border-2 border-black ${bgColor} shadow-[4px_4px_0px_rgba(0,0,0,0.2)]`}
        style={{ zIndex, width: "fit-content" }}
      >
        <div className="window-header h-8 bg-pink-300 border-b-2 border-black flex items-center justify-between px-2 cursor-move select-none">
          <span className="font-kawaii text-xl text-white drop-shadow-md">
            {title}
          </span>
          <div className="flex gap-1">
            <button
              className="p-1 hover:bg-pink-300 text-white border border-white bg-pink-300"
              onClick={onClose}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="p-2 font-kawaii">{children}</div>
      </div>
    </Draggable>
  );
};

// --- Main Template Component ---
const KawaiiPixel: React.FC = () => {
  const [windows, setWindows] = useState([
    {
      id: "paint",
      title: "Pixel Paint",
      type: "paint",
      x: 50,
      y: 50,
      z: 1,
      open: true,
    },
    {
      id: "note",
      title: "Note.txt",
      type: "note",
      x: 400,
      y: 100,
      z: 2,
      open: true,
    },
    {
      id: "welcome",
      title: "Welcome!",
      type: "welcome",
      x: 200,
      y: 200,
      z: 3,
      open: true,
    },
  ]);

  const bringToFront = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.z));
      return prev.map((w) => (w.id === id ? { ...w, z: maxZ + 1 } : w));
    });
  };

  const closeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, open: false } : w))
    );
  };

  const openWindow = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.z));
      return prev.map((w) =>
        w.id === id ? { ...w, open: true, z: maxZ + 1 } : w
      );
    });
  };

  return (
    <div className="w-full min-h-screen bg-pink-50 relative overflow-hidden font-kawaii selection:bg-pink-300 selection:text-white">
      {/* Background Grid/Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#ff99cc 1px, transparent 1px), linear-gradient(90deg, #ff99cc 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6 z-0">
        <div
          className="flex flex-col items-center gap-1 cursor-pointer group"
          onClick={() => openWindow("paint")}
        >
          <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.2)] group-hover:translate-y-[-2px] transition-transform">
            <div className="w-8 h-8 bg-gradient-to-br from-red-300 to-blue-300" />
          </div>
          <span className="bg-white border border-black px-1 text-sm text-pink-900 font-bold">
            Paint.exe
          </span>
        </div>

        <div
          className="flex flex-col items-center gap-1 cursor-pointer group"
          onClick={() => openWindow("note")}
        >
          <div className="w-12 h-12 bg-yellow-100 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.2)] group-hover:translate-y-[-2px] transition-transform">
            <div className="w-8 h-1 bg-black/20 mb-1"></div>
            <div className="w-8 h-1 bg-black/20 mb-1"></div>
            <div className="w-6 h-1 bg-black/20"></div>
          </div>
          <span className="bg-white border border-black px-1 text-sm text-pink-900 font-bold">
            Notes
          </span>
        </div>
      </div>

      {/* Windows */}
      {windows.map(
        (w) =>
          w.open && (
            <Window
              key={w.id}
              title={w.title}
              initialPosition={{ x: w.x, y: w.y }}
              zIndex={w.z}
              onClose={() => closeWindow(w.id)}
              onFocus={() => bringToFront(w.id)}
              bgColor={w.type === "paint" ? "bg-stone-100" : "bg-pink-50"}
            >
              {w.type === "paint" && <PixelPaint />}
              {w.type === "note" && (
                <textarea
                  className="w-64 h-48 p-2 bg-yellow-50 border-2 border-stone-200 resize-none outline-none font-kawaii text-lg text-pink-900"
                  defaultValue="1. Buy milk&#10;2. Call mom&#10;3. Practice drawing&#10;4. Be cute!"
                />
              )}
              {w.type === "welcome" && (
                <div className="w-64 p-2 flex flex-col gap-2 items-center text-center text-pink-900">
                  <div className="text-4xl text-pink-500">
                    <HeartIcon />
                  </div>
                  <h2 className="text-2xl font-bold">Hello!</h2>
                  <p className="text-lg">
                    Welcome to your new kawaii desktop environment.
                  </p>
                  <button className="mt-2 px-4 py-1 bg-pink-300 text-white border-2 border-pink-600 shadow-[2px_2px_0px_#db2777] active:translate-y-[2px] active:shadow-none">
                    Welcome!!
                  </button>
                </div>
              )}
            </Window>
          )
      )}
    </div>
  );
};

export default KawaiiPixel;
