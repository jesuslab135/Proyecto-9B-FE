import rest from './rest';
import API from './endpoints';

const r = rest(API.emociones);

export default {
  list: r.list,
  get: r.getOne,
  create: r.create,
  update: r.update,
  remove: r.remove,
};
import { API } from './endpoints';
import * as r from './rest';

export const EmocionesAPI = {
  list:  (p)        => r.list(API.emociones, p),
  get:   (id)       => r.getOne(API.emociones, id),
  create:(body)     => r.create(API.emociones, body),
  update:(id, body) => r.update(API.emociones, id, body),
  patch: (id, body) => r.patch(API.emociones, id, body),
  remove:(id)       => r.remove(API.emociones, id),
};

export default EmocionesAPI;
import { API } from './endpoints';
import * as r from './rest';

export const EmocionesAPI = {
  list:  (p)        => r.list(API.emociones, p),
  get:   (id)       => r.getOne(API.emociones, id),
  create:(body)     => r.create(API.emociones, body),
  update:(id, body) => r.update(API.emociones, id, body),
  patch: (id, body) => r.patch(API.emociones, id, body),
  remove:(id)       => r.remove(API.emociones, id),
};

export default EmocionesAPI;
