import geoip from "geoip-lite";
import { logData } from "../Model/logData.model.js";

const logger = async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const geo = geoip.lookup(ip);
    const country = geo?.country || "Unknown";
    const region = geo?.region || "Unknown";
    const city = geo?.city || "Unknown";

    const logEntry = new logData({
      method: req.method,
      url: req.originalUrl,
      ip,
      userAgent: req.headers["user-agent"] || "unknown",
      auth: req.headers["authorization"] || "none",
      country,
      region,
      city,
    });

    await logEntry.save();
  } catch (err) {
    console.error("Logging failed:", err.message);
  }

  next();
};

export default logger;
