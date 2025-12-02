import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCsv,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Historico() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

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
        const nomeProduto = m.produto_nome || "Produto Deletado";

        const uidEncontrado =
          mapaProdutos[nomeProduto.toLowerCase().trim()] ||
          m.uid_etiqueta ||
          m.tag_uid ||
          "N/A";

        return {
          id: m.id,
          produto: nomeProduto,
          uid: uidEncontrado,
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
      ["UID", "Produto", "Data", "Hora"].join(";"),
      ...dadosFiltrados.map((p) =>
        [p.uid, p.produto, p.data, p.hora].join(";")
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
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 h-full flex flex-col">
      <div className="flex flex-col gap-4 mb-6 sm:mb-8 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h1 className="text-primary text-xl sm:text-2xl font-medium uppercase">
            Histórico de Movimentações
          </h1>

          <button
            onClick={exportarCSV}
            className="bg-primary text-white h-11 sm:h-12 w-full sm:w-auto px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-botao transition-all duration-150 cursor-pointer"
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
              className="absolute right-4 sm:right-5 transform -translate-y-1/2 top-1/2 text-base sm:text-lg text-zinc-600"
            />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por produto ou UID..."
              className="w-full border-2 bg-white border-zinc-400 rounded-lg h-11 sm:h-12 p-3 sm:p-4 pr-10 sm:pr-12 focus:border-primary focus:outline-none transition-colors text-sm sm:text-base"
            />
          </div>

          <div className="flex gap-2 md:w-auto">
            <div className="flex-1 md:w-40 relative">
              <span className="absolute left-2 top-0.5 text-[10px] text-zinc-500 font-bold bg-white px-1">
                De
              </span>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full border-2 bg-white border-zinc-400 rounded-lg h-11 sm:h-12 px-3 focus:border-primary focus:outline-none text-sm sm:text-base text-zinc-600"
              />
            </div>
            <div className="flex-1 md:w-40 relative">
              <span className="absolute left-2 top-0.5 text-[10px] text-zinc-500 font-bold bg-white px-1">
                Até
              </span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full border-2 bg-white border-zinc-400 rounded-lg h-11 sm:h-12 px-3 focus:border-primary focus:outline-none text-sm sm:text-base text-zinc-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-auto rounded-lg shadow-sm max-h-[70vh] border border-slate-200">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-zinc-300 sticky top-0 z-10 shadow-sm">
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
                UID (Etiqueta)
              </th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
                Produto
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
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-8">
                  Carregando...
                </td>
              </tr>
            ) : dadosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  {busca || dataInicio || dataFim
                    ? "Nenhum resultado encontrado."
                    : "Nenhuma movimentação registrada."}
                </td>
              </tr>
            ) : (
              dadosFiltrados.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-200 hover:bg-emerald-50/50 transition-colors duration-200"
                >
                  <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-600 text-sm sm:text-base font-mono">
                    {item.uid}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-800 font-medium text-sm sm:text-base">
                    {item.produto}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-600 text-sm sm:text-base">
                    {item.data}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-600 text-sm sm:text-base">
                    {item.hora}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-2 sm:hidden text-center">
        ← Deslize para ver mais colunas →
      </p>
    </div>
  );
}
