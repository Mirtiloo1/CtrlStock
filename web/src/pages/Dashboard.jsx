import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faBarcode,
  faBoxOpen,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import { CirclePlus, ClipboardClock } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="p-4 px-10 sm:p-6 md:p-8 lg:p-10 xl:p-12 h-full flex flex-col gap-14">
    
      <div className="w-full bg-white p-8 md:p-10 rounded-lg flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <FontAwesomeIcon icon={faQrcode} className="text-primary text-xl" />
          <h2 className="text-lg md:text-xl lg:text-2xl text-primary font-bold tracking-tight">
            Último Item Escaneado
          </h2>
        </div>

        <hr className="border-t-2 border-gray-200 mb-8" />

        <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center sm:items-start">
          <div className="group relative bg-gradient-to-br from-zinc-200 to-zinc-300 border-2 border-zinc-400 rounded-xl border-dashed flex items-center justify-center aspect-square w-40 sm:w-44 md:w-52 lg:w-60 flex-shrink-0 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
            <FontAwesomeIcon
              icon={faCamera}
              className="text-zinc-500 text-4xl sm:text-5xl md:text-6xl group-hover:text-zinc-600 transition-colors duration-300"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-xl transition-all duration-300"></div>
          </div>
          <div className="flex flex-col gap-4 flex-1 w-full">
            <div className="bg-white rounded-lg p-4 ">
              <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">
                Produto
              </p>
              <p className="text-base md:text-lg lg:text-xl text-gray-800 font-semibold">
                Aguardando leitura...
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">
                Data e Hora
              </p>
              <p className="text-base md:text-lg lg:text-xl text-gray-800 font-semibold font-mono">
                --/--/---- --:--:--
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="h-2 w-2 bg-amber-400 rounded-full"></div>
            <span className="text-sm text-amber-700 font-medium">
              Aguardando escaneamento
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6 lg:gap-8">
        <div className="bg-white w-full lg:w-[48%] rounded-lg flex flex-col">
          <div className="rounded-t-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 flex-1">
            <div className="flex flex-col text-center sm:text-left">
              <h1 className="font-bold text-secondary text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                30
              </h1>
              <p className="text-primary font-bold text-lg sm:text-xl md:text-2xl mt-2">
                Produtos Cadastrados
              </p>
            </div>
            <FontAwesomeIcon
              icon={faBarcode}
              className="text-7xl sm:text-8xl md:text-9xl text-neutral-300 flex-shrink-0"
            />
          </div>
          <button className="flex bg-primary hover:bg-botao transition-all duration-150 w-full text-white justify-center gap-3 sm:gap-4 h-12 sm:h-14 items-center rounded-b-lg cursor-pointer text-sm sm:text-base font-medium">
            Mais informações
            <CirclePlus className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white w-full lg:w-[48%] rounded-lg flex flex-col">
          <div className="rounded-t-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 flex-1">
            <div className="flex flex-col text-center sm:text-left">
              <h1 className="font-bold text-secondary text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                15
              </h1>
              <p className="text-primary font-bold text-lg sm:text-xl md:text-2xl mt-2">
                Movimentações Hoje
              </p>
            </div>
            <FontAwesomeIcon
              icon={faBoxOpen}
              className="text-7xl sm:text-8xl md:text-9xl text-neutral-300 flex-shrink-0"
            />
          </div>
          <button className="flex bg-primary hover:bg-botao transition-all duration-150 w-full text-white justify-center gap-3 sm:gap-4 h-12 sm:h-14 items-center rounded-b-lg cursor-pointer text-sm sm:text-base font-medium">
            Mais informações
            <CirclePlus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="w-full bg-white p-8 md:p-10 rounded-lg flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardClock className="text-primary text-xl" />
          <h2 className="text-lg md:text-xl lg:text-2xl text-primary font-bold tracking-tight">
            Log de Atividades
          </h2>
        </div>
        <hr className="border-t-2 border-gray-200 mb-8" />

        <p>Nenhuma atividade recente.</p>
      </div>
    </main>
  );
}
