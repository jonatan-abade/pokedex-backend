const http = require('http');

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
            res.end(JSON.stringify({ message: 'Bem vindo ao Pokedex!' }));
        } else if (url === '/login' && method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                body = JSON.parse(body);
                if (body.email == 'teste@teste.com' && body.senha == 1234) {
                    res.writeHead(200);
                    return res.end(JSON.stringify({ message: 'Usuário autenticado com sucesso!' }));
                }
                res.writeHead(401);
                return res.end(JSON.stringify({ message: 'Usuário ou senha inválidos!' }));
            });

        } else if (url === '/contato' && method === 'GET') {
            res.end('Página de Contato');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Página não encontrada');
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno no servidor');
    }
};

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});