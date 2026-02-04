"use client";

import { useState, useEffect } from "react";
import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";
import Link from "next/link";

export default function IngresoPage() {
  const [scanResult, setScanResult] = useState<{ id: string; name?: string } | null>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");

  useEffect(() => {
    const timer = setTimeout(() => {
        startScanning();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const onNewScanResult = (decodedText: string) => {
    setStatus("success");
    try {
        const data = JSON.parse(decodedText);
        setScanResult({ id: data.id || "ID-UNICO", name: data.n });
    } catch (e) {
        setScanResult({ id: decodedText, name: "OPERARIO" });
    }
  };

  const startScanning = () => {
    setStatus("scanning");
  };

  const resetScanner = () => {
    setScanResult(null);
    window.location.reload();
  };

  return (
    <div className="aspect-container">
      <main className="content-box">
        {/* HEADER */}
        <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-black border-b-4 border-[#00ff41]">
          <h1 className="text-3xl font-bold">COCREA</h1>
          <Link href="/" className="px-4 py-2 border-2 border-[#00ff41] text-lg font-bold">
            [ SALIR ]
          </Link>
        </div>

        {/* CÁMARA */}
        {status === "scanning" && (
          <div className="flex-1 relative bg-black">
             <Html5QrcodePlugin qrCodeSuccessCallback={onNewScanResult} />
             
             {/* Marco Guía Minimalista */}
             <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-[#00ff41] relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <span className="text-4xl font-bold uppercase">APUNTE QR</span>
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* ÉXITO */}
        {status === "success" && scanResult && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black z-30">
            <div className="text-8xl mb-4 leading-none">✔</div>
            <h2 className="text-5xl font-bold mb-8 text-center uppercase tracking-tighter">REGISTRO OK</h2>
            <div className="border-y-4 border-[#00ff41] py-6 w-full text-center mb-12">
                <p className="text-4xl font-bold">{scanResult.name || scanResult.id}</p>
                <p className="text-xl mt-2">ID: {scanResult.id}</p>
            </div>
            <button
                onClick={resetScanner}
                className="btn-matrix w-full py-6 text-4xl"
            >
                SIGUIENTE &gt;
            </button>
          </div>
        )}

        {/* FALLBACK IDLE */}
        {status === "idle" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black">
            <button onClick={startScanning} className="btn-matrix w-64 h-64 text-2xl">
              REINTENTAR CÁMARA
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
