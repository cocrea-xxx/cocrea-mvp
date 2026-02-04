"use client";

import { useState, useEffect, useRef } from "react";
import Html5QrcodePlugin, { ScannerHandle } from "@/components/Html5QrcodePlugin";
import Link from "next/link";

export default function IngresoPage() {
  const scannerRef = useRef<ScannerHandle>(null);
  const [scanResult, setScanResult] = useState<{ id: string; name?: string } | null>(null);
  const [status, setStatus] = useState<"scanning" | "success">("scanning");
  
  // Estados de controles
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

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
        const success = await scannerRef.current.toggleFlash(!isFlashOn);
        if (success) setIsFlashOn(!isFlashOn);
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

  return (
    <div className="aspect-container">
      <main className="content-box">
        
        {/* HEADER MINIMALISTA CON CONTROLES GRUPALES */}
        <div className="absolute top-0 left-0 w-full p-2 z-20 flex justify-between items-center bg-black border-b-4 border-[#00ff41]">
          <div className="flex gap-2">
            <button 
                onClick={toggleFlash}
                className={`w-16 h-12 border-2 border-[#00ff41] font-bold text-xs flex items-center justify-center ${isFlashOn ? 'bg-[#00ff41] text-black' : 'text-[#00ff41]'}`}
            >
                LUZ
            </button>
            <button 
                onClick={cycleZoom}
                className="w-16 h-12 border-2 border-[#00ff41] text-[#00ff41] font-bold text-xs flex flex-col items-center justify-center"
            >
                <span>ZOOM</span>
                <span>x{zoomLevel}</span>
            </button>
          </div>

          <Link href="/" className="w-12 h-12 border-2 border-[#00ff41] text-[#00ff41] flex items-center justify-center text-2xl font-black">
            X
          </Link>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {status === "scanning" && (
          <div className="flex-1 relative bg-black">
             <Html5QrcodePlugin ref={scannerRef} qrCodeSuccessCallback={onNewScanResult} />
             <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-[#00ff41] flex items-center justify-center">
                    <span className="text-xl font-bold uppercase opacity-40">ENFOQUE QR</span>
                </div>
             </div>
          </div>
        )}

        {status === "success" && scanResult && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black z-30">
            <h2 className="text-4xl font-bold mb-4 uppercase tracking-tighter">RECIBIDO</h2>
            <div className="border-y-4 border-[#00ff41] py-6 w-full text-center mb-8 bg-[#001100]">
                <p className="text-4xl font-bold break-words px-2 leading-none uppercase">{scanResult.name || "S/N"}</p>
                <p className="text-lg mt-4 font-mono">{scanResult.id}</p>
            </div>
            <button onClick={resetScanner} className="btn-matrix w-full py-6 text-4xl">
                OK &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
