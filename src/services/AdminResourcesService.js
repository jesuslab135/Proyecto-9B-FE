import EmocionesClient from '../utils/api/emociones.client';
import HabitosClient from '../utils/api/habitos.client';
import MotivosClient from '../utils/api/motivos.client';
import { DeseosAPI } from '../utils/api/deseos.client';
import FormulariosClient from '../utils/api/formularios.client';

class AdminResourcesServiceClass {
  // Emociones
  listEmociones() { return EmocionesClient.list(); }
  getEmocion(id) { return EmocionesClient.get(id); }
  createEmocion(body) { return EmocionesClient.create(body); }
  updateEmocion(id, body) { return EmocionesClient.update(id, body); }
  deleteEmocion(id) { return EmocionesClient.remove(id); }

  // Habitos
  listHabitos() { return HabitosClient.list(); }
  getHabito(id) { return HabitosClient.get(id); }
  createHabito(body) { return HabitosClient.create(body); }
  updateHabito(id, body) { return HabitosClient.update(id, body); }
  deleteHabito(id) { return HabitosClient.remove(id); }

  // Motivos
  listMotivos() { return MotivosClient.list(); }
  getMotivo(id) { return MotivosClient.get(id); }
  createMotivo(body) { return MotivosClient.create(body); }
  updateMotivo(id, body) { return MotivosClient.update(id, body); }
  deleteMotivo(id) { return MotivosClient.remove(id); }

  // Deseos (special)
  listDeseos() { return DeseosAPI.list(); }
  getDeseo(id) { return DeseosAPI.get(id); }
  createDeseo(body) { return DeseosAPI.create(body); }
  updateDeseo(id, body) { return DeseosAPI.update(id, body); }
  deleteDeseo(id) { return DeseosAPI.remove(id); }
  resolveDeseo(id) { return DeseosAPI.resolve(id); }

  // Formularios
  listFormularios() { return FormulariosClient.list(); }
  getFormulario(id) { return FormulariosClient.get(id); }
  createFormulario(body) { return FormulariosClient.create(body); }
  updateFormulario(id, body) { return FormulariosClient.update(id, body); }
  deleteFormulario(id) { return FormulariosClient.remove(id); }
}

export const adminResourcesService = new AdminResourcesServiceClass();
import { FormulariosAPI } from '../utils/api/formularios.client';
import { DeseosAPI } from '../utils/api/deseos.client';
import { EmocionesAPI } from '../utils/api/emociones.client';
import { HabitosAPI } from '../utils/api/habitos.client';
import { MotivosAPI } from '../utils/api/motivos.client';

class AdminResourcesService {
  // Formularios
  listFormularios(params) { return FormulariosAPI.list(params); }
  getFormulario(id) { return FormulariosAPI.get(id); }
  createFormulario(body) { return FormulariosAPI.create(body); }
  updateFormulario(id, body) { return FormulariosAPI.update(id, body); }
  patchFormulario(id, body) { return FormulariosAPI.patch(id, body); }
  deleteFormulario(id) { return FormulariosAPI.remove(id); }

  // Deseos
  listDeseos(params) { return DeseosAPI.list(params); }
  getDeseo(id) { return DeseosAPI.get(id); }
  createDeseo(body) { return DeseosAPI.create(body); }
  updateDeseo(id, body) { return DeseosAPI.update(id, body); }
  patchDeseo(id, body) { return DeseosAPI.patch(id, body); }
  deleteDeseo(id) { return DeseosAPI.remove(id); }
  resolveDeseo(id) { return DeseosAPI.resolve(id); }

  // Emociones
  listEmociones(params) { return EmocionesAPI.list(params); }
  getEmocion(id) { return EmocionesAPI.get(id); }
  createEmocion(body) { return EmocionesAPI.create(body); }
  updateEmocion(id, body) { return EmocionesAPI.update(id, body); }
  patchEmocion(id, body) { return EmocionesAPI.patch(id, body); }
  deleteEmocion(id) { return EmocionesAPI.remove(id); }

  // Habitos
  listHabitos(params) { return HabitosAPI.list(params); }
  getHabito(id) { return HabitosAPI.get(id); }
  createHabito(body) { return HabitosAPI.create(body); }
  updateHabito(id, body) { return HabitosAPI.update(id, body); }
  patchHabito(id, body) { return HabitosAPI.patch(id, body); }
  deleteHabito(id) { return HabitosAPI.remove(id); }

  // Motivos
  listMotivos(params) { return MotivosAPI.list(params); }
  getMotivo(id) { return MotivosAPI.get(id); }
  createMotivo(body) { return MotivosAPI.create(body); }
  updateMotivo(id, body) { return MotivosAPI.update(id, body); }
  patchMotivo(id, body) { return MotivosAPI.patch(id, body); }
  deleteMotivo(id) { return MotivosAPI.remove(id); }
}

export const adminResourcesService = new AdminResourcesService();
import { FormulariosAPI } from '../utils/api/formularios.client';
import { DeseosAPI } from '../utils/api/deseos.client';
import { EmocionesAPI } from '../utils/api/emociones.client';
import { HabitosAPI } from '../utils/api/habitos.client';
import { MotivosAPI } from '../utils/api/motivos.client';

class AdminResourcesService {
  // Formularios
  listFormularios(params) { return FormulariosAPI.list(params); }
  getFormulario(id) { return FormulariosAPI.get(id); }
  createFormulario(body) { return FormulariosAPI.create(body); }
  updateFormulario(id, body) { return FormulariosAPI.update(id, body); }
  patchFormulario(id, body) { return FormulariosAPI.patch(id, body); }
  deleteFormulario(id) { return FormulariosAPI.remove(id); }

  // Deseos
  listDeseos(params) { return DeseosAPI.list(params); }
  getDeseo(id) { return DeseosAPI.get(id); }
  createDeseo(body) { return DeseosAPI.create(body); }
  updateDeseo(id, body) { return DeseosAPI.update(id, body); }
  patchDeseo(id, body) { return DeseosAPI.patch(id, body); }
  deleteDeseo(id) { return DeseosAPI.remove(id); }
  resolveDeseo(id) { return DeseosAPI.resolve(id); }

  // Emociones
  listEmociones(params) { return EmocionesAPI.list(params); }
  getEmocion(id) { return EmocionesAPI.get(id); }
  createEmocion(body) { return EmocionesAPI.create(body); }
  updateEmocion(id, body) { return EmocionesAPI.update(id, body); }
  patchEmocion(id, body) { return EmocionesAPI.patch(id, body); }
  deleteEmocion(id) { return EmocionesAPI.remove(id); }

  // Habitos
  listHabitos(params) { return HabitosAPI.list(params); }
  getHabito(id) { return HabitosAPI.get(id); }
  createHabito(body) { return HabitosAPI.create(body); }
  updateHabito(id, body) { return HabitosAPI.update(id, body); }
  patchHabito(id, body) { return HabitosAPI.patch(id, body); }
  deleteHabito(id) { return HabitosAPI.remove(id); }

  // Motivos
  listMotivos(params) { return MotivosAPI.list(params); }
  getMotivo(id) { return MotivosAPI.get(id); }
  createMotivo(body) { return MotivosAPI.create(body); }
  updateMotivo(id, body) { return MotivosAPI.update(id, body); }
  patchMotivo(id, body) { return MotivosAPI.patch(id, body); }
  deleteMotivo(id) { return MotivosAPI.remove(id); }
}

export const adminResourcesService = new AdminResourcesService();
