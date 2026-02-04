import Link from "next/link";

export default function Home() {
  return (
    <div className="aspect-container">
      <main className="content-box flex items-center justify-center p-8">
        <Link 
          href="/ingreso" 
          className="w-full h-32 border-4 border-[#00ff41] bg-black text-[#00ff41] text-5xl font-black flex items-center justify-center active:bg-[#00ff41] active:text-black tracking-tighter"
        >
          INICIAR
        </Link>
      </main>
    </div>
  );
}
