import { Router } from "express";
import index from "./controllers/index";
import indicators from "./controllers/indicators";

const router = Router();

router.get("/", (req, res) => {
  return res.json({ message: "Servidor Node.js funcionando!" });
});
router.post("/login", index.login);
router.get("/get-indicators", indicators.getIndicators);
router.post("/create-month-history", indicators.createMonthHistory);
router.get("/get-all-history", indicators.getAllHistory);

router.get("/test", index.test);

export default router;
