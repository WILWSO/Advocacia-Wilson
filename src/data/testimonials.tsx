import { company } from './DataCompany';

export interface Testimonial {
  id: number;
  content: string;
  author: string;
  company: string;
  image: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    content: `O escritório ${company.nome} foi fundamental para a resolução do nosso caso. A equipe demonstrou um profundo conhecimento jurídico e uma dedicação excepcional. Recomendo fortemente seus serviços.`,
    author: "Itamar Correa",
    company: "Sócio-Administrador, Black-Out Ltda.",
    image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=120"
  },
  {
    id: 2,
    content: `Profissionalismo e excelência definem o trabalho do ${company.alias}. Eles nos forneceram orientação clara e estratégica para questões jurídicas complexas que nossa empresa enfrentava.`,
    author: "Ruberval França",
    company: "Sub-Secretário de Estado, Tocantins",
    image: "/Images/Ruberval.jpg"
  },
  {
    id: 3,
    content: `A atenção personalizada e o comprometimento da equipe do ${company.alias} foram impressionantes. Seu conhecimento em direito imobiliário nos ajudou a concluir uma transação complexa com tranquilidade.`,
    author: "Outro Cliente",
    company: "Incorporadora Nova Visão",
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=120"
  }
];
