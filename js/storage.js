// localStorageへの保存・取得をまとめる

const Storage = {
    // 保存に使うキー
    keys: {
        projects: "yumeStory.projects.v1",
        currentProjectId: "yumeStory.currentProjectId.v1",
        currentEpisodeId: "yumeStory.currentEpisodeId.v1",
    },

    // 作品データを全部取得
    get(key, fallbackValue) {
        const savedData = localStorage.getItem(key);

        if (!savedData) {
            return fallbackValue;
        }

        try {
            return JSON.parse(savedData);
        } catch (error) {
            console.error("保存データの読み込みに失敗しました", error);
            return fallbackValue;
        }
    },

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove(key) {
        localStorage.removeItem(key);
    },
};