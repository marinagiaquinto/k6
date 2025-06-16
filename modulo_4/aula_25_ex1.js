import http from 'k6/http';
import { check, sleep } from 'k6';

// Teste de performance
// 10 vus por 10s
// requisição com falha inferior a 1%
// duração da requisição p(95)<500
//Requisição com sucesso superior a 95%

export const options = {
    stages: [{ duration: '10s', target: 10 }],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 500']
    }
}

export default function () {
    const USER = `${Math.random()}@mail.com`  //gera número aleatório para usar no email
    const PASS = 'user123'
    const BASE_URL = 'https://test-api.k6.io';

    console.log( USER + PASS);

    const res = http.post(`${BASE_URL}/user/register/`, {
        username: USER,
        first_name: 'crocrodilo',
        last_name: 'dino',
        email: USER,
        password: PASS
    });

    check(res, {
        'sucesso ao registar': (r) => r.status === 201
    });

    sleep(1)
}