import { describe, it, expect } from 'vitest';
import { scrapeUrl } from './web-scraper';

describe('scrapeUrl', () => {
  it('should scrape HTML content from a valid URL', async () => {
    const result = await scrapeUrl('https://badshah.io');
    expect(result.type).toBe('html');
    expect(result.content).toBeDefined();
    expect(result.content).toContain('Chandrapal Badshah');
    expect(result.content).toContain('Cloud Security Consultant');
  });
});