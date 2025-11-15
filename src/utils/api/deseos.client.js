import { API } from "./endpoints";
import * as r from "./rest";

export const DeseosAPI = {
  list:  (p)        => r.list(API.deseos, p),
  get:   (id)       => r.getOne(API.deseos, id),
  create:(body)     => r.create(API.deseos, body),
  update: (id, body) => r.patch(API.deseos, id, body), 
  remove:(id)       => r.remove(API.deseos, id),
  resolve: (id) => r.patch(API.deseos, id, { resolved: true }),
};
