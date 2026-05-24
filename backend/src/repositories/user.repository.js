import { User } from "../db/models/index.js";

export function createUser(values) {
  return User.create(values);
}

export function findUserByEmail(email) {
  return User.findOne({ where: { email: email.toLowerCase() } });
}

export function findUserById(id) {
  return User.findByPk(id, {
    attributes: ["id", "name", "email", "createdAt", "updatedAt"]
  });
}
