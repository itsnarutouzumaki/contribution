import mongoose from "mongoose";

const logDataSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: [true, "HTTP method is required."],
    },
    url: {
      type: String,
      required: [true, "Request URL is required."],
    },
    ip: {
      type: String,
      required: [true, "IP address is required."],
    },
    userAgent: {
      type: String,
      required: [true, "User-Agent is required."],
    },
    auth: {
      type: String,
      required: [true, "Authorization header is required."],
    },
    country: {
      type: String,
      required: [true, "Country is required."],
    },
    region: {
      type: String,
      required: [true, "Region is required."],
    },
    city: {
      type: String,
      required: [true, "City is required."],
    },
  },
  { timestamps: true }
);

export const logData = mongoose.model("logData", logDataSchema);
