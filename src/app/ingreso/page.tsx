"use client";

import { useState, useEffect, useRef } from "react";
import Html5QrcodePlugin, { ScannerHandle } from "@/components/Html5QrcodePlugin";
import Link from "next/link";

export default function IngresoPage() {
  const scannerRef = useRef<ScannerHandle>(null);
  const [scanResult, setScanResult] = useState<{ id: string; name?: string } | null>(null);
  const [status, setStatus] = useState<"scanning" | "success">("scanning");
  
  const [isFlashOn, setIsFlashOn] = useState(false); 
  const [zoomLevel, setZoomLevel] = useState(2);

  const onNewScanResult = (decodedText: string) => {
    setStatus("success");
    try {
        const data = JSON.parse(decodedText);
        setScanResult({ id: data.id || "ID-UNICO", name: data.n });
    } catch (e) {
        setScanResult({ id: decodedText, name: "OPERARIO" });
    }
  };

  const toggleFlash = async () => {
    if (scannerRef.current) {
        const nextState = !isFlashOn;
        const success = await scannerRef.current.toggleFlash(nextState);
        if (success) setIsFlashOn(nextState);
    }
  };

  const cycleZoom = () => {
    let nextZoom = 1;
    if (zoomLevel === 1) nextZoom = 2;
    else if (zoomLevel === 2) nextZoom = 3;
    else if (zoomLevel === 3) nextZoom = 4;
    else nextZoom = 1;
    
    setZoomLevel(nextZoom);
    scannerRef.current?.applyZoom(nextZoom);
  };

  const resetScanner = () => {
    setStatus("scanning");
    setScanResult(null);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-[#000000] flex flex-col">
      {/* HEADER: BOTONES GRANDES Y SIMBÓLICOS */}
      <div className="flex w-full h-20 border-b-4 border-[#00ff41] z-50 bg-[#000000]">
        
        {/* BOTÓN FLASH (⚡) */}
        <button 
            onClick={toggleFlash}
            className={`flex-1 flex items-center justify-center text-4xl border-r-4 border-[#00ff41] transition-colors duration-150 ${
                isFlashOn ? 'bg-[#00ff41] text-[#000000]' : 'bg-[#000000] text-[#00ff41]'
            }`}
        >
            ⚡
        </button>

        {/* BOTÓN ZOOM (🔍) */}
        <button 
            onClick={cycleZoom}
            className={`flex-1 flex items-center justify-center text-3xl border-r-4 border-[#00ff41] transition-colors duration-150 ${
                zoomLevel > 1 ? 'bg-[#00ff41] text-[#000000]' : 'bg-[#000000] text-[#00ff41]'
            }`}
        >
            <div className="flex flex-col items-center leading-none">
                <span>🔍</span>
                <span className="text-sm font-bold mt-1">{zoomLevel}x</span>
            </div>
        </button>

        {/* BOTÓN SALIR (❌) */}
        <Link 
            href="/" 
            className="flex-1 flex items-center justify-center text-4xl bg-[#000000] text-[#00ff41] active:bg-[#00ff41] active:text-[#000000] transition-colors"
        >
            ❌
        </Link>
      </div>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 relative w-full h-full bg-[#000000]">
        
        {/* ESTADO: ESCANEANDO */}
        {status === "scanning" && (
          <div className="w-full h-full relative">
             <Html5QrcodePlugin 
                ref={scannerRef} 
                qrCodeSuccessCallback={onNewScanResult}
                autoFlash={false}
                defaultZoom={2}
             />
             
             {/* OVERLAY / MARCO VERDE SIMPLE */}
             <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                <div className="w-72 h-72 relative">
                    {/* Solo esquinas verdes gruesas */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00ff41]"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00ff41]"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00ff41]"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00ff41]"></div>
                    
                    {/* Centro de mira opcional */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#00ff41] opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
             </div>
          </div>
        )}

        {/* ESTADO: ÉXITO */}
        {status === "success" && scanResult && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#000000] p-6 z-50 animate-in fade-in duration-300">
            
            {/* CHECK GIGANTE */}
            <div className="mb-8 text-9xl animate-bounce">
                ✅
            </div>

            {/* NOMBRE DEL OPERARIO */}
            <div className="w-full border-y-4 border-[#00ff41] py-8 text-center bg-[#000000] mb-12">
                <p className="text-5xl font-black uppercase text-[#00ff41] break-words leading-tight">
                    {scanResult.name || "OK"}
                </p>
            </div>

            {/* BOTÓN SIGUIENTE (FLECHA) */}
            <button 
                onClick={resetScanner} 
                className="w-full h-32 bg-[#00ff41] text-[#000000] text-7xl rounded-2xl flex items-center justify-center active:scale-95 transition-transform shadow-[0_0_20px_rgba(0,255,65,0.5)]"
            >
                ➡️
            </button>
          </div>
        )}
      </main>
    </div>
  );
}