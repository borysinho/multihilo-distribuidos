import lodash from "lodash";

const transacciones = [];
const createTransaccion = async (req, res) => {
  try {
    transacciones.push(req.body);
    console.log(
      "transacciones.controllers.js createTransaccion req.body",
      req.body
    );
    res.json(transacciones[transacciones.length - 1]);
  } catch (error) {
    res
      .status(500)
      .send("Eror: transacciones.controller.js - createTransaction " + error);
  }
};

const getTransaccion = async (req, res) => {
  try {
    const idTransaccion = req.params.id;
    console.log("idTransaccion", idTransaccion);
    res.json(lodash.filter(transacciones, { id: idTransaccion }));
  } catch (error) {
    res
      .status(500)
      .send("Eror: transacciones.controller.js - getTransaccion " + error);
  }
};

const getTransacciones = async (req, res) => {
  try {
    res.json(transacciones);
  } catch (error) {
    res
      .status(500)
      .send("Eror: transacciones.controller.js - getTransacciones " + error);
  }
};

export default { createTransaccion, getTransaccion, getTransacciones };
