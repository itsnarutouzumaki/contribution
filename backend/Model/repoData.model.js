import mongoose, { Schema } from "mongoose";

/**
 * Mongoose schema for repository data.
 *
 * Represents the structure for storing information about a repository within an organization,
 * including an array of response data for assignees and their marks.
 *
 * @typedef {Object} RepoData
 * @property {string} organization - The name of the organization. Required.
 * @property {string} repo - The name of the repository. Required.
 * @property {Array<Object>} responseData - List of assignee responses.
 * @property {string} responseData.assignee - The username of the assignee. Required.
 * @property {number} responseData.marks - The marks assigned to the assignee. Required.
 * @property {Date} createdAt - Timestamp when the document was created.
 * @property {Date} updatedAt - Timestamp when the document was last updated.
 */
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
