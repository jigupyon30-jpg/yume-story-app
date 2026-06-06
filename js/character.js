// キャラクター登録・編集・削除・SNSアカウント管理
const CharacterController = {
    // キャラクター一覧
    renderCharacterList() {
        const characterList = document.getElementById("characterList");
        const project = ProjectController.getCurrentProject();

        if (!characterList || !project) {
            return;
        }

        const characters = project.characters || [];

        if (characters.length === 0) {
            characterList.innerHTML = `
                <div class="empty">まだキャラクターが登録されていません。</div>
            `;
            return;
        }

        characterList.innerHTML = characters
            .map((character) => {
                return `
                    <article class="character-card">
                        <div class="character-card__avatar">
                            ${
                                character.avatarData
                                    ? `<img src="${character.avatarData}" alt="">`
                                    : `<i class="fa-solid fa-user"></i>`
                            }
                        </div>

                        <div class="character-card__body">
                            <p class="character-card__role">${UI.escapeHtml(character.role)}</p>
                            <h3>${UI.escapeHtml(character.name)}</h3>

                            <div class="character-card__sns">
                                <span><i class="fa-brands fa-instagram"></i>@${UI.escapeHtml(character.instagramUsername || "-")}</span>
                                <span><i class="fa-brands fa-x-twitter"></i> @${UI.escapeHtml(character.twitterUsername || "-")}</span>
                                <span><i class="fa-brands fa-tiktok"></i> @${UI.escapeHtml(character.tiktokUsername || "-")}</span>
                            </div>
                        </div>

                        <div class="character-card__actions">
                            <button class="button button--ghost" data-edit-character="${character.id}">編集</button>
                            <button class="button button--ghost" data-delete-character="${character.id}">削除</button>
                        </div>
                    </article>
                `;
            })
            .join("");
    },

    // フォーム内容からキャラクターデータを作る
    getFormData() {
        return {
            id: document.getElementById("characterId").value || DataFactory.createId("character"),
            name: document.getElementById("characterName").value.trim(),
            role: document.getElementById("characterRole").value,

            instagramName: document.getElementById("characterInstagramName").value.trim(),
            instagramUsername: document.getElementById("characterInstagramUsername").value.trim(),
            
            twitterName: document.getElementById("characterTwitterName").value.trim(),
            twitterUsername: document.getElementById("characterTwitterUsername").value.trim(),

            tiktokUsername: document.getElementById("characterTikTokUsername").value.trim(),
            lineName: document.getElementById("characterLineName").value.trim(),

            avatarData: this.currentAvatarData || "",
            updatedAt: new Date().toISOString()
        };
    },

    currentAvatarData: "",

    // キャラクターを保存する
    saveCharacter(event) {
        event.preventDefault();

        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        const character = this.getFormData();

        if (!character.name) {
            alert("名前を入力してください");
            return;
        }

        const characters = project.characters || [];
        const exists = characters.some((item) => item.id === character.id);

        project.characters = exists
            ? characters.map((item) => {
                return item.id === character.id
                    ? {
                        ...item,
                        ...character,
                        avatarData: character.avatarData || item.avatarData
                    }
                    : item;
            })
        : [
            ...characters,
            {
                ...character,
                createdAt: new Date().toISOString()
            }
        ];

    ProjectController.updateCurrentProject(project);

    this.resetForm();
    this.renderCharacterList();
    UI.showPage(UI.pages.character);

    console.log(project.characters);
    },

    // 編集用にフォームへ値を入れる
    editCharacter(characterId) {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        const character = (project.characters || []).find((item) => {
            return item.id === characterId;
        });

        if (!character) {
            return;
        }

        document.getElementById("characterId").value = character.id;
        document.getElementById("characterName").value = character.name || "";
        document.getElementById("characterRole").value = character.role || "その他";

        document.getElementById("characterInstagramName").value = character.instagramName || "";
        document.getElementById("characterInstagramUsername").value = character.instagramUsername || "";

        document.getElementById("characterTwitterName").value = character.twitterName || "";
        document.getElementById("characterTwitterUsername").value = character.twitterUsername || "";

        document.getElementById("characterTikTokUsername").value = character.tiktokUsername || "";
        document.getElementById("characterLineName").value = character.lineName || "";

        this.currentAvatarData = character.avatarData || "";
        this.renderAvatarPreview();
    },

    // キャラクターを削除する
    deleteCharacter(characterId) {
        const isOk = confirm("このキャラクターを削除しますか？");

        if (!isOk) {
            return;
        }

        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        project.characters = (project.characters || []).filter((character) => {
            return character.id !== characterId;
        });

        ProjectController.updateCurrentProject(project);
        this.renderCharacterList();
        ProjectController.openProjectInfo(project.id);
        UI.showPage(UI.pages.character);
    },

    // 画像をBase64に変換して一時保存する
    saveAvatar(file) {
        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            this.currentAvatarData = reader.result;
            this.renderAvatarPreview();
        };

        reader.readAsDataURL(file);
    },

    // アイコン画像プレビューを表示する
    renderAvatarPreview() {
        const preview = document.getElementById("characterAvatarPreview");

        if (!preview) {
            return;
        }

        if (!this.currentAvatarData) {
            preview.innerHTML = "";
            return;
        }

        preview.innerHTML = `
            <img src="${this.currentAvatarData}" alt="">
        `;
    },

    // フォームをリセットする
    resetForm() {
        document.getElementById("characterForm").reset();
        document.getElementById("characterId").value = "";
        this.currentAvatarData = "";
        this.renderAvatarPreview();
    }
};