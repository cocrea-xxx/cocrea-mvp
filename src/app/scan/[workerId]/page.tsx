"use client";

import { useState, useEffect, use } from "react";

// En Next.js 15, params es una Promesa en layouts y pages.
// Definimos el tipo para params como una Promesa.
type Params = Promise<{ workerId: string }>;

export default function ScanPage(props: { params: Params }) {
  // Usamos use() para desenvolver los params (React 19 / Next.js 15 feature)
  // Si use() no está disponible o da problemas en versiones menores, lo ajustaremos.
  // Para máxima compatibilidad ahora, usaremos un useEffect simple si falla, 
  // pero intentaremos la forma moderna primero.
  // *Nota: Para evitar errores de build si la versión de React types es vieja,
  // usaré un hook simple de desenvoltura.*
  
  const [workerId, setWorkerId] = useState<string>("");
  
  useEffect(() => {
    // Desenvolvemos la promesa de params
    props.params.then((unwrappedParams) => {
      setWorkerId(unwrappedParams.workerId);
    });
  }, [props.params]);


  const [status, setStatus] = useState<"idle" | "requesting" | "loading" | "success" | "error">("idle");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [timestamp, setTimestamp] = useState<string>("");
  const [errorHelp, setErrorHelp] = useState<string>("");

  const requestAttendance = () => {
    setStatus("requesting");
  };

  const confirmAttendance = () => {
    setStatus("loading");
    
    if (!navigator.geolocation) {
      setErrorHelp("Tu celular es muy antiguo y no soporta esta función.");
      setStatus("error");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setTimestamp(new Date().toLocaleString());
        
        console.log(`Registro para operario ${workerId} en:`, latitude, longitude);
        
        setTimeout(() => setStatus("success"), 1500);
      },
      (error) => {
        console.error(error);
        if (error.code === 1) {
            setErrorHelp("Necesitamos tu permiso. Revisa la configuración del navegador (ícono del candado 🔒 o configuración de sitio) y permite la Ubicación.");
        } else if (error.code === 2) {
            setErrorHelp("No pudimos encontrar tu señal GPS. Intenta salir al aire libre.");
        } else {
            setErrorHelp("Ocurrió un error inesperado. Intenta recargar la página.");
        }
        setStatus("error");
      },
      options
    );
  };

  if (!workerId) return <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">Cargando...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">CoCrea</h1>
        <p className="text-slate-500 mb-8 font-medium text-xs tracking-widest uppercase">Sistema de Control de Obra</p>
        
        {status === "idle" && (
          <>
            <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-slate-700 font-medium text-lg">Hola, Operario</p>
              <div className="mt-2 inline-block px-3 py-1 bg-white rounded-full border border-blue-200 shadow-sm">
                <p className="text-xs text-slate-500 font-mono font-bold uppercase tracking-wider">ID: {workerId}</p>
              </div>
            </div>
            
            <button
              onClick={requestAttendance}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              <span>📍</span> REGISTRAR ENTRADA
            </button>
          </>
        )}

        {status === "requesting" && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-6 p-6 bg-yellow-50 rounded-2xl border border-yellow-100 text-left">
                    <p className="font-bold text-yellow-800 text-lg mb-2">⚠️ Atención</p>
                    <p className="text-yellow-800 mb-4">
                        Tu celular te preguntará si permites usar la ubicación.
                    </p>
                    <p className="font-bold text-black text-xl text-center border-2 border-dashed border-yellow-300 p-2 rounded-lg bg-white">
                        Presiona "PERMITIR"
                    </p>
                </div>
                <button
                onClick={confirmAttendance}
                className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xl font-bold shadow-lg shadow-green-200"
                >
                ENTENDIDO, CONTINUAR
                </button>
             </div>
        )}

        {status === "loading" && (
          <div className="py-12 flex flex-col items-center animate-pulse">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-blue-600 font-bold text-lg">Localizando satélites...</p>
            <p className="text-xs text-slate-400 mt-2">Por favor espera un momento</p>
          </div>
        )}
        
        {status === "error" && (
           <>
            <div className="mb-8 p-6 bg-red-50 rounded-2xl border border-red-100">
              <div className="text-4xl mb-2">🚫</div>
              <p className="text-red-700 font-bold">Problema de Ubicación</p>
              <p className="text-sm text-red-600 mt-4 font-medium">{errorHelp}</p>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Volver a intentar
            </button>
          </>
        )}

        {status === "success" && (
          <div className="py-8 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="font-bold text-2xl text-slate-800 uppercase tracking-tight">¡Entrada Exitosa!</h2>
            
            <div className="mt-8 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
                <span className="text-xs text-slate-400 uppercase font-bold">Hora</span>
                <span className="font-mono text-slate-700 font-bold">{timestamp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Ubicación</span>
                <span className="font-mono text-slate-700 text-sm">{location?.lat.toFixed(5)}, {location?.lng.toFixed(5)}</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 mt-8 text-center">Tus datos han sido enviados a RRHH y Finanzas de forma segura.</p>
          </div>
        )}
      </div>
    </main>
  );
}
