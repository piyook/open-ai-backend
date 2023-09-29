/*  You will need to use a Database and bcrypt to create an auth flow for users to register and be granted a JWT access token
    Here just for demo purposes a hard coded JWT will be used that will never expire.
    Example JWT value = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBTbWl0aCIsInVzZXJJZCI6ImRlbW8tb25seSJ9.6o58e6tb2f7rxaqFJ1kT5z2gt1zjRSLquGMnf3Zu7dk
*/

import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const auth = (request: Request, response: Response, next: NextFunction) => {
	const token: string = request.headers['x-access-token'] as string;

	if (!token) {
		return response.status(403).send('You need a token for access to this route');
	}

	try {
		jwt.verify(token, process.env.TOKEN_KEY);
	} catch {
		return response.status(401).send('Invalid Token');
	}

	next();
};

export default auth;
