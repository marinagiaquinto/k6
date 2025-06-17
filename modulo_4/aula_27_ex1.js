import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"; //relatório


//Realizar consulta a API de listagem de crocodilos e busca por id de crocodilos
// é esperado um RPS de 200 Req/spara a API de listagem durante 30s
//Para a busca por id, o sistema deve atender 50 usuários onde cada usuário realiza
//até 20 solicitações em até 1 min: 
   // usuários par devem relizar busca ao crocodilo de ID2
   // usuários ímpar devem relizar busca ao crocodilo de ID1
//Ambos os testes devem ser executados simultâneamente.

export const options = {
    scenarios:{
        listar: {
            executor: 'constant-arrival-rate',
            exec: 'listar',
            duration: '30s',
            rate: 200,
            timeUnit: '1s',
            preAllocatedVUs: 150,  //VUs pré-alocadas para caso os outros UVs ainda estejam fazendo requisições quando virar o segundo
            gracefulStop: '5s',  //margem de tempo para caso chegue nos 30 segundos e ainda tenha alguma requisião em execução
            tags: { test_type: 'listagem_crocodilos' },

        },
        buscar: {
            executor: 'per-vu-iterations',
            exec: 'buscar',
            vus: 50,
            iterations: 20,
            maxDuration: '1m',
            tags: { test_type: 'busca_crocodilos' },
            gracefulStop: '5s'
        }
    },
    discardResponseBodies: true
}

const BASE_URL = 'https://test-api.k6.io';

export function listar(){
    
    http.get(BASE_URL+'/crocodiles')
};

export function buscar(){
    if(__VU % 2 === 0){   // % calcula o resto da divisão e __VU é uma variável global que representa o índice do Virtual User (VU) atual que está executando o código.
        http.get(BASE_URL+'/crocodiles/2')
    }else{
        http.get(BASE_URL+'/crocodiles/1')
    }
};

export function handleSummary(data) {
    return {
      "report_aula_27.html": htmlReport(data),
    };
  }