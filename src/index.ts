import app from "./app";
import config from "./config";

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`khk-auth-backend listening on port ${PORT}`);
});
