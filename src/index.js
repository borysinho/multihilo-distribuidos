import express, { json } from "express";
import cors from "cors";
import cajero from "./routes/cajero.jobs.js";
import { Worker } from "worker_threads";
import { cpus } from "os";
import paramsConfig from "./config/params.config.js";
//import jobs from "./jobs/cajero.jobs.js";

const app = express();

app.use(cors());
app.use(express.json());

//RUTAS
app.use("/api", cajero);

app.listen(3001, () => {
  console.log("Servidor funcionando en puerto 3001");
});

console.log("cpus", cpus().length);

//worker.postMessage({ msg: "init", nroWorker: 1 });

let c = 1;

const workersArray = [];
while (c <= paramsConfig.params.cantidadHilos) {
  const worker = new Worker("./src/jobs/cajero.jobs.js");
  workersArray.push(worker);
  worker.postMessage({ msg: "init", nroWorker: c });
  c++;
}
