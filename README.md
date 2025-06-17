# k6
Link para instalação do k6:
 https://grafana.com/docs/k6/latest/set-up/install-k6/

## I. Tipos de teste de performance


### 1. Smoke test (teste de fumaça)

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



### 2. Load test (teste de carga)

É a metodologia mais comum e a que comumente se referem quando falam de teste de performance. 
**Objetivo: compreender o desempenho da aplicação frente a grandes cargas e requisições simultâneas.**

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



### 3. Stress e Spike test


**Objetivo:** 
**- Avaliar a estabilidade do sistema sob condições adversas**
    - disponibilidade, estabilidade e a recuperabilidade do sistema.
    - Avaliar a arquitetura da aplicação, descobrindo possíveis gargalos. 

#### 3.a Teste de Stress

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


#### 3.b Spike Teste

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


### 4. Soak Testing 

**Objetivo: avaliar a confiabilidade em longos períodos de tempo**

Simula dias de tráfego no sistema em poucas horas

O que pretende responder:
- O sistema sofre de bugs ou vazamento de memória?
- Existem reinicializações inesperadas do aplicativo que fazem perder solicitações?
- Existem bugs esporádicos relacionados a condições de corrida (quando dois recursos computacionais estão tentando acessar uma mesma informação)?

- Certificar que seu banco de dados não esgote o espaço de armazenamento alocado e pare.
- Certificar que os logs não esgotem o armazenamento em disco alocado
- Certificar que os serviços externos dos quais você depende não parem de funcionar após a execução de uma certa quantidade de solicitações. 

    export const options = {
        stage:[
            {duration: "2m", target:400 }
            {duration: "3h56m", target: 400}
            {duration: "2m", target: 0}
        ]
    }


ATENÇÃO:
- o objetivo do teste não é atingir o ponto de ruptura (o ponto em que o sistema passa a ter dificuldade de funcionamento ao continuar aumentando a quantidade de usuários). Portanto, deve-se ter o conhecimento do ponto de ruptura para ficar a baixo dele. Mantendo +- 80% de sua capacidade, de forma constante.
- ter alinhado com a equipe o custo de realizar esse teste de forma prolongada (existem testes que duram dias, não só horas). Frente ao seu alto custo, é um dos testes que mais precisam de planejamento prévio para ser executado, tendo sempre em mente se ele atinge o objetivo de teste esperado pela equipe. 


### 5. Breakpoint Testing (pontos de interupção; teste da capacidade; teste de carga pontual ou teste de limite)

**Objetivo: encontrar os limites do seu sistema**

- Ajustar/ cuidar de pontos fracos do sistema, buscando limites maiores suportados pelo sistema. 
- Ajudar a planejar e verificar a correção de sistema com baixo limite de utilização.

Quando realizar esse teste:
- Após mudanças significativas na base de código/infraestrutura
- Consumo elevado de recursos pelo seu sistema
- Ajuda a encontrar os limites do sistema (ex: qutd de usuários) e ajuda a verificar após alterações se o limite realmete mudou.

- Atenção a elasticidade de ambientes de nuvem
- Aumento de carga gradual para essa modalidade
- Tipo de teste de ciclo iterativo (deve ser conduzido diversas vezes até conseguir verificar o limite do sistema, não é um teste feito uma única vez)
- Interrupção manual ou automática. (chegando ao limite, pode parar o teste)

**Seu sistema foi aprovado nos demais tipos de teste?**
Esse teste deve ser realizado com sistemas mais maduros, que já tiveram a aprovação dos outros testes de performance. Não é um tipo de teste a ser realizado inicialmente. 

    export const options = {
        executor: 'ramping-arrival-rate'
        stage:[
            {duration: "2h", target:20000 }
        ]
    }



## II. Execução
    cd <pasta/modulo>
    k6 run <aula>


## III. Ciclo de vida (aula 10)

