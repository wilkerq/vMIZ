import express from 'express';
import cors from 'cors';
import { apiRouter } from './api';

const app = express();
const port = 3001; // O backend roda em uma porta diferente do frontend

// Middleware
app.use(cors()); // Permite requisições do servidor de desenvolvimento do frontend
app.use(express.json()); // Analisa corpos de requisição JSON

// Rotas da API
app.use('/api', apiRouter);

// Inicia o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor backend está rodando em http://localhost:${port}`);
  console.log('Certifique-se de que o frontend está rodando e configurado para se conectar a este servidor.');
});
