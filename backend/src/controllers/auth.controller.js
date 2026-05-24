import { created, ok } from "../utils/api-response.js";
import { getCurrentUser, loginUser, registerUser } from "../services/auth.service.js";

export async function register(req, res) {
  const result = await registerUser(req.body);
  return created(res, result, "Registered");
}

export async function login(req, res) {
  const result = await loginUser(req.body);
  return ok(res, result, "Logged in");
}

export async function me(req, res) {
  const user = await getCurrentUser(req.user.id);
  return ok(res, user);
}