Diferente de outras ferramentas de teste de performance (ex: Jmeter), o K6 tem um ciclo bem definido. Ou seja, independente do tipo de teste e/ou tempo de execução, sempre passará pela mesma estrutura (mesmas fases, na mesma ordem):

### 1. Inicialização
Etapa de configuração.
Essa chamada ocorre uma única vez e é nela em que carregaremos os arquivos locais (dados compartilhados com todos os usuários virtuais - vu), importamos os módulos a serem utilizados no k6, etc.

    import sleep from 'k6';

### 2. Configuração
É possível ter mais de um bloco de configurações. 
Etapa executada repetidamente durante a execução do teste.


#### 2.1 Difereça entre VUS e TARGET

| O que é | Onde é usado   | Significado |
|---------|----------------|-------------|
| vus     |Fora do stages  |Define um número **FIXO** de usuários virtuais durante todo o teste|
|target   |Dentro do stages|Define um número de vus que o teste deve **ATINGIR** em cada estágio|



Definição da quantidade de usuários e do tempo de duração da execução.

Ex1: Inicia com 5 VUs e assim se mantém durante todo o teste

    export const options = {
        vus: 5                 
        duration: '10s'  
    }



Ex2: 3 blocos: 
- 0 -> 100 em 5 min; 
- mantém 100 vus por mais 10m; 
- 100 -> 0 em 5 min


    export const options = {
        stage:[
            {duration: "5m", target:100 }
            {duration: "10m", target: 100}
            {duration: "5m", target: 0}
        ]
    }



### 3. Execução (ou código VU)
Onde se define a execução do teste.

export default function(){
    console.log("testando o k6");
    sleep(1);
}


### 4. Desmontagem
Etapa opcional executada uma única vez, onde se processa os resultados do teste.
Muito importante quando precisa enviar os resultados para algum lugar e/ou para notificação de outros sistemas.

    export function teardown(data){
        console.log(data)
    }



## IV. Métricas (aulas 13 e 14)

O k6 já possui métrica integradas a ele mas é possível criar outras métricas que não venham nele por padrão.

### 1. Métricas Integradas

#### 1.a Principais métricas padrão do k6

Abaixo estão as mais usadas e úteis:

| Métrica	             | Tipo	 | O que mede| 
|------------------------|-------|------------|
|http_reqs	             |Counter|Total de requisições HTTP feitas|
|http_req_duration       |Trend  |Duração total de uma requisição HTTP (DNS + TCP + TLS + espera + resposta)|
|http_req_failed         |Rate	 |Proporção de requisições HTTP que falharam|
|http_req_blocked        |Trend	 |Tempo bloqueado (ex: espera de conexões)|
|http_req_connecting     |Trend	 |Tempo gasto conectando ao servidor|
|http_req_tls_handshaking|Trend	 |Tempo gasto na negociação TLS/SSL|
|http_req_sending        |Trend	 |Tempo de envio dos dados da requisição|
|http_req_waiting        |Trend	 |Tempo de espera pela resposta do servidor (tempo de “TTFB”)|
|http_req_receiving      |Trend	 |Tempo gasto recebendo os dados da resposta|
|vus                     |Gauge	 |Número atual de VUs (usuários virtuais) ativos|
|vus_max                 |Gauge	 |Número máximo de VUs durante o teste|
|checks                  |Rate   |Proporção de check()s que passaram|
|iteration_duration      |Trend	 |Duração total de uma iteração da função default|
|iterations              |Counter|Total de iterações executadas|

#### 1.b Tipos de Métrica

|Tipo de Métrica | Nome em inglês | Exemplo              | Função|
|----------------|----------------|----------------------|------------------------------------------------------------------------------------------------------|
|Contadores      |**Counter**     | (http_reqs, iterations)   | Conta quantas vezes algo aconteceu. Realizam somas e incrementos.
|Taxas           |**Rate**        | (checks, http_req_failed) | Proporção entre sucesso/falha. 
|Tendência       |**Trend**       | (http_req_duration, iteration_duration, http_req_waiting) | Cálculo de média, moda, mediana e percentis de intervalos de confiança.
|Medidor         |**Gauge**       | (vus, vus_max)        | Mede um valor no tempo atual, como o número de VUs ativos. Rastreia quando um valor diferente de zero ocorre.


