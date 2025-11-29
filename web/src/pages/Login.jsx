import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  {
    /* MELHORAR LOGICA DO LOGIN */
  }
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const senha = e.target.senha.value;
    console.log(email, senha);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-primary min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleLogin}
        className="flex flex-col bg-zinc-50 w-full max-w-md sm:max-w-lg rounded-lg p-6 sm:p-8 lg:p-10 gap-4 sm:gap-6 shadow-xl"
      >
        <div className="space-y-2">
          <h2 className="text-primary font-poppins font-medium text-center text-xl sm:text-2xl">
            CtrlStock
          </h2>
          <h1 className="text-primary font-poppins font-bold text-center text-2xl sm:text-2xl">
            Acesse sua conta
          </h1>
        </div>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-primary font-roboto font-medium text-sm sm:text-base"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="border-2 border-neutral-300 w-full h-12 sm:h-14 lg:h-16 rounded-lg px-4 text-sm sm:text-base focus:border-primary focus:outline-none transition-colors"
              placeholder="seu.email@email.com"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="senha"
              className="text-primary font-roboto font-medium text-sm sm:text-base"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                name="senha"
                required
                className="border-2 border-neutral-300 w-full h-12 sm:h-14 lg:h-16 rounded-lg px-4 pr-12 text-sm sm:text-base focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-neutral-600 hover:text-primary transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className="text-base sm:text-lg"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 mt-2">
          <button
            type="submit"
            className="w-full bg-primary h-12 sm:h-14 lg:h-16 text-white font-poppins font-bold text-base sm:text-lg lg:text-xl rounded-lg hover:bg-botao active:scale-95 transition-all duration-150 shadow-md"
          >
            Entrar
          </button>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 text-primary justify-center items-center font-roboto text-xs sm:text-sm">
            <button
              type="button"
              className="hover:text-secondary transition-all duration-150 hover:underline"
            >
              Esqueceu sua senha?
            </button>
            <span className="hidden sm:inline text-neutral-400">•</span>
            <Link
              to="/cadastro"
              className="hover:text-secondary transition-all duration-150 hover:underline"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
