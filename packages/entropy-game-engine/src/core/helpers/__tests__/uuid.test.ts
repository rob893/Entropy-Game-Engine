import { generateUUID } from '../UUID';

describe('generateUUID', () => {
  it('returns a string', () => {
    expect(generateUUID()).toEqual(expect.any(String));
  });

  it('returns unique values on repeated calls', () => {
    const generatedValues = Array.from({ length: 100 }, () => generateUUID());
    const uniqueValues = new Set(generatedValues);

    expect(uniqueValues.size).toBe(generatedValues.length);
  });

  it('returns a UUID-like string format', () => {
    const uuid = generateUUID();

    expect(uuid).toHaveLength(36);
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});
