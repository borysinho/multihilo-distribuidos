import { parentPort, workerData, isMainThread, threadId } from "worker_threads";
import personas from "../controllers/personas.controllers.js";
import deudas from "../controllers/deudas.controllers.js";
import helpers from "../helpers/cajero.helpers.js";
import paramsConfig from "../config/params.config.js";

const escogerCliente = async () => {
  try {
    let p = personas.getPersonas();

    if (!p) {
      p = await personas.loadPersonas();
    }

    return p[helpers.generarMontoAleatorio(1, 100) - 1];
  } catch (error) {
    throw error;
    //console.log("Este es el error:", error);
  }
};

const atenderCliente = async (nroWorker) => {
  try {
    setInterval(async () => {
      let clienteLocal = await escogerCliente();

      //Buscamos en la API si tiene deudas
      const deudasApi = await deudas.getDeudas(clienteLocal.id);
      // console.log("Deudas", deudasApi.Deudas);

      //Tiene deudas?
      if (deudasApi.Deudas.length > 0) {
        //Obtenemos el ID de la deuda a pagarse
        const deudaAPagar =
          deudasApi.Deudas[
            helpers.generarMontoAleatorio(1, deudasApi.Deudas.length) - 1
          ];
        //Pagamos la deuda
        //console.log("deudaAPagar", deudaAPagar);

        //Pago y devuelve si tiene saldo
        // console.log("await deudas.pagoDeuda(deudaAPagar, res);");

        try {
          // console.log("Antes de: await deudas.pagoDeuda(deudaAPagar)");
          const res = await deudas.pagoDeuda(deudaAPagar);
          // console.log("Despues de await deudas.pagoDeuda(deudaAPagar)");
          // console.log(
          //   `Pago en procesamiento - [Tx: ${res.pagoHash}] [Hilo ${nroWorker}] [ID Deuda: ${deudaAPagar.id}] [Cliente: ${clienteLocal.nombre} ${clienteLocal.apellido}]`
          // );
        } catch (error) {}
      } else {
        console.log(
          `CLIENTE SIN DEUDAS PENDIENTES: [Hilo: ${nroWorker}] [Cliente: ${clienteLocal.nombre} ${clienteLocal.apellido}]`
        );
      }
    }, paramsConfig.params.tiempoPostAtencion);

    //setTimeout(() => {}, paramsConfig.params.tiempoPostAtencion);
  } catch (error) {
    console.log("Este es el errorrr", error);
  }
};

parentPort.on("message", async (data) => {
  if (data.msg === "init" && !isMainThread) {
    console.log("parentPort.on");
    atenderCliente(data.nroWorker);
  }
});
//export default { atenderCliente };
