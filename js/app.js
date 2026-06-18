// アプリ起動・イベント登録をまとめる
const App = {
    init() {
        ProjectController.init();
        EpisodeController.init();
        EditorController.init();
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll(".nav-button").forEach((button) => {
            button.addEventListener("click", () => {
                UI.showPage(button.dataset.page);
            });
        });

        document.getElementById("openCreateProjectButton").addEventListener("click", () => {
            UI.showPage(UI.pages.project);
        });
    },
};

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});