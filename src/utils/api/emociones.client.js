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
