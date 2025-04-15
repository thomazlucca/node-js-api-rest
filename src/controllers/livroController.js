import NaoEncontrado from "../erros/NaoEncontrado.js";
import { autor } from "../models/index.js";
import { livro } from "../models/index.js";

class LivroController {

  static async listarLivros(req, res, next) {
    try {
      const buscaLivros = livro.find();      
      req.resultado = buscaLivros;
      next();
    } catch (erro) {
      next(erro);
    }
  };

  static async listarLivroPorId(req, res, next) {
    try {
      const id = req.params.id;
      const livroEncontrado = await livro.findById(id);
      if (livroEncontrado !== null) {
        res.status(200).json(livroEncontrado);
      } else
        res.status(404).json({ message: "Id do livro não localizado." });

    } catch (erro) {
      next(erro);
    }
  };

  static async cadastrarLivro(req, res, next) {
    const novoLivro = req.body;
    try {
      const autorEncontrado = await autor.findById(novoLivro.autor);
      if (autorEncontrado !== null) {
        const livroCompleto = { ...novoLivro, autor: { ...autorEncontrado._doc } };
        const livroCriado = await livro.create(livroCompleto);
        res.status(201).json({ message: "criado com sucesso", livro: livroCriado });
      } else {
        next(new NaoEncontrado("Id do autor não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizarLivro(req, res, next) {
    try {
      const id = req.params.id;
      await livro.findByIdAndUpdate(id, req.body);
      res.status(200).json({ message: "livro atualizado" });

    } catch (erro) {
      next(erro);
    }
  };

  static async excluirLivro(req, res, next) {
    try {
      const id = req.params.id;
      await livro.findByIdAndDelete(id);
      res.status(200).json({ message: "livro excluído com sucesso" });
    } catch (erro) {
      next(erro);
    }
  };

  static async listarLivrosPorFiltro(req, res, next) {

    try {
      const busca = await processaBusca(req.query);
      const livrosResultado = livro.find(busca);
      req.resultado = livrosResultado;
      next();
    } catch (erro) {
      next(erro);
    }
  }

};

async function processaBusca(parametros) {
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;
  const busca = {};
  if (editora) busca.editora = editora;
  if (titulo) busca.titulo = { $regex: titulo, $options: "i" };

  if (minPaginas || maxPaginas) busca.paginas = {};
  if (minPaginas) busca.paginas.$gte = minPaginas;
  if (maxPaginas) busca.paginas.$lte = maxPaginas;
  if (nomeAutor) busca["autor.nome"] = nomeAutor;
  console.log(busca);
  return busca;


};

export default LivroController;