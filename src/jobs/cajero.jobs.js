import { parentPort, workerData, isMainThread, threadId } from "worker_threads";
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
  try {
    setInterval(async () => {
      let clienteLocal = await escogerCliente();

      //Buscamos en la API si tiene deudas
      const deudasApi = await deudas.getDeudas(clienteLocal.id);
      //console.log("Deudas", deudasApi.Deudas);

      //Tiene deudas?
      if (deudasApi.Deudas.length > 0) {
        //Obtenemos el ID de la deuda a pagarse
        const deudaAPagar =
          deudasApi.Deudas[
            helpers.generarMontoAleatorio(1, deudasApi.Deudas.length) - 1
          ];
        //Pagamos la deuda
        const res = {};

        //Pago y devuelve si tiene saldo
        await deudas.pagoDeuda(deudaAPagar, res);
        console.log(
          `PAGANDO DEUDA: [Hilo ${nroWorker}] [ID Deuda: ${deudaAPagar.id}] [Cliente: ${clienteLocal.nombre} ${clienteLocal.apellido}]`
        );
      } else {
        console.log(
          `CLIENTE SIN DEUDAS PENDIETES: [Hilo: ${nroWorker}] [Cliente: ${clienteLocal.nombre} ${clienteLocal.apellido}]`
        );
      }
    }, paramsConfig.params.tiempoPostAtencion);

    //setTimeout(() => {}, paramsConfig.params.tiempoPostAtencion);
  } catch (error) {
    console.log("error", error);
  }
};

parentPort.on("message", async (data) => {
  if (data.msg === "init") {
    atenderCliente(data.nroWorker);
  }
});
//export default { atenderCliente };
