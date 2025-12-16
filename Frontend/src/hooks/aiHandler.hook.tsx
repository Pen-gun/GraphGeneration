import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useAIResponse = () => {
    return useMutation({
        mutationFn: async (prompt: string) => {
            const response = await axios.post('/api/v1/ai/generate', { topic: prompt });
            return response.data;
        }
    });
};  