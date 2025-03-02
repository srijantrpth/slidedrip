import redis from "../db/redisClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const DAILY_LIMIT = 3;

export const limitCheck = asyncHandler(async (req, _, next) => {
    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(401, "Unauthorized Request, Please login to Continue!");
    }
const today = new Date().toISOString().split("T")[0];
const key = `slidedrip:generations:${userId}:${today}`;

try {
    const count = await redis.incr(key)
    if(count===1){
        await redis.expire(key, 86400)
    }
    console.log(`Count: ${count}`);
    
    if(count > DAILY_LIMIT){
        await redis.decr(key);
        const ttl = await redis.ttl(key);
        const hoursRemaining = Math.ceil(ttl/3600);
        throw new ApiError(429, `You have reached the daily limit of ${DAILY_LIMIT} requests. Your daily limit will reset in ${hoursRemaining} hours`);
    }
next()}
   catch (error) {
   throw new ApiError(500, `Internal Server Error while checking rate limit ${error?.message}`);
}

}


)