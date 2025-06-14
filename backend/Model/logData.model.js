// Import mongoose for MongoDB object modeling
import mongoose from "mongoose";

// Define the schema for logging HTTP request data
const logDataSchema = new mongoose.Schema(
  {
    // HTTP method (GET, POST, etc.)
    method: {
      type: String,
      required: [true, "HTTP method is required."],
    },
    // Requested URL
    url: {
      type: String,
      required: [true, "Request URL is required."],
    },
    // Client IP address
    ip: {
      type: String,
      required: [true, "IP address is required."],
    },
    // User-Agent header from the request
    userAgent: {
      type: String,
      required: [true, "User-Agent is required."],
    },
    // Authorization header value
    auth: {
      type: String,
      required: [true, "Authorization header is required."],
    },
    // Geolocation: Country
    country: {
      type: String,
      required: [true, "Country is required."],
    },
    // Geolocation: Region/State
    region: {
      type: String,
      required: [true, "Region is required."],
    },
    // Geolocation: City
    city: {
      type: String,
      required: [true, "City is required."],
    },
    // All request headers (stored as a mixed type for flexibility)
    headers: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Request headers are required."],
    },
    // Request body (optional, as not all requests have a body)
    body: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    // Query parameters (optional)
    query: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the logData model for use in the application
export const logData = mongoose.model("logData", logDataSchema);
