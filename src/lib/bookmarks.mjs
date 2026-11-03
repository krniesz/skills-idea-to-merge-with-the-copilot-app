const slugAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function normalizeUrl(value) {
  if (typeof value !== 'string') return null;

  const input = value.trim();
  if (!input) return null;

  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function createSlug(random = Math.random) {
  let suffix = '';
  for (let index = 0; index < 4; index += 1) {
    suffix += slugAlphabet[Math.floor(random() * slugAlphabet.length)];
  }
  return `mona-${suffix}`;
}

export function loadBookmarks(rawValue) {
  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return [];
      if (typeof entry.url !== 'string' || typeof entry.slug !== 'string') return [];
      if (!/^mona-[0-9A-Za-z]{4}$/.test(entry.slug)) return [];

      const url = normalizeUrl(entry.url);
      return url ? [{ url, slug: entry.slug }] : [];
    });
  } catch {
    return [];
  }
}

export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}
