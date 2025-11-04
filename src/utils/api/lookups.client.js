import { API } from "./endpoints";
import * as r from "./rest";

export const HabitosAPI   = { list:(p)=>r.list(API.habitos,p), create:(b)=>r.create(API.habitos,b) };
export const EmocionesAPI = { list:(p)=>r.list(API.emociones,p), create:(b)=>r.create(API.emociones,b) };
export const MotivosAPI   = { list:(p)=>r.list(API.motivos,p), create:(b)=>r.create(API.motivos,b) };
export const SolucionesAPI= { list:(p)=>r.list(API.soluciones,p), create:(b)=>r.create(API.soluciones,b) };
