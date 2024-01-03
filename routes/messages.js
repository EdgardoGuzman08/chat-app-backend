const { addMessage, getMessages, deletedMessage } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.delete("/deletemsg/", deletedMessage); // Nueva ruta para eliminar mensajes

module.exports = router;
