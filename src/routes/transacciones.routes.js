import { Router, json } from "express";
import transaccionesCont from "../controllers/transacciones.controllers.js";

const router = Router();

router.get("/transacciones", transaccionesCont.getTransacciones);
router.get("/transacciones/:id", transaccionesCont.getTransaccion);
router.post("/transacciones", transaccionesCont.createTransaccion);

export default router;
