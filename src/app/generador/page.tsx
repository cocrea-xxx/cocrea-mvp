"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export default function GeneradorPage() {
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");

  // Creamos el JSON que el escáner leerá automáticamente
  const valorQR = JSON.stringify({
    id: rut,
    n: nombre
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 font-sans print:bg-white print:p-0">
      {/* HEADER - No se imprime */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-2xl font-black text-blue-900">CoCrea | Generador QR</h1>
        <Link href="/" className="px-4 py-2 bg-slate-200 rounded-lg font-bold text-slate-600">Volver</Link>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* FORMULARIO - No se imprime */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 print:hidden">
          <h2 className="text-xl font-bold mb-6 text-slate-700">Datos del Trabajador</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase mb-1">RUT (Sin puntos ni guión)</label>
              <input 
                type="text" 
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                placeholder="Ej: 181234567"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all text-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase mb-1">Nombre Completo</label>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: JUAN PEREZ"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all text-lg"
              />
            </div>
          </div>

          <button 
            onClick={handlePrint}
            disabled={!rut || !nombre}
            className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-black text-lg shadow-lg shadow-blue-200 transition-all"
          >
            IMPRIMIR CÓDIGO
          </button>
        </div>

        {/* VISTA PREVIA DEL CÓDIGO - Esto es lo que se imprime */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center print:shadow-none print:border-none print:w-full">
          {rut && nombre ? (
            <>
              <div className="bg-white p-4 border-4 border-slate-900 rounded-xl mb-6">
                <QRCodeSVG 
                    value={valorQR} 
                    size={256}
                    level="H" // Alta recuperación de errores (ideal para cascos sucios)
                    includeMargin={true}
                />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase">{nombre}</h3>
              <p className="text-slate-500 font-mono text-xl">{rut}</p>
              <p className="mt-8 text-xs text-slate-300 uppercase font-bold tracking-widest print:text-slate-500">
                PROPIEDAD DE COCREA - CASCO DE SEGURIDAD
              </p>
            </>
          ) : (
            <div className="text-slate-300 flex flex-col items-center">
                <span className="text-8xl mb-4">🖨️</span>
                <p className="font-bold">Ingresa los datos para generar el código</p>
            </div>
          )}
        </div>
      </div>

      {/* Estilos para impresión */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\:w-full, .print\:w-full * {
            visibility: visible;
          }
          .print\:w-full {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
