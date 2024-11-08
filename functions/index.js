import https from 'https';

export function login(req, res) {
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