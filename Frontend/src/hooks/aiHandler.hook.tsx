import { useMutation } from "@tanstack/react-query";
import api from '../utils/axios-utils';

export const useAIResponse = () => {
    return useMutation({
        mutationFn: async (prompt: string) => {
            const response = await api.post('/ai/generates', { topic: prompt });
            return response.data;
        }
    });
};