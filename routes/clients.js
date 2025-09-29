const express = require("express");
const router = express.Router();
const { all, client, add, edit, remove } = require("../controllers/clients");
const { auth } = require("../middleware/auth");

router.get("/", all);
router.get("/:id", client);
router.post("/add", auth, add);
router.put("/edit/:id", auth, edit);
router.delete("/remove/:id", auth, remove);

module.exports = router;
