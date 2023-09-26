import axios from "axios";
import dotenv from "dotenv";
import helpers from "../helpers/cajero.helpers.js";
import paramsConfig from "../config/params.config.js";

dotenv.config();

const pagoDeuda = async (req) => {
  try {
    const remoteURL = process.env.RS_PAGO || "http://localhost:3000/api/pagos";

    const mpt = paramsConfig.params.randomMaxPagoTotal;

    //Si es 3, se paga el total -- TERNARIO
    const montoAPagar =
      helpers.generarMontoAleatorio(1, mpt) === mpt
        ? req.saldo
        : helpers.generarMontoAleatorio(1, req.saldo);

    const body = {
      deudaId: req.id,
      monto: montoAPagar,
    };
    return await axios.post(remoteURL, body).data;
  } catch (error) {
    console.log("error", error);
  }
};

const getDeudas = async (id) => {
  try {
    const remoteURL =
      (process.env.RS_DEUDA || "http://localhost:3000/api/deudas/persona/") +
      +id;

    return (
      await axios.get(remoteURL, {
        params: { answer: 42 },
      })
    ).data;
  } catch (error) {
    console.log("Error", error);
  }
};

export default { getDeudas, pagoDeuda };
