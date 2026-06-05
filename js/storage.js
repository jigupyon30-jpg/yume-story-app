// localStorageへの保存・取得をまとめる

const StorageService = {
    // 保存に使うキー
    key: "yumeStoryStudio.projects.v1",

    // 作品データを全部取得
    getProjects() {
        const json = localStorage.getItem(this.key);

        if (!json) {
            return [];
        }

        try {
            return JSON.parse(json);
        } catch (error) {
            console.error("保存データの読み込みに失敗しました", error);
            return [];
        }
    },

    // 作品データを全部保存する
    saveProjects(projects) {
        localStorage.setItem(this.key, JSON.stringify(projects));
    }
};