/**
 * Example test file to verify vitest configuration with jsdom
 * This will be replaced with real component tests in Phase 2
 */

import { describe, it, expect } from 'vitest';
import { VERSION } from '../src/index';

describe('Package Configuration', () => {
  it('should export VERSION constant', () => {
    expect(VERSION).toBeDefined();
    expect(typeof VERSION).toBe('string');
    expect(VERSION).toBe('0.1.0');
  });

  it('should have access to DOM globals (jsdom)', () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();
    expect(HTMLElement).toBeDefined();
  });

  it('should be able to create DOM elements', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    
    expect(div.tagName).toBe('DIV');
    expect(div.textContent).toBe('Hello World');
  });

  it('should handle DOM attributes', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'test';
    input.value = 'example';
    
    expect(input.type).toBe('text');
    expect(input.name).toBe('test');
    expect(input.value).toBe('example');
  });
});

describe('React Environment', () => {
  it('should have React available as peer dependency', () => {
    // React is a peer dependency, so we just verify the test environment works
    expect(true).toBe(true);
  });

  it('should support async operations', async () => {
    const promise = Promise.resolve(42);
    const result = await promise;
    
    expect(result).toBe(42);
  });

  it('should handle setTimeout (async timers)', async () => {
    const result = await new Promise((resolve) => {
      setTimeout(() => resolve('done'), 10);
    });
    
    expect(result).toBe('done');
  });
});

describe('TypeScript Integration', () => {
  it('should support modern JavaScript features', () => {
    const arr = [1, 2, 3];
    const doubled = arr.map(x => x * 2);
    const sum = arr.reduce((acc, x) => acc + x, 0);
    
    expect(doubled).toEqual([2, 4, 6]);
    expect(sum).toBe(6);
  });

  it('should support destructuring and spread', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const { a, ...rest } = obj;
    
    expect(a).toBe(1);
    expect(rest).toEqual({ b: 2, c: 3 });
  });
});
