import { http } from "./https";

export const list    = (path, params)      => http.get(`/${path}/`, { params }).then(r => r.data);
export const getOne  = (path, id)          => http.get(`/${path}/${id}/`).then(r => r.data);
export const create  = (path, body)        => http.post(`/${path}/`, body).then(r => r.data);
export const update  = (path, id, body)    => http.put(`/${path}/${id}/`, body).then(r => r.data);
export const patch   = (path, id, body)    => http.patch(`/${path}/${id}/`, body).then(r => r.data);
export const remove  = (path, id)          => http.delete(`/${path}/${id}/`).then(r => r.data);

export const post    = (path, body)        => http.post(`/${path}/`, body).then(r => r.data);

export const action  = (path, id, actionName, body = {}) => 
  http.post(`/${path}/${id}/${actionName}/`, body).then(r => r.data);

export const actionGet = (path, id, actionName, params = {}) => 
  http.get(`/${path}/${id}/${actionName}/`, { params }).then(r => r.data);