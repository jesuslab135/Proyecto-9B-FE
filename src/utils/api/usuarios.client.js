import { API } from "./endpoints";
import * as r from "./rest";

export const UsuariosAPI = {
  list:  (params)       => r.list(API.usuarios, params),
  get:   (id)           => r.getOne(API.usuarios, id),
  create:(body)         => r.create(API.usuarios, body), 
  update:(id, body)     => r.update(API.usuarios, id, body),
  patch: (id, body)     => r.patch(API.usuarios, id, body),
  remove:(id)           => r.remove(API.usuarios, id),
  login: (email, password) => r.post(API.usLogin, { email, password }),
  logout: ()            => r.post(API.usLogout),
  register: (userData) => r.post(API.usRegister, userData),
  softDelete: (id)     => r.action(API.usSoftDelete, id, 'soft_delete'),
  restore: (id)        => r.action(API.usRestore, id, 'restore'),
};
