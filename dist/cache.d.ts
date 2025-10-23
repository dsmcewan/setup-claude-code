export interface CacheOptions {
    version: string;
}
/**
 * Generate cache key for Claude Code installation
 */
export declare function getCacheKey(version: string): string;
/**
 * Generate cache restore keys (fallback keys)
 */
export declare function getRestoreKeys(version: string): string[];
/**
 * Get paths to cache
 */
export declare function getCachePaths(): string[];
/**
 * Restore Claude Code from cache
 */
export declare function restoreCache(options: CacheOptions): Promise<boolean>;
/**
 * Save Claude Code to cache
 */
export declare function saveCache(options: CacheOptions): Promise<void>;
