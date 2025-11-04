import { API } from "./endpoints";
import * as r from "./rest";

export const NotificacionesAPI = {
  list:  (p)        => r.list(API.notificaciones, p),
  patch: (id, body) => r.patch(API.notificaciones, id, body),
};
