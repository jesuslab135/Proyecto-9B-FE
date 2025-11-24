import { API } from "./endpoints";
import * as r from "./rest";

export const AnalisisAPI = {
  list:  (p)        => r.list(API.analisis, p),
  get:   (id)       => r.getOne(API.analisis, id),
  create:(body)     => r.create(API.analisis, body),
  remove:(id)       => r.remove(API.analisis, id),
};
