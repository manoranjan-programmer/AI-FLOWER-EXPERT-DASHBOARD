const http = require('http');

const data = JSON.stringify({
  email: 'admin.ai@flowerexpert.com',
  password: 'Admin-ai@123'
});

const req = http.request({
  hostname: 'localhost',
  port: 5001,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', body);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e);
  process.exit(1);
});

req.write(data);
req.end();
