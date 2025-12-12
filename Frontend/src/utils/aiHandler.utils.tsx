import { useQueries } from "@tanstack/react-query"
import axios from "axios"

const fetchAIResponse = async (prompt: string) => {
    const response = await axios.post('/api/ai/generate', { prompt })
    return response.data
}

export {fetchAIResponse}