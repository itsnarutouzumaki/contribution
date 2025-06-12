import { logData } from "../Model/logData.model.js";

const logger = async (req, res, next) => {
  try {
    const logEntry = new logData({
      method: req.method,
      url: req.originalUrl,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      auth: req.headers["authorization"] || "none",
    });

    await logEntry.save();
  } catch (err) {
    console.error("Logging failed:", err.message);
  }

  next();
};

export default logger;
