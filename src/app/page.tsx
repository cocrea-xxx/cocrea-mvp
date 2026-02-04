import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black selection:bg-green-900 selection:text-white">
      <div className="w-full max-w-4xl border-2 border-green-900 bg-black/90 p-8 md:p-12 text-center shadow-[0_0_20px_rgba(0,255,65,0.1)] relative overflow-hidden">
        
        {/* Efecto decorativo de líneas de escaneo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-20 shadow-[0_0_10px_#00FF41]"></div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-[#00FF41] mb-2 neon-text tracking-widest uppercase">CoCrea</h1>
        <p className="text-green-700 mb-12 text-xl font-mono tracking-widest border-b border-green-900 inline-block pb-2">
          SISTEMA CENTRAL V.1.0
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Tarjeta Principal: Scanner */}
          <Link 
            href="/ingreso"
            className="group flex flex-col items-center p-8 border-2 border-[#00FF41] bg-black hover:bg-[#001a00] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:shadow-[0_0_25px_rgba(0,255,65,0.6)] relative"
          >
            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-[#00FF41]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#00FF41]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00FF41]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#00FF41]"></div>

            <span className="text-6xl mb-4 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_5px_#00FF41]">📸</span>
            <h3 className="font-bold text-3xl text-[#00FF41] uppercase tracking-wider">Marcar<br/>Asistencia</h3>
            <p className="text-lg text-green-600 mt-4 font-bold bg-green-900/20 px-4 py-1 rounded">
              [ INICIAR ]
            </p>
          </Link>

          {/* Generador de QR */}
          <Link 
            href="/generador"
            className="group flex flex-col items-center p-6 border border-green-800 bg-[#050505] hover:border-[#00FF41] hover:bg-[#001a00] transition-all cursor-pointer"
          >
            <span className="text-4xl mb-4 text-green-700 group-hover:text-[#00FF41] transition-colors">🖨️</span>
            <h3 className="font-bold text-2xl text-green-600 group-hover:text-[#00FF41] uppercase">Generar<br/>Credenciales</h3>
            <p className="text-sm text-green-800 mt-2 font-mono"> ADMIN ONLY </p>
          </Link>

          {/* Placeholder Futuro */}
          <div className="flex flex-col items-center p-6 border border-green-900/30 bg-black/50 opacity-40 grayscale">
            <span className="text-4xl mb-4">👥</span>
            <h3 className="font-bold text-xl text-green-800">RRHH DB</h3>
            <p className="text-xs text-green-900 mt-2">[ OFFLINE ]</p>
          </div>
        </div>

        <div className="mt-16 text-xs text-green-900 font-mono">
          CONEXIÓN SEGURA ESTABLECIDA • IP: 192.168.X.X
        </div>
      </div>
    </main>
  );
}
