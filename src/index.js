import express from "express";
import cors from "cors";
// import cajero from "./routes/cajero.routes.js";
import transacciones from "./routes/transacciones.routes.js";
import { Worker } from "worker_threads";
import { cpus } from "os";
import paramsConfig from "./config/params.config.js";
import messages from "./services/messages.services.js";
// import jobs from "./jobs/cajero.jobs.js";

const app = express();

app.use(cors());
app.use(express.json());

//RUTAS
app.use("/api", transacciones);
app.post("/api/messages", (req, res) => {
  //const hash = req.body;
  console.log("Datos recibidos: ", req.body);
  res.json(`Mensaje recibido.`);
  //messages.putHash(req.json.data.pagoHash, req.json.data);
});

app.listen(3001, () => {
  console.log("Cliente iniciado. Puerto 3001");
});

console.log("cpus", cpus().length);

// worker.postMessage({ msg: "init", nroWorker: 1 });

let c = 1;

const workersArray = [];

while (c <= paramsConfig.params.cantidadHilos) {
  const worker = new Worker("./src/jobs/cajero.jobs.js");
  workersArray.push(worker);
  worker.postMessage({ msg: "init", nroWorker: c });
  c++;
}
