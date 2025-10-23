export interface MarketplaceInfo {
    name: string;
    repo: string;
}
/**
 * Check if a marketplace is already installed
 */
export declare function isMarketplaceInstalled(repo: string): Promise<MarketplaceInfo | null>;
/**
 * Add or update a plugin marketplace
 * Supports multiple formats:
 * - GitHub: owner/repo
 * - Git URL: https://gitlab.com/company/plugins.git
 * - Local path: ./my-marketplace or ./path/to/marketplace.json
 * - Remote URL: https://url.of/marketplace.json
 */
export declare function addOrUpdateMarketplace(source: string): Promise<boolean>;
/**
 * Parse a multiline or comma-separated string into array
 * Supports both formats:
 * - Comma-separated: "item1,item2,item3"
 * - Newline-separated: "item1\nitem2\nitem3"
 * - Mixed: "item1,item2\nitem3"
 */
export declare function parseList(input: string): string[];
/**
 * Parse plugin list string into array
 */
export declare function parsePluginList(pluginList: string): string[];
/**
 * Add or update multiple plugin marketplaces
 */
export declare function addOrUpdateMarketplaces(marketplacesInput: string): Promise<number>;
/**
 * Install multiple plugins
 */
export declare function installPlugins(pluginList: string): Promise<string[]>;
