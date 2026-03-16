import { AssetPool } from '../AssetPool';

interface ITestAssets {
  playerSprite: { src: string };
  themeSong: string;
}

type TestAssetKey = keyof ITestAssets;
type TestAssetValue = ITestAssets[TestAssetKey];

test('AssetPool getAsset returns the correct asset by key', (): void => {
  const playerSprite = { src: 'player.png' };
  const themeSong = 'theme.ogg';
  const pool = new AssetPool<ITestAssets>(
    new Map<TestAssetKey, TestAssetValue>([
      ['playerSprite', playerSprite],
      ['themeSong', themeSong]
    ])
  );

  expect(pool.getAsset('playerSprite')).toBe(playerSprite);
  expect(pool.getAsset('themeSong')).toBe(themeSong);
});

test('AssetPool getAsset throws when the asset key is missing', (): void => {
  const pool = new AssetPool<ITestAssets>(
    new Map<TestAssetKey, TestAssetValue>([['playerSprite', { src: 'player.png' }]])
  );

  expect(() => pool.getAsset('themeSong')).toThrowError('Asset of key themeSong not found in the asset pool!');
});
