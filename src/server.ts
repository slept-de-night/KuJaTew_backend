import "./common/z"; 
import { buildApp } from "./app";
import {env} from "./config/env"
const PORT = parseInt(env.PORT);
const HOST = env.HOST;
const app = buildApp();


app.listen(PORT,HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
