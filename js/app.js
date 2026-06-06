// アプリ起動・イベント登録をまとめる
const App = {
    init() {
        ProjectController.renderProjectList();
        this.bindEvents();
        this.bindStoryDragEvents();
    },

    bindEvents() {
        document.getElementById("openCreateProjectButton").addEventListener("click", () => {
            UI.showPage(UI.pages.create);
        });

        document.getElementById("createEpisodeButton").addEventListener("click", () => {
            const project = ProjectController.getCurrentProject();

            if (!project) {
                return;
            }

            EpisodeController.createEpisode(
                project.id
            );
        });

        document.getElementById("projectForm").addEventListener("submit", (event) => {
            ProjectController.createProject(event);
        });

        document.querySelectorAll("[data-back-to-list]").forEach((button) => {
            button.addEventListener("click", () => {
                ProjectController.currentProjectId = null;
                ProjectController.renderProjectList();
                UI.showPage(UI.pages.list);
            });
        });

        document.getElementById("openBlockMenuButton").addEventListener("click", () => {
            const panel = document.getElementById("blockMenuPanel");
            panel.classList.toggle("is-open");
        });

        // プレビューを手更新
        document.getElementById("refreshPreviewButton").addEventListener("click", () => {
            const episode = ProjectController.getCurrentEpisode();

            if (!episode) {
                return;
            }

            EditorController.renderPreview(episode);
        });

        document.addEventListener("click", (event) => {
            const openProjectInfoButton = event.target.closest("[data-open-project-info]");
            const openEpisodeButton = event.target.closest("[data-open-episode]");
            const openProjectButton = event.target.closest("[data-open-project]");
            const deleteProjectButton = event.target.closest("[data-delete-project]");
            const deleteBlockButton = event.target.closest("[data-delete-block]");
            const addBlockButton = event.target.closest("[data-add-block-type]");
            const addTwitterPostButton = event.target.closest("[data-add-twitter-post]");
            const deleteTwitterPostButton = event.target.closest("[data-delete-twitter-post]");
            const addStoryItemButton = event.target.closest("[data-add-story-item]");
            const deleteStoryItemButton = event.target.closest("[data-delete-story-item]");
            const addDmMessageButton = event.target.closest("[data-add-dm-message]");
            const deleteDmMessageButton = event.target.closest("[data-delete-dm-message]");
            const deleteLineImageButton = event.target.closest("[data-delete-line-image]");
            const addTemplateButton = event.target.closest("[data-add-template]");

            if (openProjectInfoButton) {
                const projectId = openProjectInfoButton.dataset.openProjectInfo;
                ProjectController.openProjectInfo(projectId);
            }

            if (openEpisodeButton) {
                const episodeId = openEpisodeButton.dataset.openEpisode;
                const project = ProjectController.getCurrentProject();

                if (!project) {
                    return;
                }

                ProjectController.openProject(
                    project.id,
                    episodeId
                );
            }

            if (openProjectButton) {
                const projectId = openProjectButton.dataset.openProject;
                ProjectController.openProject(projectId);
            }

            if (deleteProjectButton) {
                const projectId = deleteProjectButton.dataset.deleteProject;
                ProjectController.deleteProject(projectId);
            }

            if (deleteBlockButton) {
                const blockId = deleteBlockButton.dataset.deleteBlock;
                EditorController.deleteBlock(blockId);
            }

            if (addBlockButton) {
                const type = addBlockButton.dataset.addBlockType;
                const panel = document.getElementById("blockMenuPanel");

                EditorController.addBlock(type);
                panel.classList.remove("is-open");
            }

            if (deleteLineImageButton) {
                const blockId = deleteLineImageButton.dataset.deleteLineImage;
                EditorController.deleteLineImage(blockId);
            }

            if (addDmMessageButton) {
                const blockId = addDmMessageButton.dataset.addDmMessage;
                EditorController.addInstagramDmMessage(blockId);
            }

            if (deleteDmMessageButton) {
                const blockId = deleteDmMessageButton.dataset.deleteDmMessage;
                const messageId = deleteDmMessageButton.dataset.dmMessageId;

                EditorController.deleteInstagramDmMessage(blockId, messageId);
            }

            if (addStoryItemButton) {
                const blockId = addStoryItemButton.dataset.addStoryItem;
                const type = addStoryItemButton.dataset.storyItemType;

                EditorController.addInstagramStoryItem(blockId, type);
            }

            if (deleteStoryItemButton) {
                const blockId = deleteStoryItemButton.dataset.deleteStoryItem;
                const itemId = deleteStoryItemButton.dataset.storyItemId;

                EditorController.deleteInstagramStoryItem(blockId, itemId);
            }

            if (addTwitterPostButton) {
                const blockId = addTwitterPostButton.dataset.addTwitterPost;
                EditorController.addTwitterPost(blockId);
            }

            if (deleteTwitterPostButton) {
                const blockId = deleteTwitterPostButton.dataset.deleteTwitterPost;
                const postId = deleteTwitterPostButton.dataset.twitterPostId;

                EditorController.deleteTwitterPostButton(blockId, postId);
            }

            if (addTemplateButton) {
                const templateId = addTemplateButton.dataset.addTemplate;
                const panel = document.getElementById("templateMenuPanel");

                EditorController.addTemplateBlocks(templateId);
                panel.classList.remove("is-open");
            }
        });

        document.addEventListener("input", (event) => {

            const storyItemInput = event.target.closest("[data-story-item-input]");

            if (storyItemInput) {
                const blockId = storyItemInput.dataset.storyItemInput;
                const itemId = storyItemInput.dataset.storyItemId;
                const fieldName = storyItemInput.dataset.fieldName;
                const value = storyItemInput.value;

                EditorController.updateInstagramStoryItem(blockId, itemId, fieldName, value);
                return;
            }

            const twitterPostInput = event.target.closest("[data-twitter-post-input]");

            if (twitterPostInput) {
                const blockId = twitterPostInput.dataset.twitterPostInput;
                const postId = twitterPostInput.dataset.twitterPostInput;
                const fieldName = twitterPostInput.dataset.fieldName;
                const value = twitterPostInput.value;

                EditorController.updateTwitterPost(blockId, postId, fieldName, value);
                return;
            }

            const input = event.target.closest("[data-block-input]");

            const dmTextInput = event.target.closest("[data-dm-message-input]");

            if (dmTextInput) {
                const blockId = dmTextInput.dataset.dmMessageInput;
                const messageId = dmTextInput.dataset.dmMessageId;
                const fieldName = dmTextInput.dataset.fieldName;
                const value = dmTextInput.value;

                EditorController.updateInstagramDmMessage(
                    blockId,
                    messageId,
                    fieldName,
                    value,
                    false
                );

                return;
            }

            if (!input) {
                return;
            }

            const blockId = input.dataset.blockInput;
            const fieldName = input.dataset.fieldName;
            const value = input.value;

            EditorController.updateBlockField(blockId, fieldName, value);
        });

        // チェックボックスの内容を保存
        document.addEventListener("change", (event) => {
            const checkbox = event.target.closest("[data-block-check]");
            const imageInput = event.target.closest("[data-line-image-input]");
            const instagramImageInput = event.target.closest("[data-instagram-image-input]");
            const newsImageInput = event.target.closest("[data-news-image-input]");
            const wikiImageInput = event.target.closest("[data-wiki-image-input]");
            const dmStoryImageInput = event.target.closest("[data-dm-story-image-input]");
            const dmMessageInput = event.target.closest("[data-dm-message-input]");
            const storyBgInput = event.target.closest("[data-story-bg-input]");
            const twitterImageInput = event.target.closest("[data-twitter-image-input]");
            const twitterPostSelect = event.target.closest("[data-twitter-post-input]");
            const characterAvatarInput = event.target.closest("#characterAvatar");
            const editCharacterButton = event.target.closest("[data-edit-character]");
            const deleteCharacterButton = event.target.closest("[data-delete-character]");

            if (checkbox) {
                const blockId = checkbox.dataset.blockCheck;
                const fieldName = checkbox.dataset.fieldName;
                const value = checkbox.checked;

                EditorController.updateBlockField(blockId, fieldName, value);
            }

            if (imageInput) {
                const blockId = imageInput.dataset.lineImageInput;
                const file = imageInput.files[0];

                EditorController.saveLineImage(blockId, file);
            }

            if (instagramImageInput) {
                const blockId =
                    instagramImageInput.dataset.instagramImageInput;
                const file =
                    instagramImageInput.files[0];

                EditorController.saveBlockImage(
                    blockId,
                    file
                );
            }

            if (dmMessageInput) {
                const blockId = dmMessageInput.dataset.dmMessageInput;
                const messageId = dmMessageInput.dataset.dmMessageId;
                const fieldName = dmMessageInput.dataset.fieldName;
                const value = dmMessageInput.value;

                EditorController.updateInstagramDmMessage(blockId, messageId, fieldName, value, true);
            }

            if (dmStoryImageInput) {
                const blockId = dmStoryImageInput.dataset.dmStoryImageInput;
                const messageId = dmStoryImageInput.dataset.dmMessageId;
                const file = dmStoryImageInput.files[0];

                EditorController.saveInstagramDmStoryImage(blockId, messageId, file);
            }

            if (newsImageInput) {
                const blockId =
                    newsImageInput.dataset.newsImageInput;

                const file =
                    newsImageInput.files[0];

                EditorController.saveBlockImage(
                    blockId,
                    file
                );
            }

            if (wikiImageInput) {
                const blockId = wikiImageInput.dataset.wikiImageInput;
                const file = wikiImageInput.files[0];

                EditorController.saveBlockImage(
                    blockId,
                    file
                );
            }

            if (storyBgInput) {
                const blockId = storyBgInput.dataset.storyBgInput;
                const file = storyBgInput.files[0];

                EditorController.saveInstagramStoryBackground(blockId, file);
            }

            if (twitterPostSelect) {
                const blockId = twitterPostSelect.dataset.twitterPostInput;
                const postId = twitterPostSelect.dataset.twitterPostId;
                const fieldName = twitterPostSelect.dataset.fieldName;
                const value = twitterPostSelect.value;

                EditorController.updateTwitterPost(blockId, postId, fieldName, value, true);
            }

            if (twitterImageInput) {
                const blockId = twitterImageInput.dataset.twitterImageInput;
                const postId = twitterImageInput.dataset.twitterPostId;
                const file = twitterImageInput.files[0];

                EditorController.saveTwitterPostImage(blockId, postId, file);
            }

            if (characterAvatarInput) {
                const file = characterAvatarInput.files[0];
                CharacterController.saveAvatar(file);
            }

            if (editCharacterButton) {
                const characterId = editCharacterButton.dataset.editCharacter;

                CharacterController.editCharacter(characterId);
            }

            if (deleteCharacterButton) {
                const characterId = deleteCharacterButton.dataset.deleteCharacter;

                CharacterController.deleteCharacter(characterId);
            }
        });

        document.getElementById("openTemplateMenuButton"),addEventListener("click", () => {
            const panel = document.getElementById("templateMenuPanel");
            panel.classList.toggle("is-open");
        });

        document.getElementById("openEditorButton").addEventListener("click", () => {
            const project = ProjectController.getCurrentProject();
            
            if (!project) {
                return;
            }

            const firstEpisode = project.episodes?.[0];

            if (!firstEpisode) {
                return;
            }

            ProjectController.openProject(project.id, firstEpisode.id);
        });

        document.getElementById("openCharacterButton").addEventListener("click", () => {
            CharacterController.renderCharacterList();
            UI.showPage(UI.pages.character);
        });

        document.getElementById("backToProjectInfoButton").addEventListener("click", () => {
            const project = ProjectController.getCurrentProject();

            if (!project) {
                return;
            }

            ProjectController.openProjectInfo(project.id);
        });

        document.getElementById("characterForm").addEventListener("submit", (event) => {
            CharacterController.saveCharacter(event);
        });
    },

    // ストーリーパーツのドラッグ移動を管理する
        bindStoryDragEvents() {
            let dragTarget = null;
            let startX = 0;
            let startY = 0;
            let originalX = 0;
            let originalY = 0;

            document.addEventListener("pointerdown", (event) => {
                const target = event.target.closest("[data-story-draggable]");

                if (!target) return;

                dragTarget = target;
                startX = event.clientX;
                startY = event.clientY;
                originalX = parseFloat(target.style.left) || 0;
                originalY = parseFloat(target.style.top) || 0;

                target.setPointerCapture(event.pointerId);
            });

            document.addEventListener("pointermove", (event) => {
                if (!dragTarget) return;

                const canvas = dragTarget.closest("[data-story-canvas]");
                const canvasRect = canvas.getBoundingClientRect();

                const moveX = event.clientX - startX;
                const moveY = event.clientY - startY;

                let nextX = originalX + moveX;
                let nextY = originalY + moveY;

                nextX = Math.max(0, Math.min(nextX, canvasRect.width - dragTarget.offsetWidth));
                nextY = Math.max(0, Math.min(nextY, canvasRect.height - dragTarget.offsetHeight));

                dragTarget.style.left = `${nextX}px`;
                dragTarget.style.top = `${nextY}px`;
            });

            document.addEventListener("pointerup", () => {
                if (!dragTarget) return;

                const blockId = dragTarget.dataset.storyBlockId;
                const itemId = dragTarget.dataset.storyItemId;
                const x = parseFloat(dragTarget.style.left) || 0;
                const y = parseFloat(dragTarget.style.top) || 0;

                EditorController.updateInstagramStoryItemPosition(blockId, itemId, x, y);

                dragTarget = null;
            });
        },
};

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});