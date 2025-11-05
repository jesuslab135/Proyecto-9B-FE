import { API } from "./endpoints";
import * as r from "./rest";

export const LecturasAPI = {
  list:  (p)        => r.list(API.lecturas, p),
  create:(body)     => r.create(API.lecturas, body),
  remove:(id)       => r.remove(API.lecturas, id),
};
