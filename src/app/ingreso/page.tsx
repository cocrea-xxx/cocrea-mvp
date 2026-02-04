"use client";

import { useState, useEffect } from "react";
import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";
import Link from "next/link";

export default function IngresoPage() {
  const [scanResult, setScanResult] = useState<{ id: string; name?: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");

  useEffect(() => {
    const timer = setTimeout(() => {
        startScanning();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const onNewScanResult = (decodedText: string, decodedResult: any) => {
    setIsScanning(false);
    setStatus("success");
    
    try {
        const data = JSON.parse(decodedText);
        setScanResult({ id: data.id || "Desconocido", name: data.n });
    } catch (e) {
        setScanResult({ id: decodedText, name: "ID DETECTADO" });
    }
  };

  const startScanning = () => {
    setStatus("scanning");
    setIsScanning(true);
  };

  const resetScanner = () => {
    setStatus("idle");
    setScanResult(null);
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen flex-col bg-black font-mono text-[#00FF41]">
      {/* HEADER FLOTANTE */}
      <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-black/80 border-b border-green-900">
        <h1 className="text-2xl font-bold tracking-widest neon-text">CoCrea OS</h1>
        <Link href="/" className="px-4 py-2 border border-green-800 hover:bg-green-900/30 text-green-500 hover:text-[#00FF41] rounded uppercase text-sm font-bold transition-all">
            [ SALIR ]
        </Link>
      </div>

      {/* ESTADO: ESCANEANDO */}
      {status === "scanning" && (
        <div className="fixed inset-0 z-0 bg-black flex items-center justify-center">
             <div className="w-full h-full relative">
                 <Html5QrcodePlugin
                    qrCodeSuccessCallback={onNewScanResult}
                 />
                 
                 {/* Marco Matrix Verde */}
                 <div className="absolute inset-0 border-[40px] md:border-[100px] border-black/80 z-10 pointer-events-none flex items-center justify-center">
                    <div className="w-72 h-72 border-2 border-[#00FF41] relative shadow-[0_0_30px_rgba(0,255,65,0.3)]">
                        {/* Esquinas Brillantes */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00FF41] -mt-1 -ml-1"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00FF41] -mt-1 -mr-1"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00FF41] -mb-1 -ml-1"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00FF41] -mb-1 -mr-1"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                            <span className="text-[#00FF41] font-bold text-2xl uppercase tracking-widest bg-black/50 px-2">ESCANEAR</span>
                        </div>
                    </div>
                 </div>

                 <div className="absolute bottom-36 left-0 w-full text-center z-20">
                    <p className="text-[#00FF41] font-bold text-xl bg-black/60 inline-block px-6 py-2 border border-green-800">
                        BUSCANDO OBJETIVO...
                    </p>
                 </div>
             </div>
        </div>
      )}

      {/* ESTADO: IDLE */}
      {status === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black z-10">
           <button
            onClick={startScanning}
            className="w-full max-w-sm aspect-square bg-[#001a00] border-4 border-[#00FF41] rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,255,65,0.2)] active:scale-95 transition-transform hover:bg-[#002b00]"
           >
              <span className="text-8xl mb-2 filter drop-shadow-[0_0_10px_#00FF41]">◉</span>
              <span className="text-2xl font-bold text-[#00FF41] neon-text tracking-widest">ACTIVAR</span>
           </button>
        </div>
      )}

      {/* ESTADO: ÉXITO */}
      {status === "success" && scanResult && (
        <div className="fixed inset-0 z-50 bg-[#001a00] flex flex-col items-center justify-center p-6 border-8 border-[#00FF41]">
            <div className="w-32 h-32 border-4 border-[#00FF41] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_#00FF41] bg-black">
              <span className="text-6xl animate-bounce">✔</span>
            </div>
            <h2 className="text-5xl font-bold text-[#00FF41] mb-4 text-center uppercase tracking-tighter neon-text">ACCESO<br/>AUTORIZADO</h2>
            <div className="border-t border-b border-green-800 py-4 mb-12 w-full text-center bg-black/30">
                <p className="text-3xl text-white font-mono">{scanResult.name || scanResult.id}</p>
                <p className="text-sm text-green-600 mt-2">ID: {scanResult.id}</p>
            </div>
            
            <button
                onClick={resetScanner}
                className="w-full py-6 bg-[#00FF41] text-black hover:bg-white rounded-none border-2 border-transparent hover:border-[#00FF41] text-3xl font-bold shadow-[0_0_20px_rgba(0,255,65,0.5)] transition-all uppercase tracking-widest"
            >
                CONTINUAR >
            </button>
        </div>
      )}
    </main>
  );
}