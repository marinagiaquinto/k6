import http from 'k6/http'
import { check, sleep } from 'k6'

// teste de performance
// ramp up -: 10 vus em 10s
// carga 10 vus por 10s
// ramp down 0 Vus em 10s
// sucesso > 95%
// tempo requisição p(90)<200

export const options = {
    stages:[
        {duration: '10s', target:10},
        {duration: '10s', target: 10},
        {duration: '10s', target: 0}, //do 10 vai descendo pra zero VUS, passa pra 9,8,7,6,...0
    ],
    thresholds:{
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 200']
    }
}

export default () =>{
    const BASE_URL = 'https://test-api.k6.io/public/crocodiles/1'

    const response = http.get(BASE_URL)

    check(response, {
        'status code 200': (r) => r.status === 200
    })

    sleep(1)
    // o sleep serve para garantir que o usuário só vai realizar uma requisição a cada intervalo de tempo determinado (aqui, um segundo), não mais.
    
}