"use client";

import { useState } from "react";
import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";

export default function IngresoPage() {
  const [scanResult, setScanResult] = useState<{ id: string; name?: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");

  // Función que se ejecuta al detectar un código
  const onNewScanResult = (decodedText: string, decodedResult: any) => {
    // Detener escaneo visualmente
    setIsScanning(false);
    setStatus("success");
    
    // Intentar "parsear" (leer) los datos si es un JSON (QR de Casco)
    // O usar el texto crudo si es un código simple
    try {
        // Ejemplo de QR Casco: {"id": "OP-55", "n": "Juan Perez"}
        const data = JSON.parse(decodedText);
        setScanResult({ id: data.id || "Desconocido", name: data.n });
    } catch (e) {
        // Si no es JSON, asumimos que es el ID directo o RUT crudo
        setScanResult({ id: decodedText, name: "Operario (Datos pendientes)" });
    }

    // Capturar ubicación en el momento exacto del escaneo
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
    }
  };

  const startScanning = () => {
    setStatus("scanning");
    setIsScanning(true);
  };

  const resetScanner = () => {
    setStatus("idle");
    setScanResult(null);
    setIsScanning(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-12 p-6 bg-slate-50 font-sans">
      <h1 className="text-2xl font-extrabold text-blue-900 mb-2">CoCrea | Acceso</h1>
      
      {status === "idle" && (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center mt-10">
          <div className="mb-8">
            <span className="text-6xl">🪪</span>
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-4">Registro de Asistencia</h2>
          <p className="text-slate-500 mb-8 text-sm">
            Ten a mano tu credencial o el código QR de tu casco.
          </p>
          <button
            onClick={startScanning}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            ESCANEAR AHORA
          </button>
        </div>
      )}

      {status === "scanning" && (
        <div className="w-full max-w-md flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-lg w-full mb-4">
                 <Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={onNewScanResult}
                 />
            </div>
            <p className="text-slate-500 animate-pulse text-sm">Buscando código...</p>
            <button 
                onClick={resetScanner}
                className="mt-8 text-slate-400 underline text-sm"
            >
                Cancelar
            </button>
        </div>
      )}

      {status === "success" && scanResult && (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center mt-10 border-t-4 border-green-500 animate-in zoom-in duration-300">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">¡Bienvenido!</h2>
            <p className="text-lg text-blue-600 font-bold mb-6">{scanResult.name || scanResult.id}</p>
            
            <div className="bg-slate-50 p-4 rounded-xl text-left text-sm space-y-2 border border-slate-100">
                <div className="flex justify-between">
                    <span className="text-slate-400">ID Detectado:</span>
                    <span className="font-mono font-bold text-slate-700">{scanResult.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Hora:</span>
                    <span className="font-mono font-bold text-slate-700">{new Date().toLocaleTimeString()}</span>
                </div>
                {location && (
                    <div className="flex justify-between">
                        <span className="text-slate-400">GPS:</span>
                        <span className="font-mono text-slate-700 text-xs">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                    </div>
                )}
            </div>

            <button
                onClick={resetScanner}
                className="w-full mt-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold"
            >
                Finalizar
            </button>
        </div>
      )}
    </main>
  );
}
