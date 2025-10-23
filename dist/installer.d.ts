export interface InstallOptions {
    version: string;
    target?: string;
}
/**
 * Install Claude Code CLI
 */
export declare function installClaudeCode(options: InstallOptions): Promise<void>;
