const express = require("express");
const router = express.Router();
const { all, master, add, edit, remove } = require("../controllers/masters");
const { auth } = require("../middleware/auth");

router.get("/", all);
router.get("/:id", master);
router.post("/add", auth, add);
router.put("/edit/:id", auth, edit);
router.delete("/remove/:id", auth, remove);

module.exports = router;
