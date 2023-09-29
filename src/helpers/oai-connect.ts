import OpenAI from 'openai';

export default async function oaiConnect(userPrompt: string): Promise<string> {
	if (userPrompt === '' || !userPrompt) return;

	const openai = new OpenAI({
		apiKey: process.env?.OPEN_AI_API_KEY ?? '',
	});

	// Prepare prompt
	const parameters: OpenAI.Chat.ChatCompletionCreateParams = {
		messages: [
			{
				role: 'user',
				content: `${userPrompt}`,
			},
		],
		model: 'gpt-3.5-turbo',
	};

	// Get OAI response with user supplied prompt and await response
	const completion: OpenAI.Chat.ChatCompletion = await openai.chat.completions
		.create(parameters)
		.catch((error) => {
			if (error instanceof OpenAI.APIError) {
				throw error;
			}

			throw new Error('Sorry - there was an error. Please Try again later.');
		});

	if (!completion.choices[0]?.message?.content) {
		throw new Error('No Response From OpenAI Server.');
	}

	// Return OAI response
	return completion.choices[0].message.content;
}
