const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.deletedMessage = async (req, res, next) => {
  try {
    const { messageId } = req.body;

    try {
      // Intenta encontrar y eliminar el mensaje por su ID
      const deletedMessage = await Messages.findByIdAndDelete(messageId);

      // Si el mensaje no existe, devuelve un error
      if (!deletedMessage) {
        return res.status(404).json({ msg: "Message not found." });
      }

      // Si se eliminó correctamente, responde con éxito
      return res.status(204).json({ msg: "Message deleted successfully." });
    } catch (error) {
      // Maneja errores relacionados con la eliminación
      console.error("Error deleting message:", error);
      return res.status(500).json({ msg: "Internal server error." });
    }
  } catch (ex) {
    // Maneja otros errores
    next(ex);
  }
};
