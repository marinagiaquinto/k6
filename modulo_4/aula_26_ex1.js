import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

//Realizar o login com um novo usuário
// Stress test
  // ramp up 5VU em 5s
  // carga 5vu por 5s
  // ramp up 50 vus em 2s
  // carga de 50 vu em 2s
  // ramp down 0 vu em 5s
// Requisição com falha inferior a 1%


export const options = {
    stages: [
        { duration: '5s', target: 5 },
        { duration: '5s', target: 5 },
        { duration: '2s', target: 50 },
        { duration: '2s', target: 50 },
        { duration: '5s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate < 0.01']
    }
}

const csvData = new SharedArray('Ler dados', function(){
    return papaparse.parse(open('./usuarios.csv'), {header: true}).data;  
}); //papaparse.parse para a leitura do csv. Pega o arquivo de texto e o transforma em um array. "data" é o nome atribuído ao array nessa transformação
    //header: true -> informa que o csv já possui cabeçalho

export default function () {
    const USER = csvData[Math.floor(Math.random() * csvData.length)].email //Pega um valor de email do arquivo csv, aleatoriamente. 
    const PASS = 'user123'                                                 //Ao multiplicar o número aleatório por csvData.length, você obtém um número de ponto flutuante que varia de 0 até 55. Ex: Se Math.random() for 0.87 e csvData.length for 3, o resultado será 2.61.
    const BASE_URL = 'https://test-api.k6.io';                             // O Math.floor arredonda o número de ponto flutuante para baixo e ele vira o índice do array de objetos (emails) que será considerado. ex: 2.61 -> 2 = 0.7468106955225898@mail.com
    console.log(USER);

    const res = http.post(`${BASE_URL}/auth/token/login/`, {
        username: USER,
        password: PASS
    }); //Faz o login usando um dos emails e senhas criadas

    check(res, {
        'sucesso login': (r) => r.status === 200,
        'token gerado': (r) => r.json('access') != '' //verifica se criou o token JWT após o login
    }); 

    sleep(1)
}