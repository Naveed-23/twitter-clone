
import { graphqlClient } from "@/clients/api"
import { getCurrentUserQuery, getUserByIdQuery } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ['current-user'],
        queryFn: () => graphqlClient.request(getCurrentUserQuery),
    });

    return { ...query, user: query.data?.getCurrentUser };
}


export const useGetUserById = (id: string | undefined) => {
    const query = useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            if (!id) throw new Error("User ID is required");
            const data = await graphqlClient.request(getUserByIdQuery, { id });
            return data;
        },
        enabled: !!id, 
    });

    return { ...query, user: query.data?.getUserById };
};