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
} from "@fortawesome/free-solid-svg-icons";
import { CirclePlus, ClipboardClock } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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

const UltimoItemCard = ({ loading, ultimoItem }) => {
  const { data, hora } = ultimoItem
    ? formatarDataHora(ultimoItem.timestamp)
    : { data: "--/--/----", hora: "--:--:--" };
  return (
    <div className="w-full xl:w-[65%] bg-white p-6 md:p-8 rounded-lg flex flex-col shadow-md border border-slate-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-50 rounded-lg">
          <FontAwesomeIcon icon={faQrcode} className="text-primary text-xl" />
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

const MovimentacoesHojeCard = ({ loading, movimentacoesHoje, navigate }) => (
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
      Ver Histórico Completo <CirclePlus className="w-5 h-5" />
    </button>
  </div>
);

const AtividadeSemanalChart = ({ chartData, loading }) => (
  <div className="w-full bg-white rounded-lg flex flex-col shadow-md border border-slate-300 p-6">
    <div className="mb-4">
      <h3 className="text-lg font-bold text-slate-800">Atividade Semanal</h3>
      <p className="text-sm text-slate-500">Fluxo nos últimos 7 dias</p>
    </div>
    <div className="w-full h-[300px]">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-slate-400 font-medium">Carregando gráfico...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              dy={10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
            <Bar dataKey="quantidade" radius={[4, 4, 0, 0]} barSize={50}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#49975e" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

const DistribuicaoPieChart = ({ pieData, loading }) => (
  <div className="bg-white w-full lg:w-[40%] rounded-lg flex flex-col shadow-md border border-slate-300 p-6 min-w-0">
    <div className="mb-4 flex items-center gap-2">
      <FontAwesomeIcon icon={faChartPie} className="text-primary" />
      <h3 className="text-lg font-bold text-slate-800">
        Distribuição por Ação
      </h3>
    </div>
    <div className="w-full h-[280px]">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-slate-400 font-medium">Carregando dados...</p>
        </div>
      ) : (
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
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span style={{ color: "#475569" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

const TopProdutosChart = ({ topProductsData, loading }) => (
  <div className="bg-white w-full lg:w-[60%] rounded-lg flex flex-col shadow-md border border-slate-300 p-6 min-w-0">
    <div className="mb-4 flex items-center gap-2">
      <FontAwesomeIcon icon={faRankingStar} className="text-primary" />
      <h3 className="text-lg font-bold text-slate-800">
        Produtos Mais Movimentados
      </h3>
    </div>
    <div className="w-full h-[280px]">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-slate-400 font-medium">Carregando dados...</p>
        </div>
      ) : (
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
              {topProductsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#49975e" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    chart: [],
    topProd: [],
    pie: [],
    logs: [],
    movsHoje: 0,
    ultimo: null,
  });
  const [loading, setLoading] = useState(true);

  const carregarDados = useCallback(async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true);
      const movimentos = await api.getMovimentacoes();
      const hoje = new Date();
      const dia = hoje.getDate();
      const mes = hoje.getMonth();
      const ano = hoje.getFullYear();

      const movsHoje = movimentos.filter((m) => {
        if (!m.timestamp) return false;
        const d = new Date(m.timestamp);
        return (
          d.getDate() === dia && d.getMonth() === mes && d.getFullYear() === ano
        );
      }).length;

      const ultimoItem =
        movimentos.length > 0
          ? [...movimentos].sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            )[0]
          : null;

      const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dDia = d.getDate();
        const dMes = d.getMonth();
        const qtd = movimentos.filter((m) => {
          const dm = new Date(m.timestamp);
          return dm.getDate() === dDia && dm.getMonth() === dMes;
        }).length;
        chartData.push({ name: diasSemana[d.getDay()], quantidade: qtd });
      }

      const prodCount = {};
      const actionCount = {
        entrada: 0,
        saida: 0,
        movimentacao: 0,
        editado: 0,
        excluido: 0,
      };

      movimentos.forEach((m) => {
        prodCount[m.nome || "Desconhecido"] =
          (prodCount[m.nome || "Desconhecido"] || 0) + 1;
        let t = m.tipo ? m.tipo.toLowerCase() : "entrada";
        if (t === "leitura") t = "movimentacao";
        if (actionCount[t] !== undefined) actionCount[t]++;
      });

      const topProductsData = Object.entries(prodCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
      const pieData = Object.entries(actionCount)
        .filter(([, v]) => v > 0)
        .map(([t, v]) => ({
          name: LABELS_ACOES[t],
          value: v,
          color: CORES_ACOES[t],
        }));
      const recentLogs = movimentos
        .slice(0, 5)
        .map((m) => ({ ...m, tipo: m.tipo || "entrada" }));

      setData({
        chart: chartData,
        topProd: topProductsData,
        pie: pieData,
        logs: recentLogs,
        movsHoje,
        ultimo: ultimoItem,
      });
    } catch (e) {
      console.error(e);
    } finally {
      if (!silencioso) setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados(false);
    const i = setInterval(() => carregarDados(true), 5000);
    return () => clearInterval(i);
  }, [carregarDados]);

  return (
    <main className="p-4 px-6 sm:px-8 md:px-10 lg:px-12 h-full flex flex-col gap-8 bg-slate-100 min-h-screen">
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-stretch">
        <UltimoItemCard loading={loading} ultimoItem={data.ultimo} />
        <MovimentacoesHojeCard
          loading={loading}
          movimentacoesHoje={data.movsHoje}
          navigate={navigate}
        />
      </div>
      <AtividadeSemanalChart chartData={data.chart} loading={loading} />
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <DistribuicaoPieChart pieData={data.pie} loading={loading} />
        <TopProdutosChart topProductsData={data.topProd} loading={loading} />
      </div>
      <LogAtividades loading={loading} recentLogs={data.logs} />
    </main>
  );
}
