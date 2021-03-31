import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.json({mensagem: "Olá Mundo"});
})

app.listen(3000);