### 2. Métricas personalizadas

Assim como as métricas integradas, se dividem nos mesmos 4 tipos. 
No entanto (como apresentado na aula 14), a função deve ser setada no código com os diversos métodos de métricas a serem apresentadas de forma automática no resultado. 

![metrica_personalizada](/imagens/metricas_personalizadas.png)

### 3. Thresholds -> limite. (aula 15)

Um dos recursos mais importantes na utilização do k6.
Utilizados como critérios de reprovação ou aprovação de um teste. 
**O limite também é uma métrica, mas uma métrica que esperamos que o teste atenda.** Caso ele não atenda, o teste terminará (no tempo normal, sem ser interrompido) com status de FALHA.

Não é necessário importar nenhum módulo. Apenas inserir os parâmetros dentro de options, na configuração do teste (sendo possível usar mais de um limite para cada parâmetro)

![limite](/imagens/limite.png)

Caso deseje abortar a execução quando um limite for atingido, precisa deixar isso exposto no código. 

![limite_req_abort](/imagens/limit_abort.png)

Delay: caso quebre, ele ainda espera mais o tempo de delay para parar a execução

![delay](/imagens/delay.png)




## V. Módulos (aula 16)

Existem três tipos de módulos:

![modulos](/imagens/modulos.png)

### 1. Módulos Embutidos
Módulos que já fazem parteda própria ferramenta. São os que garantem melhor performance.

### 2. Módulos Remotos
Módulos que não estão imbutidos diretamente nas libs do k6 mas que utilizamos por meio de importação remota através do protocolo HTTP.
Caso precise utilizar, sempre dê preferência aos citados em https://jslib.k6.io/ . 

### 3. Módulos do sistema local
Fazer a utilização de um arquivo local para execução, tornando-o um módulo para execução da ferramenta.



## VI. Grupos (aula 17)

Ao realizar mais de uma requisição, os relatórios do k6 não conseguem diferenciar as requisições se não segragá-los por grupos. 
Um grupo pode ser formado de uma ou mais requisições (uma transação) necessárias para realizar uma ação. 

**Transação:**
Ações necessárias para realizar uma transação. 
Ex: Teste de login. Para realizar o login será necessário criar o usuário. Portanto, o fluxo que reune a criação do usuário com a requisição do login, compõe uma transação. 

Ex de requisições em grupo e separação de métricas

![group](/imagens/group.png)


## VII. Tags (aula 18)

Tags são maneiras de rotular elementos no k6 (podendo ser utilizadas em conjunto com os grupos). 
Sua importância se da mais especificamente quando esses dados serão usados em outra ferramenta e se faz necessário uma tag pra distinguir de qual requisição os dados estão tratando.
Porém, existem formar diferentes de utilização:

1. Requests
2. Checks
3. Thresholds
4. Métricas customizadas
5. Todas as métricas de um teste


## VIII. Ambientes (aula 19)

Para o código reconhecer uma variável, é necessário setar a variável com   __ENV.<nome da variável> . 

![variavel_ambiente](/imagens/variavel_ambiente.png)


## IX. Scenarios (aula 20, 21 e 22)

Os cenários nos permitem determinar **COMO** as **VUs** e as **iterações** serão executadas no nosso script de teste. 

Os executores no k6 são agrupados em 3 grupos:

### 1. Por número de iterações

#### 1.a shared-iterations

Compartilha iterações entre VUs.
- Executor adequado quando desejamos que um **número específico de VUs** complete um **número específico de iterações**
- Quantidade de iterações por VU **não importa**
- **Tempo para concluir** uma série de iterações **é importante**


#### 1.b per-vu-iterations

