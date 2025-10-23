export interface Platform {
    os: string;
    arch: string;
    platform: string;
}
/**
 * Detect the current platform (OS + architecture)
 */
export declare function getPlatform(): Platform;
/**
 * Add a directory to the system PATH
 */
export declare function addToPath(dir: string): Promise<void>;
/**
 * Get the home directory path
 */
export declare function getHomeDir(): string;
/**
 * Get the Claude Code installation paths
 */
export declare function getClaudePaths(): {
    bin: string;
    data: string;
    executable: string;
};
/**
 * Verify the Claude Code installation
 */
export declare function verifyInstallation(): Promise<{
    version: string;
    path: string;
}>;
/**
 * Get the current date in YYYY-MM-DD format
 */
export declare function getCurrentDate(): string;
