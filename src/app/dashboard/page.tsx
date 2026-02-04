"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Tipos de datos simulados
type TaskStatus = "completed" | "in-progress" | "pending" | "locked";

interface Task {
  id: string;
  title: string;
  specialty: string; // Oficio
  workerName?: string;
  status: TaskStatus;
  startTime?: string;
  endTime?: string;
  recommendedEnd?: string;
}

export default function DashboardPage() {
  // --- DATOS SIMULADOS DEL OPERARIO ---
  const worker = {
    name: "JUAN PÉREZ GONZÁLEZ",
    rut: "12.345.678-9",
    role: "MAESTRO ENFIERRADOR",
    avatarUrl: null // Usaremos un placeholder
  };

  // --- ESTADO DE LAS TAREAS (MOCK) ---
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "Trazado de Ejes",
      specialty: "Topografía",
      workerName: "Ana S.",
      status: "completed",
      startTime: "08:00",
      endTime: "09:15"
    },
    {
      id: "t2",
      title: "Armado de Pilares",
      specialty: "Enfierradura", // Tarea del usuario actual
      workerName: "Juan P. (Tú)",
      status: "in-progress",
      startTime: "09:15", // Inició cuando Ana terminó
      recommendedEnd: "11:00"
    },
    {
      id: "t3",
      title: "Cierre de Moldaje",
      specialty: "Carpintería",
      workerName: "Pendiente",
      status: "pending",
      recommendedEnd: "13:00"
    },
    {
      id: "t4",
      title: "Hormigonado",
      specialty: "Albañilería",
      workerName: "Pendiente",
      status: "locked",
      recommendedEnd: "15:00"
    }
  ]);

  const [notes, setNotes] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Función para terminar tarea y activar la siguiente
  const completeTask = (taskId: string) => {
    setTasks(prev => {
        const index = prev.findIndex(t => t.id === taskId);
        if (index === -1) return prev;

        const newTasks = [...prev];
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // 1. Completar actual
        newTasks[index] = { ...newTasks[index], status: "completed", endTime: now };

        // 2. Activar siguiente (si existe)
        if (index + 1 < newTasks.length) {
            newTasks[index + 1] = { 
                ...newTasks[index + 1], 
                status: "in-progress", 
                startTime: now,
                workerName: "Esperando..." 
            };
        }
        return newTasks;
    });
  };

  return (
    <div className="fixed inset-0 bg-[#000000] flex items-center justify-center overflow-hidden">
      
      {/* 
         CONTENEDOR PRINCIPAL RESPONSIVO 
         - Vertical: aspect-[3/4]
         - Horizontal: aspect-[4/3]
         - Tamaño: 95% del lado más pequeño (vmin)
      */}
      <div className="w-[95vmin] md:w-auto md:h-[95vmin] aspect-[3/4] md:aspect-[4/3] bg-[#0a0a0a] border-2 border-[#333] shadow-2xl flex flex-col relative rounded-xl overflow-hidden">
        
        {/* --- HEADER --- */}
        <header className="flex flex-row items-center p-4 bg-[#111] border-b border-[#333] h-[15%]">
          {/* Avatar Circular */}
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full border-2 border-[#00ff41] flex items-center justify-center bg-black shrink-0 overflow-hidden">
             {worker.avatarUrl ? (
                <img src={worker.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
             ) : (
                <span className="text-2xl">👷‍♂️</span>
             )}
          </div>
          
          {/* Info Texto */}
          <div className="ml-4 flex-1 overflow-hidden">
             <h1 className="text-[#00ff41] font-bold text-lg md:text-xl truncate leading-tight uppercase">
                {worker.name}
             </h1>
             <p className="text-gray-400 text-xs font-mono tracking-wider">{worker.rut}</p>
             <div className="mt-1 inline-block bg-[#00ff41] text-black text-xs font-bold px-2 py-0.5 rounded-sm uppercase">
                {worker.role}
             </div>
          </div>

          {/* Hora y Geolocalización (Simulada) */}
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-mono text-white font-bold">{currentTime}</div>
            <div className="text-[10px] text-[#00ff41] flex items-center justify-end gap-1">
                <span>📍</span> 
                <span>EN OBRA</span>
            </div>
          </div>
        </header>


        {/* --- CUERPO (GRID DE TAREAS) --- */}
        <div className="flex-1 overflow-y-auto p-4 bg-black/50">
            <h2 className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-3 sticky top-0 bg-[#0a0a0a] py-2 z-10 border-b border-[#333]">
                Flujo de Trabajo
            </h2>
            
            <div className="space-y-3">
                {tasks.map((task, index) => (
                    <div 
                        key={task.id}
                        className={`relative p-3 rounded-lg border-l-4 transition-all ${
                            task.status === 'completed' ? 'bg-[#111] border-gray-600 opacity-60' :
                            task.status === 'in-progress' ? 'bg-[#001a05] border-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.1)]' :
                            'bg-[#0a0a0a] border-gray-800 opacity-40'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                    task.status === 'in-progress' ? 'bg-[#00ff41] text-black' : 'bg-gray-800 text-gray-400'
                                }`}>
                                    {task.specialty}
                                </span>
                                <h3 className={`text-base font-bold mt-1 ${task.status === 'in-progress' ? 'text-white' : 'text-gray-400'}`}>
                                    {task.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5 uppercase">{task.workerName}</p>
                            </div>

                            {/* Tiempos */}
                            <div className="text-right font-mono text-xs">
                                {task.startTime && (
                                    <div className="text-gray-400">
                                        INICIO: <span className="text-white">{task.startTime}</span>
                                    </div>
                                )}
                                {task.status === 'in-progress' && task.recommendedEnd && (
                                    <div className="text-[#00ff41] mt-1">
                                        META: {task.recommendedEnd}
                                    </div>
                                )}
                                {task.status === 'completed' && task.endTime && (
                                    <div className="text-gray-500 mt-1">
                                        FIN: {task.endTime}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botón de Acción para Tarea Activa */}
                        {task.status === 'in-progress' && (
                            <button 
                                onClick={() => completeTask(task.id)}
                                className="mt-3 w-full py-3 bg-[#00ff41] hover:bg-[#00cc33] text-black font-bold uppercase text-sm rounded flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                            >
                                <span>✅</span> TERMINAR TURNO / TAREA
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>


        {/* --- FOOTER (NOTAS) --- */}
        <footer className="h-[25%] bg-[#111] border-t border-[#333] p-3 flex flex-col">
            <label className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex justify-between">
                <span>Notas / Solicitudes / Reportes</span>
                <span className="text-[#00ff41]">{notes.length > 0 ? '📝 Editando...' : ''}</span>
            </label>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escribe aquí si necesitas materiales, tuviste problemas o tienes dudas..."
                className="flex-1 w-full bg-[#0a0a0a] border border-[#333] rounded p-2 text-white text-sm focus:border-[#00ff41] focus:outline-none resize-none placeholder-gray-700"
            />
            <div className="mt-2 flex justify-end">
                <button 
                    className={`px-4 py-2 text-xs font-bold uppercase rounded transition-colors ${
                        notes.trim() ? 'bg-white text-black' : 'bg-gray-800 text-gray-500'
                    }`}
                    disabled={!notes.trim()}
                >
                    Enviar Reporte 📤
                </button>
            </div>
        </footer>

      </div>
    </div>
  );
}
