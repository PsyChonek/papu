import { getUserIDFromToken, verifyToken } from '$lib/server/auth';
import { Database } from '$lib/server/database';
import { ObjectId } from 'bson';
import type { User } from '$lib/types/user';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	// Get user from session
	const token = cookies.get('token');

	if (token == null) {
		return {
			status: 401,
			error: 'Token not found'
		};
	}

	var userId: string = getUserIDFromToken(token);

	if (userId == null) {
		return {
			status: 401,
			error: 'Invalid token'
		};
	}

	// Load user data
	var user: User | null = (await Database.getDb()
		.collection('users')
		.findOne({ _id: new ObjectId(userId) })) as User | null;
	user = JSON.parse(JSON.stringify(user)); // Convert to JSON and back to remove ObjectId

	return {
		User: {
			_id: userId,
			username: user?.username,
			email: user?.email,
			hash: user?.hash,
		}
	};
}) satisfies PageServerLoad;
