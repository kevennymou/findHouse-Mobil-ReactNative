'use strict';

require('express-async-errors');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { storage } = require('./config/upload'); // Importa o storage de config/upload

mongoose.connect('mongodb://127.0.0.1:27017/findHouse');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const AppError = require('../backend/erros/AppError');
const authMiddleware = require('../backend/middlewares/AuthMidlleware');
const UserRouter = require('./routers/UserRouter');
const AuthRouter = require('./routers/AuthRouter');

const app = express();
const port = process.env.port || 3333;

// Configuração do Multer
const upload = multer({ storage: storage });

// Middleware para lidar com erros
const erroHandling = async (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: err.message,
  });
};

app.use(express.json());
app.use(cors());

// Utiliza o middleware de autenticação para rotas abaixo
app.use(authMiddleware);

// Adiciona a rota para upload de arquivos
app.post('/upload', upload.single('file'), (req, res) => {
  return res.json(req.file.filename);
});

app.use(UserRouter);
app.use(AuthRouter);

app.use(erroHandling);

// Configuração do CORS
const corsOptions = {
  origin: 'http://localhost:3333',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  Headers: 'Acess-token',
};

app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`O servidor está executando na porta ${port}`);
});


// credenciais para logar no banco:
//const dbUser = process.env.DB_USER;
//const dbPassword = process.env.DB_PASS;


// conectando com banco de dados:
/*mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.3h93jqh.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
    console.log("conectado ao banco!");
  })
  .catch((err) => console.log(err));*/