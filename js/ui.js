// 画面切り替えなど共通UIをまとめる
const UI = {
    // 画面IDをまとめておく
    pages: {
        list: "projectListPage",
        create: "projectCreatePage",
        info: "projectInfoPage",
        detail: "projectDetailPage",
        character: "characterPage"
    },

    // 指定した画面だけ表示する
    showPage(pageId) {
        const pages = document.querySelectorAll(".page");

        pages.forEach((page) => {
            page.classList.remove("is-active");
        });

        const targetPage = document.getElementById(pageId);

        if (targetPage) {
            targetPage.classList.add("is-active");
        }
    },

    // 改行などを安全に表示するための変換
    escapeHtml(text) {
        return String(text)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
};