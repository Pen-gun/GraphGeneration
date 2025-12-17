import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../utils/axios-utils.tsx'

const query = ['queries'];

const useCreateQuery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['createQuery'],
        mutationFn: async (queryData: {
            topic: string;
            points: Array<string>;
            diagram: string
        }) => {
            const res = await api.post('/queries/', queryData);
            return res.data;    
        },
        onSuccess: (data) => {
            console.log("Query created successfully:", data);
            queryClient.invalidateQueries({ queryKey: query });
        }
    });
};
const useDeleteQuery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['deleteQuery'],
        mutationFn: async (id: string) => {
            const res = await api.delete(`/queries/${id}`);
            return res.data;    
        },
        onSuccess: (data) => {
            console.log("Query deleted successfully:", data);
            queryClient.invalidateQueries({ queryKey: query });
        }
    });
};
const useGetQueries = (enabled: boolean = true) => {
    return useQuery({
        queryKey: query,
        queryFn: async () => {
            const res = await api.get('/queries/');
            return res.data;
        },
        enabled,
        retry: enabled ? 3 : false,
    });
};

const countQueries = () => {
    return useQuery({
        queryKey: ['countQueries'],
        queryFn: async () => {
            const res = await api.get('/queries/count');
            return res.data;
        },
        retry: 3,
    });
};

export {useCreateQuery, useDeleteQuery, useGetQueries, countQueries};