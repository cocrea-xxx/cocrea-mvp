import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">CoCrea</h1>
        <p className="text-slate-500 mb-12 text-lg">Plataforma Centralizada de Gestión de Obra</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta de Simulación para Pruebas */}
          <Link 
            href="/scan/OP-001"
            className="group flex flex-col items-center p-6 border-2 border-dashed border-blue-200 rounded-2xl hover:bg-blue-50 transition-all cursor-pointer"
          >
            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">👷</span>
            <h3 className="font-bold text-slate-700">Simular Escaneo QR</h3>
            <p className="text-xs text-slate-400 mt-2">Prueba para operario #001</p>
          </Link>

          {/* Placeholders para futuros módulos */}
          <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl opacity-50">
            <span className="text-4xl mb-4">📊</span>
            <h3 className="font-bold text-slate-700">Dashboard Finanzas</h3>
            <p className="text-xs text-slate-400 mt-2">Próximamente</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl opacity-50">
            <span className="text-4xl mb-4">👥</span>
            <h3 className="font-bold text-slate-700">Recursos Humanos</h3>
            <p className="text-xs text-slate-400 mt-2">Próximamente</p>
          </div>
        </div>
      </div>
    </main>
  );
}