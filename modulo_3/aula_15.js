import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 1,
    duration: '30s',
    thresholds: { //define quais limites o teste deve atender
        http_req_failed: ['rate < 0.01'], //taxa de falha inferior a 1%
        http_req_duration: ['p(95) < 200', 'p(90) < 400'], //duração da requisição deve ter um percentil de 95% maior que 200 milissegundos e 90% maior que 400.
        checks: ['rate > 0.99'] //taxa de sucesso dos testes tem que ser maior que 99%
    }
}

export default function(){
   const resp = http.get('http://test.k6.io')

   check(resp, {
    'Status code 200': (r) => r.status === 200
   })
}