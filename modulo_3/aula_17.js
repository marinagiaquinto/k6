import http from 'k6/http';
import { check, group } from 'k6';

export const options = {
    vus: 4,
    duration: '5s', 
    thresholds:{
        'http_req_duration{group:::requisição por id}': ['p(95) < 500']
    }
}

export default () => {

    group('requisição todos os crocodilos', () => {
        const responseList = http.get('https://test-api.k6.io/public/crocodiles/');
        check(responseList, {
            'status code 200 get all': (r) => r.status === 200
        })
    })

    group('requisição por id', () => {
        const reponseForId = http.get('https://test-api.k6.io/public/crocodiles/1');
        check(reponseForId, {
            'status code 200 get id': (r) => r.status === 200
        })
    })


}
