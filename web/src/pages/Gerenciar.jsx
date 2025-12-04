import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faTrash,
  faPenToSquare,
  faPlus,
  faWifi,
  faSort,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Gerenciar() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("az");

  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [lendoTag, setLendoTag] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const intervalRef = useRef(null);

  const [form, setForm] = useState({
    nome: "",
    uid: "",
    descricao: "",
  });

  const carregarProdutos = async (silencioso = false) => {
    if (!isAuthenticated) return;

    try {
      if (!silencioso) setLoading(true);
      const dados = await api.getProdutos();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      if (!silencioso) setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      carregarProdutos(false);

      const intervalProdutos = setInterval(() => {
        carregarProdutos(true);
      }, 5000);

      return () => {
        clearInterval(intervalProdutos);
        pararLeituraTag();
      };
    }
  }, [isAuthenticated]);

  const iniciarLeituraTag = () => {
    setLendoTag(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      try {
        const dadosBuffer = await api.getUltimaTagLida();
        if (dadosBuffer && dadosBuffer.uid) {
          setForm((prev) => ({ ...prev, uid: dadosBuffer.uid }));
          if (navigator.vibrate) navigator.vibrate(200);
          pararLeituraTag();
        }
      } catch {
        // Erro silencioso
      }
    }, 1000);
  };

  const pararLeituraTag = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setLendoTag(false);
  };

  const getProdutosFiltrados = () => {
    let lista = produtos.filter(
      (p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.uid_etiqueta?.toLowerCase().includes(busca.toLowerCase())
    );

    lista.sort((a, b) => {
      if (ordenacao === "az") return a.nome.localeCompare(b.nome);
      if (ordenacao === "za") return b.nome.localeCompare(a.nome);
      if (ordenacao === "recentes") return b.id - a.id;
      if (ordenacao === "antigos") return a.id - b.id;
      return 0;
    });

    return lista;
  };

  const produtosFiltrados = getProdutosFiltrados();

  const abrirModalNovo = () => {
    setForm({ nome: "", uid: "", descricao: "" });
    setProdutoEditando(null);
    setModalAberto(true);
  };

  const abrirModalEditar = (produto) => {
    setForm({
      nome: produto.nome,
      uid: produto.uid_etiqueta,
      descricao: produto.descricao || "",
    });
    setProdutoEditando(produto);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setForm({ nome: "", uid: "", descricao: "" });
    setProdutoEditando(null);
    pararLeituraTag();
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.uid.trim()) {
      alert("Nome e UID são obrigatórios.");
      return;
    }
    setSalvando(true);
    try {
      let resultado;
      if (produtoEditando) {
        resultado = await api.atualizarProduto(
          produtoEditando.id,
          form.nome,
          form.uid,
          form.descricao
        );
      } else {
        resultado = await api.cadastrarProduto(
          form.nome,
          form.uid,
          form.descricao
        );
      }

      if (resultado.success || resultado.data) {
        alert(
          `Produto ${
            produtoEditando ? "atualizado" : "cadastrado"
          } com sucesso!`
        );
        fecharModal();
        carregarProdutos(false);
      } else {
        alert(resultado.message || "Erro ao salvar produto.");
      }
    } catch {
      alert("Erro ao salvar produto.");
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (produto) => {
    if (!window.confirm(`Deseja realmente excluir "${produto.nome}"?`)) return;
    try {
      const resultado = await api.deletarProduto(produto.id);
      if (resultado.success) {
        alert("Produto excluído com sucesso!");
        carregarProdutos(false);
      } else {
        alert(resultado.message || "Erro ao excluir produto.");
      }
    } catch {
      alert("Erro ao excluir produto.");
    }
  };

  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-zinc-500">Verificando permissões...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-slate-100">
        <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <FontAwesomeIcon icon={faLock} className="text-4xl text-zinc-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 mb-3">
          Acesso Restrito
        </h2>
        <p className="text-zinc-500 max-w-md mb-8">
          Você precisa estar logado com uma conta de administrador para
          gerenciar, editar ou excluir produtos do sistema.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-primary hover:bg-botao text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-100 lg:p-12 h-full flex flex-col">
      <div className="flex flex-col gap-4 mb-6 sm:mb-8 lg:mb-10 flex-shrink-0">
        <h1 className="text-primary text-xl sm:text-2xl font-semibold uppercase tracking-wide">
          Gerenciamento de Produtos
        </h1>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
            />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full border bg-white border-zinc-400 rounded-lg h-11 sm:h-12 pl-10 pr-4 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm sm:text-base shadow-sm"
            />
          </div>

          <div className="relative w-full md:w-48">
            <FontAwesomeIcon
              icon={faSort}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
            />
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="w-full border bg-white border-zinc-400 rounded-lg h-11 sm:h-12 pl-10 pr-8 appearance-none focus:border-primary focus:ring-1 focus:outline-none transition-all cursor-pointer text-sm sm:text-base text-zinc-700"
            >
              <option value="az">Nome (A-Z)</option>
              <option value="za">Nome (Z-A)</option>
              <option value="recentes">Mais Recentes</option>
              <option value="antigos">Mais Antigos</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-600">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <button
            onClick={abrirModalNovo}
            className="bg-primary hover:bg-botao text-white px-6 h-11 sm:h-12 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Novo</span>
          </button>
        </div>
      </div>

      <div className="hidden sm:block bg-white rounded-lg overflow-auto shadow-sm border border-slate-200 max-h-[70vh]">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-300 sticky top-0 z-10 shadow-sm">
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
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-8">
                  Carregando...
                </td>
              </tr>
            ) : produtosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500">
                  {busca
                    ? "Nenhum produto encontrado."
                    : "Nenhum produto cadastrado."}
                </td>
              </tr>
            ) : (
              produtosFiltrados.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-t border-slate-200 hover:bg-slate-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  }`}
                >
                  <td className="py-4 px-6 text-slate-800 font-medium">
                    {item.nome}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-mono text-sm">
                    {item.uid_etiqueta || "N/A"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleExcluir(item)}
                        className="bg-btnDelete hover:bg-red-700 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                      <button
                        onClick={() => abrirModalEditar(item)}
                        className="bg-btnEdit hover:bg-yellow-600 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="text-sm"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-3 overflow-y-auto max-h-[70vh]">
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {busca
              ? "Nenhum produto encontrado."
              : "Nenhum produto cadastrado."}
          </div>
        ) : (
          produtosFiltrados.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm"
            >
              <div className="mb-3">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">
                  Produto
                </p>
                <p className="text-slate-800 font-medium">{item.nome}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">
                  ID da Etiqueta (UID)
                </p>
                <p className="text-slate-600 font-mono text-sm">
                  {item.uid_etiqueta || "N/A"}
                </p>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleExcluir(item)}
                  className="flex-1 bg-btnDelete hover:bg-red-700 text-white h-10 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  <span className="text-sm font-medium">Excluir</span>
                </button>
                <button
                  onClick={() => abrirModalEditar(item)}
                  className="flex-1 bg-btnEdit hover:bg-yellow-600 text-white h-10 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="text-sm" />
                  <span className="text-sm font-medium">Editar</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-primary mb-4">
              {produtoEditando ? "Editar Produto" : "Novo Produto"}
            </h2>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none"
                  required
                  disabled={salvando}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UID da Etiqueta *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.uid}
                    onChange={(e) => setForm({ ...form, uid: e.target.value })}
                    className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none"
                    required
                    disabled={salvando}
                    placeholder="Digite ou escaneie..."
                  />
                  <button
                    type="button"
                    onClick={iniciarLeituraTag}
                    disabled={salvando}
                    className="bg-zinc-700 hover:bg-zinc-900 text-white px-4 rounded-lg flex items-center justify-center transition-colors"
                    title="Escanear"
                  >
                    <FontAwesomeIcon icon={faWifi} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none"
                  rows="3"
                  disabled={salvando}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-botao transition-colors disabled:opacity-50"
                >
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {lendoTag && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full flex flex-col items-center text-center animate-fade-in">
            <div className="mb-4 text-primary animate-pulse">
              <FontAwesomeIcon icon={faWifi} size="3x" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Aguardando Tag...
            </h3>
            <p className="text-gray-600 mb-6">
              Aproxime o cartão ou chaveiro do leitor IoT Arduino agora.
            </p>
            <button
              onClick={pararLeituraTag}
              className="bg-btnDelete hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
