import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCsv,
  faMagnifyingGlass,
  faArrowUp,
  faArrowDown,
  faPenToSquare,
  faTrash,
  faCheck,
  faRightLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Historico() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Função auxiliar para configurar cores e ícones baseada no tipo (Igual ao Mobile adaptado para Web)
  const getStatusConfig = (tipo) => {
    const t = tipo ? tipo.toLowerCase() : "";

    switch (t) {
      case "entrada":
        return {
          label: "Entrada",
          icon: faArrowUp,
          style: "bg-green-50 text-green-700 border-green-200",
        };
      case "saida":
        return {
          label: "Saída",
          icon: faArrowDown,
          style: "bg-red-50 text-red-700 border-red-200",
        };
      case "leitura":
      case "movimentacao":
        return {
          label: "Movimento",
          icon: faRightLeft,
          style: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "editado":
        return {
          label: "Editado",
          icon: faPenToSquare,
          style: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "excluido":
        return {
          label: "Excluído",
          icon: faTrash,
          style: "bg-gray-50 text-gray-600 border-gray-200",
        };
      default:
        return {
          label: tipo || "Outro",
          icon: faCheck,
          style: "bg-slate-50 text-white border-slate-200",
        };
    }
  };

  const carregarDados = async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true);

      const [movimentosData, produtosData] = await Promise.all([
        api.getMovimentacoes(),
        api.getProdutos(),
      ]);

      const mapaProdutos = {};
      produtosData.forEach((p) => {
        if (p.nome) {
          mapaProdutos[p.nome.toLowerCase().trim()] = p.uid_etiqueta;
        }
      });

      const formatados = movimentosData.map((m) => {
        const dataObj = new Date(m.timestamp);
        const nomeProduto = m.nome || "Produto Deletado";
        const uidProduto = m.uid_etiqueta || "N/A";

        return {
          id: m.id,
          produto: nomeProduto,
          uid: uidProduto,
          tipo: m.tipo,
          dataObj: dataObj,
          data: dataObj.toLocaleDateString("pt-BR"),
          hora: dataObj.toLocaleTimeString("pt-BR"),
        };
      });

      formatados.sort((a, b) => b.dataObj - a.dataObj);
      setMovimentacoes(formatados);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      if (!silencioso) setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados(false);

    const interval = setInterval(() => {
      carregarDados(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const dadosFiltrados = movimentacoes.filter((item) => {
    const termo = busca.toLowerCase();
    const matchTexto =
      item.produto.toLowerCase().includes(termo) ||
      item.uid.toLowerCase().includes(termo);

    let matchData = true;
    if (dataInicio) {
      const inicio = new Date(dataInicio);
      inicio.setHours(0, 0, 0, 0);
      if (item.dataObj < inicio) matchData = false;
    }
    if (dataFim) {
      const fim = new Date(dataFim);
      fim.setHours(23, 59, 59, 999);
      if (item.dataObj > fim) matchData = false;
    }

    return matchTexto && matchData;
  });

  const exportarCSV = () => {
    if (dadosFiltrados.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }

    const csvContent = [
      ["UID", "Produto", "Tipo", "Data", "Hora"].join(";"),
      ...dadosFiltrados.map((p) =>
        [p.uid, p.produto, p.tipo, p.data, p.hora].join(";")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `historico_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 h-full flex flex-col bg-slate-100 min-h-screen">
      <div className="flex flex-col gap-4 mb-6 sm:mb-8 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h1 className="text-primary text-xl sm:text-2xl font-bold uppercase tracking-tight">
            Histórico de Movimentações
          </h1>

          <button
            onClick={exportarCSV}
            className="bg-primary text-white h-11 sm:h-12 w-full sm:w-auto px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all duration-150 cursor-pointer shadow-sm hover:shadow"
          >
            <p className="font-medium text-sm sm:text-base">Exportar</p>
            <span className="text-base sm:text-lg">
              <FontAwesomeIcon icon={faFileCsv} />
            </span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute right-4 sm:right-5 transform -translate-y-1/2 top-1/2 text-base sm:text-lg text-zinc-400"
            />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por produto ou UID..."
              className="w-full border border-zinc-400 bg-white rounded-lg h-11 sm:h-12 p-3 sm:p-4 pr-10 sm:pr-12 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm sm:text-base shadow-sm"
            />
          </div>

          <div className="flex gap-2 md:w-auto">
            <div className="flex-1 md:w-40 relative">
              <span className="absolute left-2 top-0.5 text-[10px] text-zinc-500 font-bold bg-white px-1 z-10">
                De
              </span>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full border border-zinc-400 bg-white rounded-lg h-11 sm:h-12 px-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm sm:text-base text-zinc-600 shadow-sm"
              />
            </div>
            <div className="flex-1 md:w-40 relative">
              <span className="absolute left-2 top-0.5 text-[10px] text-zinc-500 font-bold bg-white px-1 z-10">
                Até
              </span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full border border-zinc-400 bg-white rounded-lg h-11 sm:h-12 px-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm sm:text-base text-zinc-600 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-auto rounded-xl shadow-md border border-slate-300 max-h-[70vh]">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-primary sticky top-0 z-10 shadow-sm border-b border-slate-200">
              <th className="text-left py-4 px-6 text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                UID (Etiqueta)
              </th>
              <th className="text-left py-4 px-6 text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                Produto
              </th>
              {/* NOVA COLUNA AÇÃO */}
              <th className="text-center py-4 px-6 text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                Ação
              </th>
              <th className="text-left py-4 px-6 text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                Data
              </th>
              <th className="text-left py-4 px-6 text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                Hora
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-12">
                  <p className="text-slate-400 font-medium">Carregando...</p>
                </td>
              </tr>
            ) : dadosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <p className="font-medium text-white">
                      {busca || dataInicio || dataFim
                        ? "Nenhum resultado encontrado."
                        : "Nenhuma movimentação registrada."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              dadosFiltrados.map((item) => {
                const status = getStatusConfig(item.tipo);

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6 text-slate-500 text-sm font-mono">
                      {item.uid}
                    </td>
                    <td className="py-4 px-6 text-slate-800 font-semibold text-sm sm:text-base">
                      {item.produto}
                    </td>
                    
                    {/* CÉLULA AÇÃO COM BADGE */}
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${status.style}`}
                        >
                          <FontAwesomeIcon icon={status.icon} />
                          {status.label}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-white text-sm">
                      {item.data}
                    </td>
                    <td className="py-4 px-6 text-white text-sm">
                      {item.hora}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-2 sm:hidden text-center">
        ← Deslize para ver mais colunas →
      </p>
    </div>
  );
}