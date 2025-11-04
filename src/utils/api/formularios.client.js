import { API } from "./endpoints";
import * as r from "./rest";

export const FormulariosAPI = {
  list:  (p)        => r.list(API.formularios, p), 
  get:   (id)       => r.getOne(API.formularios, id),
  create:(body)     => r.create(API.formularios, body),
  update:(id, body) => r.update(API.formularios, id, body),
  patch: (id, body) => r.patch(API.formularios, id, body),
  remove:(id)       => r.remove(API.formularios, id),
};

export const FormulariosTemporalesAPI = {
  list:  (p)        => r.list(API.formulariosTemporales, p),
  get:   (id)       => r.getOne(API.formulariosTemporales, id),
  create:(body)     => r.create(API.formulariosTemporales, body),
  remove:(id)       => r.remove(API.formulariosTemporales, id),
};
