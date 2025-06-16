import http from 'k6/http';

//3.a constant-arrival-rate
export const options = {
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      duration: '30s',
      rate: 30, //iterações que serão feitas pelo tempo setado
      timeUnit: '1s',
      preAllocatedVUs: 50, //quantidade de usuários que serão utilizados conforme a necessidade de execução do teste
    },
  },
};

export default function () {
  http.get('https://test.k6.io/contacts.php');
}