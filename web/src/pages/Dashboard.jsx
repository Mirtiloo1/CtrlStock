import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faBoxOpen,
  faQrcode,
  faArrowUp,
  faArrowDown,
  faChartPie,
  faRankingStar,
  faPenToSquare,
  faTrash,
  faRightLeft,
  faCalendarDay,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { CirclePlus, ClipboardClock } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import { api } from "../services/api.js";

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

const CORES_ACOES = {
  entrada: "#49975e",
  saida: "#BC4242",
  leitura: "#1d4ed8",
  movimentacao: "#1d4ed8",
  editado: "#b45309",
  excluido: "#6b7280",
};

const LABELS_ACOES = {
  entrada: "Entrada",
  saida: "Saída",
  leitura: "Movimentação",
  movimentacao: "Movimentação",
  editado: "Editado",
  excluido: "Excluído",
};

const FILTROS_PERIODO = [
  { label: "7 Dias", value: "semana" },
  { label: "30 Dias", value: "mes" },
  { label: "90 Dias", value: "trimestre" },
];

const TIPOS_VISUALIZACAO = [
  { label: "Barras", value: "bar" },
  { label: "Linha", value: "line" },
];

// ============================================================================
// HELPERS APRIMORADOS
// ============================================================================

const formatarDataHora = (isoString) => {
  if (!isoString) return { data: "--/--/----", hora: "--:--:--" };
  try {
    const dataObj = new Date(isoString);
    return {
      data: dataObj.toLocaleDateString("pt-BR"),
      hora: dataObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } catch {
    return { data: "--/--/----", hora: "--:--:--" };
  }
};

// Calcula estatísticas avançadas
const calcularEstatisticas = (movimentos, periodo) => {
  if (!movimentos || movimentos.length === 0) {
    return {
      media: 0,
      mediana: 0,
      maximo: 0,
      minimo: 0,
      total: 0,
      tendencia: "estavel",
    };
  }

  const now = new Date();
  const dias = periodo === "semana" ? 7 : periodo === "mes" ? 30 : 90;
  const movsRecentes = movimentos.filter((m) => {
    if (!m.timestamp) return false;
    const diff = now - new Date(m.timestamp);
    return diff <= dias * 24 * 60 * 60 * 1000;
  });

  // Agrupa por dia
  const porDia = {};
  movsRecentes.forEach((m) => {
    const data = new Date(m.timestamp).toLocaleDateString("pt-BR");
    porDia[data] = (porDia[data] || 0) + 1;
  });

  const valores = Object.values(porDia);
  const total = movsRecentes.length;
  const media = valores.length > 0 ? total / dias : 0;
  const ordenado = [...valores].sort((a, b) => a - b);
  const mediana =
    ordenado.length > 0 ? ordenado[Math.floor(ordenado.length / 2)] : 0;
  const maximo = Math.max(...valores, 0);
  const minimo = Math.min(...valores, 0);

  // Calcula tendência (compara primeira e segunda metade do período)
  const metade = Math.floor(dias / 2);
  const primeiraMetade = movsRecentes.filter((m) => {
    const diff = now - new Date(m.timestamp);
    return diff > metade * 24 * 60 * 60 * 1000;
  }).length;
  const segundaMetade = movsRecentes.length - primeiraMetade;

  let tendencia = "estavel";
  if (segundaMetade > primeiraMetade * 1.1) tendencia = "crescente";
  else if (segundaMetade < primeiraMetade * 0.9) tendencia = "decrescente";

  return { media, mediana, maximo, minimo, total, tendencia };
};

// ============================================================================
// COMPONENTES VISUAIS APRIMORADOS
// ============================================================================

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-300 shadow-lg rounded-lg text-xs z-50">
        <p className="font-bold text-slate-800 mb-1 text-[11px] sm:text-[13px]">
          {label}
        </p>
        <p className="text-primary font-semibold text-[11px] sm:text-[13px]">{`Movimentações: ${payload[0].value}`}</p>
        {payload[0].payload.detalhes && (
          <div className="mt-2 text-[11px] sm:text-[13px] text-slate-600">
            {Object.entries(payload[0].payload.detalhes).map(([tipo, qtd]) => (
              <p key={tipo}>
                {LABELS_ACOES[tipo]}: {qtd}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const UltimoItemCard = ({ loading, ultimoItem }) => {
  const { data, hora } = ultimoItem
    ? formatarDataHora(ultimoItem.timestamp)
    : { data: "--/--/----", hora: "--:--:--" };

  const getStatusInfo = (tipo) => {
    switch (tipo) {
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
          style: "bg-slate-50 text-slate-600 border-slate-200",
        };
    }
  };

  const status = ultimoItem ? getStatusInfo(ultimoItem.tipo) : null;
  return (
    <div className="w-full xl:w-[65%] bg-white p-6 md:p-8 rounded-lg flex flex-col shadow-md border border-slate-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-50 rounded-lg">
          <FontAwesomeIcon icon={faQrcode} className="text-primary text-xl" />
        </div>
        <h2 className="text-lg md:text-xl lg:text-2xl text-primary font-bold tracking-tight">
          Última atualização
        </h2>
        {status && (
          <span
            className={`ml-auto px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex gap-2 ${status.style}`}
          >
            <FontAwesomeIcon icon={status.icon} />
            {status.label}
          </span>
        )}
      </div>
      <hr className="border-t-2 border-gray-200 mb-8" />
      <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center sm:items-start flex-1">
        <div className="group relative bg-gradient-to-br from-zinc-100 to-zinc-200 border-2 border-dashed border-zinc-400 rounded-xl overflow-hidden flex items-center justify-center aspect-square w-40 sm:w-44 md:w-52 lg:w-60 flex-shrink-0 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
          {ultimoItem && ultimoItem.imagem ? (
            <>
              <img
                src={ultimoItem.imagem}
                alt={ultimoItem.nome || "Produto"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300"></div>
            </>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faCamera}
                className="text-4xl sm:text-5xl text-zinc-500"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-xl transition-all duration-300"></div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-4 flex-1 w-full justify-center">
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">
              Produto
            </p>
            <p className="text-base md:text-lg lg:text-xl text-gray-800 font-semibold truncate">
              {loading
                ? "Carregando..."
                : ultimoItem
                ? ultimoItem.nome || "Produto Desconhecido"
                : "Aguardando leitura..."}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">
              Data e Hora
            </p>
            <p className="text-base md:text-lg lg:text-xl text-gray-800 font-semibold font-mono">
              {data} {hora}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MovimentacoesHojeCard = ({
  loading,
  movimentacoesHoje,
  estatisticas,
}) => {
  const getTendenciaIcon = () => {
    if (estatisticas.tendencia === "crescente") return faArrowUp;
    if (estatisticas.tendencia === "decrescente") return faArrowDown;
    return faRightLeft;
  };

  const getTendenciaColor = () => {
    if (estatisticas.tendencia === "crescente") return "text-green-600";
    if (estatisticas.tendencia === "decrescente") return "text-red-600";
    return "text-blue-600";
  };

  return (
    <div className="w-full xl:w-[35%] bg-white rounded-lg flex flex-col shadow-md border border-slate-300">
      <div className="rounded-t-lg p-6 sm:p-10 flex flex-col items-center justify-center gap-6 flex-1 text-center">
        <FontAwesomeIcon
          icon={faBoxOpen}
          className="text-7xl sm:text-8xl text-neutral-300"
        />
        <div>
          <h1 className="font-bold text-secondary text-6xl sm:text-7xl">
            {loading ? "..." : movimentacoesHoje}
          </h1>
          <p className="text-primary font-bold text-lg sm:text-xl mt-2">
            Movimentações Hoje
          </p>
          {!loading && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <FontAwesomeIcon
                icon={getTendenciaIcon()}
                className={`text-sm ${getTendenciaColor()}`}
              />
              <span className={`text-xs font-medium ${getTendenciaColor()}`}>
                {estatisticas.tendencia === "crescente" && "Tendência de alta"}
                {estatisticas.tendencia === "decrescente" &&
                  "Tendência de baixa"}
                {estatisticas.tendencia === "estavel" && "Tendência estável"}
              </span>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => (window.location.href = "/historico")}
        className="flex bg-primary hover:bg-green-700 transition-all duration-150 w-full text-white justify-center gap-3 h-14 items-center rounded-b-lg cursor-pointer text-sm sm:text-base font-medium"
      >
        Ver Histórico Completo <CirclePlus className="w-5 h-5" />
      </button>
    </div>
  );
};

// ============================================================================
// GRÁFICO DE ATIVIDADE APRIMORADO
// ============================================================================

const AtividadeChart = ({
  chartData,
  loading,
  periodo,
  setPeriodo,
  onBarClick,
  diaSelecionado,
  tipoVisualizacao,
  setTipoVisualizacao,
  estatisticas,
  filtroTipo,
  setFiltroTipo,
}) => {
  const dadosFiltrados = useMemo(() => {
    if (filtroTipo === "todos") return chartData;
    return chartData.map((dia) => ({
      ...dia,
      quantidade: dia.detalhes?.[filtroTipo] || 0,
    }));
  }, [chartData, filtroTipo]);

  return (
    <div className="w-full bg-white rounded-lg flex flex-col shadow-md border border-slate-300 p-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarDay} className="text-primary" />
            Fluxo de Atividades
          </h3>
          <p className="text-sm text-slate-500">
            {periodo === "semana" && "Últimos 7 dias"}
            {periodo === "mes" && "Últimos 30 dias"}
            {periodo === "trimestre" && "Últimos 90 dias"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Filtro de Período */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {FILTROS_PERIODO.map((filtro) => (
              <button
                key={filtro.value}
                onClick={() => {
                  setPeriodo(filtro.value);
                  onBarClick(null);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                  periodo === filtro.value
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>

          {/* Filtro de Tipo */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 border-none cursor-pointer"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
            <option value="movimentacao">Movimentações</option>
          </select>

          {/* Tipo de Visualização */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {TIPOS_VISUALIZACAO.map((tipo) => (
              <button
                key={tipo.value}
                onClick={() => setTipoVisualizacao(tipo.value)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                  tipoVisualizacao === tipo.value
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Média/Dia</p>
            <p className="text-lg font-bold text-slate-800">
              {estatisticas.media.toFixed(1)}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Máximo</p>
            <p className="text-lg font-bold text-slate-800">
              {estatisticas.maximo}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Mínimo</p>
            <p className="text-lg font-bold text-slate-800">
              {estatisticas.minimo}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Total</p>
            <p className="text-lg font-bold text-slate-800">
              {estatisticas.total}
            </p>
          </div>
        </div>
      )}

      <div className="w-full h-[300px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-slate-400 font-medium">Carregando gráfico...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            {tipoVisualizacao === "bar" ? (
              <BarChart
                data={dadosFiltrados}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    onBarClick(data.activePayload[0].payload);
                  }
                }}
                cursor="pointer"
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  dy={10}
                  interval={
                    periodo === "trimestre" ? 5 : periodo === "mes" ? 2 : 0
                  }
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f1f5f9", opacity: 0.6 }}
                />
                <Bar
                  dataKey="quantidade"
                  radius={[4, 4, 0, 0]}
                  barSize={
                    periodo === "trimestre" ? 8 : periodo === "mes" ? 15 : 40
                  }
                >
                  {dadosFiltrados.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        diaSelecionado &&
                        diaSelecionado.fullDate === entry.fullDate
                          ? "#166534"
                          : filtroTipo !== "todos"
                          ? CORES_ACOES[filtroTipo]
                          : "#49975e"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart
                data={dadosFiltrados}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    onBarClick(data.activePayload[0].payload);
                  }
                }}
                cursor="pointer"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  dy={10}
                  interval={
                    periodo === "trimestre" ? 5 : periodo === "mes" ? 2 : 0
                  }
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "#49975e", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="quantidade"
                  stroke={
                    filtroTipo !== "todos" ? CORES_ACOES[filtroTipo] : "#49975e"
                  }
                  strokeWidth={3}
                  dot={{
                    fill:
                      filtroTipo !== "todos"
                        ? CORES_ACOES[filtroTipo]
                        : "#49975e",
                    r: 4,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Detalhes do Dia Selecionado */}
      {diaSelecionado && (
        <div className="mt-6 border-t border-slate-100 pt-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-bold text-slate-800 flex items-center gap-2">
              Detalhes de {diaSelecionado.name}
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {diaSelecionado.fullDate}
              </span>
            </h4>
            <button
              onClick={() => onBarClick(null)}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {diaSelecionado.logsDoDia && diaSelecionado.logsDoDia.length > 0 ? (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-[200px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Hora</th>
                    <th className="px-3 py-2">Produto</th>
                    <th className="px-3 py-2 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {diaSelecionado.logsDoDia.map((log, idx) => {
                    const { hora } = formatarDataHora(log.timestamp);
                    return (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 last:border-0 hover:bg-white"
                      >
                        <td className="px-3 py-2 font-mono text-slate-600">
                          {hora}
                        </td>
                        <td className="px-3 py-2 font-medium text-slate-800">
                          {log.nome || "Desconhecido"}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.tipo === "entrada"
                                ? "bg-green-100 text-green-800"
                                : log.tipo === "saida"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {log.tipo ? log.tipo.toUpperCase() : "MOV"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic text-center py-4">
              Sem detalhes registrados para este dia.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const DistribuicaoPieChart = ({ pieData, loading, periodo, setPeriodo }) => {
  return (
    <div className="bg-white w-full lg:w-[40%] rounded-lg flex flex-col shadow-md border border-slate-300 p-6 min-w-0">
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faChartPie} className="text-primary" />
            <h3 className="text-lg font-bold text-slate-800">Distribuição</h3>
          </div>
        </div>

        {/* Filtros - Apenas período */}
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {FILTROS_PERIODO.map((filtro) => (
              <button
                key={filtro.value}
                onClick={() => setPeriodo(filtro.value)}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all duration-200 ${
                  periodo === filtro.value
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-slate-400 font-medium">Carregando...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={32} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const TopProdutosChart = ({
  topProductsData,
  loading,
  periodo,
  setPeriodo,
  filtroTipo,
  setFiltroTipo,
}) => {
  // Define a cor baseada no tipo de filtro selecionado
  const getCorFiltro = () => {
    if (filtroTipo === "todos") return "#49975e";
    return CORES_ACOES[filtroTipo] || "#3273F5";
  };

  return (
    <div className="bg-white w-full lg:w-[60%] rounded-lg flex flex-col shadow-md border border-slate-300 p-6 min-w-0">
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faRankingStar} className="text-primary" />
            <h3 className="text-lg font-bold text-slate-800">Top Produtos</h3>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {FILTROS_PERIODO.map((filtro) => (
              <button
                key={filtro.value}
                onClick={() => setPeriodo(filtro.value)}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all duration-200 ${
                  periodo === filtro.value
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700 border-none cursor-pointer"
          >
            <option value="todos">Todos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
            <option value="movimentacao">Movimentações</option>
          </select>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-slate-400 font-medium">Carregando...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              layout="vertical"
              data={topProductsData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={80}
                tick={{ fontSize: 11, fill: "#475569" }}
                interval={0}
              />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                {topProductsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCorFiltro()} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const LogAtividades = ({ loading, recentLogs }) => {
  const getEstilo = (tipo) => {
    const t = tipo ? tipo.toLowerCase() : "entrada";
    if (t === "saida")
      return {
        bg: "bg-red-600/10",
        text: "text-btnDelete",
        border: "border-red-200",
        label: "Saída",
        icon: faArrowDown,
      };
    if (t === "entrada")
      return {
        bg: "bg-green-600/10",
        text: "text-green-800",
        border: "border-green-200",
        label: "Entrada",
        icon: faArrowUp,
      };
    if (t === "leitura" || t === "movimentacao")
      return {
        bg: "bg-blue-600/10",
        text: "text-blue-800",
        border: "border-blue-200",
        label: "Movimentação",
        icon: faRightLeft,
      };
    if (t === "editado")
      return {
        bg: "bg-amber-600/10",
        text: "text-amber-800",
        border: "border-amber-200",
        label: "Editado",
        icon: faPenToSquare,
      };
    if (t === "excluido")
      return {
        bg: "bg-gray-600/10",
        text: "text-gray-800",
        border: "border-gray-200",
        label: "Excluído",
        icon: faTrash,
      };
    return {
      bg: "bg-slate-600/10",
      text: "text-slate-800",
      border: "border-slate-200",
      label: "Outro",
      icon: faRightLeft,
    };
  };

  return (
    <div className="w-full bg-white p-6 md:p-8 rounded-xl flex flex-col shadow-md border border-slate-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-50 rounded-lg text-primary border border-green-100">
          <ClipboardClock className="text-xl" />
        </div>
        <h2 className="text-lg md:text-xl lg:text-2xl text-slate-800 font-bold tracking-tight">
          Log de Atividades
        </h2>
      </div>
      <hr className="border-t border-slate-100 mb-6" />
      <div className="flex flex-col">
        {loading ? (
          <p className="text-slate-400 text-center py-8">Carregando...</p>
        ) : recentLogs.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">
              Nenhuma atividade recente.
            </p>
          </div>
        ) : (
          recentLogs.map((log) => {
            const { data, hora } = formatarDataHora(log.timestamp);
            const s = getEstilo(log.tipo);
            return (
              <div
                key={log.id}
                className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors rounded-lg px-3 group"
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border ${s.bg} ${s.text} ${s.border}`}
                  >
                    <FontAwesomeIcon icon={s.icon} className="text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-800 font-bold text-sm sm:text-base group-hover:text-black transition-colors">
                      {log.nome || "Produto Desconhecido"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {data} • {hora}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-md tracking-wider uppercase border ${s.bg} ${s.text} ${s.border}`}
                >
                  {s.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default function Dashboard() {
  const [data, setData] = useState({
    chart: [],
    topProd: [],
    pie: [],
    logs: [],
    movsHoje: 0,
    ultimo: null,
    todosMovimentos: [],
    estatisticas: {
      media: 0,
      mediana: 0,
      maximo: 0,
      minimo: 0,
      total: 0,
      tendencia: "estavel",
    },
  });

  const [loading, setLoading] = useState(true);
  const [periodoGrafico, setPeriodoGrafico] = useState("semana");
  const [periodoPie, setPeriodoPie] = useState("semana");
  const [periodoTop, setPeriodoTop] = useState("semana");
  const [tipoVisualizacao, setTipoVisualizacao] = useState("bar");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroTipoTop, setFiltroTipoTop] = useState("todos");
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  const calcularPieData = useCallback((movimentos, periodo) => {
    const now = new Date();
    const dias = periodo === "semana" ? 7 : periodo === "mes" ? 30 : 90;

    const movsRecentes = movimentos.filter((m) => {
      if (!m.timestamp) return false;
      const diff = now - new Date(m.timestamp);
      return diff <= dias * 24 * 60 * 60 * 1000;
    });

    const actionCounts = {
      entrada: 0,
      saida: 0,
      movimentacao: 0,
      editado: 0,
      excluido: 0,
    };

    for (const m of movsRecentes) {
      let type = m.tipo ? m.tipo.toLowerCase() : "entrada";
      if (type === "leitura") type = "movimentacao";
      if (actionCounts[type] !== undefined) {
        actionCounts[type]++;
      }
    }

    return Object.entries(actionCounts)
      .filter(([, v]) => v > 0)
      .map(([t, v]) => ({
        name: LABELS_ACOES[t],
        value: v,
        color: CORES_ACOES[t],
      }));
  }, []);

  const calcularTopProdutos = useCallback((movimentos, periodo, filtro) => {
    const now = new Date();
    const dias = periodo === "semana" ? 7 : periodo === "mes" ? 30 : 90;

    const movsRecentes = movimentos.filter((m) => {
      if (!m.timestamp) return false;
      const diff = now - new Date(m.timestamp);
      const dentroPerido = diff <= dias * 24 * 60 * 60 * 1000;

      if (!dentroPerido) return false;
      if (filtro === "todos") return true;

      let type = m.tipo ? m.tipo.toLowerCase() : "entrada";
      if (type === "leitura") type = "movimentacao";
      return type === filtro;
    });

    const productCounts = {};
    for (const m of movsRecentes) {
      const pName = m.nome || "Desconhecido";
      productCounts[pName] = (productCounts[pName] || 0) + 1;
    }

    return Object.entries(productCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, []);

  const processarGrafico = useCallback((movimentos, periodo) => {
    const now = new Date();
    const dias = periodo === "semana" ? 7 : periodo === "mes" ? 30 : 90;
    const chartData = [];
    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    // Define o intervalo de agrupamento baseado no período
    let intervalo = 1;
    if (periodo === "mes") intervalo = 3;
    if (periodo === "trimestre") intervalo = 7;

    for (let i = dias - 1; i >= 0; i -= intervalo) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const fullDate = d.toLocaleDateString("pt-BR");
      const shortDate = `${d.getDate()}/${d.getMonth() + 1}`;

      const logsDoPeriodo = [];
      const detalhesPeriodo = {
        entrada: 0,
        saida: 0,
        movimentacao: 0,
        editado: 0,
        excluido: 0,
      };

      chartData.push({
        name: periodo === "semana" ? daysOfWeek[d.getDay()] : shortDate,
        fullDate: fullDate,
        quantidade: 0,
        logsDoDia: logsDoPeriodo,
        detalhes: detalhesPeriodo,
      });
    }

    // Popula com dados reais
    movimentos.forEach((m) => {
      if (!m.timestamp) return;
      const mDate = new Date(m.timestamp);

      for (let i = 0; i < chartData.length; i++) {
        const bucket = chartData[i];
        const bucketDate = bucket.fullDate.split("/");
        const bucketDay = parseInt(bucketDate[0]);
        const bucketMonth = parseInt(bucketDate[1]) - 1;
        const bucketYear = parseInt(bucketDate[2]);

        const bucketStart = new Date(bucketYear, bucketMonth, bucketDay);
        const bucketEnd = new Date(bucketStart);
        bucketEnd.setDate(
          bucketEnd.getDate() +
            (periodo === "mes" ? 3 : periodo === "trimestre" ? 7 : 1)
        );

        if (mDate >= bucketStart && mDate < bucketEnd) {
          chartData[i].quantidade++;
          chartData[i].logsDoDia.push(m);

          let tipo = m.tipo ? m.tipo.toLowerCase() : "entrada";
          if (tipo === "leitura") tipo = "movimentacao";
          if (chartData[i].detalhes[tipo] !== undefined) {
            chartData[i].detalhes[tipo]++;
          }
          break;
        }
      }
    });

    chartData.forEach((day) => {
      day.logsDoDia.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    });

    return chartData;
  }, []);

  const carregarDados = useCallback(
    async (silencioso = false) => {
      try {
        if (!silencioso) setLoading(true);

        const dataAPI = await api.getMovimentacoes();

        const movimentosReais = Array.isArray(dataAPI)
          ? dataAPI.map((m) => ({
              id: m.id,
              timestamp: m.timestamp,
              nome: m.nome || "Produto Desconhecido",
              tipo: m.tipo,
              imagem: m.imagem || null,
            }))
          : [];

        const sortedMovs = [...movimentosReais].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        const now = new Date();
        const todayDate = now.getDate();
        const todayMonth = now.getMonth();
        const todayYear = now.getFullYear();

        let todayCount = 0;
        const productCounts = {};
        const actionCounts = {
          entrada: 0,
          saida: 0,
          movimentacao: 0,
          editado: 0,
          excluido: 0,
        };

        for (const m of sortedMovs) {
          if (!m.timestamp) continue;
          const mDate = new Date(m.timestamp);

          if (
            mDate.getDate() === todayDate &&
            mDate.getMonth() === todayMonth &&
            mDate.getFullYear() === todayYear
          ) {
            todayCount++;
          }

          const pName = m.nome || "Desconhecido";
          productCounts[pName] = (productCounts[pName] || 0) + 1;

          let type = m.tipo ? m.tipo.toLowerCase() : "entrada";
          if (type === "leitura") type = "movimentacao";
          if (actionCounts[type] !== undefined) actionCounts[type]++;
        }

        const topProductsData = Object.entries(productCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        const pieData = Object.entries(actionCounts)
          .filter(([, v]) => v > 0)
          .map(([t, v]) => ({
            name: LABELS_ACOES[t],
            value: v,
            color: CORES_ACOES[t],
          }));

        const recentLogs = sortedMovs
          .slice(0, 5)
          .map((m) => ({ ...m, tipo: m.tipo || "entrada" }));

        const chartData = processarGrafico(sortedMovs, periodoGrafico);
        const estatisticas = calcularEstatisticas(sortedMovs, periodoGrafico);

        setData({
          chart: chartData,
          topProd: topProductsData,
          pie: pieData,
          logs: recentLogs,
          movsHoje: todayCount,
          ultimo: sortedMovs[0] || null,
          todosMovimentos: sortedMovs,
          estatisticas,
        });
      } catch (e) {
        console.error("Erro ao carregar dados do dashboard:", e);
      } finally {
        if (!silencioso) setLoading(false);
      }
    },
    [periodoGrafico, processarGrafico]
  );

  useEffect(() => {
    if (data.todosMovimentos.length > 0) {
      const novoGrafico = processarGrafico(
        data.todosMovimentos,
        periodoGrafico
      );
      const novasEstatisticas = calcularEstatisticas(
        data.todosMovimentos,
        periodoGrafico
      );
      const novoPie = calcularPieData(data.todosMovimentos, periodoPie);
      const novoTop = calcularTopProdutos(
        data.todosMovimentos,
        periodoTop,
        filtroTipoTop
      );

      setData((prev) => ({
        ...prev,
        chart: novoGrafico,
        estatisticas: novasEstatisticas,
        pie: novoPie,
        topProd: novoTop,
      }));
    }
  }, [
    periodoGrafico,
    periodoPie,
    periodoTop,
    filtroTipoTop,
    processarGrafico,
    calcularPieData,
    calcularTopProdutos,
    data.todosMovimentos,
  ]);

  useEffect(() => {
    carregarDados(false);
    const intervalo = setInterval(() => carregarDados(true), 30000);
    return () => clearInterval(intervalo);
  }, [carregarDados]);

  return (
    <main className="p-4 px-6 sm:px-8 md:px-10 lg:px-12 h-full flex flex-col gap-8 bg-slate-100 min-h-screen">
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-stretch">
        <UltimoItemCard loading={loading} ultimoItem={data.ultimo} />
        <MovimentacoesHojeCard
          loading={loading}
          movimentacoesHoje={data.movsHoje}
          estatisticas={data.estatisticas}
        />
      </div>

      <AtividadeChart
        chartData={data.chart}
        loading={loading}
        periodo={periodoGrafico}
        setPeriodo={setPeriodoGrafico}
        onBarClick={setDiaSelecionado}
        diaSelecionado={diaSelecionado}
        tipoVisualizacao={tipoVisualizacao}
        setTipoVisualizacao={setTipoVisualizacao}
        estatisticas={data.estatisticas}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
      />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <DistribuicaoPieChart
          pieData={data.pie}
          loading={loading}
          periodo={periodoPie}
          setPeriodo={setPeriodoPie}
        />
        <TopProdutosChart
          topProductsData={data.topProd}
          loading={loading}
          periodo={periodoTop}
          setPeriodo={setPeriodoTop}
          filtroTipo={filtroTipoTop}
          setFiltroTipo={setFiltroTipoTop}
        />
      </div>
      <LogAtividades loading={loading} recentLogs={data.logs} />
    </main>
  );
}
