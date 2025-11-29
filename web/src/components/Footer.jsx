import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faGithub,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const socialLinks = [
    { icon: faGoogle, href: "#", label: "Google" },
    { icon: faGithub, href: "#", label: "GitHub" },
    { icon: faWhatsapp, href: "#", label: "WhatsApp" },
  ];

  const navLinks = [
    { name: "Dashboard", href: "#" },
    { name: "Histórico", href: "#" },
    { name: "Gerenciar", href: "#" },
    { name: "Sobre", href: "#" },
  ];

  return (
    <footer className="font-roboto">
      {/* Parte superior */}
      <div className="bg-footer-primary w-full">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {/* Coluna 1 - Brand */}
            <div className="flex flex-col gap-3 md:gap-4 items-center sm:items-start">
              <h2 className="font-poppins font-bold text-primary text-2xl md:text-3xl">
                CtrlStock
              </h2>
              <p className="text-botao font-medium text-sm md:text-base">
                Controle de estoque
              </p>

              {/* Ícones sociais */}
              <div className="flex gap-2 md:gap-3 mt-1 md:mt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="bg-botao text-white rounded-full w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center hover:bg-primary transition-all duration-150 flex-shrink-0"
                    aria-label={social.label}
                  >
                    <FontAwesomeIcon
                      icon={social.icon}
                      className="text-base sm:text-lg md:text-xl"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Coluna 2 - Navegação */}
            <div className="flex flex-col gap-2 md:gap-3 items-center sm:items-start">
              <h3 className="font-bold text-primary text-lg md:text-xl mb-1">
                Navegação
              </h3>
              <nav className="flex flex-col gap-2 md:gap-2.5">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="font-medium text-botao text-sm md:text-base hover:text-primary transition-colors duration-150"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Coluna 3 - Contato */}
            <div className="flex flex-col gap-2 md:gap-3 items-center sm:items-start sm:col-span-2 lg:col-span-1">
              <h3 className="font-bold text-primary text-lg md:text-xl mb-1">
                Contato
              </h3>
              <a
                href="mailto:contato@ctrlstock.com"
                className="flex items-center font-bold text-botao text-sm md:text-base gap-2 hover:text-primary transition-colors duration-150 group"
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-botao group-hover:text-primary transition-colors duration-150 flex-shrink-0"
                />
                <span className="break-all sm:break-normal font-medium">
                  contato@ctrlstock.com
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Parte inferior */}
      <div className="bg-footer-secondary w-full py-3 md:py-4 px-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">
            © 2025 CtrlStock. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-xs md:text-sm">
            Felipe de Souza, Gabriel Pontes, Jefferson Kotoski, Murilo Pimentel
          </p>
        </div>
      </div>
    </footer>
  );
}
