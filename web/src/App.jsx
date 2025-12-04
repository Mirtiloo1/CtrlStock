import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import "./App.css";
// Context
import { AuthProvider } from "./contexts/AuthContext";
// Components
import Navbar from "./components/Navbar";
import LeftNavbar from "./components/LeftNavbar";
import Footer from "./components/Footer";
// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Sobre from "./pages/Sobre";
import Historico from "./pages/Historico";
import Gerenciar from "./pages/Gerenciar";

// LPAGS AUTENTICADAS
function AuthenticatedLayout() {
  return (
    <div className="font-roboto min-h-screen flex flex-col pb-16 sm:pb-0">
      <Navbar />

      <div className="flex flex-col lg:flex-row flex-1">
        <LeftNavbar />

        <main className="flex-1 bg-background overflow-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

// PAGS PUBLICAS
function PublicLayout() {
  return (
    <div className="font-roboto min-h-screen">
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas (sem navbar/footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
          </Route>

          {/* Rotas autenticadas (com navbar/footer) */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/gerenciar" element={<Gerenciar />} />
            <Route path="/sobre" element={<Sobre />} />

            {/* 404 */}
            <Route
              path="*"
              element={<div className="p-6">Página não encontrada</div>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
