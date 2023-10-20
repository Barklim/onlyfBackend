import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  onApplicationBootstrap() {
    // TODO: Move this to the dedicated "RedisModule"
    this.redisClient = new Redis({
      host: 'localhost', // NOTE: Use env variable here
      port: 6379
    })
  }

  onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storeId = await this.redisClient.get(this.getKey(userId));
    if (storeId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storeId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`
  }
}