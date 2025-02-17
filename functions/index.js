import https from 'https';
import { connection } from './db_connection.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer'
import knex from 'knex';
import { timeStamp } from 'console';

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
export function sendmail(req, res) {
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


        connection.query(`SELECT * FROM users WHERE email = ?`, [body.email], function (err, results) {


            if (results.length > 0) {


                function generateToken() { return crypto.randomBytes(20).toString('hex'); }

                const token = generateToken();

                const timeStamp = Date.now()
                    knex('password_resets').insert({ 
                                email: body.email,
                                token: token,
                                created_at: timeStamp,
                                expired_at: timeStamp
                            }).useNullAsDefault; 

                            let transport = nodemailer.createTransport({
                                host: "sandbox.smtp.mailtrap.io",
                                port: 2525,
                                auth: {
                                    user: process.env.EMAIL_USER,
                                    pass: process.env.EMAIL_PASS
                                }
                            });

                            let mailOptions = {
                                from: 'moreply@gmail.com',
                                to: `${body.email}`,
                                subject: 'Sending Email using Node.js',
                                text: `Link para redefinição de senha! 
            
                     Siga as orientações abaixo. ☻

                        Para concluir a solicitação, clique no link, preencha corretamente os seus dados e confirme.

                    LINK:   ${token} 
        
                        Caso erre o preenchimento do token na aplição, uma nova solicitação deve ser feita. `
                            };

                            transport.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });

                            res.end(JSON.stringify({ message: 'Email enviado com sucesso!' }));

                        } else {
                            res.writeHead(500);
                            return res.end(JSON.stringify({ message: 'Email inválido!' }));

                        }
                    });

            })
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

            connection.query(`SELECT * FROM users WHERE email = ?`, [body.email], function (err, results) {

                if (results.length > 0) {

                    if (!body.senha) {
                        res.writeHead(400);
                        return res.end(JSON.stringify({ message: 'Senha não informada' }));
                    }
                    let senha = body.senha.toString();

                    if (body.senha.length < 6) {
                        res.writeHead(400);
                        return res.end(JSON.stringify({ message: 'A senha deve ter no mínimo 6 caracteres' }));
                    }

                    senha = crypto.createHash('sha256').update(senha).digest('hex');
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
                    res.writeHead(500);
                    return res.end(JSON.stringify({ message: 'Usuário não encontrado!' }));
                }
            });

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