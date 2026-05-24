import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config.js";
import { createUser, findUserByEmail, findUserById } from "../repositories/user.repository.js";

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

export async function registerUser(input) {
  const email = String(input.email || "").trim().toLowerCase();
  const password = String(input.password || "");
  const name = String(input.name || "").trim();

  if (!name || !email || password.length < 6) {
    const error = new Error("Name, valid email, and 6+ character password are required");
    error.statusCode = 400;
    throw error;
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, passwordHash });
  return { user: sanitizeUser(user), token: signToken(user) };
}

export async function loginUser(input) {
  const email = String(input.email || "").trim().toLowerCase();
  const password = String(input.password || "");
  const user = await findUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return { user: sanitizeUser(user), token: signToken(user) };
}

export async function getCurrentUser(userId) {
  const user = await findUserById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
}
