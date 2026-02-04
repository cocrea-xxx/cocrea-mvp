"use client";

import { useState, useEffect } from "react";
import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";
import Link from "next/link";

export default function IngresoPage() {
  const [scanResult, setScanResult] = useState<{ id: string; name?: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");

  // Intentar iniciar automáticamente al cargar
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
        setScanResult({ id: decodedText, name: "Operario Detectado" });
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
    <main className="flex min-h-screen flex-col bg-black">
      {/* HEADER FLOTANTE (Solo visible si NO estamos escaneando o si queremos salir) */}
      <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-xl font-bold text-white">CoCrea</h1>
        <Link href="/" className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold text-white border border-white/30">
            SALIR
        </Link>
      </div>

      {/* ESTADO: ESCANEANDO (CÁMARA FULL SCREEN) */}
      {status === "scanning" && (
        <div className="fixed inset-0 z-0 bg-black flex items-center justify-center">
             {/* El plugin ahora ocupará todo el contenedor */}
             <div className="w-full h-full relative">
                 <Html5QrcodePlugin
                    qrCodeSuccessCallback={onNewScanResult}
                 />
                 
                 {/* Marco de Enfoque Visual (Overlay) */}
                 <div className="absolute inset-0 border-[40px] md:border-[100px] border-black/60 z-10 pointer-events-none flex items-center justify-center">
                    <div className="w-72 h-72 border-4 border-white/80 rounded-3xl relative shadow-2xl">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-blue-500 rounded-tl-2xl -mt-2 -ml-2"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-blue-500 rounded-tr-2xl -mt-2 -mr-2"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-blue-500 rounded-bl-2xl -mb-2 -ml-2"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-blue-500 rounded-br-2xl -mb-2 -mr-2"></div>
                        
                        {/* Texto guía en el centro del marco */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white/20 font-black text-2xl uppercase text-center">Código<br/>Aquí</span>
                        </div>
                    </div>
                 </div>

                 <div className="absolute bottom-20 left-0 w-full text-center z-20">
                    <p className="text-white font-bold text-lg drop-shadow-md bg-black/30 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
                        Apunte al código QR
                    </p>
                 </div>
             </div>
        </div>
      )}

      {/* ESTADO: IDLE (Fallback manual) */}
      {status === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 z-10">
           <button
            onClick={startScanning}
            className="w-full max-w-sm aspect-square bg-blue-600 rounded-full flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform animate-pulse"
           >
              <span className="text-6xl mb-2">📷</span>
              <span className="text-xl font-extrabold text-white">ACTIVAR CÁMARA</span>
           </button>
        </div>
      )}

      {/* ESTADO: ÉXITO */}
      {status === "success" && scanResult && (
        <div className="fixed inset-0 z-50 bg-green-600 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="text-6xl">✅</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-2 text-center uppercase">¡Correcto!</h2>
            <p className="text-2xl text-green-100 font-bold mb-12 text-center">{scanResult.name || scanResult.id}</p>
            
            <button
                onClick={resetScanner}
                className="w-full py-6 bg-white text-green-700 rounded-2xl text-2xl font-black shadow-xl"
            >
                SIGUIENTE
            </button>
        </div>
      )}
    </main>
  );
}
