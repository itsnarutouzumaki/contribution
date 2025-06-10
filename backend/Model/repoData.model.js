import mongoose, { Schema } from "mongoose";

const repoDataSchema = new Schema(
  {
    organization: {
      type: String,
      required: [true, "organization is required."],
    },
    repo: {
      type: String,
      required: [true, "Repo  is required."],
    },
    responseData: [
      {
        assignee: {
          type: String,
          required: [true, "user is required."],
        },
        marks: {
          type: Number,
          required: [true, "marks is required."],
        },
      },
    ],
  },
  { timestamps: true }
);

export const repoData = mongoose.model("repoData", repoDataSchema);
