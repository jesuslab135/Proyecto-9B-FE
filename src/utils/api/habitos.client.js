import rest from './rest';
import API from './endpoints';

const r = rest(API.habitos);

export default {
  list: r.list,
  get: r.getOne,
  create: r.create,
  update: r.update,
  remove: r.remove,
};
import { API } from './endpoints';
import * as r from './rest';

export const HabitosAPI = {
  list:  (p)        => r.list(API.habitos, p),
  get:   (id)       => r.getOne(API.habitos, id),
  create:(body)     => r.create(API.habitos, body),
  update:(id, body) => r.update(API.habitos, id, body),
  patch: (id, body) => r.patch(API.habitos, id, body),
  remove:(id)       => r.remove(API.habitos, id),
};

export default HabitosAPI;
import { API } from './endpoints';
import * as r from './rest';

export const HabitosAPI = {
  list:  (p)        => r.list(API.habitos, p),
  get:   (id)       => r.getOne(API.habitos, id),
  create:(body)     => r.create(API.habitos, body),
  update:(id, body) => r.update(API.habitos, id, body),
  patch: (id, body) => r.patch(API.habitos, id, body),
  remove:(id)       => r.remove(API.habitos, id),
};

export default HabitosAPI;
