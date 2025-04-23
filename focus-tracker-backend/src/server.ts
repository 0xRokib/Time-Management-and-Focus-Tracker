import app from "./app";
const dotenvConfig = require("./config/dotenvConfig");

const { PORT } = dotenvConfig;

// Export the Express API
export default app;

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
