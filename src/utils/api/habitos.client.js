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
