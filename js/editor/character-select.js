// キャラクター選択・SNSアカウント反映
Object.assign(EditorController, {
    getProjectCharacters() {
        const project = ProjectController.getCurrentProject();
        return project?.characters || [];
    },

    createCharacterOptions(selectedCharacterId = "") {
        const characters = this.getProjectCharacters();

        return `
            <option value="">アカウントを選択</option>
            ${characters
                .map((character) => {
                    return `
                        <option value="${character.id}" ${character.id === selectedCharacterId ? "selected": ""}>
                            ${UI.escapeHtml(character.name)}
                        </option>
                    `;
                })
            .join("")}
        `;
    },

    applyCharacterToBlock(blockId, blockType, characterId) {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        const character = (project.characters || []).find((item) => {
            return item.id === characterId;
        });

        if (!character) return;

        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) {
                        return block;
                    }

                    if (blockType === "instagram") {
                        return {
                            ...block,
                            characterId: character.id,
                            username: character.instagramUsername || character.name
                        };
                    } 

                    if (blockType === "line") {
                        return {
                            ...block,
                            partnerCharacterId: character.id,
                            partnerName: character.lineName || character.name
                        };
                    } 

                    if (blockType === "instagramDm") {
                        return {
                            ...block,
                            partnerCharacterId: character.id,
                            partnerName: character.instagramName || character.name,
                            partnerUsername: character.instagramUsername || ""
                        };
                    } 

                    return block;
                })
            };
        });

        EpisodeUpdateService.rerender();
    },

    // Twitter投稿に選択したキャラクター情報を反映する
    applyCharacterToTwitterPost(blockId, postId, characterId) {
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        const character = (project.characters || []).find((item) => {
            return item.id === characterId;
        });

        if (!character) return;

        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId || block.type !== "twitter") {
                        return block;
                    }

                    return {
                        ...block,
                        posts: (block.posts || []).map((post) => {
                            if (post.id !== postId) {
                                return post;
                            }

                            return {
                                ...post,
                                characterId: character.id,
                                displayName: character.twitterName || character.name,
                                username: character.twitterUsername || ""
                            };
                        })
                    };
                })
            };
        });

        EpisodeUpdateService.rerender();
    }
});