// 作品一覧・作品作成・作品詳細表示をまとめる
const ProjectController = {
    projects: [],
    currentProjectId: null,

    elements: {},

    init() {
        this.projects = Storage.get(Storage.keys.projects, []);
        this.currentProjectId = Storage.get(Storage.keys.currentProjectId, null);

        this.cacheElements();
        this.bindEvents();
        this.render();
    },

    cacheElements() {
        this.elements.form = document.getElementById("projectForm");
        this.elements.id = document.getElementById("projectId");
        this.elements.title = document.getElementById("projectTitleInput");
        this.elements.genre = document.getElementById("projectGenreInput");
        this.elements.memo = document.getElementById("projectMemoInput");
        this.elements.projectList = document.getElementById("projectList");
        this.elements.recentProjectList = document.getElementById("recentProjectList");
        this.elements.projectCount = document.getElementById("projectCount");
        this.elements.currentProjectName = document.getElementById("currentProjectName");
        this.elements.resetButton = document.getElementById("resetProjectFormButton");
    },

    bindEvents() {
        this.elements.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.saveProject();
        });

        this.elements.resetButton.addEventListener("click", () => {
            this.resetForm();
        });
    },

    saveProject() {
        const now = new Date().toISOString();
        const id = this.elements.id.value || crypto.randomUUID();
        const oldProject = this.getProjectById(id);

        const project = {
            id,
            title: this.elements.title.value.trim(),
            genre: this.elements.genre.value,
            memo: this.elements.memo.value.trim(),
            episodes: oldProject?.episodes || [],
            createdAt: oldProject?.createdAt || now,
            updatedAt: now,
        };

        if (!project.title) {
            alert("作品タイトルを入力してね");
            return;
        }

        const existingIndex = this.projects.findIndex((item) => item.id === id);

        if (existingIndex >= 0) {
            this.projects[existingIndex] = project;
        } else {
            this.projects.unshift(project);
            this.setCurrentProject(id);
        }

        this.save();
        this.resetForm();
        this.render();
        EditorController.render();
    },

    editProject(id) {
        const project = this.getProjectById(id);
        

        if (!project) {
            return;
        }

        this.elements.id.value = project.id;
        this.elements.title.value = project.title;
        this.elements.genre.value = project.genre;
        this.elements.memo.value = project.memo;

        UI.showPage(UI.pages.project);
    },

    deleteProject(id) {
        const isConfirmed = confirm("この作品を削除する？");

        if (!isConfirmed) {
            return;
        }

        this.projects = this.projects.filter((project) => project.id !== id);

        if (this.currentProjectId === id) {
            this.currentProjectId = this.projects[0]?.id || null;
            Storage.set(Storage.keys.currentProjectId, this.currentProjectId);
        }

        this.save();
        this.render();
        EditorController.render();
    },

    setCurrentProject(id) {
        this.currentProjectId = id;
        Storage.set(Storage.keys.currentProjectId, id);

        this.render();
        EditorController.render();
        UI.showPage(UI.pages.editor);
    },

    getCurrentProject() {
        return this.getProjectById(this.currentProjectId);
    },

    getProjectById(id) {
        return this.projects.find((project) => project.id === id);
    },

    updateProject(updateProject) {
        this.projects = this.projects.map((project) => {
            return project.id === updateProject.id ? updateProject : project;
        });

        this.save();
        this.render();
    },

    resetForm() {
        this.elements.form.reset();
        this.elements.id.value = "";
    },

    save() {
        Storage.set(Storage.keys.projects, this.projects);
    },

    render() {
        this.recentProjectList();
        this.renderHome();
    },

    recentProjectList() {
        if (this.projects.length === 0) {
            this.elements,projectList.innerHTML = `
                <div class="empty-message">まだ作品がありません。新規作品を作ってね。</div>
            `;
            return;
        }

        this.elements.projectList.innerHTML = this.projects.map((project) => {
            const isCurrent = project.id === this.currentProjectId;

            return `
                <article class="project-card">
                    <div class="project-card__top">
                        <div>
                            <span class="genre-badge">${UI.escapeHtml(project.genre)}</span>
                            <h4>${UI.escapeHtml(project.title)}</h4>
                        </div>
                        ${isCurrent ? `<span class="block-badge">選択中</span>` : ""}
                    </div>

                    <p>${UI.escapeHtml(project.memo || "メモなし")}</p>
                    <p>更新日：${UI.formatDate(project.updatedAt)}</p>

                    <div class="card-actions">
                        <button class="primary-button" onclick="ProjectController.openProjectDetail('${project.id}')">
                            詳細を見る
                        </button>
                        <button class="ghost-button" onclick="ProjectController.editProject('${project.id}')">
                            編集
                        </button>
                        <button class="danger-button" onclick="ProjectController.deleteProject('${project.id}')">
                            削除
                        </button>
                    </div>
                </article>
            `;
        }).join("");
    },

    renderHome() {
        const currentProject = this.getCurrentProject();

        this.elements.projectCount.textContent = this.projects.length;
        this.elements.currentProjectName.textContent = currentProject?.title || "未選択";

        const recentProjects = this.projects.slice(0, 3);

        if (recentProjects.length === 0) {
            this.elements.recentProjectList.innerHTML = `
                <div class="empty-message">最近の作品はまだありません。</div>
            `;
            return;
        }

        this.elements.recentProjectList.innerHTML = recentProjects.map((project) => {
            return `
                <article class="project-card">
                    <span class="genre-badge">${UI.escapeHtml(project.genre)}</span>
                    <h4>${UI.escapeHtml(project.title)}</h4>
                    <p>${UI.escapeHtml(project.memo || "メモなし")}</p>
                    <button class="primary-button" onclick="ProjectController.setCurrentProject('${project.id}')">
                        この作品を書く
                    </button>
                </article>
            `;
        }).join("");
    },

    openProjectDetail(id) {
        this.setCurrentProject(id);
        EpisodeController.render();
        UI.showPage(UI.pages.projectDetail);
    },
};