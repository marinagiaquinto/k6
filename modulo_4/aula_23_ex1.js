import http from 'k6/http';
import { check } from 'k6';

//Objetivo:
// - smoke teste
// - 1 usuário
// - 30 segundos
// - taxa de sucesso acima de 99%


export const options = {
    vus:5,
    duration: '30s',
    thershoulds:{
        check: ['rate > 0.99']
    }
};

export default () => {
    const BASE_URL = 'https://test-api.k6.io/public/crocodiles';
    // primeiro salva a url que será utilizada

    const response = http.get(BASE_URL)
    // faz o get pra url salvando sua resposta na variável

    check(response, {
        'status code 200': (r) => r.status === 200
    })
}