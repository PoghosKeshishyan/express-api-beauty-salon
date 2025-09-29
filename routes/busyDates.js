const express = require("express");
const router = express.Router();
const { all, getOne, add, edit, remove } = require("../controllers/busyDates");
const { auth } = require("../middleware/auth");

router.get("/", all);
router.get("/:id", getOne);
router.post("/add", auth, add);
router.put("/edit/:id", auth, edit);
router.delete("/remove/:id", auth, remove);

module.exports = router;
