import { USERS_QUERY } from "~/graphql/queries/users.gql";

export const useFetchUsers = () => {
	const { $graphql } = useNuxtApp();

	const { data: users, pending, error } = useAsyncData("users", async () => {
		const response = await $graphql.default.request(USERS_QUERY);
		return response.users;
	});

	return {
		users,
		pending,
		error,
	};
};
