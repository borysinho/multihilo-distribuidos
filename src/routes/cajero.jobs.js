import { Router, json } from "express";

const router = Router();

router.use("/cajero", () => {
  console.log("/cajero");
});

export default router;
