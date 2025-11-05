import { API } from "./endpoints";
import * as r from "./rest";

export const ConsumidoresAPI = {
  list:  (params)       => r.list(API.consumidores, params),
  get:   (id)           => r.getOne(API.consumidores, id),
  create:(body)         => r.create(API.consumidores, body),
  update:(id, body)     => r.update(API.consumidores, id, body),
  patch: (id, body)     => r.patch(API.consumidores, id, body),
  remove:(id)           => r.remove(API.consumidores, id),
};
