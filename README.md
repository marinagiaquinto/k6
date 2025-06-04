# k6
Link para instalação do k6:
 https://grafana.com/docs/k6/latest/set-up/install-k6/

 ## I. Tipos de teste de performance

 ### I.a Smoke test (teste de fumaça)

 Visa validar um mínimo funcionamento, uma abordagem para carga mínima. 
 Objetivo: testar se a feature e o script são funcionais e/ou continuam funcionais após alguma alteração.

 - Carga mínima
 - Cenário Simples
 - Funcionalidade core
 - Rápido resultado

 **Carga Constante**
    export const options1 = {
        vus: 1,
        duration: "1m"
    }

### I.b Load test (teste de carga)

É a metodologia mais comum e a que comumente se referem quando falam de teste de performance. 
Objetivo: compreender o desempenho da aplicação frente a grandes cargas e requisições simultâneas. 

- Quantidade de tráfego -> deve-se levantar a quantidade de tráfego que a aplicação costumar ter nos horários de pico. Caso não tenha, alinhar com o time a quantidade de usuários esperados.

- Condições normais e de pico -> 
         - pode-se realizar o teste com uma quantidade constantes de usuários durante um determinado tempo. 
         - pode-se trabalhar com diferentes etapas de teste, alternando a quantidade de usuários ao longo do tempo. Benefícios:
            - permitir que seu sistema aqueça ou redimensione automaticamente para lidar com o tráfego
            - permitir que você compare o tempo de resposta entre os estágios de carga baixa (carga inicial) e carga nominal (quando estamos com carga constante no sistema). 

- Garantir funcionamento

**Carga Constante**
    export const options1 = {
        vus: 100,
        duration: "20m"
    }

**Carga Variável**
    export const options2 = {
        stage:[
            {duration: "5m", target:100 }
            {duration: "10m", target: 100}
            {duration: "5m", target: 0}
        ]
    }

### I.c Stress e Skipe test

Objetivo: Responder como o sistema se comportará sobre alta carga

- Avaliar disponibilidade, estabilidade e a recuperabilidade do sistema.
- Avaliar a arquitetura da aplicação, descobrindo possíveis gargalos. 

#### I.c.a Teste de Stress

**4 Perguntas a serem respondidas ao realizar o teste de Stress**

1. Como seu sistema se comporta em condições extremas?
2. Qual é a capacidade máxima do seu sistema em termos de usuários ou taxa de transferência?
3. Qual o ponto de ruptura do seu sistema (ponto em que o sistema não suporta mais receber requisições / carga de usuários)?
4. O sistema se recupera sem interveção manual após o término do teste de estresse?

*Grande quantidade de usuários que aumentam progressivamente ao longo de alguns minutos.*

    export const options = {
        stage:[
            {duration: "2m", target:100 }
            {duration: "5m", target: 100}
            {duration: "2m", target: 200}
            {duration: "5m", target: 200}
            {duration: "2m", target: 300}
            {duration: "5m", target: 300}
            {duration: "2m", target: 400}
            {duration: "5m", target: 400}
            {duration: "10m", target: 0}
        ]
    }

**O que pretende responder:** 

1. A rapidez com que os mecanismos de dimensionamento automático reagem ao aumento da carga. (Diante do testes de stress, a aplicação deve escalar, aumentando e diminuindo sua capacidade conforma a carga. Isso faz com que se gaste apenas com a infoaestrutura necessária, evitando ter uma capacidade maior do que a necessária por demanda em cada serviço.)
2. Se há alguma falha durante os eventos de dimensionamento.


#### I.c.b Spike Teste

Diferente do teste de stress, não aumenta de forma gradual a carga. 
*Carga extrema em um período de tempo muito curto (fração de segundos).*

**O que pretende responder:** 

    1. Como seu sistema funcionará sob um aumento repentino de tráfego?
    2. O seu sistema irá se recuperar assim que o tréfego diminuir (redimensionamento) ?

**Como resultado, o sistema reage de 4 maneiras diferentes**
    1. Execelente:
    o sistema não é degradado durante o aumento de tráfego, com tempo de resposta semelhante ao de tráfegos menores;
    2. Bom: 
    tempo de resposta mais lento, mas não apresenta erro, conseguindo atender a todas as requisições;
    3. Satisfatório: 
    o sistema produz erros durante o aumento de tráfego repentino, mas volta ao normal depois que o tráfego diminui;
    4. Ruim: 
    o sistema trava e não se recupera depois que o tráfego repentino diminui.


    export const options = {
        stage:[
            {duration: "10s", target:100 }
            {duration: "1m", target: 100}
            {duration: "10s", target: 1400}
            {duration: "3m", target: 1400}
            {duration: "10s", target: 100}
            {duration: "3m", target: 100}
            {duration: "10s", target: 0}
        ]
    }
