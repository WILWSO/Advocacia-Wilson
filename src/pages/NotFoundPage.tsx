import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Log 404 para análisis
    console.warn(`404 - Página não encontrada: ${window.location.pathname}`);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Código de erro animado */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold text-primary-900 opacity-10">
            404
          </h1>
        </motion.div>

        {/* Mensagem principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-900 mb-4">
            Página não encontrada
          </h2>
          <p className="text-lg text-neutral-600 mb-2">
            Desculpe, a página que você está procurando não existe.
          </p>
          <p className="text-sm text-neutral-500">
            A URL pode estar incorreta ou a página foi removida.
          </p>
        </motion.div>

        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-white border-2 border-primary-800 text-primary-800 rounded-lg font-medium hover:bg-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </button>

          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-800 text-white rounded-lg font-medium hover:bg-primary-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Home size={20} className="mr-2" />
            Ir para a Home
          </Link>
        </motion.div>

        {/* Links úteis */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-neutral-200"
        >
          <p className="text-sm text-neutral-600 mb-4 flex items-center justify-center">
            <Search size={16} className="mr-2" />
            Páginas mais acessadas:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/sobre"
              className="text-sm text-primary-700 hover:text-primary-900 hover:underline transition-colors"
            >
              Sobre Nós
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
              to="/areas-de-atuacao"
              className="text-sm text-primary-700 hover:text-primary-900 hover:underline transition-colors"
            >
              Áreas de Atuação
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
              to="/equipe"
              className="text-sm text-primary-700 hover:text-primary-900 hover:underline transition-colors"
            >
              Equipe
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
              to="/contato"
              className="text-sm text-primary-700 hover:text-primary-900 hover:underline transition-colors"
            >
              Contato
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
