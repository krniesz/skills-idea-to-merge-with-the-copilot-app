import test from 'node:test';
import assert from 'node:assert/strict';
import { createSlug, formatBookmark, loadBookmarks, normalizeUrl } from '../src/lib/bookmarks.mjs';

test('normalizes URLs with and without https to the same value', () => {
  assert.equal(normalizeUrl('https://www.example.com'), normalizeUrl('www.example.com'));
});

test('recovers gracefully from empty, corrupted, legacy, and non-array storage', () => {
  for (const value of [null, '', '{broken json', '{"url":"https://legacy.example"}', '"legacy value"']) {
    assert.doesNotThrow(() => loadBookmarks(value));
    assert.deepEqual(loadBookmarks(value), []);
  }
});

test('drops malformed entries while keeping valid bookmarks', () => {
  const entries = [
    { url: 'example.com', slug: 'mona-7fk2' },
    { url: 'javascript:alert(1)', slug: 'mona-abcd' },
    { url: 'https://example.com', slug: 'not-a-slug' },
    null,
  ];

  assert.deepEqual(loadBookmarks(JSON.stringify(entries)), [
    { url: 'https://example.com/', slug: 'mona-7fk2' },
  ]);
});

test('formats a bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});

test('creates a short base62 slug with the mona prefix', () => {
  assert.equal(createSlug(() => 0), 'mona-0000');
  assert.match(createSlug(), /^mona-[0-9A-Za-z]{4}$/);
});
