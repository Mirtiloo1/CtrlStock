import { useState, useEffect } from "react";
import ButtonLogar from "./ButtonLogar";
import { api } from "../services/api"; 

function Navbar() {
  const [modo, setModo] = useState("entrada");

  useEffect(() => {
    const verificarStatus = async () => {
      try {
        const dados = await api.getDeviceStatus();

        if (dados && dados.success && dados.state) {
          setModo(dados.state.mode);
        }
      } catch (error) {
        console.error("Erro ao buscar status:", error);
      }
    };
    verificarStatus();
    const intervalo = setInterval(verificarStatus, 2000);

    return () => clearInterval(intervalo);
  }, []);

  const isEntrada = modo === "entrada";

  return (
    <nav className="bg-secondary w-full h-16 sm:h-18 md:h-20 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 font-roboto sticky top-0 z-50 shadow-lg border-b border-green-800/30 transition-all">
      <div className="flex items-center gap-3 cursor-pointer group transition-all duration-200 hover:opacity-90">
        <h1 className="text-white font-poppins font-bold text-lg sm:text-xl md:text-2xl tracking-tight">
          CtrlStock
        </h1>
      </div>

      <div className="hidden sm:flex justify-center">
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
          <span className="text-xs sm:text-sm font-bold text-secondary uppercase tracking-wide">
            Status:
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm font-bold transition-colors duration-300 uppercase ${
                isEntrada ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isEntrada ? "Entrada" : "Saída"}
            </span>
            <div className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isEntrada ? "bg-emerald-400" : "bg-red-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 transition-colors duration-300 ${
                  isEntrada ? "bg-emerald-500" : "bg-red-500"
                }`}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        <ButtonLogar />
      </div>
    </nav>
  );
}

export default Navbar;
