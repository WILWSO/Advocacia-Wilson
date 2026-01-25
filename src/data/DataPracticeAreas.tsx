import { 
  Building2, 
  LandPlot, 
  Scale, 
  Briefcase, 
  FileText, 
  Users,
  HomeIcon,
  Landmark,
  CoinsIcon,
  ShoppingBagIcon,
  FileSignatureIcon,
  ShieldCheckIcon,
  HeartPulseIcon,
  LeafyGreenIcon,
  Globe2Icon,
  GavelIcon,
  VoteIcon
} from 'lucide-react';

export interface PracticeArea {
  id: number;
  icon: JSX.Element;
  iconLarge?: JSX.Element;
  title: string;
  description: string;
  link: string;
  services?: string[];
}

export const practiceAreasData: PracticeArea[] = [
  {
    id: 1,
    icon: <Building2 size={32} className="text-gold-600" />,
    iconLarge: <Building2 size={40} className="text-gold-600" />,
    title: 'Direito Empresarial',
    description: 'Assessoria completa para empresas de todos os portes, desde a constituição até questões societárias complexas.',
    link: '/areas-de-atuacao',
    services: [
      'Constituição e alteração de sociedades',
      'Contratos empresariais',
      'Fusões e aquisições',
      'Consultoria empresarial preventiva',
      'Planejamento societário',
      'Reestruturação empresarial',
      'Governança corporativa'
    ]
  },
  {
    id: 2,
    icon: <Scale size={32} className="text-gold-600" />,
    iconLarge: <Scale size={40} className="text-gold-600" />,
    title: 'Direito Civil',
    description: 'Representação em contratos, responsabilidade civil, direito de família, sucessões e questões patrimoniais.',
    link: '#civil',
    services: [
      'Contratos em geral',
      'Direito de família e sucessões',
      'Responsabilidade civil',
      'Direito das obrigações',
      'Direitos reais',
      'Ações indenizatórias',
      'Inventários e testamentos'
    ]
  },
  {
    id: 3,
    icon: <Briefcase size={32} className="text-gold-600" />,
    iconLarge: <Briefcase size={40} className="text-gold-600" />,
    title: 'Direito Trabalhista',
    description: 'Orientação preventiva e contenciosa em relações trabalhistas para empresas e colaboradores.',
    link: '/areas-de-atuacao',
    services: [
      'Assessoria jurídica preventiva',
      'Auditoria trabalhista',
      'Negociações coletivas',
      'Contencioso trabalhista',
      'Terceirização',
      'Planos de cargos e salários',
      'Compliance trabalhista'
    ]
  },
  {
    id: 4,
    icon: <FileText size={32} className="text-gold-600" />,
    iconLarge: <CoinsIcon size={40} className="text-gold-600" />,
    title: 'Direito Tributário',
    description: 'Planejamento tributário, defesa em autuações fiscais e recuperação de créditos tributários.',
    link: '/areas-de-atuacao',
    services: [
      'Planejamento tributário',
      'Contencioso administrativo e judicial',
      'Recuperação de créditos tributários',
      'Consultoria fiscal',
      'Defesa em autuações fiscais',
      'Regimes especiais de tributação',
      'Análise de benefícios fiscais'
    ]
  },
  {
    id: 5,
    icon: <LandPlot size={32} className="text-gold-600" />,
    iconLarge: <LandPlot size={40} className="text-gold-600" />,
    title: 'Direito Imobiliário',
    description: 'Suporte em transações imobiliárias, locações, incorporações e regularização de imóveis.',
    link: '/areas-de-atuacao',
    services: [
      'Contratos de compra e venda',
      'Locação comercial e residencial',
      'Incorporações imobiliárias',
      'Due diligence imobiliária',
      'Regularização de imóveis',
      'Usucapião',
      'Condomínios e loteamentos', 
      'Ações possessórias',
      'Regularização fundiária'
    ]
  },
  {
    id: 6,
    icon: <Users size={32} className="text-gold-600" />,
    iconLarge: <ShoppingBagIcon size={40} className="text-gold-600" />,
    title: 'Direito do Consumidor',
    description: 'Defesa de direitos em relações de consumo, para consumidores e fornecedores.',
    link: '/areas-de-atuacao',
    services: [
      'Ações indenizatórias',
      'Defesa do fornecedor',
      'Recall de produtos',
      'Contratos de consumo',
      'Publicidade e práticas comerciais',
      'Proteção de dados do consumidor',
      'Consultoria preventiva'
    ]
  },
  {
    id: 7,
    icon: <HomeIcon size={32} className="text-gold-600" />,
    iconLarge: <HomeIcon size={40} className="text-gold-600" />,
    title: 'Direito de família e sucessões',
    description: 'Atuação em divórcios, guarda de filhos, inventários e testamentos, sempre buscando soluções amigáveis.',
    link: '/areas-de-atuacao',
    services: [
      'Divórcios consensuais e litigiosos',
      'Guarda de filhos e pensão alimentícia',
      'Inventários e partilhas',
      'Testamentos e planejamento sucessório',
      'Reconhecimento de paternidade',
      'Adoção',
      'Mediação familiar'
    ]
  },
  {
    id: 8,
    icon: <FileSignatureIcon size={32} className="text-gold-600" />,
    iconLarge: <FileSignatureIcon size={40} className="text-gold-600" />,
    title: 'Direito Contratual',
    description: 'Elaboração, análise e negociação de contratos de diversos tipos e complexidades.',
    link: '/areas-de-atuacao',
    services: [
      'Elaboração de contratos',
      'Análise de cláusulas contratuais',
      'Negociação de termos e condições',
      'Revisão contratual',
      'Contratos internacionais',
      'Resolução de conflitos contratuais',
      'Contratos de prestação de serviços'
    ]
  },
  {
    id: 9,
    icon: <ShieldCheckIcon size={32} className="text-gold-600" />,
    iconLarge: <ShieldCheckIcon size={40} className="text-gold-600" />,
    title: 'Direito Digital',
    description: 'Assessoria jurídica em questões relacionadas à tecnologia, internet e proteção de dados.',
    link: '/areas-de-atuacao',
    services: [
      'Adequação à LGPD',
      'Proteção de dados pessoais',
      'Termos de uso e políticas de privacidade',
      'Direito autoral digital',
      'Crimes digitais',
      'E-commerce',
      'Contratos de tecnologia'
    ]
  },
  {
    id: 10,
    icon: <Landmark size={32} className="text-gold-600" />,
    iconLarge: <Landmark size={40} className="text-gold-600" />,
    title: 'Direito Administrativo',
    description: 'Suporte jurídico em licitações, contratos administrativos e relações com o poder público.',
    link: '/areas-de-atuacao',
    services: [
      'Licitações públicas',
      'Contratos administrativos',
      'Processos administrativos',
      'Parcerias público-privadas',
      'Concessões e permissões',
      'Atos de improbidade administrativa',
      'Intervenção do Estado na propriedade'
    ]
  },
  {
    id: 11,
    icon: <HeartPulseIcon size={32} className="text-gold-600" />,
    iconLarge: <HeartPulseIcon size={40} className="text-gold-600" />,
    title: 'Direito Previdenciário',
    description: 'Assistência em questões relacionadas à aposentadoria, benefícios e planejamento previdenciário.',
    link: '/areas-de-atuacao',
    services: [
      'Aposentadorias',
      'Pensões e auxílios',
      'Revisão de benefícios',
      'Planejamento previdenciário',
      'Desaposentação',
      'Recursos administrativos',
      'Ações judiciais previdenciárias'
    ]
  },
  {
    id: 12,
    icon: <LeafyGreenIcon size={32} className="text-gold-600" />,
    iconLarge: <LeafyGreenIcon size={40} className="text-gold-600" />,
    title: 'Direito Ambiental',
    description: 'Consultoria e contencioso em questões ambientais, licenciamento e responsabilidade ambiental.',
    link: '/areas-de-atuacao',
    services: [
      'Licenciamento ambiental',
      'Consultoria em normas ambientais',
      'Defesa em ações civis públicas',
      'Recuperação de áreas degradadas',
      'Responsabilidade civil ambiental',
      'Planejamento ambiental empresarial',
      'Compliance ambiental'
    ]
  },
  {
    id: 13,
    icon: <Globe2Icon size={32} className="text-gold-600" />,
    iconLarge: <Globe2Icon size={40} className="text-gold-600" />,
    title: 'Direito Internacional',
    description: 'Assessoria em questões de direito internacional público e privado, incluindo contratos internacionais.',
    link: '/areas-de-atuacao',
    services: [
      'Contratos internacionais',
      'Arbitragem internacional',
      'Direitos humanos',
      'Imigração e naturalização',
      'Litígios internacionais',
      'Compliance internacional',
      'Consultoria em comércio exterior'
    ]
  },
  {
    id: 14,
    icon: <GavelIcon size={32} className="text-gold-600" />,
    iconLarge: <GavelIcon size={40} className="text-gold-600" />,
    title: 'Direito Penal',
    description: 'Defesa criminal em diversas áreas do direito penal, incluindo crimes contra a pessoa e o patrimônio.',
    link: '/areas-de-atuacao',
    services: [
      'Defesa em processos criminais',
      'Crimes contra a pessoa',
      'Crimes contra o patrimônio',
      'Crimes ambientais',
      'Crimes digitais',
      'Recursos penais',
      'Consultoria preventiva'
    ]
  },
  {
    id: 15,
    icon: <VoteIcon size={32} className="text-gold-600" />,
    iconLarge: <VoteIcon size={40} className="text-gold-600" />,
    title: 'Direito Eleitoral',
    description: 'Assessoria jurídica em questões eleitorais, incluindo candidaturas, campanhas e contencioso eleitoral.',
    link: '/areas-de-atuacao',
    services: [
      'Assessoria a candidatos',
      'Registro de candidaturas',
      'Campanhas eleitorais',
      'Contencioso eleitoral',
      'Consultoria em legislação eleitoral',
      'Recursos eleitorais',
      'Direitos políticos'
    ]
  }
];
