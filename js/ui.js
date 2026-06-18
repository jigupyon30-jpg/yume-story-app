// 画面切り替えなど共通UIをまとめる
const UI = {
    // 画面IDをまとめておく
    pages: {
        home: "homePage",
        project: "projectPage",
        editor: "editorPage",
        preview: "previewPage",
        projectDetail: "projectDetailPage",
    },

    pageTitles: {
        homePage: "ホーム",
        projectPage: "作品",
        editorPage: "エディタ",
        previewPage: "プレビュー",
        projectDetailPage: "作品詳細",
    },

    // 指定した画面だけ表示する
    showPage(pageId) {
        document.querySelectorAll(".page").forEach((page) => {
            page.classList.toggle("is-active", page.id === pageId);
        });

        document.querySelectorAll(".nav-button").forEach((button) => {
            button.classList.toggle("is-active", button.dataset.page === pageId);
        });

        document.getElementById("pageTitle").textContent = this.pageTitles[pageId] || "";
    },

    // 改行などを安全に表示するための変換
    escapeHtml(text) {
        return String(text)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    },

    formatDate(dateString) {
        const date = new Date(dateString);

        return date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    },
};