const CACHE_NAME = "junrei-v2";

// 県ごとの札所数
const TEMPLE_COUNTS = {
  Awa: 23,
  Sanuki: 22,
  Iyo: 26,
  Tosa: 17
};

// 静的ファイル（共通）
const STATIC_FILES = [
  "index.html",
  "manifest.json",
  "script.js",

  // CSS
  "css/base.css",
  "css/temple.css",
  "css/washi.css",

  // 画像
  "images/washi-light.png",
  "images/washi-dark.png",
  "images/hero.jpg",

  // 県別アイコンページ（SPAで必要）
  "icon/tokushima.html",
  "icon/kagawa.html",
  "icon/ehime.html",
  "icon/kochi.html"
];

// 88ヶ所の札所ページを自動生成して追加
for (const [pref, count] of Object.entries(TEMPLE_COUNTS)) {
  for (let i = 1; i <= count; i++) {
    const num = String(i).padStart(2, "0");
    STATIC_FILES.push(`${pref}/${num}.html`);
  }
}

// インストール（静的ファイルをキャッシュ）
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_FILES);
    })
  );
});

// fetch（キャッシュ優先 → ネット）
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).then(res => {
          // 動的キャッシュ（強め）
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
      );
    })
  );
});

// 古いキャッシュ削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
