import Redis from 'ioredis';

const redis = new Redis({
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    maxRetriesPerRequest: 3,
    retryStrategy: function(times){
        const delay = Math.min(times*100, 5000);
        console.log(`Redis Retry Strategy: Attempt ${times}, Retrying in ${delay}ms`);
        return delay;
    }
});

export default redis;
