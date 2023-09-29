import OpenAI from 'openai';
import { type Response } from 'express';
import oaiConnect from '../helpers/oai-connect';

const oaiRoute = async (response: Response): Promise<Response> => {
	try {
		return response.json({
			data: { message: `${await oaiConnect('say hello')}}` },
		});
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			response.status(error.status);
			return response.send(error.message);
		}

		return response.send(error);
	}
};

export default oaiRoute;
