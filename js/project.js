// 作品一覧・作品作成・作品詳細表示をまとめる
const ProjectController = {
    currentProjectId: null,

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
                            <button class="button button--primary" data-open-project="${project.id}">開く</button>
                            <button class="button button--ghost" data-delete-project="${project.id}">削除</button>
                        </div>
                    </article>
                `;
            })
            .join("");
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

    // 作品詳細を開く
    openProject(projectId) {
        const projects = StorageService.getProjects();
        const project = projects.find((item) => item.id === projectId);

        if (!project) {
            alert("作品が見つかりませんでした");
            return;
        }

        this.currentProjectId = project.id;

        document.getElementById("detailGenre").textContent = project.genre;
        document.getElementById("detailTitle").textContent = project.title;
        document.getElementById("detailMemo").textContent = project.memo || "";

        EditorController.renderBlocks(project);
        EditorController.renderPreview(project);

        UI.showPage(UI.pages.detail);
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