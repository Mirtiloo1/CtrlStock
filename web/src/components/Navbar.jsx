import ButtonLogar from "./ButtonLogar";
import UsuarioLogado from "./UsuarioLogado";

function Navbar() {
  return (
    <nav className="bg-secondary w-full h-16 sm:h-18 md:h-20 lg:h-22 flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 font-roboto">
      <h1 className="text-white font-poppins font-bold text-base sm:text-lg md:text-xl lg:text-2xl cursor-pointer transition-all duration-200 hover:opacity-90">
        CtrlStock
      </h1>
      
      <div className="flex justify-center">
        <div className="bg-zinc-100 backdrop-blur-sm rounded-lg px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm md:text-base font-medium text-secondary">
            Status:
          </span>
          <span className="text-xs sm:text-sm md:text-base font-semibold text-primary">
            Conectado
          </span>
          <div className="relative">
            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 bg-primary rounded-full animate-pulse"></div>
            <div className="absolute inset-0 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-primary rounded-full animate-ping opacity-75"></div>
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