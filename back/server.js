const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Rota GET: listar usuários
app.get("/usuarios", (req, res) => {
    db.query("SELECT id, nome, cientifico, familia, origem,usos,principios,parte,preparo,contra,imagem FROM registro", (err, results) => {
        if (err) {
            console.error("Erro ao buscar Plantas:", err);
            res.status(500).json({ erro: "Erro ao buscar Plantas no banco de dados." });
        } else {
            res.json(results);
        }
    });
});
// Rota POST: criar usuário
app.post("/usuarios", (req, res) => {
    const { nome, cientifico, familia, origem,usos,principios,parte,preparo,contra,imagem } = req.body;
    const sql = "INSERT INTO registro (nome, cientifico, familia, origem,usos,principios,parte,preparo,contra,imagem) VALUES (?, ?, ?, ?,?,?,?,?,?,?)";

    db.query(sql, [nome, cientifico, familia, origem,usos,principios,parte,preparo,contra,imagem], (err, result) => {
        if (err) {
            console.error("Erro ao inserir usuário:", err);
            res.status(500).json({ erro: "Erro ao salvar Plantas no banco de dados." });
        } else {
            res.json({
                id: result.insertId,
                nome: nome,
                cientifico: cientifico,
                familia: familia,
                origem: origem,
                usos: usos,
                principios: principios,
                parte: parte,
                preparo: preparo,
                contra: contra,
                imagem: imagem

            });
        }
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
