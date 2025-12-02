import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function UsuarioLogado() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Deseja desconectar da sua conta?")) {
      logout();
      navigate("/login");
    }
  };
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="bg-gray-200 rounded-full w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 flex-shrink-0 flex items-center justify-center">
          <span className="text-primary font-bold text-lg">
            {user.nome?.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="hidden sm:flex flex-col justify-center min-w-0">
          <p className="text-white text-sm md:text-base lg:text-lg font-medium truncate">
            {user.nome}
          </p>
          <p className="text-gray-300 text-xs md:text-sm lg:text-base truncate">
            {user.email}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="p-2 md:p-2.5 lg:p-3 rounded-lg hover:bg-botao transition-all duration-150 flex items-center justify-center flex-shrink-0 cursor-pointer"
        aria-label="Sair"
      >
        <FontAwesomeIcon
          icon={faRightFromBracket}
          className="text-white text-lg sm:text-xl md:text-2xl"
        />
      </button>
    </div>
  );
}

export default UsuarioLogado;
