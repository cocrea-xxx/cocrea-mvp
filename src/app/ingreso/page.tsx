"use client";

import { useState, useEffect, useRef } from "react";
import Html5QrcodePlugin, { ScannerHandle } from "@/components/Html5QrcodePlugin";
import Link from "next/link";

export default function IngresoPage() {
  const scannerRef = useRef<ScannerHandle>(null);
  const [scanResult, setScanResult] = useState<{ id: string; name?: string } | null>(null);
  const [status, setStatus] = useState<"scanning" | "success">("scanning");
  
  // Estados de controles sincronizados con el inicio automático
  const [isFlashOn, setIsFlashOn] = useState(true); 
  const [zoomLevel, setZoomLevel] = useState(2); // Iniciamos en x2

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
    else if (zoomLevel === 2) nextZoom = 4;
    else nextZoom = 1;
    
    setZoomLevel(nextZoom);
    scannerRef.current?.applyZoom(nextZoom);
  };

  const resetScanner = () => {
    window.location.reload();
  };

  // Clase de utilidad para botones cuadrados de un mismo tamaño
  const btnStyle = "w-16 h-16 border-4 border-[#00ff41] font-bold text-xs flex flex-col items-center justify-center transition-colors leading-none aspect-square";

  return (
    <div className="aspect-container">
      <main className="content-box">
        
        {/* HEADER CON BOTONES UNIFICADOS */}
        <div className="absolute top-0 left-0 w-full p-2 z-20 flex justify-between items-center bg-black border-b-4 border-[#00ff41]">
          <div className="flex gap-2">
            <button 
                onClick={toggleFlash}
                className={`${btnStyle} ${isFlashOn ? 'bg-[#00ff41] text-black' : 'text-[#00ff41] bg-black'}`}
            >
                <span>LUZ</span>
                <span className="mt-1 text-sm">{isFlashOn ? "ON" : "OFF"}</span>
            </button>
            <button 
                onClick={cycleZoom}
                className={`${btnStyle} ${zoomLevel > 1 ? 'bg-[#00ff41] text-black' : 'text-[#00ff41] bg-black'}`}
            >
                <span>ZOOM</span>
                <span className="mt-1 text-sm">x{zoomLevel}</span>
            </button>
          </div>

          <Link href="/" className={`${btnStyle} text-[#00ff41] bg-black text-4xl font-black`}>
            X
          </Link>
        </div>

        {/* CÁMARA */}
        {status === "scanning" && (
          <div className="flex-1 relative bg-black">
             <Html5QrcodePlugin 
                ref={scannerRef} 
                qrCodeSuccessCallback={onNewScanResult}
                autoFlash={true}
                defaultZoom={2}
             />
             <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-[#00ff41] flex items-center justify-center">
                    <span className="text-xl font-bold uppercase opacity-30 text-[#00ff41]">ENFOQUE QR</span>
                </div>
             </div>
          </div>
        )}

        {/* ÉXITO */}
        {status === "success" && scanResult && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black z-30">
            <h2 className="text-4xl font-bold mb-4 uppercase tracking-tighter text-[#00ff41]">RECIBIDO</h2>
            <div className="border-y-4 border-[#00ff41] py-6 w-full text-center mb-8 bg-black">
                <p className="text-4xl font-bold break-words px-2 leading-none uppercase text-[#00ff41]">{scanResult.name || "S/N"}</p>
                <p className="text-lg mt-4 font-mono text-[#00ff41]">ID: {scanResult.id}</p>
            </div>
            <button 
                onClick={resetScanner} 
                className="w-full py-8 border-4 border-[#00ff41] bg-black text-[#00ff41] text-4xl font-bold active:bg-[#00ff41] active:text-black transition-colors"
            >
                OK &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}