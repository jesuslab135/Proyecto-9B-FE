import { API } from "./endpoints";
import * as r from "./rest";

export const VentanasAPI = {
  list:  (p)        => r.list(API.ventanas, p),
  get:   (id)       => r.getOne(API.ventanas, id),
  create:(body)     => r.create(API.ventanas, body),
  remove:(id)       => r.remove(API.ventanas, id),
};
