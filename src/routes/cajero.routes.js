import { Router, json } from "express";

const router = Router();

router.get("/cajero", () => {
  console.log("/cajero");
});

export default router;
