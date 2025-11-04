import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UsuariosAPI } from "../utils/api/usuarios.client";

export const useUsuarios = (params) =>
  useQuery({ queryKey: ["usuarios", params||"all"], queryFn: () => UsuariosAPI.list(params) });

export const useCrearUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => UsuariosAPI.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios"] }),
  });
};

export const useEliminarUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => UsuariosAPI.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios"] }),
  });
};
