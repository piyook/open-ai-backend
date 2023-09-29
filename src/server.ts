// Initial express set-up

import * as url from 'node:url';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import OpenAI from 'openai';
import oaiConnect from './helpers/oai-connect';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

if (!process.env?.OPEN_AI_API_KEY) {
	throw new Error('Please provide openAi API key');
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
	response.send(
		"<html><body style='margin:auto 0; text-align:center;padding:20px;'><h1>OpenAI Server</h1><br/><h3>Send requests to /api/oai</h3></body></html>",
	);
});

app.get('/api/oai', async (request, response) => {
	try {
		response.json({ data: { message: `${await oaiConnect('say hello')}}` } });
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			response.status(error.status);
			response.send(error.message);
		} else {
			response.send(error);
		}
	}
});

app.listen(3000);
