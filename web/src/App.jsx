import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
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

// Layout para páginas autenticadas
function AuthenticatedLayout() {
  return (
    <div className="font-roboto min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftNavbar />
        
        <main className="flex-1 bg-background overflow-auto">
          <Outlet /> {/* Renderiza as rotas filhas aqui */}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

// Layout para páginas públicas
function PublicLayout() {
  return (
    <div className="font-roboto min-h-screen">
      <Outlet /> {/* Renderiza as rotas filhas aqui */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas (sem navbar/footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          {/* Adicione aqui outras rotas públicas */}
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        </Route>

        {/* Rotas autenticadas (com navbar/footer) */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/gerenciar" element={<Gerenciar />} />
          <Route path="/sobre" element={<Sobre />} />
          
          {/* 404 */}
          <Route path="*" element={<div className="p-6">Página não encontrada</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;