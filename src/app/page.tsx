import Link from "next/link";

export default function Home() {
  return (
    <div className="aspect-container">
      <main className="content-box p-6 flex flex-col justify-between">
        <header className="text-center border-b-4 border-[#00ff41] py-4">
          <h1 className="text-6xl font-black leading-none tracking-tighter uppercase">COCREA</h1>
          <p className="text-xl mt-2 tracking-widest">[ SISTEMA DE OBRA ]</p>
        </header>

        <nav className="flex-1 flex flex-col justify-center gap-8">
          <Link href="/ingreso" className="btn-matrix h-32 text-4xl leading-none">
            MARCAR ASISTENCIA
          </Link>
          
          <Link href="/generador" className="btn-matrix h-20 text-2xl leading-none">
            ADMIN: GENERAR QR
          </Link>
        </nav>

        <footer className="text-center border-t-4 border-[#00ff41] py-2 text-lg">
          ESTADO: CONECTADO
        </footer>
      </main>
    </div>
  );
}