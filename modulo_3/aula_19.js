import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 1,
    duration: '3s'
}

export default () => {

    const res = http.get(__ENV.URL);

    sleep(1);
}