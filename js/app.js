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

        document.getElementById("backToEpisodeListButton").addEventListener("click", () => {
            const project = ProjectController.getCurrentProject();

            if (!project) {
                return;
            }

            ProjectController.openProjectInfo(project.id);
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
            const addLiveMessageButton = event.target.closest("[data-add-live-message]");
            const deleteLiveMessageButton = event.target.closest("[data-delete-live-message]");
            const moveBlockUpButton = event.target.closest("[data-move-block-up]");
            const moveBlockDownButton = event.target.closest("[data-move-block-down]");
            const duplicateBlockButton = event.target.closest("[data-duplicate-block]");
            const readEpisodeButton = event.target.closest("[data-read-episode]");
            const openProjectInfoButton = event.target.closest("[data-open-project-info]");
            const openEpisodeButton = event.target.closest("[data-open-episode]");
            const openProjectButton = event.target.closest("[data-open-project]");
            const editCharacterButton = event.target.closest("[data-edit-character]");
            const deleteCharacterButton = event.target.closest("[data-delete-character]");
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


            if (addLiveMessageButton) {
                const blockId = addLiveMessageButton.dataset.addLiveMessage;
                EditorController.addInstagramLiveMessage(blockId);
            }

            if (deleteLiveMessageButton) {
                const blockId = deleteLiveMessageButton.dataset.deleteLiveMessage;
                const messageId = deleteLiveMessageButton.dataset.liveMessageId;

                EditorController.deleteInstagramLiveMessage(blockId, messageId);
            }

            if (moveBlockUpButton) {
                const blockId = moveBlockUpButton.dataset.moveBlockUp;
                EditorController.moveBlockUp(blockId);
            }

            if (moveBlockDownButton) {
                const blockId = moveBlockDownButton.dataset.moveBlockDown;
                EditorController.moveBlockDown(blockId);
            }

            if (duplicateBlockButton) {
                const blockId = duplicateBlockButton.dataset.duplicateBlock;
                EditorController.duplicateBlock(blockId);
            }

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

            if (readEpisodeButton) {
                const episodeId = readEpisodeButton.dataset.readEpisode;
                EpisodeController.openEpisodeReader(episodeId);
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

                EditorController.deleteTwitterPost(blockId, postId);
            }

            if (addTemplateButton) {
                const templateId = addTemplateButton.dataset.addTemplate;
                const panel = document.getElementById("templateMenuPanel");

                EditorController.addTemplateBlocks(templateId);
                panel.classList.remove("is-open");
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

            if (twitterPostInput && twitterPostInput.tagName !== "SELECT") {
                const blockId = twitterPostInput.dataset.twitterPostInput;
                const postId = twitterPostInput.dataset.twitterPostId;
                const fieldName = twitterPostInput.dataset.fieldName;
                const value = twitterPostInput.value;

                EditorController.updateTwitterPost(blockId, postId, fieldName, value);
                return;
            }
            const dmTextInput = event.target.closest("[data-dm-message-input]");
            const liveMessageInput = event.target.closest("[data-live-message-input]");
            const input = event.target.closest("[data-block-input]");

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

            if (liveMessageInput) {
                const blockId = liveMessageInput.dataset.liveMessageInput;
                const messageId = liveMessageInput.dataset.liveMessageId;
                const fieldName = liveMessageInput.dataset.fieldName;
                const value = liveMessageInput.value;

                EditorController.updateInstagramLiveMessage(blockId,messageId,fieldName,value);

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
            const episodeTitleInput = event.target.closest("[data-episode-title-input]");
            const checkbox = event.target.closest("[data-block-check]");
            const imageInput = event.target.closest("[data-line-image-input]");
            const instagramImageInput = event.target.closest("[data-instagram-image-input]");
            const newsImageInput = event.target.closest("[data-news-image-input]");
            const wikiImageInput = event.target.closest("[data-wiki-image-input]");
            const dmStoryImageInput = event.target.closest("[data-dm-story-image-input]");
            const storyBgInput = event.target.closest("[data-story-bg-input]");
            const liveMessageSelect = event.target.closest("select[data-live-message-input]");
            const twitterImageInput = event.target.closest("[data-twitter-image-input]");
            const tiktokImageInput = event.target.closest("[data-tiktok-image-input]");
            const twitterPostSelect = event.target.matches("select[data-twitter-post-input]")
                ? event.target
                : null;
            const characterAvatarInput = event.target.closest("#characterAvatar");
            const blockCharacterSelect = event.target.closest("[data-block-character-select]");
            const twitterCharacterSelect = event.target.closest("[data-twitter-character-select]");

            if (episodeTitleInput) {
                const episodeId = episodeTitleInput.dataset.episodeTitleInput;
                const title = episodeTitleInput.value;

                EpisodeController.updateEpisodeTitle(episodeId, title);
            }

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

            if (dmStoryImageInput) {
                const blockId = dmStoryImageInput.dataset.dmStoryImageInput;
                const messageId = dmStoryImageInput.dataset.dmMessageId;
                const file = dmStoryImageInput.files[0];

                EditorController.saveInstagramDmStoryImage(blockId, messageId, file);
            }
            
            if (liveMessageSelect) {
                const blockId = liveMessageSelect.dataset.liveMessageInput;
                const messageId = liveMessageSelect.dataset.liveMessageId;
                const fieldName = liveMessageSelect.dataset.fieldName;
                const value = liveMessageSelect.value;

                EditorController.updateInstagramLiveMessage(blockId, messageId, fieldName, value);
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

            if (twitterPostSelect && twitterPostSelect.dataset.twitterPostId) {
                const blockId = twitterPostSelect.dataset.twitterPostInput;
                const postId = twitterPostSelect.dataset.twitterPostId;
                const fieldName = twitterPostSelect.dataset.fieldName;
                const value = twitterPostSelect.value;

                EditorController.updateTwitterPost(blockId, postId, fieldName, value);
            }

            if (twitterImageInput) {
                const blockId = twitterImageInput.dataset.twitterImageInput;
                const postId = twitterImageInput.dataset.twitterPostId;
                const file = twitterImageInput.files[0];

                EditorController.saveTwitterPostImage(blockId, postId, file);
            }

            if (tiktokImageInput) {
                const blockId = tiktokImageInput.dataset.tiktokImageInput;
                const file = tiktokImageInput.files[0];

                EditorController.saveBlockImage(blockId, file);
            }

            if (characterAvatarInput) {
                const file = characterAvatarInput.files[0];
                CharacterController.saveAvatar(file);
            }


            if (blockCharacterSelect) {
                const blockId = blockCharacterSelect.dataset.blockCharacterSelect;
                const blockType = blockCharacterSelect.dataset.blockType;
                const characterId = blockCharacterSelect.value;

                EditorController.applyCharacterToBlock(blockId, blockType, characterId);
            }

            if (twitterCharacterSelect) {
                const blockId = twitterCharacterSelect.dataset.twitterCharacterSelect;
                const postId = twitterCharacterSelect.dataset.twitterPostId;
                const characterId = twitterCharacterSelect.value;

                EditorController.applyCharacterToTwitterPost(blockId, postId, characterId);
            }
        });

        document.getElementById("openTemplateMenuButton").addEventListener("click", () => {
            const panel = document.getElementById("templateMenuPanel");
            panel.classList.toggle("is-open");
        });

        document.getElementById("openEditorButton").addEventListener("click", () => {
            const project = ProjectController.getCurrentProject();
            
            if (!project) {
                return;
            }

            const currentEpisode = ProjectController.getCurrentEpisode();

            if (currentEpisode) {
                ProjectController.openProject(
                    project.id,
                    currentEpisode.id
                );
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