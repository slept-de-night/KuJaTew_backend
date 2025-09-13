import "./common/z"; 
import { buildApp } from "./app";
import {env} from "./config/env"
const PORT = env.PORT;
const app = buildApp();


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
