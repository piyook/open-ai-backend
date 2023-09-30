import redis from 'redis';

const config = process.env;

const redisConnect = async () => {
	return redis
		.createClient({
			url: config?.REDIS_URL ?? 'redis://redis:6379',
			password: config?.REDIS_PASSWORD ?? null,
			socket: {
				port: Number.parseInt(config?.REDIS_PORT ?? '6679', 10),
				host: config?.REDIS_HOST ?? '127.0.0.1',
			},
		})
		.on('error', (error) => {
			console.error(`Error: ${error}`);
			throw new Error('Error connecting to REDIS');
		})
		.connect();
};

export { redisConnect };
