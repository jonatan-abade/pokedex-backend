import https from 'https';
import { connection } from './db_connection.js';
import crypto from 'crypto';

export function login(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        body = JSON.parse(body);

        let senha = crypto.createHash('sha256').update(body.senha.toString()).digest('hex');

        connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [body.email, senha], function (err, results) {

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
export function redefinirSenha(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        body = JSON.parse(body);

        if (!body.email) {
            res.writeHead(400);
            return res.end(JSON.stringify({ message: 'Email não informado' }));
        }

        if (!body.senha) {
            res.writeHead(400);
            return res.end(JSON.stringify({ message: 'Senha não informada' }));
        }
        let senha = body.senha.toString();

        if (body.senha.length < 6) {
            res.writeHead(400);
            return res.end(JSON.stringify({ message: 'A deve ter no mínimo 6 caracteres' }));
        }

        senha = crypto.createHash('sha256').update(senha).digest('hex');

        connection.query(`SELECT * FROM users WHERE email = ?`, [body.email], function (err, results) {

            if (err) {
                res.writeHead(500);
                return res.end(JSON.stringify({ message: 'Usuário não encontrado!' }));
            }
            if (results.length > 0) {
                if (results[0].password === senha) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ message: 'A nova senha não pode ser igual a antiga!' }));
                }

                connection.query('UPDATE users SET password = ? WHERE email = ?', [senha, body.email], function (err, updateResults) {
                    if (err) {
                        res.writeHead(500);
                        return res.end(JSON.stringify({ message: 'Erro ao atualizar senha' }));
                    }
                    res.writeHead(200);
                    return res.end(JSON.stringify({ message: 'Senha redefinida com sucesso!' }));
                });
            } else {
                res.writeHead(401);
                return res.end(JSON.stringify({ message: 'Usuário inválido!' }));
            }

        })

    })
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