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
      descricao: "Estrutura semântica",
    },
    {
      nome: "CSS3",
      icon: faCss3Alt,
      descricao: "Estilização visual",
    },
    {
      nome: "JavaScript",
      icon: faSquareJs,
      descricao: "Lógica do sistema",
    },
    {
      nome: "React",
      icon: faReact,
      descricao: "Interface reativa",
    },
    {
      nome: "Node.js",
      icon: faNodeJs,
      descricao: "API e Backend",
    },
    {
      nome: "NFC",
      icon: faWifi,
      descricao: "Comunicação sem fio",
    },
    {
      nome: "ESP32",
      icon: faMicrochip,
      descricao: "Hardware IoT",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-roboto">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-slate-900 mb-6 tracking-tight">
            Projeto <span className="text-primary">CtrlStock</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed">
            Um protótipo de Sistema de Controle de Estoque por Aproximação
            (NFC), demonstrando viabilidade técnica e automação de baixo custo
            para gestão de inventário.
          </p>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-slate-300 flex-1"></div>
            <h2 className="font-poppins font-bold text-slate-800 text-center uppercase tracking-wider text-sm">
              Tecnologias Utilizadas
            </h2>
            <div className="h-px bg-slate-300 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tecnologias.map((tech, index) => (
              <div
                key={index}
                className="bg-white rounded-r-xl rounded-l-md p-6 border border-slate-200 border-l-4 border-l-primary shadow-sm hover:shadow-md hover:bg-green-50 hover:border-green-200 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-white group-hover:scale-105 transition-all duration-300 border border-slate-100 group-hover:border-green-100">
                  <FontAwesomeIcon
                    icon={tech.icon}
                    className="text-3xl text-primary"
                  />
                </div>

                <h3 className="text-slate-800 font-bold text-xl mb-2 group-hover:text-emerald-800 transition-colors">
                  {tech.nome}
                </h3>

                <p className="text-slate-500 text-sm font-medium group-hover:text-emerald-700/80">
                  {tech.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200 shadow-md">
          <h3 className="text-2xl sm:text-3xl font-poppins text-slate-900 font-bold mb-8 text-center">
            Objetivos do Sistema
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-primary border border-green-100">
                <FontAwesomeIcon icon={faBoxes} className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">
                  Controle de Estoque
                </h4>
                <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                  Monitoramento em tempo real da entrada e saída de produtos,
                  garantindo precisão nos dados.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-primary border border-green-100">
                <FontAwesomeIcon icon={faMobileAlt} className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">
                  Tecnologia NFC
                </h4>
                <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                  Identificação rápida, segura e sem contato através de tags e
                  leitores de proximidade.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-primary border border-green-100">
                <FontAwesomeIcon icon={faDollarSign} className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">
                  Baixo Custo
                </h4>
                <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                  Utilização de componentes acessíveis como ESP32, tornando
                  viável para pequenas empresas.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-primary border border-green-100">
                <FontAwesomeIcon icon={faBolt} className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Automação</h4>
                <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                  Redução drástica de erros humanos manuais e agilidade nos
                  processos de conferência.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
