import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{endpoint:login}': ['p(95)<800'],
    'http_req_duration{endpoint:create_user}': ['p(95)<1000'],
    'http_req_duration{endpoint:add_pet}': ['p(95)<1200'],
    'http_req_duration{endpoint:get_pet}': ['p(95)<800'],
    'http_req_failed': ['rate<0.05'],
  },
};

const BASE_URL = 'https://petstore.swagger.io/v2';

export default function () {
  // login
  http.get(`${BASE_URL}/user/login?username=test&password=123`, {
    tags: { endpoint: 'login' },
  });

  // criar usuário
  http.post(`${BASE_URL}/user`, JSON.stringify({
    id: __VU,
    username: `user_${__VU}`,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    password: '123',
    phone: '123',
    userStatus: 1,
  }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'create_user' },
  });

  // adicionar pet
  http.post(`${BASE_URL}/pet`, JSON.stringify({
    id: __VU,
    name: 'dog',
    status: 'available',
  }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'add_pet' },
  });

  // buscar pet
  http.get(`${BASE_URL}/pet/1`, {
    tags: { endpoint: 'get_pet' },
  });

  sleep(1);
}
