import { API } from './endpoints';
import * as r from './rest';

export const MotivosAPI = {
  list:  (p)        => r.list(API.motivos, p),
  get:   (id)       => r.getOne(API.motivos, id),
  create:(body)     => r.create(API.motivos, body),
  update:(id, body) => r.update(API.motivos, id, body),
  patch: (id, body) => r.patch(API.motivos, id, body),
  remove:(id)       => r.remove(API.motivos, id),
};

export default MotivosAPI;
