import app from "./app";
const dotenvConfig = require("./config/dotenvConfig");
const { PORT } = dotenvConfig;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
