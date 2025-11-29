import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  {
    /* MELHORAR LOGICA DO CADASTRO */
  }
  const handleCadastro = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const senha = e.target.senha.value;
    const confirmarSenha = e.target.confirmarSenha.value;

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    console.log("Cadastro enviado:", { email, senha });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="bg-primary min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleCadastro}
        className="flex flex-col bg-zinc-50 w-full max-w-md sm:max-w-lg rounded-lg p-6 sm:p-8 lg:p-10 gap-4 sm:gap-6 shadow-xl"
      >
        <div className="space-y-2">
          <h2 className="text-primary font-poppins font-medium text-center text-xl sm:text-2xl">
            CtrlStock
          </h2>
          <h1 className="text-primary font-poppins font-bold text-center text-2xl sm:text-2xl">
            Crie sua conta
          </h1>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
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
                minLength="6"
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
          <div className="space-y-2">
            <label
              htmlFor="confirmarSenha"
              className="text-primary font-roboto font-medium text-sm sm:text-base"
            >
              Confirme sua senha
            </label>
            <div className="relative">
              <input
                id="confirmarSenha"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmarSenha"
                required
                minLength="6"
                className="border-2 border-neutral-300 w-full h-12 sm:h-14 lg:h-16 rounded-lg px-4 pr-12 text-sm sm:text-base focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••••"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-neutral-600 hover:text-primary transition-colors"
                aria-label={
                  showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                }
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEye : faEyeSlash}
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
            Cadastrar
          </button>

          {/* Links auxiliares */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 text-primary justify-center items-center font-roboto text-xs sm:text-sm">
            <button
              type="button"
              className="hover:text-secondary transition-all duration-150 hover:underline"
            >
              Esqueceu sua senha?
            </button>
            <span className="hidden sm:inline text-neutral-400">•</span>
            <Link
              to="/login"
              className="hover:text-secondary transition-all duration-150 hover:underline"
            >
              Já possui uma conta?
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
