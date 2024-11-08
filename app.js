const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// Função para manipular rotas
const handleRequest = (req, res) => {
    const { url, method } = req;
    res.writeHead(200, { 'Content-Type': 'application/json' });

    try {
        if (url === '/' && method === 'GET') {
            res.end(JSON.stringify({ message: 'Hello World' }));

        } else if (url === '/login' && method === 'POST') {
            res.end('Página Sobre');
        } else if (url === '/contato' && method === 'GET') {
            res.end('Página de Contato');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Página não encontrada');
        }
    } catch (err) {
        // res.writeHead(500, { 'Content-Type': 'application/json' });
        // res.write({ message: `Erro interno no servidor \n ${err.message}` });
        res.write(`Erro interno no servidor \n ${err}`);
        res.end();
    }
};

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});