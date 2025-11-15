import rest from './rest';
import API from './endpoints';

const r = rest(API.motivos);

export default {
  list: r.list,
  get: r.getOne,
  create: r.create,
  update: r.update,
  remove: r.remove,
};
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
