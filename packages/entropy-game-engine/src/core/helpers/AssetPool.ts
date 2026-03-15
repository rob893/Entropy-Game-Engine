export class AssetPool<TAssets extends Record<string, unknown> = Record<string, unknown>> {
  private readonly assetPool: Map<keyof TAssets & string, TAssets[keyof TAssets & string]>;

  public constructor(assetPool: Map<keyof TAssets & string, TAssets[keyof TAssets & string]>) {
    this.assetPool = assetPool;
  }

  public getAsset<TKey extends keyof TAssets & string>(key: TKey): TAssets[TKey] {
    const asset = this.assetPool.get(key);

    if (asset === undefined) {
      throw new Error(`Asset of key ${key} not found in the asset pool!`);
    }

    return asset as TAssets[TKey];
  }
}
