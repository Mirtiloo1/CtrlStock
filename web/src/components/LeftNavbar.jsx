import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ChartNoAxesGantt,
  History,
  IdCard,
} from "lucide-react";

export default function LeftNavbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/historico", icon: History, label: "Histórico" },
    { path: "/gerenciar", icon: ChartNoAxesGantt, label: "Gerenciar" },
    { path: "/sobre", icon: IdCard, label: "Sobre" },
  ];

  return (
    <>
      {/* Mobile: Navbar horizontal no topo */}
      <aside className="lg:hidden w-full bg-primary">
        <nav className="w-full px-4 py-2">
          <ul className="flex gap-2 justify-around">
            {navItems.map(({ path, icon: Icon, label }) => (
              <li key={path} className="flex-1">
                <Link
                  to={path}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-150 ${
                    isActive(path) 
                      ? "bg-secondary text-white" 
                      : "text-white/80 hover:bg-secondary/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Desktop: Navbar lateral */}
      <aside className="hidden lg:flex lg:flex-col bg-primary w-64 text-white">
        <nav className="flex-1 px-4 pt-8">
          <ul className="flex flex-col gap-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-150 ${
                    isActive(path) 
                      ? "bg-secondary" 
                      : "hover:bg-secondary/70"
                  }`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}