import { API } from "./endpoints";
import * as r from "./rest";

export const UsuariosAPI = {
  list:  (params)       => r.list(API.usuarios, params),
  get:   (id)           => r.getOne(API.usuarios, id),
  create:(body)         => r.create(API.usuarios, body), 
  update:(id, body)     => r.update(API.usuarios, id, body),
  patch: (id, body)     => r.patch(API.usuarios, id, body),
  remove:(id)           => r.remove(API.usuarios, id),
};
