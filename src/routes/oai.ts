import OpenAI from 'openai';
import { type Response, type Request } from 'express';
import oaiConnect from '../helpers/oai-connect';

const oaiRoute = async (
	request: Request,
	response: Response,
): Promise<Response> => {
	const userPrompt = `${request.body?.userPrompt ?? ''}`;

	try {
		return response.json({
			data: { message: `${await oaiConnect(userPrompt)}}` },
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
