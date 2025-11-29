import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHtml5,
  faCss3Alt,
  faSquareJs,
  faNodeJs,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import {
  faWifi,
  faMicrochip,
  faBoxes,
  faMobileAlt,
  faDollarSign,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

export default function Sobre() {
  const tecnologias = [
    {
      nome: "HTML5",
      icon: faHtml5,
      descricao: "Estrutura das páginas web",
      color: "text-white",
    },
    {
      nome: "CSS3",
      icon: faCss3Alt,
      descricao: "Estilização e layout",
      color: "text-white",
    },
    {
      nome: "JavaScript",
      icon: faSquareJs,
      descricao: "Lógica e interatividade",
      color: "text-white",
    },
    {
      nome: "React",
      icon: faReact,
      descricao: "Framework frontend",
      color: "text-white",
    },
    {
      nome: "Node.js",
      icon: faNodeJs,
      descricao: "Backend e APIs",
      color: "text-white",
    },
    {
      nome: "NFC",
      icon: faWifi,
      descricao: "Comunicação por proximidade",
      color: "text-white",
    },
    {
      nome: "ESP32",
      icon: faMicrochip,
      descricao: "Microcontrolador IoT",
      color: "text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-primary mb-8 sm:mb-12">
          Projeto CtrlStock
        </h1>
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-gray-700 font-roboto text-base sm:text-lg leading-relaxed text-justify">
              O presente projeto tem como finalidade o desenvolvimento de um
              protótipo de Sistema de Controle de Estoque por Aproximação,
              utilizando a tecnologia de comunicação por campo de proximidade
              (NFC) para monitorar e registrar a movimentação de produtos. A
              proposta busca demonstrar, de forma simplificada e de baixo custo,
              a lógica e a viabilidade de sistemas de inventário automatizado.
            </p>
          </div>
        </div>

        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-poppins font-bold text-primary mb-8 sm:mb-12">
          Tecnologias Utilizadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {tecnologias.map((tech, index) => (
            <div
              key={index}
              className="bg-primary rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center group"
            >
              <div
                className={`mb-4 sm:mb-6 ${tech.color} transition-transform duration-300`}
              >
                <FontAwesomeIcon
                  icon={tech.icon}
                  className="text-6xl sm:text-7xl lg:text-8xl"
                />
              </div>

              <h3 className="text-white font-poppins font-bold text-xl sm:text-2xl mb-2">
                {tech.nome}
              </h3>

              <p className="text-white font-roboto text-sm sm:text-base">
                {tech.descricao}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 sm:p-8 lg:p-10">
            <h3 className="text-2xl sm:text-3xl font-poppins text-primary font-bold mb-6 sm:mb-8 text-center">
              Objetivo do Sistema
            </h3>
            <div className="space-y-5 font-roboto text-sm sm:text-base">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBoxes} className="text-xl text-primary" />
                </div>
                <p>
                  <strong className="text-primary">Controle de Estoque:</strong> Monitoramento em tempo
                  real da movimentação de produtos
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <FontAwesomeIcon icon={faMobileAlt} className="text-xl text-primary" />
                </div>
                <p>
                  <strong className="text-primary">Tecnologia NFC:</strong> Identificação rápida e segura
                  através de tags NFC
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <FontAwesomeIcon icon={faDollarSign} className="text-xl text-primary" />
                </div>
                <p>
                  <strong className="text-primary">Baixo Custo:</strong> Solução acessível para pequenas
                  e médias empresas
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBolt} className="text-xl text-primary" />
                </div>
                <p>
                  <strong className="text-primary">Automação:</strong> Redução de erros humanos e
                  agilidade nos processos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
