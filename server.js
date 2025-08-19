const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { env } = require('./src/config/env');

const server = http.createServer(app);

(async () => {
  try {
    await connectDB();
    const port = env.PORT || 9000;
    server.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
 