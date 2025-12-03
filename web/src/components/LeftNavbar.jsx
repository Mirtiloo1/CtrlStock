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
      {/* Mobile */}
      <aside className="lg:hidden w-full bg-white border-t border-slate-300 fixed bottom-0 z-40 sm:relative sm:bottom-auto">
        <nav className="w-full px-4 py-2">
          <ul className="flex gap-2 justify-around">
            {navItems.map(({ path, icon: Icon, label }) => (
              <li key={path} className="flex-1">
                <Link
                  to={path}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                    isActive(path)
                      ? "text-primary font-bold bg-green-50"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isActive(path) ? 2.5 : 2}
                  />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Desktop */}
      <aside className="hidden lg:flex lg:flex-col bg-white border-r border-slate-200 w-64 h-[calc(100vh-80px)] sticky top-20">
        <nav className="flex-1 px-4 pt-8">
          <ul className="flex flex-col gap-3">
            {navItems.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`group flex items-center gap-4 p-3.5 rounded-r-lg mr-4 transition-all duration-200 relative overflow-hidden ${
                      active
                        ? "bg-green-50 text-emerald-700 font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium"
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-md"></div>
                    )}

                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                        active ? "ml-2" : ""
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
