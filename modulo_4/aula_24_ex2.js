import http from 'k6/http';
import {sleep, check} from 'k6';
import { SharedArray } from 'k6/data'; // função usada para carregar dados apenas uma vez, mesmo com múltiplos VUS.
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"; //relatório


//Mesmo teste realizado anteriormente, porém, com id variável na url

export const options = {
    stages: [
        { duration: '10s', target: 10 }, 
        { duration: '10s', target: 10 },
        { duration: '10s', target: 0 } 
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 200']
    }
}

const data = new SharedArray('ler dados', () => {
    return JSON.parse(open('./dados.json')).users;   // no json, "users" foi o nome dado a coleção de objetos

})

export default function(){

    const userId = data[Math.floor(Math.random() * data.length)].id;  //pega um índice aleatório do array data e acessa o id contindo no objeto.
    const BASE_URL = `https://test-api.k6.io/public/crocodiles/${userId}`;
    const res = http.get(BASE_URL)
    
    check(res,{
        'status 200': (r) => r.status === 200
    });
    sleep(1);
}

export function handleSummary(data) {
    return {
      "report_aula_24.html": htmlReport(data),
    };
}