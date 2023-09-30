import OpenAI from 'openai';
import { type Response, type Request } from 'express';
import oaiConnect from '../helpers/oai-connect';
import { redisConnect } from '../helpers/redis-connect';

const oaiRoute = async (
	request: Request,
	response: Response,
): Promise<Response> => {
	const userPrompt = `${request.body?.userPrompt ?? ''}`;

	const redisClient = await redisConnect();

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
