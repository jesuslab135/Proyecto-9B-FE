import { API } from "./endpoints";
import * as r from "./rest";
import { http } from "./https";

export const NotificacionesAPI = {
  list:  (p)        => r.list(API.notificaciones, p),
  get:   (id)       => r.getOne(API.notificaciones, id),
  patch: (id, body) => r.patch(API.notificaciones, id, body),
  create:(body)     => r.create(API.notificaciones, body),
  remove:(id)       => r.remove(API.notificaciones, id),
  
  // Custom action endpoints
  markRead:   (id)  => http.post(`/${API.notificaciones}/${id}/mark_read/`).then(r => r.data),
  markUnread: (id)  => http.post(`/${API.notificaciones}/${id}/mark_unread/`).then(r => r.data),
};

export default NotificacionesAPI;