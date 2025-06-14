import geoip from "geoip-lite";
import { logData } from "../Model/logData.model.js";

// Simple function to detect code-like patterns in a string
const isCodeLike = (value) => {
  if (typeof value !== "string") return false;
  const codePatterns = [/function/, /<script>/i, /=>/, /{.*}/, /console\./, /<\/?[\w\s="/.':;#-\/]+>/];
  return codePatterns.some((pattern) => pattern.test(value));
};

// Filter out query fields that look like code
const sanitizeQuery = (query) => {
  const sanitized = {};
  for (const key in query) {
    const value = query[key];
    if (!isCodeLike(value)) {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Express middleware for logging request data to the database.
 *
 * Captures and logs details such as HTTP method, URL, client IP address,
 * user agent, authorization header, geolocation (country, region, city),
 * request headers, body, and sanitized query parameters.
 *
 * Utilizes geoip for IP geolocation and saves the log entry using the logData model.
 * Handles errors gracefully and always calls the next middleware.
 *
 * @async
 * @function logger
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
const logger = async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const geo = geoip.lookup(ip) || {};
    const country = geo.country || "Unknown";
    const region = geo.region || "Unknown";
    const city = geo.city || "Unknown";

    const logEntry = new logData({
      method: req.method,
      url: req.originalUrl,
      ip,
      userAgent: req.headers["user-agent"] || "unknown",
      auth: req.headers["authorization"] || "none",
      country,
      region,
      city,
      headers: req.headers,
      body: req.body,
      query: sanitizeQuery(req.query),
    });

    await logEntry.save();
  } catch (err) {
    console.error("Logging failed:", err.message);
  }

  next();
};

export default logger;
