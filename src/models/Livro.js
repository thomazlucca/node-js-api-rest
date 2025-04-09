import mongoose from "mongoose";
import { autorSchema } from "./Autor.js";

const livroSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    titulo: { type: String, required: [true, "O título do livro é obrigatório."] },
    editora: { type: String, required: [true, "A Editora é obrigatória."], enum: {values: ["Casa do código", "Alura" ], message: "A Editora {VALUE} não é um valor permitido"}},
    preco: { type: Number },
    paginas: { 
      type: Number,
      validate: {
        validator: (valor) => {
          return valor >= 10 && valor <= 5000;
        },
        message: "O número de páginas deve estar entre 10 e 5000. Valor inserido: {VALUE}"
      }
      // min: [10, "O número de páginas deve estar entre 10 e 5000. Valor inserido: {VALUE}"],
      // max: [5000, "O número de páginas deve estar entre 10 e 5000. Valor inserido: {VALUE}"] 
    },
    autor: autorSchema
  },
  {
    versionKey: false
  }
);

const livro = mongoose.model("livros", livroSchema);

export default livro;