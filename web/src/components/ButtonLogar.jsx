import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

function ButtonLogar() {
  const navigate = useNavigate();
  return (
    <Link to={"/login"}>
      <button onClick={() => navigate("/login")} className="hidden bg-primary px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-2.5 lg:px-7 lg:py-3 text-sm md:text-base lg:text-lg rounded-lg text-white flex items-center justify-center gap-2 md:gap-3 lg:gap-4 font-bold cursor-pointer hover:bg-botao transition-all duration-150 whitespace-nowrap">
        Login
        <FontAwesomeIcon
          icon={faKey}
          className="text-xs md:text-sm lg:text-base"
        />
      </button>
    </Link>
  );
}

export default ButtonLogar;
