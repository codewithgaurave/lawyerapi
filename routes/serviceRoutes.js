import express from "express";
import { addService, getMyServices, updateService, deleteService, getAllLawyersWithServices, getServicesByLawyer } from "../controllers/serviceController.js";
import { authenticateLawyer } from "../middleware/lawyerAuth.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", authenticateLawyer, addService);
router.get("/my-services", authenticateLawyer, getMyServices);
router.put("/:id", authenticateLawyer, updateService);
router.delete("/:id", authenticateLawyer, deleteService);

router.get("/admin/all-lawyers-services", authenticateAdmin, getAllLawyersWithServices);
router.get("/lawyer/:lawyerId", getServicesByLawyer);

export default router;
