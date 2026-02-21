import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

const STORE_MAP: Record<string, { store: string; color: string; logo: string }> = {
  "amazon": { store: "Amazon.in", color: "#FF9900", logo: "🛒" },
  "flipkart": { store: "Flipkart", color: "#2874F0", logo: "🏪" },
  "croma": { store: "Croma", color: "#1A8B3E", logo: "🔌" },
  "myntra": { store: "Myntra", color: "#FF3F6C", logo: "👗" },
  "reliancedigital": { store: "Reliance Digital", color: "#E31E24", logo: "📱" },
  "tatacliq": { store: "Tata Cliq", color: "#6B1FCA", logo: "🛍️" },
  "snapdeal": { store: "Snapdeal", color: "#E40046", logo: "💰" },
  "meesho": { store: "Meesho", color: "#F43397", logo: "🏷️" },
  "vijaysales": { store: "Vijay Sales", color: "#D32F2F", logo: "🔧" },
  "nykaa": { store: "Nykaa", color: "#FC2779", logo: "💄" },
  "jiomart": { store: "JioMart", color: "#0A6EBD", logo: "🛵" },
};

function getStoreMeta(url: string) {
  for (const key of Object.keys(STORE_MAP)) {
    if (url.toLowerCase().includes(key)) return STORE_MAP[key];
  }
  return null;
}

function extractDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

async function scrapeGoogleSearch(query: string) {
  const results: any[] = [];
  const seen = new Set<string>();

  // Search 1: regular Google search with "buy" + "price"
  try {
    const url1 = `https://www.google.com/search?q=${encodeURIComponent(query + " buy online india price")}&gl=in&hl=en&num=30`;
    const { data: html1 } = await axios.get(url1, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-IN,en;q=0.9",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html1);

    // Parse organic search results
    $("div.g, div[data-sokoban-container]").each((_, el) => {
      const linkEl = $(el).find("a[href]").first();
      const href = linkEl.attr("href") || "";
      if (!href.startsWith("http")) return;

      const meta = getStoreMeta(href);
      if (!meta) return;
      if (seen.has(meta.store)) return;

      const title = $(el).find("h3").first().text().trim();
      const snippet = $(el).find(".VwiC3b, .st, span").text();

      // Try to extract price from snippet
      const priceMatch = snippet.match(/(?:Rs\.?|₹|INR)\s*([\d,]+)/i) ||
                         title.match(/(?:Rs\.?|₹|INR)\s*([\d,]+)/i);

      if (priceMatch) {
        const price = parseInt(priceMatch[1].replace(/,/g, ""));
        if (price > 0 && price < 10000000) {
          seen.add(meta.store);
          results.push({
            ...meta,
            name: title || query,
            price,
            image: "",
            link: href,
          });
        }
      }
    });
  } catch (e) {
    console.error("Google search 1 failed:", e);
  }

  // Search 2: Google Shopping
  try {
    const url2 = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=shop&gl=in&hl=en&num=20`;
    const { data: html2 } = await axios.get(url2, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-IN,en;q=0.9",
      },
      timeout: 10000,
    });

    const $2 = cheerio.load(html2);

    $2(".sh-dgr__content, .i0X6df, .sh-pr__product-results-grid .sh-dgr__grid-result, .Oj5Naf").each((_, el) => {
      const name = $2(el).find("h3, h4, .Xjkr3b, .tAxDx").first().text().trim();
      const priceRaw = $2(el).find(".a8Pemb, .kHxwFf, .OFFNJ").first().text().replace(/[^0-9]/g, "");
      const image = $2(el).find("img").first().attr("src") || "";
      const storeText = $2(el).find(".aULzUe, .IuHnof, .JTUCC").first().text().trim();
      const href = $2(el).find("a[href]").first().attr("href") || "";
      const fullHref = href.startsWith("http") ? href : "https://www.google.com" + href;

      const meta = getStoreMeta(storeText) || getStoreMeta(fullHref);
      if (!meta) return;
      if (seen.has(meta.store)) return;
      if (!priceRaw) return;

      const price = parseInt(priceRaw);
      if (price > 0 && price < 10000000) {
        seen.add(meta.store);
        results.push({
          ...meta,
          name: name || query,
          price,
          image,
          link: fullHref,
        });
      }
    });
  } catch (e) {
    console.error("Google Shopping failed:", e);
  }

  // Search 3: site-specific searches for top stores
  const storeSearches = [
    { site: "site:amazon.in", meta: STORE_MAP["amazon"] },
    { site: "site:flipkart.com", meta: STORE_MAP["flipkart"] },
    { site: "site:croma.com", meta: STORE_MAP["croma"] },
    { site: "site:reliancedigital.in", meta: STORE_MAP["reliancedigital"] },
    { site: "site:tatacliq.com", meta: STORE_MAP["tatacliq"] },
  ];

  for (const s of storeSearches) {
    if (seen.has(s.meta.store)) continue;
    try {
      const url3 = `https://www.google.com/search?q=${encodeURIComponent(query + " " + s.site + " price")}&gl=in&hl=en&num=5`;
      const { data: html3 } = await axios.get(url3, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-IN,en;q=0.9",
        },
        timeout: 8000,
      });

      const $3 = cheerio.load(html3);
      let found = false;

      $3("div.g").each((_, el) => {
        if (found) return;
        const href = $3(el).find("a[href]").first().attr("href") || "";
        const title = $3(el).find("h3").first().text().trim();
        const snippet = $3(el).find(".VwiC3b, span").text();
        const combined = title + " " + snippet;

        const priceMatch = combined.match(/(?:Rs\.?|₹|INR)\s*([\d,]+)/i);
        if (priceMatch && href.startsWith("http")) {
          const price = parseInt(priceMatch[1].replace(/,/g, ""));
          if (price > 0 && price < 10000000) {
            seen.add(s.meta.store);
            results.push({
              ...s.meta,
              name: title || query,
              price,
              image: "",
              link: href,
            });
            found = true;
          }
        }
      });
    } catch {
      // skip if this store search fails
    }
  }

  return results.sort((a, b) => a.price - b.price);
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "No query provided" }, { status: 400 });

    const products = await scrapeGoogleSearch(query);
    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