Onde cada VU realiza o número de iterações configurada.
- **Número específico de VUS** para completar um **número fixo de iterações**
- Importante quando deseja particionar dados de teste entre as VUs, tendo que garantir o número de iterações de cada usuário virtual.

### 2. Por números de VUs

#### 2.a constant-vus
Envia um número de VUs constante para a execução.
- **Número específico de VUs** seja executado por um **período especificado de tempo**
- Não importa o número de iterações, foco na quantidade de tempo mantida em iteração dos VUs.

#### 2.b ramping-vus
Aumenta o número de VUs conforme seus estágios configurados.

### 3. Por taxa de iteração

#### 3.a constant-arrival-rate
Inicia a iteração a uma taxa constante.
- Executor com foco em métricas como o RPS.
- Número fixo de iterações iniciadas pelo k6 (ex: rate/iterações = 30)
- Novas iterações iniciadas enquanto houver VUs disponíveis. 
- Novas iterções seguindo sempre a taxa configurada. 
(no exemplo, inserimos mais 50 VUs pra  caso algum usuário dos 30 utilizados no segundo anterior ainda estejam em execução. Então ao invés de aguardar liberarem usuários, usa da "taxa" a mais de segurança garantindo sempre 30 usuários iteragindo por minuto)


#### 3.b ramping-arrival-rate
Aumenta a taxa de iteração de acordo com os estágios configurados.

#### Ex dos quatro tipos trabalhados no curso
![executor](/imagens/executor.png)


## X. Relatórios (aula 28 e 32)

Os relatórios fazem com que os dados resultantes do teste não mais apareçam no console e, sim, em uma pág web. 
Para isso, como expresso na aula 28, basta exportar o módulo htmlReport e utilizar a função requeria. 

1. Ao executar o teste será gerado automaticamente um novo arquivo. 

![relatorio](/imagens/exec_relatorio.png)

2. Indo na pasta e clicando no seu ícone, abrirá a página WEB.

![relatorio](/imagens/icone_relatorio.png)
![relatorio](/imagens/web_relatorio.png)

3. Relatório no yaml 

Para adicionar o relatório ao yaml, é necessário que dentro do arquivo de teste se tenham as configs pra geração de relatório e que também tenha no yaml. 
Depois de executada a pipeline > clicar na execução > clicar em **"relatorio de testes de performance"** > abrir a pasta zip > abrir o(s) arquivo(s) html. 
Clicando no arquivo html, terá acesso ao relatório do teste requerido. 

![relatorio_yaml](/imagens/relatorio_yaml.png)


## XI. Teste de Performance no Front-end (aulas 33, 34 e 35)

O K6 se destaca por conseguir fazer testes de performance tanto do back-en quanto do front-end. Os testes podem ser feitos considerando apenas cada camada separamente ou podem considerá-las de forma integrada.

### 1. Objetivo geral do teste de desempenho de front-end:
- Analisar se as páginas do aplicativo são otimizadas para renderizar rapidamente na tela de um usuário.
- Analisar quanto tempo leva para um usuário interagir com os elementos de interface do aplicativo. 


### 2. Tipos de teste de desempenho de front-end

#### 2.1 Navegador:

O teste de carga baseado em navegador verifica o **desempenho do front-end** de um aplicativo **simulando usuários** reais usando um navegador para **acessar seu site**. 
Aqui o objetivo é analisar **APENAS** o desempenho do **front-end**, desconsiderando o tempo de resposta do back-end.

#### 2.2 Protocolo:

O teste de carga baseado em protocolo verifica o **desempenho do back-end** de um aplicativo simulando as solicitações subjacentes às ações do usuário. 
Ou seja, as ações são feitas a partir das interações com o front-end, mas mede-se o tempo de resposta do front-end com base no tempo de resposta do back-end. 

#### 2.3 Híbrido:

O teste de carga híbrido é uma combinação de teste de carga aseado em protocolo e baseado em navegador.
Aqui realiza-se a análise tanto de pontos específicos do front-end quanto pontos do front-end em interação com o back-end.