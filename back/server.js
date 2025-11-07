const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const JWT_SECRET = "1234";

app.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ erro: "Preencha todos os campos." });

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor." });
    if (results.length > 0)
      return res.status(400).json({ erro: "Email já cadastrado." });

    try {
      const bcrypt = require("bcryptjs");
      const senhaHash = await bcrypt.hash(senha, 10);
      const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
      db.query(sql, [nome, email, senhaHash], (err) => {
        if (err) return res.status(500).json({ erro: "Erro ao cadastrar usuário." });
        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ erro: "Erro interno do servidor." });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Erro SELECT login:", err);
      return res.status(500).json({ erro: "Erro no servidor." });
    }

    if (results.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado." });
    }

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  });
});


app.get("/plantas", (req, res) => {
    db.query("SELECT id, nome, cientifico, familia, origem,usos,principios,parte,preparo,contra,imagem FROM registro", (err, results) => {
        if (err) {
            console.error("Erro ao buscar Plantas:", err);
            res.status(500).json({ erro: "Erro ao buscar Plantas no banco de dados." });
        } else {
            res.json(results);
        }
    });
});
app.post("/plantas", upload.single("imagem"), (req, res) => {
  const { nome, cientifico, familia, origem, usos, principios, parte, preparo, contra } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;

  if (!nome || !cientifico || !familia || !origem) {
    return res.status(400).json({ erro: "Preencha os campos obrigatórios." });
  }

  const sql = `
    INSERT INTO registro (nome, cientifico, familia, origem, usos, principios, parte, preparo, contra, imagem)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [nome, cientifico, familia, origem, usos, principios, parte, preparo, contra, imagem], (err, result) => {
    if (err) {
      console.error("Erro ao inserir planta:", err);
      return res.status(500).json({ erro: "Erro ao salvar planta no banco de dados." });
    }

    res.json({
      id: result.insertId,
      nome,
      cientifico,
      familia,
      origem,
      usos,
      principios,
      parte,
      preparo,
      contra,
      imagem
    });
  });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
