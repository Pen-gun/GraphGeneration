import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../utils/axios-utils";

const conversationsKey = ["conversations"];

export interface CreateConversationPayload {
  title?: string;
}

export interface AddMessagePayload {
  topic: string;
}

export const useCreateConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["createConversation"],
    mutationFn: async (payload: CreateConversationPayload) => {
      const res = await api.post("/conversations", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: conversationsKey });
    },
  });
};

export const useGetConversations = (enabled: boolean = true) => {
  return useQuery({
    queryKey: conversationsKey,
    queryFn: async () => {
      const res = await api.get("/conversations");
      return res.data;
    },
    enabled,
  });
};

export const useGetConversationById = (id?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const res = await api.get(`/conversations/${id}`);
      return res.data;
    },
    enabled: enabled && Boolean(id),
  });
};

export const useAddMessageToConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["addMessage"],
    mutationFn: async ({ conversationId, payload }: { conversationId: string; payload: AddMessagePayload }) => {
      const res = await api.post(`/conversations/${conversationId}/messages`, payload);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate and refetch conversation details to ensure messages array is up-to-date
      qc.invalidateQueries({ queryKey: ["conversation", variables.conversationId] });
      qc.refetchQueries({ queryKey: ["conversation", variables.conversationId] });
      qc.invalidateQueries({ queryKey: conversationsKey });
    },
  });
};

export const useDeleteConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["deleteConversation"],
    mutationFn: async (id: string) => {
      const res = await api.delete(`/conversations/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: conversationsKey });
    },
  });
};