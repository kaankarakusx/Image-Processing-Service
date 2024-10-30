import redis from "../config/redis";

class CacheService {
  async get(key: string) {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async set(key: string, value: object, duration: number = 3600) {
    return redis.set(key, JSON.stringify(value), "EX", duration);
  }

  async del(key: string) {
    return redis.del(key);
  }
}

export default new CacheService();
