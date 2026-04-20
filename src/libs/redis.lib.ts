import Redis from 'ioredis';
import config from '@/config/config';
import { log } from './logger.lib';

abstract class RedisService {
  private static instance: Redis | null = null;

  private static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
        maxRetriesPerRequest: null, // Essential for apps like BullMQ or to prevent crashing on connection failure
      });

      this.instance.on('error', (err) => {
        log.error('❌ [Redis Error]', { err: err.message });
      });

      this.instance.on('connect', () => {
        log.info('✅ [Redis] Connected successfully');
      });
    }
    return this.instance;
  }

  static async set(key: string, value: unknown, expiresIn = 60 * 60 * 24 * 7): Promise<void> {
    try{
      const redis = this.getInstance();
      const stringValue = JSON.stringify(value);

      if (expiresIn) {
        await redis.setex(key, expiresIn, stringValue);
      } else {
        await redis.set(key, stringValue);
      }
    }catch(error){
      console.error('❌ RedisService.set error', { error });
      throw error;
    }
  }

  static async get(key: string): Promise<unknown> {
    const redis = this.getInstance();
    const value = await redis.get(key);

    if (value) {
      return JSON.parse(value);
    }

    return null;
  }

  static async delete(key: string): Promise<void> {
    const redis = this.getInstance();
    await redis.del(key);
  }

  static async increment(key: string): Promise<number> {
    const redis = this.getInstance();
    return await redis.incr(key);
  }
}

export default RedisService;
