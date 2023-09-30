import OpenAI from 'openai';
import redis from 'redis';
import { type Response, type Request } from 'express';
import oaiConnect from '../helpers/oai-connect';

const redisPort = 6379;
const redisHost = '127.0.0.1';
const redisPassword = 'fHJG9EgHnnxdEWDhiLsyJVge6oYd4t66';
const redisUrl = 'redis://redis:6379';

const oaiRoute = async (
	request: Request,
	response: Response,
): Promise<Response> => {
	const userPrompt = `${request.body?.userPrompt ?? ''}`;

	// Connect to redis
	const redisClient = await redis
		.createClient({
			url: redisUrl,
			password: redisPassword,
			socket: {
				port: redisPort,
				host: redisHost,
			},
		})
		.on('error', (error) => {
			console.error(`Error: ${error}`);
			throw new Error('Error connecting to REDIS');
		})
		.connect();

	// Try to get cached keyed with userPrompt question
	const cachedResponse = await redisClient.get(userPrompt);

	// Check to see if there is a cached question/response and if so return this
	if (cachedResponse) {
		await redisClient.disconnect();
		return response.json({
			data: { message: `${cachedResponse}`, cachedResponse: true },
		});
	}

	// Or connect to oai get the response, cache it and return it.

	try {
		const oaiResponse = await oaiConnect(userPrompt);
		await redisClient.set(userPrompt, `${oaiResponse}`);
		await redisClient.disconnect();
		return response.json({
			data: { message: `${oaiResponse}`, cachedResponse: false },
		});
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			response.status(error.status);
			return response.send(error.message);
		}

		return response.send(error);
	}
};

export { oaiRoute };
