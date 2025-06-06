import http, { request } from 'k6/http';
import { Counter } from 'k6/metrics'; //métrica de tipo contador
import { Gauge } from 'k6/metrics'; //métrica de tipo medição
import { Rate } from 'k6/metrics';//métricas de tipo taxa
import { Trend } from 'k6/metrics';//métricas de tipo tendências

export const options = {
    vus: 1,
    duration: '3s'
}

const chamadas = new Counter('quantidadeDeChamadas');
//Counter é um contador simples. Conta a quantidade de vezes que algo ocorreu.
const medidor = new Gauge('tempoBloqueado')
//Gauge mede valores pontuais (ex: tempo, memória, etc) da última requisição registrada (valor mais recente)
const taxa = new Rate('taxaReq200')
//Rate apresenta o percentual de algo.
const tendencia = new Trend('taxaEspera')
// Trend mede a métrica de distribuição (ex: tempo de resposta). Armazena todos os valores adicionados e apresenta como média, mediana, etc. 


//A função a seguir é realizada em loop (por cada VU) durante os 3s do teste
export default function(){
   const resp = http.get('http://test.k6.io')
   chamadas.add(1)
   //incrementa o contador 1 (medindo quantas chamadas foram feitas)
   medidor.add(resp.timings.blocked);
   //mede o tempo que a requisição ficou bloqueada (aguardando conexão TCP) - valor mais recente
   taxa.add(resp.status === 200)
   //adiciona TRUE ou FALSE para calcular a taxa de resposta com status 200
   tendencia.add(resp.timings.waiting)
   //registra o tempo de espera (entre enviar a requisição e receber a resposta), útil para analisar variações com o tempo.
}