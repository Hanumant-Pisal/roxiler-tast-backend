const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { env } = require('./src/config/env');

// Function to start the server (only for local dev)
const startServer = async () => {
  try {
    await connectDB();
    const port = env.PORT || 9000;
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// If running locally -> start server
if (require.main === module) {
  startServer();
} else {
  // If running on Vercel -> just connect DB and export app
  connectDB().catch(err => console.error('MongoDB connection failed:', err));
  module.exports = app;
}

























// const http = require('http');
// const app = require('./src/app');
// const { connectDB } = require('./src/config/db');
// const { env } = require('./src/config/env');

// const server = http.createServer(app);

// (async () => {
//   try {
//     await connectDB();
//     const port = env.PORT || 9000;
//     server.listen(port, () => {
//       console.log(`Server running on ${port}`);
//     });
//   } catch (err) {
//     console.error('Failed to start server:', err);
//     process.exit(1);
//   }
// })();




 