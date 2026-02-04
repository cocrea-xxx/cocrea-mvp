"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export default function GeneradorPage() {
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");

  const valorQR = JSON.stringify({ id: rut, n: nombre });

  const handlePrint = () => window.print();

  return (
    <div className="aspect-container print:bg-white print:p-0">
      <main className="content-box p-6 flex flex-col justify-between print:border-none print:aspect-auto">
        <header className="text-center border-b-4 border-[#00ff41] py-4 print:hidden">
          <h1 className="text-4xl font-black">GENERADOR QR</h1>
        </header>

        <div className="flex-1 flex flex-col md:flex-row gap-8 py-6 items-center justify-center">
          {/* FORMULARIO */}
          <div className="w-full space-y-4 print:hidden">
            <input 
              type="text" 
              placeholder="RUT OPERARIO"
              value={rut}
              onChange={(e) => setRut(e.target.value.toUpperCase())}
              className="w-full p-4 bg-black border-4 border-[#00ff41] text-[#00ff41] text-2xl outline-none"
            />
            <input 
              type="text" 
              placeholder="NOMBRE COMPLETO"
              value={nombre}
              onChange={(e) => setNombre(e.target.value.toUpperCase())}
              className="w-full p-4 bg-black border-4 border-[#00ff41] text-[#00ff41] text-2xl outline-none"
            />
            <button 
              onClick={handlePrint}
              disabled={!rut || !nombre}
              className="btn-matrix w-full py-4 text-2xl disabled:opacity-30"
            >
              IMPRIMIR
            </button>
            <Link href="/" className="btn-matrix w-full py-2 text-xl opacity-50">
              VOLVER
            </Link>
          </div>

          {/* VISTA PREVIA */}
          <div className="flex flex-col items-center justify-center print:w-full">
            {rut && nombre ? (
              <div className="p-4 bg-white border-8 border-black">
                <QRCodeSVG value={valorQR} size={200} level="H" includeMargin={true} />
                <div className="text-black text-center mt-4">
                  <p className="font-bold text-xl">{nombre}</p>
                  <p className="font-mono text-lg">{rut}</p>
                </div>
              </div>
            ) : (
              <div className="text-[#00ff41] text-xl border-4 border-dashed border-[#00ff41] p-10 print:hidden uppercase">
                Esperando Datos...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}