import { type Response } from 'express';

const homeRoute = (response: Response): Response => {
	return response.send(
		"<html><body style='margin:auto 0; text-align:center;padding:20px;'><h1>OpenAI Server</h1><br/><h3>Send POST requests to /api/oai</h3></body></html>",
	);
};

export { homeRoute };
