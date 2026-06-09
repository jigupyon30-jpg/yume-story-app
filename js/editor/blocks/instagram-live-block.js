Object.assign(EditorController, {
    createInstagramLiveBlockHtml(block) {
        const messages = block.messages ||  block.comments || [];
        
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <span class="story-block__type">
                        <i class="fa-solid fa-video"></i>
                        インスタライブブロック
                    </span>

                    <div class="story-block__actions">
                        <button type="button" class="story-block__move" data-move-block-up="${block.id}">↑</button>
                        <button type="button" class="story-block__move" data-move-block-down="${block.id}">↓</button>
                        <button type="button" class="story-block__duplicate" data-duplicate-block="${block.id}">複製</button>
                        <button type="button" class="story-block__delete" data-delete-block="${block.id}">削除</button>
                    </div>
                </div>

                <div class="story-block__fields">
                    <label>
                        <span>配信アカウント</span>
                        <select data-block-character-select="${block.id}" data-block-type="instagramLive">${this.createCharacterOptions(block.characterId)}</select>
                    </label>

                    <input type="text" data-block-input="${block.id}" data-field-name="username" value="${UI.escapeHtml(block.username || "")}" placeholder="例：kusakawa_milk">

                    <div class="live-comment-editor">
                        <div class="live-comment-editor__head">
                            <span>コメント</span>
                            <button type="button" class="button button--ghost" data-add-live-message="${block.id}">
                                <i class="fa-solid fa-plus"></i>
                                <span>メッセージ追加</span>
                            </button>
                        </div>

                        <div class="live-comment-list">
                            ${messages.map((message, index) => {
                                return this.createInstagramLiveMessageFormHtml(block.id, message, index);
                            })
                        .join("")}
                        </div>                            
                    </div>
                </div>
            </article>
        `;
    },

    // インライコメント入力欄を作る
    createInstagramLiveMessageFormHtml(blockId, message, index) {
        return `
            <div class="live-comment-form">
                <div class="live-comment-form__head">
                    <strong>メッセージ ${index + 1}</strong>

                    <button type="button" data-delete-live-message="${blockId}" data-live-message-id="${message.id}">削除</button>
                </div>

                <label>
                    <span>種類</span>
                    <select data-live-message-input="${blockId}" data-live-message-id="${message.id}" data-field-name="type">
                        <option value="host" ${message.type === "host" ? "selected" : ""}>配信者の会話</option>
                        <option value="viewer" ${message.type === "viewer" ? "selected" : ""}>視聴者コメント</option>
                    </select>
                </label>

                ${
                    message.type === "viewer"
                        ? `
                            <input type="text" data-live-message-input="${blockId}" data-live-message-id="${message.id}" data-field-name="username" value="${UI.escapeHtml(message.username || "")}" placeholder="コメントユーザー名 例：aaa">
                        `
                        : ""
                }

                <textarea data-live-message-input="${blockId}" data-live-message-id="${message.id}" data-field-name="text" placeholder="内容を書く">${UI.escapeHtml(message.text || "")}</textarea>
            </div>
        `;
    },

    // インライコメントを追加する
    addInstagramLiveMessage(blockId) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        messages: [
                            ...(block.messages || block.comments || []),
                            {
                                id: DataFactory.createId("liveMessage"),
                                type: "viewer",
                                username: "",
                                text: ""
                            }
                        ]
                    };
                })
            };
        });

        EpisodeUpdateService.rerender();
    },

    // インライコメントを更新する
    updateInstagramLiveMessage(blockId, messageId, fieldName, value) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        messages: 
                            (block.messages || block.comments || []).map((message) => {
                                if (message.id !== messageId) return message;

                                return {
                                    ...message,
                                    [fieldName]: value
                                };
                            })
                    };
                })
            };
        });

        const episode = EpisodeUpdateService.getCurrentEpisode();

        if (fieldName === "type") {
            this.renderBlocks(episode);
        }

        this.renderPreview(episode);
    },

    // インライコメントを削除する
    deleteInstagramLiveMessage(blockId, messageId) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        messages: (block.messages || block.comments || []).filter((message) => {
                            return message.id !== messageId;
                        })
                    };
                })
            };
        });

        EpisodeUpdateService.rerender();
    },

    // インライプレビュー
    createInstagramLivePreviewHtml(block) {
        const messages = block.messages || block.comments || [];
        const username = block.username || "kusakawa_milk";

        return `
            <section class="preview-instagram-live">
                <div class="preview-instagram-live__top">
                    <div class="preview-instagram-live__profile">
                        <div class="preview-instagram-live__avatar"></div>
                        <strong>${UI.escapeHtml(username)}</strong>
                        <span>LIVE</span>
                    </div>

                    <i class="fa-solid fa-xmark"></i>
                </div>
                
                <div class="preview-instagram-live__screen">
                    <div class="preview-instagram-live__notice">${UI.escapeHtml(username)}がライブ配信を始めました</div>
                </div>

                <div class="preview-instagram-live__comments">
                    ${messages.map((message) => {
                        if (message.type === "host") {
                            return `
                                <p class="preview-instagram-live__host">
                                    <strong>${UI.escapeHtml(username)}</strong>
                                    <span>${UI.formatText(message.text || "配信者の会話")}</span>
                                </p>
                            `;
                        }

                        return `
                            <p>
                                <strong>${UI.escapeHtml(message.username || "user")}</strong>
                                <span>${UI.formatText(message.text || "コメント")}</span>
                            </p>
                        `;
                    })
                .join("")}
            </div>

            <div class="preview-instagram-live__bottom">
                <span>コメントを追加...</span>
                <i class="fa-regular fa-heart"></i>
                <i class="fa-regular fa-paper-plane"></i>
            </div>
            </section>
        `;
    }
});