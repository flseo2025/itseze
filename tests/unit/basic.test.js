// Basic validation test to ensure Jest is working
describe('Basic Project Validation', () => {
  it('should have Node.js environment available', () => {
    expect(typeof process).toBe('object');
    expect(process.env).toBeDefined();
  });

  it('should support basic JavaScript operations', () => {
    const sum = (a, b) => a + b;
    expect(sum(2, 3)).toBe(5);
  });

  it('should support async operations', async () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const start = Date.now();
    await delay(10);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(10);
  });

  it('should have access to Jest matchers', () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect({ a: 1, b: 2 }).toMatchObject({ a: 1 });
    expect('hello world').toMatch(/world/);
  });
});
