import https from 'https';
import { connection } from './db_connection.js';

export function login(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        body = JSON.parse(body);

        connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [body.email, body.senha], function (err, results) {
            if (err) {
                res.writeHead(500);
                return res.end(JSON.stringify({ message: 'Erro ao buscar usuário' }));
            }

            if (results.length > 0) {
                res.writeHead(200);
                return res.end(JSON.stringify({ message: 'Usuário autenticado com sucessoo!' }));
            }
            res.writeHead(401);
            return res.end(JSON.stringify({ message: 'Usuário ou senha inválidos!' }));
        });
    });
}

export function listPokemons(req, res) {
    https.get('https://pokeapi.co/api/v2/pokemon?limit=10', response => {
        let data = '';

        response.on('data', chunk => {
            data += chunk;
        });

        response.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    });
}