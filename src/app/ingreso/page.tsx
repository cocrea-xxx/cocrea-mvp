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
    // Pequeño delay para asegurar que el componente montó
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
    setStatus("idle"); // Volver a estado inicial (intentará auto-start por el useEffect si recarga, o manual)
    setScanResult(null);
    // Forzamos recarga para limpiar cámara si quedó pegada
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen flex-col bg-black">
      {/* HEADER SIMPLE */}
      <div className="w-full p-4 bg-blue-900 text-white flex justify-between items-center z-10">
        <h1 className="text-xl font-bold">CoCrea</h1>
        <Link href="/" className="px-4 py-2 bg-blue-800 rounded-lg text-sm font-bold">SALIR</Link>
      </div>

      {/* ESTADO: ESCANEANDO (CÁMARA VIVA) */}
      {status === "scanning" && (
        <div className="flex-1 flex flex-col items-center justify-center relative bg-black">
            <div className="w-full h-full absolute top-0 left-0">
                 <Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={onNewScanResult}
                    // Si falla la cámara, mostramos error
                    qrCodeErrorCallback={(err) => console.log(err)} 
                 />
            </div>
            <div className="z-10 mt-96 bg-black/50 p-4 rounded-xl text-white text-center backdrop-blur-sm">
                <p className="font-bold text-xl">APUNTE AL CÓDIGO</p>
            </div>
        </div>
      )}

      {/* ESTADO: IDLE (Por si falla el auto-start o el usuario cancela) */}
      {status === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-100">
           <button
            onClick={startScanning}
            className="w-full h-96 bg-blue-600 rounded-3xl flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform"
           >
              <span className="text-8xl mb-4">📷</span>
              <span className="text-3xl font-extrabold text-white">TOCAR PARA<br/>ESCANEAR</span>
           </button>
           <p className="mt-8 text-slate-500 text-center text-lg font-medium">Si la cámara no abre, toca el botón azul.</p>
        </div>
      )}

      {/* ESTADO: ÉXITO (PANTALLA VERDE GIGANTE) */}
      {status === "success" && scanResult && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-green-600 animate-in zoom-in duration-300">
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