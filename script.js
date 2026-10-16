// ------------------------------
// ハンバーガーメニュー開閉（PC用）
// ------------------------------
const menu = document.getElementById("menu");
if (menu) {
    menu.addEventListener("click", () => {
        const menuContent = document.getElementById("menu-content");
        if (menuContent) {
            menuContent.style.display =
                menuContent.style.display === "block" ? "none" : "block";
        }
        menu.classList.toggle("active");
    });
}

// ------------------------------
// 画面切り替え
// ------------------------------
function hideAllScreens() {
    ["screen-home", "screen-list", "screen-detail"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

// ------------------------------
// HTML読み込み（SPA）
// ------------------------------
function loadScreen(targetId, file) {
    fetch(file)
        .then(res => res.text())
        .then(html => {
            const target = document.getElementById(targetId);
            if (!target) return;

            target.innerHTML = html;

            // 詳細ページを開いた時は県判定用に保存
            document.body.dataset.currentFile = file;

            hideAllScreens();
            target.style.display = "block";
        })
        .catch(err => console.error("読み込みエラー:", err));
}

// ------------------------------
// DOM読み込み後
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {

    // 四国4県の一覧読み込み（SPA方式）
    const linkMap = {
        ".nav-tokushima": "icon/tokushima-icon.html",
        ".nav-kagawa": "icon/kagawa-icon.html",
        ".nav-ehime": "icon/ehime-icon.html",
        ".nav-kochi": "icon/kochi-icon.html",
        ".nav-manner": "manner/manner.html"
    };

    // PC用リンク + スマホ用リンクの両方にイベント付け
    Object.keys(linkMap).forEach(selector => {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener("click", () => {
                loadScreen("screen-list", linkMap[selector]);
            });
        });
    });

    // ------------------------------
    // 一覧 → 詳細（イベント委譲）
    // ------------------------------
    document.addEventListener("click", (e) => {
        const icon = e.target.closest(".temple-wrapper");
        if (icon) {
            const file = icon.dataset.file;
            if (file) loadScreen("screen-detail", file);
        }
    });

    // ------------------------------
    // ホームに戻る（イベント委譲）
    // ------------------------------
    document.addEventListener("click", (e) => {
        const btnHome = e.target.closest(".btn-back-home");
        if (btnHome) {
            hideAllScreens();
            document.getElementById("screen-home").style.display = "block";
        }
    });

    // ------------------------------
    // 一覧に戻る（県判定つき）
    // ------------------------------
    document.addEventListener("click", (e) => {
        const btnList = e.target.closest(".btn-back-list");
        if (btnList) {

            const file = document.body.dataset.currentFile;
            if (!file) return;

            let prefecture = "";
            if (file.startsWith("Awa")) prefecture = "icon/tokushima-icon.html";
            else if (file.startsWith("Sanuki")) prefecture = "icon/kagawa-icon.html";
            else if (file.startsWith("Iyo")) prefecture = "icon/ehime-icon.html";
            else if (file.startsWith("Tosa")) prefecture = "icon/kochi-icon.html";

            loadScreen("screen-list", prefecture);
        }
    });

});

// ------------------------------
// Service Worker
// ------------------------------
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

// ===============================
// 地図モーダルを開く
// ===============================
document.addEventListener("click", (e) => {
    const btn = e.target.closest("#show-map-btn");
    if (btn) {
        const modal = document.querySelector(".fullscreen-map");
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
});

// ===============================
// 地図モーダルを閉じる
// ===============================
document.addEventListener("click", (e) => {
    const btn = e.target.closest("#close-map-btn");
    if (btn) {
        const modal = document.querySelector(".fullscreen-map");
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
});
