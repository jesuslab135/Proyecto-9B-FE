import { API } from "./endpoints";
import * as r from "./rest";

export const AdministradoresAPI = {
  list:  (p)        => r.list(API.administradores, p),
  get:   (id)       => r.getOne(API.administradores, id),
  create:(body)     => r.create(API.administradores, body),
  update:(id, body) => r.update(API.administradores, id, body),
  patch: (id, body) => r.patch(API.administradores, id, body),
  remove:(id)       => r.remove(API.administradores, id),
};
