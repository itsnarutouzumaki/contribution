/**
 * Axios global configuration file.
 *
 * - Imports the Axios HTTP client library.
 * - Sets the default configuration to include credentials (such as cookies, authorization headers, or TLS client certificates)
 *   in cross-site requests.
 *
 * This configuration ensures that authentication information is sent with every HTTP request made using Axios,
 * which is essential for applications that rely on session-based authentication or require secure communication
 * between the frontend and backend.
 *
 * @module axiosConfig
 */
import axios from "axios";

axios.defaults.withCredentials = true;
