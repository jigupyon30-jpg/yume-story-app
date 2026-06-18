// 作品ごとの話数追加・選択・削除
const EpisodeController = {
    currentEpisodeId: null,
    elements: {},

    init() {
        this.currentEpisodeId = Storage.get(Storage.keys.currentEpisodeId, null);
        this.cacheElements();
        this.bindEvents();
        this.render();
    },

    cacheElements() {
        this.elements.form = document.getElementById("episodeForm");
        this.elements.titleInput = document.getElementById("episodeTitleInput");
        this.elements.episodeList = document.getElementById("episodeList");
        this.elements.detailProjectTitle = document.getElementById("detailProjectTitle");
        this.elements.detailProjectMeta = document.getElementById("detailProjectMeta");
    },

    bindEvents() {
        this.elements.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.createEpisode();
        });
    },

    createEpisode() {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            alert("作品を選択してね");
            return;
        }

        const now = new Date().toISOString();

        const episode = {
            id: crypto.randomUUID(),
            title: this.elements.titleInput.value.trim() || `第${project.episodes.length + 1}話`,
            blocks: [],
            createdAt: now,
            updatedAt: now,
        };

        project.episodes.push(episode);
        project.updatedAt = now;

        this.setCurrentEpisode(episode.id);
        ProjectController.updateProject(project);

        this.elements.form.reset();
        this.render();
        EditorController.render();
    },

    setCurrentEpisode(id) {
        this.currentEpisodeId = id;
        Storage.set(Storage.keys.currentEpisodeId, id);
    },

    openEpisode(id) {
        this.setCurrentEpisode(id);
        EpisodeController.render();
        UI.showPage(UI.pages.editor);
    },

    readEpisode(id) {
        this.setCurrentEpisode(id);
        EditorController.render();
        UI.showPage(UI.pages.preview);
    },

    deleteEpisode(id) {
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        if (!confirm("この話を削除する？")) return;

        project.episodes = project.episode.filter((episode) => {
            return episode.id !== id;
        });

        if (this.currentEpisodeId === id) {
            this.currentEpisodeId = project.episodes[0]?.id || null;
            Storage.set(Storage.keys.currentEpisodeId, this.currentEpisodeId);
        }

        project.updatedAt = new Date().toISOString();

        ProjectController.updateProject(project);
        this.render();
        EditorController.render();
    },

    getCurrentEpisode() {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return null;
        }

        if (!Array.isArray(project.episodes)) {
            project.episodes = [];
            ProjectController.updateProject(project);
        }

        return project.episodes.find((episode) => {
            return episode.id === this.currentEpisodeId;
        }) || project.episodes[0] || null;
    },

    updateEpisode(updateEpisode) {
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        project.episodes = project.episodes.map((episode) => {
            return episode.id === updateEpisode.id ? updateEpisode : episode;
        });

        project.updatedAt = new Date().toISOString();
        ProjectController.updateProject(project);
        this.render();
    },

    render() {
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        this.elements.detailProjectTitle.textContent = project.title;
        this.elements.detailProjectMeta.textContent = `${project.genre} / ${project.memo || "メモなし"}`;

        if (!project.episodes || project.episodes.length === 0) {
            this.elements.episodeList.innerHTML = `
                <div class="empty-message">まだ話がありません。第1話を追加してね。</div>
            `;
            return;
        }

        this.elements.episodeList.innerHTML = project.episodes.map((episode, index) => {
            const isCurrent = episode.id === this.currentEpisodeId;

            return `
                <article class="episode-card">
                    <div>
                        <span class="block-badge">${isCurrent ? "編集中" : `第${index + 1}話`}</span>
                        <h4>${UI.escapeHtml(episode.title)}</h4>
                        <p>${episode.blocks.length}ブロック</p>
                    </div>

                    <div class="card-actions">
                        <button class="primary-button"onclick="EpisodeController.openEpisode('${episode.id}')">
                            編集
                        </button>
                        <button class="ghost-button" onclick="EpisodeController.readEpisode('${episode.id}')">
                            読む
                        </button>
                        <button class="danger-button" onclick="EpisodeController.deleteEpisode('${episode.id}')">
                            削除
                        </button>
                    </div>
                </article>
            `;
        }).join("");
    },
};