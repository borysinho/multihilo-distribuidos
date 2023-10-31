import dotenv from "dotenv";

dotenv.config();

const params = {
  randomMaxPagoTotal: 10, //Si sale 10 [1..10] se realiza el pago total de la deuda
  tiempoPostAtencion: 2000,
  cantidadHilos: 1,
};

const server = {
  RS_PERSONAS: process.env.RS_PERSONAS || "http://localhost:3000/api/personas",
  RS_DEUDA: process.env.RS_DEUDA || "http://localhost:3000/api/deudas/persona/",
  RS_PAGO: process.env.RS_PAGO || "http://localhost:3000/api/pagos",
  LS_MESSAGES: process.env.LS_MESSAGES || "http://localhost:3001/api/pagos",
};

export default { params, server };
