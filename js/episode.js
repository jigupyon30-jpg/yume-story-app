const EpisodeController = {
    createEpisode(projectId) {
        const projects = StorageService.getProjects();

        const project = projects.find(
            item => item.id === projectId
        );

        if (!project) {
            return;
        }

        if (!project.episodes) {
            project.episodes = [];
        }

        project.episodes.push({
            id: DataFactory.createId("episode"),
            title: `第${project.episodes.length + 1}話`,
            blocks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        StorageService.saveProjects(projects);

        ProjectController.openProjectInfo(
            projectId
        );
    },

    // 指定したエピソードを読むページで開く
    openEpisodeReader(episodeId) {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        const episode = (project.episodes || []).find((item) => {
            return item.id === episodeId;
        });

        if (!episode) {
            alert("お話が見つかりませんでした");
            return;
        }

        ProjectController.currentEpisodeId = episode.id;

        ReaderController.render(episode);
        UI.showPage(UI.pages.reader);
    }
};