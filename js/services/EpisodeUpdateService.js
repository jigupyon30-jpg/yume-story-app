// 現在開いている話(Episode)を安全に更新する
const EpisodeUpdateService = {
    // 現在の話を更新する
    update(callback) {
        const projectId = ProjectController.currentProjectId;
        const episodeId = ProjectController.currentEpisodeId;

        if (!projectId || !episodeId) {
            console.warn("EpisodeUpdateService: projectId または episodeId がありません");
            return false;
        }

        const projects = StorageService.getProjects();

        const nextProjects = projects.map((project) => {
            if (project.id !== projectId) {
                return project;
            }

            return {
                ...project,
                updatedAt: new Date().toISOString(),
                episodes: (project.episodes || []).map((episode) => {
                    if (
                        episode.id !== episodeId
                    ) {
                        return episode;
                    }

                    return {
                        ...callback(episode),
                        updatedAt: new Date().toISOString()
                    };
                })
            };
        });

        StorageService.saveProjects(
            nextProjects
        );

        return true;
    },

    // 現在の話を取得
    getCurrentEpisode() {
        return ProjectController.getCurrentEpisode();
    },

    // 更新後の再描画
    rerender() {
        const episode = ProjectController.getCurrentEpisode();

        if (!episode) {
            return;
        }

        EditorController.renderBlocks(episode);

        EditorController.renderPreview(episode);
    }
};