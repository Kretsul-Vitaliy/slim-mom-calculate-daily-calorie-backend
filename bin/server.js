const app = require('../app');
const { connectDB } = require('../libs');
const { mkdir } = require('fs/promises');
const { PUBLIC_DIR } = require('../libs/constants');

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, async () => {
      await mkdir(PUBLIC_DIR, { recursive: true });
      console.log(`Server running. Use our API on port:${PORT}`);
    });
  })
  .catch(error => {
    console.log(`Server not running. Error: ${error.message}`);
  });
