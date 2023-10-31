import axios from "axios";
import dotenv, { config } from "dotenv";
import helpers from "../helpers/cajero.helpers.js";
import paramsConfig from "../config/params.config.js";
import hash from "object-hash";
import axiosRetry from "axios-retry";
import messages from "../services/messages.services.js";

dotenv.config();

/* axiosRetry(axios, {
  retries: -1,
  retryDelay: (retryCount) => {
    console.log(`reintentando por: ${retryCount}`);
    return retryCount + 500;
  },
});
 */

//simulacion de un mapa que almacena las solicitudes por su ID
const requestStatusMap = new Map();

const pagoDeuda = async (req) => {
  const maxRetries = 1000; //numero maximo de intentos
  const retryInterval = 1000; // Milisegundos entre intentos

  try {
    const remoteURL = paramsConfig.server.RS_PAGO;

    const mpt = paramsConfig.params.randomMaxPagoTotal;

    //Si es 3, se paga el total -- TERNARIO
    const montoAPagar =
      helpers.generarMontoAleatorio(1, mpt) === mpt
        ? req.saldo
        : helpers.generarMontoAleatorio(1, req.saldo);

    //hashing Pago
    const pagoHash = hash({
      deudaId: req.id,
      monto: montoAPagar,
    });

    const body = {
      deudaId: req.id,
      monto: montoAPagar,
      pagoHash,
      responseURL: paramsConfig.server.LS_MESSAGES,
    };
    try {
      // await axios.post(remoteURL, body);
      const result = await axios.post(remoteURL, body);
      console.log("result.status()", result.status());
      // console.log("result", result);
      //axiosRetry(axios, { retries: 3 });
      return result.data;
    } catch (error) {
      throw error;
    }

    // axiosRetry(client, { retries: 3 });

    // client
    //   .post(remoteURL, body)
    //   .then((result) => res.send(result.data))
    //   .catch((error) => {
    //     throw error;
    //   });

    //Realizando Solicitud...

    // const sendRequest = async () => {
    //   try {
    //     // axiosRetry(axios, {
    //     //   retryDelay: (retryCount) => {
    //     //     return retryCount * 1000;
    //     //   },
    //     // });
    //     console.log("body", body);
    //     res.json(await axios.post(remoteURL, JSON(body)));
    //     // const response = await axios.post(remoteURL, body);
    //     // return response.data;
    //   } catch (error) {
    //     throw error;
    //   }
    // };

    // let retries = 0;
    // while (retries < maxRetries) {
    //   try {
    //     //verificar si la solicitud ya se ejecutó en el servidor
    //     if (!requestStatusMap.has(pagoHash)) {
    //       const result = await sendRequest();
    //       requestStatusMap.set(pagoHash, true);
    //       return result;
    //     } else {
    //       console.log(
    //         `La solicitud para deudaID ${body.deudaId} ya se ha ejecutado, no es necesario volver a hacerlo`
    //       );
    //       return null;
    //     }
    //   } catch (error) {
    //     console.log(
    //       `Error en la solicitud : ${body.deudaId}. Reintentando en ${
    //         retryInterval / 1000
    //       } segundos...`
    //     );
    //     await new Promise((resolve) => setTimeout(resolve, retryInterval));
    //     retries++;
    //   }
    // }
  } catch (error) {
    if (error.response) {
      //El servidor respondió con un estado HTTP diferente
      console.error(
        "Error en la respuesta del servidor: ",
        error.response.status
      );
    } else if (error.request) {
      //la solicitud no pudo llegar al servidor o no recibió la respuesta
      console.error("Error en la solicitud al servidor:", error.message);
    } else {
      // otros errors
      console.error("Error:", error.message);
    }
  }
};

const getDeudas = async (id) => {
  const retryInterval = 1000;
  const maxRetries = 1000;

  try {
    const remoteURL =
      (process.env.RS_DEUDA || "http://localhost:3000/api/deudas/persona/") +
      +id;

    const params = { answer: 42 };

    //funcion para realizar la solicitud
    const sendRequest = async () => {
      try {
        const response = await axios.get(remoteURL, { params });
        return response.data;
      } catch (error) {
        throw error;
      }
    };

    let retries = 0;
    while (retries < maxRetries) {
      try {
        return await sendRequest();
      } catch (error) {
        console.log("reintentando getDeudas");
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
        retries++;
      }
    }

    throw new Error("numero de intentos maximos alcanzados");
  } catch (error) {
    if (error.response) {
      //El servidor respondió con un estado HTTP diferente
      console.error(
        "Error en la respuesta del servidor: ",
        error.response.status
      );
    } else if (error.request) {
      //la solicitud no pudo llegar al servidor o no recibió la respuesta
      console.error("Error en la solicitud al servidor:", error.message);
    } else {
      // otros errors
      console.error("Error:", error.message);
    }
  }
};

export default { getDeudas, pagoDeuda };
