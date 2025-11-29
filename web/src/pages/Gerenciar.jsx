import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function Gerenciar() {
  const produtos = [
    {
      produto: "Parafuso Sextavado M5",
      uid: "A1-B2-C3-D4",
    },
    {
      produto: "Parafuso Sextavado M5",
      uid: "A1-B2-C3-D4",
    },
    {
      produto: "Parafuso Sextavado M5",
      uid: "A1-B2-C3-D4",
    },
    {
      produto: "Parafuso Sextavado M5",
      uid: "A1-B2-C3-D4",
    },
    {
      produto: "Parafuso Sextavado M5",
      uid: "A1-B2-C3-D4",
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-primary text-xl sm:text-2xl font-semibold uppercase tracking-wide">
          Gerenciamento de Produtos
        </h1>

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
      </div>

      {/* Tabela Desktop/Tablet */}
      <div className="hidden sm:block bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-300">
              <th className="text-left py-4 px-6 text-slate-700 font-semibold text-sm uppercase tracking-wide">
                Produto
              </th>
              <th className="text-left py-4 px-6 text-slate-700 font-semibold text-sm uppercase tracking-wide">
                ID da Etiqueta (UID)
              </th>
              <th className="text-center py-4 px-6 text-slate-700 font-semibold text-sm uppercase tracking-wide">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((item, index) => (
              <tr
                key={index}
                className={`border-t border-slate-200 hover:bg-slate-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                }`}
              >
                <td className="py-4 px-6 text-slate-800 font-medium">
                  {item.produto}
                </td>
                <td className="py-4 px-6 text-slate-600 font-mono text-sm">
                  {item.uid}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button className="bg-btnDelete hover:bg-red-700 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                      <FontAwesomeIcon icon={faTrash} className="text-sm" />
                    </button>
                    <button className="bg-btnEdit hover:bg-yellow-600 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="text-sm"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="sm:hidden space-y-3">
        {produtos.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm"
          >
            <div className="mb-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">
                Produto
              </p>
              <p className="text-slate-800 font-medium">{item.produto}</p>
            </div>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">
                ID da Etiqueta (UID)
              </p>
              <p className="text-slate-600 font-mono text-sm">{item.uid}</p>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button className="flex-1 bg-btnDelete hover:bg-red-700 text-white h-10 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                <span className="text-sm font-medium">Excluir</span>
              </button>
              <button className="flex-1 bg-btnEdit hover:bg-yellow-600 text-white h-10 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                <FontAwesomeIcon icon={faPenToSquare} className="text-sm" />
                <span className="text-sm font-medium">Editar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
