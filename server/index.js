const app = require('./app');
const PORT = process.env.PORT || 5001;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aflowerexpert.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Admin Analytics Server running on http://localhost:${PORT}`);
  console.log(`Default Credentials -> Email: ${ADMIN_EMAIL} | Password: ${ADMIN_PASSWORD}`);
  console.log(`====================================================`);
});
