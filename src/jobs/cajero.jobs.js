import { parentPort, workerData, isMainThread } from "worker_threads";
import personas from "../controllers/personas.controllers.js";
import deudas from "../controllers/deudas.controllers.js";
import helpers from "../helpers/cajero.helpers.js";
import paramsConfig from "../config/params.config.js";
import { setTimeout } from "timers/promises";
import delay from "delay";

const escogerCliente = async () => {
  try {
    let p = personas.getPersonas();

    if (!p) {
      p = await personas.loadPersonas();
    }

    return p[helpers.generarMontoAleatorio(1, 100) - 1];
  } catch (error) {
    console.log("Error:", error);
  }
};

const atenderCliente = async (nroWorker) => {
  setInterval(async () => {
    try {
      //let clienteLocal = await escogerCliente();
      let clienteLocal = await escogerCliente();
      //console.log("cliente.id: ", clienteLocal.id);

      //Buscamos en la API si tiene deudas
      //const deudasApi = await deudas.getDeudas(clienteLocal.id);
      const deudasApi = await deudas.getDeudas(clienteLocal.id);
      console.log("Deudas", deudasApi.Deudas);

      //Tiene deudas?
      if (deudasApi.Deudas.length > 0) {
        //console.log("SI tiene deudas");
        //Obtenemos el ID de la deuda a pagarse
        const deudaAPagar =
          deudasApi.Deudas[
            helpers.generarMontoAleatorio(1, deudasApi.Deudas.length) - 1
          ];
        //console.log("idDeudaAPagar:", deudaAPagar.id);
        //Pagamos la deuda
        const res = {};

        //Pago y devuelve si tiene saldo
        await deudas.pagoDeuda(deudaAPagar, res);
        console.log(`Worker ${nroWorker}. Pagando deuda: ${deudaAPagar.id}`);

        //personas.tieneDeudasLocal();

        //delay()
        //delay(1000);
      } else {
        console.log(
          `Worker ${nroWorker}. Deudas pagadas. Buscando otro cliente`
        );
      }

      //setTimeout(() => {}, paramsConfig.params.tiempoPostAtencion);
    } catch (error) {
      console.log("error", error);
    }
  }, paramsConfig.params.tiempoPostAtencion);
};

parentPort.on("message", async (data) => {
  if (data.msg === "init") {
    //setInterval(() => {
    atenderCliente(data.nroWorker);
    //}, paramsConfig.params.tiempoPostAtencion);
  }
});
//export default { atenderCliente };
