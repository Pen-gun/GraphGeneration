import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchResponse = async (prompt: string) => {
    const response = await axios.post('/api/generate', { prompt })
    return response.data
}

const fetchAIResponse = (prompt: string) => {
    return useQuery({
        queryKey: ['aiResponse', prompt],
        queryFn: () => fetchResponse(prompt)
    })
}

export { fetchAIResponse }  