import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCsv,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export default function Historico() {
  const produtos = [
    {
      produto: "Parafuso Sextavado M5",
      uid: "A1-B2-C3-D4",
      data: "22/09/2025",
      hora: "16:50:01",
    },
    {
      produto: "Fita Isolante 10m",
      uid: "E5-F6-G7-H8",
      data: "22/09/2025",
      hora: "16:49:32",
    },
    {
      produto: "Chave Phillips Média",
      uid: "I9-J0-K1-L2",
      data: "22/09/2025",
      hora: "16:50:01",
    },
    {
      produto: "Porca M5",
      uid: "A1-B2-C3-D4",
      data: "22/09/2025",
      hora: "16:50:01",
    },
    {
      produto: "Parafuso Sextavado M5",
      uid: "A1-B2-C3-D4",
      data: "22/09/2025",
      hora: "16:50:01",
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <h1 className="text-primary text-xl sm:text-2xl font-medium">
          HISTÓRICO DE MOVIMENTAÇÕES
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-12 lg:ml-auto">
          <div className="relative flex-1 sm:flex-none">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute right-4 sm:right-5 transform -translate-y-1/2 top-1/2 text-base sm:text-lg text-zinc-600"
            />
            <input
              type="text"
              name="buscar"
              placeholder="Buscar produtos..."
              className="w-full border-2 bg-white border-zinc-400 rounded-lg h-11 sm:h-12 sm:w-64 md:w-80 p-3 sm:p-4 pr-10 sm:pr-12 focus:border-primary focus:outline-none transition-colors text-sm sm:text-base"
            />
          </div>
          <button className="bg-primary text-white h-11 sm:h-12 w-full sm:w-32 rounded-lg flex items-center justify-center gap-2 hover:bg-botao transition-all duration-150 cursor-pointer">
            <p className="font-medium text-sm sm:text-base">Exportar</p>
            <span className="text-base sm:text-lg">
              <FontAwesomeIcon icon={faFileCsv} />
            </span>
          </button>
        </div>
      </div>

      {/* Tabela Responsiva */}
      <div className="bg-white overflow-x-auto mt-6 sm:mt-8 lg:mt-12 rounded-lg shadow-sm">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-zinc-300">
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
                Produto
              </th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
                ID da Etiqueta (UID)
              </th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
                Data
              </th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
                Hora
              </th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((item, index) => (
              <tr
                key={index}
                className="border-t border-slate-200 hover:bg-emerald-50/50 transition-colors duration-200"
              >
                <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-800 font-medium text-sm sm:text-base">
                  {item.produto}
                </td>
                <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-600 font-mono text-xs sm:text-sm">
                  {item.uid}
                </td>
                <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-600 text-sm sm:text-base">
                  {item.data}
                </td>
                <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-600 text-sm sm:text-base">
                  {item.hora}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensagem de scroll para mobile */}
      <p className="text-xs text-slate-500 mt-2 sm:hidden text-center">
        ← Deslize para ver mais colunas →
      </p>
    </div>
  );
}
