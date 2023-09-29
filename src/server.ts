// Initial express set-up

import * as url from 'node:url';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

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
	// OR can use : res.send("Hello World!!");
	response.json({ data: { message: `${process.env.OPEN_AI_API_KEY}` } });
});

app.listen(3000);
