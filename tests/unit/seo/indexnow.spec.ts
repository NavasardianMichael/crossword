import { describe, expect, it } from 'vitest'
import { sitemapUrls } from '../../../scripts/indexnow.mjs'

describe('IndexNow', () => {
  const site = 'https://crossword.example'
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url>
<loc>${site}/en</loc>
<xhtml:link rel="alternate" hreflang="hy" href="${site}/hy" />
<lastmod>2026-11-22T12:00:00.000Z</lastmod>
</url>
<url>
<loc>${site}/hy/topics/home-and-everyday</loc>
</url>
<url>
<loc>https://elsewhere.example/en</loc>
</url>
</urlset>`

  it("announces the sitemap entries' own URLs, not their hreflang alternates or other hosts", () => {
    expect(sitemapUrls(xml, site)).toEqual([`${site}/en`, `${site}/hy/topics/home-and-everyday`])
  })
})
