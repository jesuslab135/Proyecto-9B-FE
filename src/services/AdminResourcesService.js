import { FormulariosAPI } from '../utils/api/formularios.client';
import { DeseosAPI } from '../utils/api/deseos.client';
import { EmocionesAPI } from '../utils/api/emociones.client';
import { HabitosAPI } from '../utils/api/habitos.client';
import { MotivosAPI } from '../utils/api/motivos.client';
import { UsuariosAPI } from '../utils/api/usuarios.client';

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

  // Usuarios
  listUsuarios(params) { return UsuariosAPI.list(params); }
  getUsuario(id) { return UsuariosAPI.get(id); }
  createUsuario(body) { return UsuariosAPI.create(body); }
  updateUsuario(id, body) { return UsuariosAPI.update(id, body); }
  patchUsuario(id, body) { return UsuariosAPI.patch(id, body); }
  deleteUsuario(id) { return UsuariosAPI.remove(id); }
}

export const adminResourcesService = new AdminResourcesService();
