import { Job, Product } from "../db/models/index.js";

export function createJob(type) {
  return Job.create({ type, status: "queued", progress: 0 });
}

export function updateJob(id, values) {
  return Job.update(values, { where: { id } });
}

export function findJobById(id) {
  return Job.findByPk(id, {
    include: [{ model: Product, as: "products" }],
    order: [[{ model: Product, as: "products" }, "createdAt", "DESC"]]
  });
}

export function findJobs() {
  return Job.findAll({
    order: [["createdAt", "DESC"]]
  });
}
