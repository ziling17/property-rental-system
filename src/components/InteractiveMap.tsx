import React, { useState, useRef, useEffect } from "react";
import { Property } from "../types";
import { PROPERTIES, LANDMARKS, Landmark } from "../mapData";
import { Maximize2, Compass, Layers, ZoomIn, ZoomOut } from "lucide-react";

interface InteractiveMapProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onSelectProperty: (propertyId: string) => void;
}

export default function InteractiveMap({
  properties,
  selectedPropertyId,
  onSelectProperty,
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Map state
  const [zoom, setZoom] = useState<number>(1.12);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: -20, y: -40 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mapStyle, setMapStyle] = useState<"light" | "dark" | "transit">("light");

  // Reset standard coordinates bounding box
  const minLat = 3.1300;
  const maxLat = 3.1800;
  const minLng = 101.6400;
  const maxLng = 101.7300;

  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;

  // Convert GPS Coordinates to Percentage Coordinates on our 1000x1000 base map box
  const getCoordinatesPct = (lat: number, lng: number) => {
    const x = ((lng - minLng) / lngDiff) * 1000;
    // Note: Latitudes increase upwards, screen coordinates increase downwards
    const y = (1.0 - (lat - minLat) / latDiff) * 1000;
    return { x, y };
  };

  // Center on property when selected from the list or initiated
  useEffect(() => {
    if (selectedPropertyId) {
      const selectedProp = PROPERTIES.find((p) => p.id === selectedPropertyId);
      if (selectedProp && containerRef.current) {
        const { x, y } = getCoordinatesPct(selectedProp.latitude, selectedProp.longitude);
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        // Position selected pin directly in center of map
        // Formula: centeredCoord * zoom + offset = containerCenter => offset = containerCenter - centeredCoord * zoom
        setOffset({
          x: containerWidth / 2 - x * zoom,
          y: containerHeight / 2 - y * zoom,
        });
      }
    }
  }, [selectedPropertyId]);

  // Dragging event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on left click
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  // Zoom helpers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.15, 2.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.15, 0.6));
  };

  const handleRecenter = () => {
    setZoom(1.1);
    setOffset({ x: -20, y: -45 });
  };

  const handleCycleTheme = () => {
    const modes: ("light" | "dark" | "transit")[] = ["light", "dark", "transit"];
    const currentIndex = modes.indexOf(mapStyle);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMapStyle(modes[nextIndex]);
  };

  // Helper formatting for RM Price markers
  const formatCompactPrice = (price: number) => {
    if (price >= 1000) {
      return `RM ${parseFloat((price / 1000).toFixed(1))}k`;
    }
    return `RM ${price}`;
  };

  return (
    <div
      id="map-container"
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing transition-colors duration-500 rounded-2xl border border-blue-100 shadow-sm ${mapStyle === "light"
          ? "bg-[#f4f7fc]"
          : mapStyle === "dark"
            ? "bg-[#0f172a]"
            : "bg-[#eff3f8]"
        }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Background Dots Grid for texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage: mapStyle === "dark"
            ? "radial-gradient(#ffffff0a 1px, transparent 1px)"
            : "radial-gradient(#1e3a8a0f 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      {/* SVG Canvas with scalable view */}
      <svg
        id="map-vector"
        className="absolute origin-top-left transition-transform duration-100 ease-out"
        width="1000"
        height="1000"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          willChange: "transform",
        }}
        viewBox="0 0 1000 1000"
      >
        {/* PARKS AND NATURE AREA */}
        {/* KLCC Park */}
        <g id="parks" className="opacity-90">
          <path
            d="M 680 430 Q 720 410 760 450 T 800 520 T 730 550 Z"
            fill={mapStyle === "dark" ? "#1e293b" : "#e2f0d9"}
            stroke={mapStyle === "dark" ? "#475569" : "#c5e0b4"}
            strokeWidth="3"
            className="transition-colors duration-500"
          />
          <text
            x="730"
            y="490"
            className={`font-sans font-medium text-[10px] ${mapStyle === "dark" ? "fill-[#64748b]" : "fill-[#548235]"
              } pointer-events-none transition-colors duration-500`}
            textAnchor="middle"
          >
            KLCC Park
          </text>

          {/* Lake Titiwangsa Area (Top and north-east) */}
          <path
            d="M 450 80 Q 480 30 530 60 T 500 120 Z"
            fill={mapStyle === "dark" ? "#1e293b" : "#d5ebd8"}
            stroke={mapStyle === "dark" ? "#334155" : "#a8dca8"}
            strokeWidth="2.5"
            className="transition-colors duration-500"
          />
        </g>

        {/* WATER BODIES & RIVER */}
        <g id="rivers">
          {/* Klang River winding through KL */}
          <path
            d="M 120 -50 Q 200 400 380 440 T 480 490 T 520 620 T 490 850 T 470 1050"
            fill="none"
            stroke={mapStyle === "dark" ? "#1d4ed8" : "#d0e3ff"}
            strokeWidth="11"
            strokeLinecap="round"
            className="transition-colors duration-500"
          />
          <path
            d="M 120 -50 Q 200 400 380 440 T 480 490 T 520 620 T 490 850 T 470 1050"
            fill="none"
            stroke={mapStyle === "dark" ? "#1e40af" : "#bbdefb"}
            strokeWidth="6"
            strokeLinecap="round"
            className="transition-colors duration-500"
          />
          {/* Gombak River meeting Klang River */}
          <path
            d="M 480 180 Q 440 280 480 490"
            fill="none"
            stroke={mapStyle === "dark" ? "#1d4ed8" : "#bbdefb"}
            strokeWidth="6"
            strokeLinecap="round"
            className="transition-colors duration-500"
          />
        </g>

        {/* GRID AND STREET NETWORKS */}
        <g id="roads" className="opacity-90">
          {/* SPRINT Highway (West side Mont Kiara area) */}
          <path
            d="M 50 150 Q 150 180 250 250 T 350 500 T 260 750 T 180 1050"
            fill="none"
            stroke={mapStyle === "dark" ? "#1e293b" : "#ffffff"}
            strokeWidth="10"
            strokeLinecap="round"
            className="transition-colors duration-500"
          />
          <path
            d="M 50 150 Q 150 180 250 250 T 350 500 T 260 750 T 180 1050"
            fill="none"
            stroke={mapStyle === "dark" ? "#334155" : "#e4ebf5"}
            strokeWidth="6"
            strokeLinecap="round"
            className="transition-colors duration-500"
          />

          {/* Jalan Sultan Ismail (Connecting central to KLCC) */}
          <path
            d="M 320 280 L 390 350 L 520 370 L 680 420 L 740 400"
            fill="none"
            stroke={mapStyle === "dark" ? "#192231" : "#ffffff"}
            strokeWidth="12"
            strokeLinecap="round"
            className="transition-colors duration-500"
          />
          <path
            d="M 320 280 L 390 350 L 520 370 L 680 420 L 740 400"
            fill="none"
            stroke={mapStyle === "dark" ? "#334155" : "#e4ebf5"}
            strokeWidth="8"
            className="transition-colors duration-500"
          />
          <text x="560" y="388" className="font-sans font-medium text-[8px] fill-[#94a3b8] tracking-widest pointer-events-none uppercase">
            Jalan Sultan Ismail
          </text>

          {/* Jalan Bukit Bintang */}
          <path
            d="M 500 550 L 610 590 L 750 620 L 850 630"
            fill="none"
            stroke={mapStyle === "dark" ? "#192231" : "#ffffff"}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 500 550 L 610 590 L 750 620 L 850 630"
            fill="none"
            stroke={mapStyle === "dark" ? "#334155" : "#e4ebf5"}
            strokeWidth="6"
          />

          {/* Jalan Ampang */}
          <path
            d="M 450 490 L 580 470 L 800 480 L 950 490"
            fill="none"
            stroke={mapStyle === "dark" ? "#192231" : "#ffffff"}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 450 490 L 580 470 L 800 480 L 950 490"
            fill="none"
            stroke={mapStyle === "dark" ? "#334155" : "#e4ebf5"}
            strokeWidth="6"
          />

          {/* Inner ring road connectors */}
          <path d="M 680 420 L 690 600 L 750 780" fill="none" stroke={mapStyle === "dark" ? "#1e293b" : "#ffffff"} strokeWidth="8" />
          <path d="M 680 420 L 690 600 L 750 780" fill="none" stroke={mapStyle === "dark" ? "#334155" : "#e4ebf5"} strokeWidth="5" />

          <path d="M 120 220 L 400 230 C 420 230 450 310 450 350" fill="none" stroke={mapStyle === "dark" ? "#1e293b" : "#ffffff"} strokeWidth="8" />
          <path d="M 120 220 L 400 230 C 420 230 450 310 450 350" fill="none" stroke={mapStyle === "dark" ? "#334155" : "#e4ebf5"} strokeWidth="5" />
        </g>

        {/* RAIL / MRT METRO LINES (Active in Transit view or subtle in Default view) */}
        <g id="transit-rail" className={mapStyle === "transit" ? "opacity-100" : "opacity-40"}>
          {/* LRT Kelana Jaya Line */}
          <path
            d="M 280 1000 L 410 700 L 490 490 L 580 390 L 700 430 L 850 410 L 1000 450"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3.5"
            strokeDasharray={mapStyle === "transit" ? "6, 4" : "none"}
            className="transition-all duration-500"
          />
          {/* MRT Kajang Line (Green) */}
          <path
            d="M 50 820 L 180 580 L 320 400 L 520 440 L 630 550 L 750 630 L 950 850"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeDasharray={mapStyle === "transit" ? "6, 4" : "none"}
            className="transition-all duration-500"
          />
        </g>

        {/* MAJOR LANDMARKS & BUILDING STRUCTURES */}
        <g id="landmarks">
          {LANDMARKS.map((landmark, idx) => {
            const { x, y } = getCoordinatesPct(landmark.latitude, landmark.longitude);
            return (
              <g key={`landmark-${idx}`} className="group cursor-default">
                {landmark.type === "tower" && (
                  <>
                    {/* Tower shadow/background ring */}
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill={mapStyle === "dark" ? "#1e293b" : "#ffffff"}
                      stroke={mapStyle === "dark" ? "#004ac6" : "#2563eb"}
                      strokeWidth="2.2"
                      className="shadow-sm transition-all duration-300"
                    />
                    {/* Tiny representation of Twin Towers or Single tower */}
                    {landmark.name.includes("Twin") ? (
                      <g transform={`translate(${x - 7}, ${y - 12}) scale(0.65)`}>
                        <path d="M 4 20 L 4 4 L 7 4 L 7 20 Z" fill="#2563eb" />
                        <path d="M 12 20 L 12 4 L 15 4 L 15 20 Z" fill="#2563eb" />
                        <rect x="7" y="10" width="5" height="3" fill="#2563eb" />
                      </g>
                    ) : (
                      <g transform={`translate(${x - 4}, ${y - 13}) scale(0.65)`}>
                        <path d="M 6 24 L 6 8 Q 6 4 9 4 T 12 8 L 12 24 Z" fill="#2563eb" />
                        <circle cx="9" cy="8" r="4" fill="#004ac6" />
                      </g>
                    )}
                  </>
                )}

                {landmark.type === "mall" && (
                  <rect
                    x={x - 10}
                    y={y - 10}
                    width="20"
                    height="20"
                    rx="3"
                    fill={mapStyle === "dark" ? "#312e81" : "#ffe6e6"}
                    stroke={mapStyle === "dark" ? "#61a5fa" : "#ff9999"}
                    strokeWidth="1.5"
                  />
                )}

                {/* Annotation Text */}
                <text
                  x={x}
                  y={y - 20}
                  textAnchor="middle"
                  className={`font-sans font-semibold text-[8px] tracking-wide ${mapStyle === "dark" ? "fill-slate-300 bg-slate-900" : "fill-slate-700 bg-white"
                    } transition-colors duration-500 pointer-events-none`}
                >
                  {landmark.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* FLOATING MARKERS ON TOP (Calculated in DOM elements overlaying the canvas for exact pixel interaction) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ width: "100%", height: "100%" }}
      >
        {properties.map((property) => {
          const { x: baseX, y: baseY } = getCoordinatesPct(property.latitude, property.longitude);
          // Scale based on zoom and apply offset
          const posX = baseX * zoom + offset.x;
          const posY = baseY * zoom + offset.y;
          const isSelected = property.id === selectedPropertyId;

          // Prevent rendering if offscreen to optimize
          const isOffscreen =
            posX < -150 ||
            posY < -150 ||
            (containerRef.current &&
              (posX > containerRef.current.clientWidth + 150 ||
                posY > containerRef.current.clientHeight + 150));

          if (isOffscreen) return null;

          return (
            <div
              key={property.id}
              className="absolute pointer-events-auto transition-transform duration-100 ease-out"
              style={{
                left: `${posX}px`,
                top: `${posY}px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <button
                id={`marker-${property.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProperty(property.id);
                }}
                className={`flex items-center justify-center px-4 py-2 rounded-full shadow-lg border transition-all duration-300 transform active:scale-95 ${isSelected
                    ? "bg-[#2563eb] border-[#1d4ed8] text-white font-bold opacity-100 scale-110 z-30"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 font-medium scale-100 hover:scale-105 z-10"
                  }`}
                style={{
                  boxShadow: isSelected
                    ? "0 4px 15px rgba(37, 99, 235, 0.45)"
                    : "0 2px 6px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="flex flex-col items-center leading-none text-center">
                  <span className={`text-[12px] uppercase ${isSelected ? "text-blue-100" : "text-slate-400 text-[10px]"}`}>
                    RM
                  </span>
                  <span className="text-[13px] font-sans">
                    {(property.price / 1000).toFixed(1)}k
                  </span>
                </div>
              </button>

              {/* Downward bubble arrow tail */}
              <div
                className={`w-3 h-3 mx-auto rotate-45 -mt-1.5 border-r border-b ${isSelected
                    ? "bg-[#2563eb] border-[#1d4ed8] z-30"
                    : "bg-white border-slate-200 z-10"
                  }`}
              />
            </div>
          );
        })}
      </div>

      {/* MAP CONTROLS FLOATING BAR */}
      <div id="map-controls" className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        {/* Zoom In button */}
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 active:bg-slate-100 rounded-lg shadow-md border border-slate-100 transition-all"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Zoom Out button */}
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 active:bg-slate-100 rounded-lg shadow-md border border-slate-100 transition-all"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        {/* Recenter & Compass button */}
        <button
          onClick={handleRecenter}
          title="Recenter Map"
          className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 active:bg-slate-100 rounded-lg shadow-md border border-slate-100 transition-all"
        >
          <Compass className="w-5 h-5" />
        </button>

        {/* Map Layers toggle */}
        <button
          onClick={handleCycleTheme}
          title={`Cycle Style (Current: ${mapStyle})`}
          className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 active:bg-slate-100 rounded-lg shadow-md border border-slate-100 transition-all"
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* Subtle Legend Indicator on Bottom */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-100 shadow-sm pointer-events-none z-10 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
          <span className="text-[10px] text-slate-600 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] opacity-40 animate-ping absolute" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300" />
          <span className="text-[10px] text-slate-600 font-medium">Available</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <span className="w-3 h-1.5 bg-[#e2f0d9] rounded border border-[#c5e0b4]" />
          <span className="text-[10px] text-slate-600 font-medium">Parks</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <span className="text-[10px] text-slate-400 capitalize font-mono text-[9px] bg-slate-100 px-1 rounded">
            Style: {mapStyle}
          </span>
        </div>
      </div>
    </div>
  );
}
