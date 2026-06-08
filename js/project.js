// 作品一覧・作品作成・作品詳細表示をまとめる
const ProjectController = {
    currentProjectId: null,
    currentEpisodeId: null,

    // 作品一覧を描画
    renderProjectList() {
        const projectList = document.getElementById("projectList");
        const projects = StorageService.getProjects();

        if (projects.length === 0) {
            projectList.innerHTML = `
                <div class="empty">
                    まだ作品がありません。<br>
                    最初の夢小説を作ってみよう♡
                </div>
            `;

            return;
        }

        projectList.innerHTML = projects
            .map((project) => {
                return `
                    <article class="project-card">
                        <p class="project-card__genre">${UI.escapeHtml(project.genre)}</p>
                        <h3 class="project-card__title">${UI.escapeHtml(project.title)}</h3>
                        <p class="project-card__memo">
                            ${UI.escapeHtml(project.memo || "あらすじメモなし")}
                        </p>

                        <div class="project-card__actions">
                            <button class="button button--primary" data-open-project-info="${project.id}">
                                <i class="fa-solid fa-circle-info"></i>
                                <span>詳細</span>
                            </button>
                            <button class="button button--ghost" data-delete-project="${project.id}">削除</button>
                        </div>
                    </article>
                `;
            })
            .join("");
    },

    // 古い作品データをepisodes対応の形に変換する
    normalizeProject(project) {
        if (!project.episodes) {
            project.episodes = [
                {
                    id: DataFactory.createId("episode"),
                    title: "第１話",
                    blocks: episode.blocks || [],
                    createdAt: project.createdAt || new Date().toISOString(),
                    updatedAt: project.updatedAt || new Date().toISOString()
                }
            ];

            delete episode.blocks;
        }

        if (!project.characters) {
            project.characters = [];
        }

        if (!project.relationships) {
            project.relationships = [];
        }

        return project;
    },
    // 新しい作品を保存する
    createProject(event) {
        event.preventDefault();

        const titleInput = document.getElementById("projectTitle");
        const genreInput = document.getElementById("projectGenre");
        const memoInput = document.getElementById("projectMemo");

        const project = DataFactory.createProject({
            title: titleInput.value.trim(),
            genre: genreInput.value,
            memo: memoInput.value.trim()
        });

        const projects = StorageService.getProjects();

        projects.unshift(project);
        StorageService.saveProjects(projects);

        event.target.reset();

        this.renderProjectList();
        UI.showPage(UI.pages.list);
    },

    // Episode一覧を表示する
    renderEpisodeList(project) {
        const episodeList = document.getElementById("episodeList");

        if (!episodeList) {
            return;
        }

        const episodes = project.episodes || [];

        if (episodes.length === 0) {
            episodeList.innerHTML = `
                <div class="empty">まだお話がありません</div>
            `;
            return;
        }

        episodeList.innerHTML = episodes
            .map((episode) => {
                return `
                    <article class="episode-card">
                        <div class="episode-card__content">
                            <label class="episode-title-field">
                                <span>タイトル</span>
                                <input type="text" value="${UI.escapeHtml(episode.title || "")}" data-episode-title-input="${episode.id}" placeholder="例：放課後、君からのDM">
                            </label>
                            <p>ブロック数：${episode.blocks?.length || 0}</p>
                        </div>

                        <div class="episode-card__actions">
                            <button class="button button--ghost" data-read-episode="${episode.id}">
                                <i class="fa-solid fa-book-open-reader"></i>
                                <span>読む</span>
                            </button>

                            <button class="button button--primary" data-open-episode="${episode.id}">
                                <i class="fa-solid fa-pen-to-square"></i>
                                <span>編集</span>
                            </button>
                        </div>
                    </article>
                `;
            })
            .join("");
    },

    // 指定した話のエディタ画面を開く
    openProject(projectId, episodeId) {
        const projects = StorageService.getProjects();
        const project = projects.find((item) => item.id === projectId);

        if (!project) {
            alert("作品が見つかりませんでした");
            return;
        }

        const normalizedProject = this.normalizeProject(project);

        const episode = normalizedProject.episodes.find((item) => item.id === episodeId) || 
        normalizedProject.episodes[0];

        if (!episode) {
            alert("お話が見つかりませんでした");
            return;
        }

        this.currentProjectId = normalizedProject.id;
        this.currentEpisodeId = episode.id;

        console.log("currentEpisodeId", this.currentEpisodeId);

        StorageService.saveProjects(projects);

        document.getElementById("detailGenre").textContent = normalizedProject.genre;
        document.getElementById("detailTitle").textContent = episode.title;
        document.getElementById("detailMemo").textContent = normalizedProject.title;

        EditorController.renderBlocks(episode);
        EditorController.renderPreview(episode);

        UI.showPage(UI.pages.detail);
    },

    openProjectInfo(projectId) {
        const projects = StorageService.getProjects();
        const project = projects.find((item) => item.id === projectId);
        const normalizedProject = this.normalizeProject(project);

        StorageService.saveProjects(projects);

        if (!project) {
            alert("作品が見つかりませんでした");
            return;
        }

        this.currentProjectId = project.id;

        document.getElementById("infoGenre").textContent = project.genre;
        document.getElementById("infoTitle").textContent = project.title;
        document.getElementById("infoMemo").textContent = project.memo || "";

        document.getElementById("infoCardTitle").textContent = project.title;
        document.getElementById("infoCardMemo").textContent = project.memo || "あらすじメモはまだありません。";

        const totalBlockCount = normalizedProject.episodes.reduce((total, episode) => {
            return total + (episode.blocks?.length || 0);
        }, 0);
        document.getElementById("infoBlockCount").textContent = totalBlockCount;
        document.getElementById("infoCharacterCount").textContent = project.characters?.length || 0;
        document.getElementById("infoRelationshipCount").textContent = project.relationships?.length || 0;

        UI.showPage(UI.pages.info);

        this.renderEpisodeList(normalizedProject);
    },


    // 作品を削除する
    deleteProject(projectId) {
        const isOk = confirm("この作品を削除しますか？");

        if (!isOk) {
            return;
        }

        const  projects = StorageService.getProjects();
        const nextProjects = projects.filter((project) => project.id !== projectId);

        StorageService.saveProjects(nextProjects);
        this.renderProjectList();
    },

    // 現在開いている作品を取得する
    getCurrentProject() {
        const projects = StorageService.getProjects();
        return projects.find((project) => project.id === this.currentProjectId);
    },

    getCurrentEpisode() {
        const project = this.getCurrentProject();

        if (!project || !project.episodes) {
            return null;
        }

        return project.episodes.find((episode) => {
            return episode.id === this.currentEpisodeId;
    });
},

    updateCurrentProject(updatedProject) {
        const projects = StorageService.getProjects();
        
        const nextProjects = projects.map((project) => {
            if (project.id === updatedProject.id) {
                return {
                    ...updatedProject,
                    updatedAt: new Date().toISOString()
                };
            }

            return project;
        });

        StorageService.saveProjects(nextProjects);
    }
};