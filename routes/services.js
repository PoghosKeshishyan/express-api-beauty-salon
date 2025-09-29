const express = require("express");
const router = express.Router();
const { all, service, add, edit, remove } = require("../controllers/services");
const { auth } = require("../middleware/auth");

router.get("/", all);
router.get("/:id", service);
router.post("/add", auth, add);
router.put("/edit/:id", auth, edit);
router.delete("/remove/:id", auth, remove);

module.exports = router;
