import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faBoxOpen,
  faQrcode,
  faArrowUp,
  faArrowDown,
  faChartPie,
  faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import { CirclePlus, ClipboardClock } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
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
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  const [chartData, setChartData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [movimentacoesHoje, setMovimentacoesHoje] = useState(0);
  const [ultimoItem, setUltimoItem] = useState(null);

  const [loading, setLoading] = useState(true);

  const COLORS = ["#49975e", "#BC4242"]; //verde e vermelho

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

  const carregarDados = async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true);

      const movimentos = await api.getMovimentacoes();

      const hoje = new Date();
      const movsHoje = movimentos.filter((m) => {
        if (!m.timestamp) return false;
        const dataMov = new Date(m.timestamp);
        return (
          dataMov.getDate() === hoje.getDate() &&
          dataMov.getMonth() === hoje.getMonth() &&
          dataMov.getFullYear() === hoje.getFullYear()
        );
      });
      setMovimentacoesHoje(movsHoje.length);

      if (movimentos.length > 0) {
        movimentos.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setUltimoItem(movimentos[0]);
      }

      const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      const dadosGrafico = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        const nomeDia = diasDaSemana[d.getDay()];
        const count = movimentos.filter((m) => {
          const dataM = new Date(m.timestamp);
          return (
            dataM.getDate() === d.getDate() && dataM.getMonth() === d.getMonth()
          );
        }).length;

        dadosGrafico.push({ name: nomeDia, quantidade: count });
      }
      setChartData(dadosGrafico);

      const contagemProdutos = {};
      movimentos.forEach((m) => {
        const nome = m.produto_nome || "Desconhecido";
        contagemProdutos[nome] = (contagemProdutos[nome] || 0) + 1;
      });

      const rankingProdutos = Object.entries(contagemProdutos)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setTopProductsData(rankingProdutos);

      let entradas = 0;
      let saidas = 0;
      movimentos.forEach((m) => {
        if (m.tipo === "saida") saidas++;
        else entradas++;
      });
      setPieData([
        { name: "Entradas", value: entradas },
        { name: "Saídas", value: saidas },
      ]);

      const ultimos5 = movimentos.slice(0, 5).map((m) => ({
        ...m,
        tipo: m.tipo || "entrada",
      }));
      setRecentLogs(ultimos5);
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

  const ultimaDataHora = ultimoItem
    ? formatarDataHora(ultimoItem.timestamp)
    : { data: "--/--/----", hora: "--:--:--" };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-300 shadow-lg rounded-lg text-xs">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          <p className="text-primary font-semibold">{`Qtd: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="p-4 px-6 sm:px-8 md:px-10 lg:px-12 h-full flex flex-col gap-8 bg-slate-100 min-h-screen">
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-stretch">
        <div className="w-full xl:w-[65%] bg-white p-6 md:p-8 rounded-lg flex flex-col shadow-md border border-slate-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <FontAwesomeIcon
                icon={faQrcode}
                className="text-primary text-xl"
              />
            </div>
            <h2 className="text-lg md:text-xl lg:text-2xl text-primary font-bold tracking-tight">
              Último Item Escaneado
            </h2>
          </div>

          <hr className="border-t-2 border-gray-200 mb-8" />

          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center sm:items-start flex-1">
            <div className="group relative bg-gradient-to-br from-zinc-100 to-zinc-200 border-2 border-zinc-400 rounded-xl border-dashed flex items-center justify-center aspect-square w-40 sm:w-44 md:w-52 lg:w-60 flex-shrink-0 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
              <FontAwesomeIcon
                icon={faCamera}
                className="text-zinc-500 text-4xl sm:text-5xl md:text-6xl group-hover:text-zinc-600 transition-colors duration-300"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-xl transition-all duration-300"></div>
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
                    ? ultimoItem.produto_nome
                    : "Aguardando leitura..."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">
                  Data e Hora
                </p>
                <p className="text-base md:text-lg lg:text-xl text-gray-800 font-semibold font-mono">
                  {ultimaDataHora.data} {ultimaDataHora.hora}
                </p>
              </div>
            </div>
          </div>
        </div>

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
            </div>
          </div>
          <button
            onClick={() => navigate("/historico")}
            className="flex bg-primary hover:bg-green-700 transition-all duration-150 w-full text-white justify-center gap-3 h-14 items-center rounded-b-lg cursor-pointer text-sm sm:text-base font-medium"
          >
            Ver Histórico Completo
            <CirclePlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg flex flex-col shadow-md border border-slate-300 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            Atividade Semanal
          </h3>
          <p className="text-sm text-slate-500">Fluxo nos últimos 7 dias</p>
        </div>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                dy={10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Bar dataKey="quantidade" radius={[4, 4, 0, 0]} barSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#49975e" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="bg-white w-full lg:w-[40%] rounded-lg flex flex-col shadow-md border border-slate-300 p-6 min-w-0">
          <div className="mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faChartPie} className="text-primary" />
            <h3 className="text-lg font-bold text-slate-800">Distribuição</h3>
          </div>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white w-full lg:w-[60%] rounded-lg flex flex-col shadow-md border border-slate-300 p-6 min-w-0">
          <div className="mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faRankingStar} className="text-primary" />
            <h3 className="text-lg font-bold text-slate-800">
              Produtos Mais Movimentados
            </h3>
          </div>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                layout="vertical"
                data={topProductsData}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 11, fill: "#475569" }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                  {topProductsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#49975e" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

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
                Nenhuma atividade recente hoje.
              </p>
            </div>
          ) : (
            recentLogs.map((log) => {
              const { data, hora } = formatarDataHora(log.timestamp);
              const isSaida = log.tipo === "saida";

              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors rounded-lg px-3 group"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border ${
                        isSaida
                          ? "bg-red-600/10 text-btnDelete border-red-200"
                          : "bg-green-600/10 text-green-800 border-green-200"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={isSaida ? faArrowDown : faArrowUp}
                        className="text-sm"
                      />
                    </div>

                    <div className="flex flex-col">
                      <p className="text-slate-800 font-bold text-sm sm:text-base group-hover:text-black transition-colors">
                        {isSaida ? "- " : "+ "} 1{" "}
                        {log.produto_nome || "Desconhecido"}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {data} • {hora}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-md tracking-wider uppercase border ${
                      isSaida
                        ? "bg-red-600/10 text-btnDelete border-red-200"
                        : "bg-green-600/10 text-green-800 border-green-200"
                    }`}
                  >
                    {isSaida ? "Saída" : "Entrada"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
