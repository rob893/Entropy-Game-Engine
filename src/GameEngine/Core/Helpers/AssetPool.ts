export class AssetPool {

    private readonly assetPool: Map<string, any>;


    public constructor(assetPool: Map<string, any>) {
        this.assetPool = assetPool;
    }

    public getAsset<T>(key: string): T {
        if (!this.assetPool.has(key)) {
            throw new Error(`Asset of key ${key} not found in the asset pool!`);
        }

        return this.assetPool.get(key);
    }
}