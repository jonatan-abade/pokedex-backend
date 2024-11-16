// Importando o módulo http
import http from 'http';
import * as functions from './functions/index.js';

const hostname = '127.0.0.1';
const port = 3000;

// Função para manipular rotas
const handleRequest = (req, res) => {
    const { url, method } = req;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    try {
        if (url === '/' && method === 'GET') {
            res.end(JSON.stringify('Bem vindo ao Pokedex!'));
        } else if (url === '/login' && method === 'POST') {
            functions.login(req, res);
        } else if (url === '/pokemons' && method === 'GET') {
            functions.listPokemons(req, res);
        } else if (url === '/redefinir-senha' && method === 'POST') {
            functions.redefinirSenha(req,res);
        }else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Página não encontrada');
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.message);
    }
};

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {

    console.log(`Server running at http://${hostname}:${port}/`);
});