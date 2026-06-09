Object.assign(EditorController, {
    createInstagramDmBlockHtml(block) {
        const messages = block.messages || [];

        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <div class="story-block__actions">
                        <button type="button" class="story-block__move" data-move-block-up="${block.id}">↑</button>
                        <button type="button" class="story-block__move" data-move-block-down="${block.id}">↓</button>
                        <button type="button" class="story-block__duplicate" data-duplicate-block="${block.id}">複製</button>
                        <button type="button" class="story-block__delete" data-delete-block="${block.id}">削除</button>
                    </div>
                    <span class="story-block__type">
                        <i class="fa-solid fa-paper-plane"></i>
                        インスタDMブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <label>
                        <span>相手アカウント</span>
                        <select data-block-character-select="${block.id}" data-block-type="instagramDm">${this.createCharacterOptions(block.partnerCharacterId)}</select>
                    </label>
                    <input type="text" data-block-input="${block.id}" data-field-name="partnerName" value="${UI.escapeHtml(block.partnerName || "")}" placeholder="相手の名前 例：柔太朗">

                    <input type="text" data-block-input="${block.id}" data-field-name="partnerUsername" value="${UI.escapeHtml(block.partnerUsername || "")}" placeholder="相手のユーザー名 例：jyutaro_milk">

                    <label class="line-check">
                        <input type="checkbox" data-block-check="${block.id}" data-field-name="isReadVisible" ${block.isReadVisible ? "checked" : ""}>
                        <span>自分のメッセージに既読を表示する</span>
                    </label>

                    <div class="dm-message-editor">
                        <div class="dm-message-editor__head">
                            <span>DMメッセージ</span>

                            <button type="button" class="button button--ghost" data-add-dm-message="${block.id}">
                                <i class="fa-solid fa-plus"></i>
                                <span>追加</span>
                            </button>
                        </div>

                        <div class="dm-message-list">
                            ${messages
                                .map((message, index) => {
                                    return this.createInstagramDmMessageFormHtml(block.id, message, index);
                                })
                            .join("")}
                        </div>
                    </div>
                </div>
            </article>
        `;
    },

    // インスタDM内の1メッセージ分の入力欄を作る
    createInstagramDmMessageFormHtml(blockId, message, index) {
        return `
            <div class="dm-message-form" data-dm-message-id="${message.id}">
                <div class="dm-message-form__head">
                    <strong>メッセージ ${index + 1}</strong>

                    <button type="button" data-delete-dm-message="${blockId}" data-dm-message-id="${message.id}">
                    削除
                    </button>
                </div>

                <div class="dm-message-form__grid">
                    <label>
                        <span>種類</span>
                        <select data-dm-message-input="${blockId}" data-dm-message-id="${message.id}" data-field-name="type">
                            <option value="text" ${message.type === "text" ? "selected" : ""}>通常メッセージ</option>
                            <option value="call" ${message.type === "call" ? "selected" : ""}>通話</option>
                            <option value="missed" ${message.type === "missed" ? "selected" : ""}>不在着信</option>
                            <option value="story" ${message.type === "story" ? "selected" : ""}>ストーリー引用</option>
                            <option value="deleted" ${message.type === "deleted" ? "selected" : ""}>メッセージ取り消し</option>
                            <option value="voice" ${message.type === "voice" ? "selected" : ""}>ボイスメッセージ</option>
                            <option value="note" ${message.type === "note" ? "selected" : ""}>ノート共有</option>
                        </select>
                    </label>

                    <label>
                        <span>送信者</span>
                        <select data-dm-message-input="${blockId}" data-dm-message-id="${message.id}" data-field-name="sender">
                            <option value="me" ${message.sender === "me" ? "selected" : ""}>自分</option>
                            <option value="partner" ${message.sender === "partner" ? "selected" : ""}>相手</option>
                        </select>
                    </label>
                </div>

                <textarea data-dm-message-input="${blockId}" data-dm-message-id="${message.id}" data-field-name="text" placeholder="メッセージ内容 / 通話メモ">${UI.escapeHtml(message.text || "")}</textarea>
                ${
                    message.type === "story"
                        ? `
                            <label class="image-upload-field">
                                <span>ストーリー引用画像</span>
                                <input type="file" accept="image/*" data-dm-story-image-input="${blockId}" data-dm-message-id="${message.id}">
                            </label>

                            ${
                                message.imageData
                                    ? `
                                        <div class="image-preview">
                                            <img src="${message.imageData}" alt="">
                                        </div>
                                    `
                                    : ""
                            }
                        `
                        : ""
                }
            </div>
        `;
    },

    // インスタDMメッセージを追加する
    addInstagramDmMessage(blockId) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        messages: [
                            ...(block.messages || []),
                            {
                                id: DataFactory.createId("dm"),
                                type: "text",
                                sender: "me",
                                text: "",
                                imageData: null,
                                createdAt: new Date().toISOString()
                            }
                        ]
                    };
                })
            };
        });

        EpisodeUpdateService.rerender();
    },

    // インスタDMメッセージを更新する
    updateInstagramDmMessage(blockId, messageId, fieldName, value, shouldRenderBlocks = false) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        messages: (block.messages || []).map((message) => {
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

        if (shouldRenderBlocks) {
            this.renderBlocks(episode);
        }
        this.renderPreview(episode);
    },

    // インスタDMメッセージを削除する
    deleteInstagramDmMessage(blockId, messageId) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        messages: (block.messages || []).filter((message) => {
                            return message.id !== messageId;
                        })
                    };
                })
            };
        });

        EpisodeUpdateService.rerender();
    },

    // ストーリー引用画像を保存する
    saveInstagramDmStoryImage(blockId, messageId, file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            this.updateInstagramDmMessage(
                blockId,
                messageId,
                "imageData",
                reader.result,
                true
            );
        };

        reader.readAsDataURL(file);
    },

    // インスタDMプレビューHTML
    createInstagramDmPreviewHtml(block) {

        const messages = block.messages || [];

        return `
            <section class="preview-instagram-dm">
                <div class="preview-instagram-dm__header">
                    <div class="preview-instagram-dm__avatar"></div>

                    <div>
                        <p>${UI.escapeHtml(block.partnerName || "相手の名前")}</p>
                        <span>@${UI.escapeHtml(block.partnerUsername || "username")}</span>
                    </div>
                </div>

                <div class="preview-instagram-dm__messages">
                    ${
                        messages.length === 0
                            ? `
                                <p class="preview-instagram-dm__empty">メッセージがありません</p>
                            `
                            : messages
                                .map((message) => {
                                    return this.createInstagramDmMessagePreviewHtml(
                                        block,
                                        message
                                    );
                                })
                                .join("")
                    }
                </div>
            </section>
        `;
    },

    // インスタDM 1メッセージ分のプレビューHTMLを作る
    createInstagramDmMessagePreviewHtml(block, message) {
        const isMe = message.sender === "me";

        if (message.type === "call") {
            return this.createInstagramDmCallPreviewHtml(message, false);
        }

        if (message.type === "missed") {
            return this.createInstagramDmCallPreviewHtml(message, true);
        }

        if (message.type === "story") {
            return `
                <div class="preview-instagram-dm__row ${isMe ? "is-me" : ""}">
                    <div class="preview-instagram-dm__story">
                        ${
                            message.imageData
                                ? `<img src="${message.imageData}" alt="">`
                                : `
                                    <div class="preview-instagram-dm__story-dummy">
                                        <i class="fa-solid fa-image"></i>
                                        <span>ストーリー</span>
                                    </div>
                                `
                        }
                        <p>${UI.escapeHtml(message.text || "ストーリーに返信しました")}</p>
                    </div>

                    ${
                        isMe && block.isReadVisible
                            ? `<span class="preview-instagram-dm__read">既読</span>`
                            : ""
                    }
                </div>
            `;
                }

            // メッセージ取り消し表示
            if (message.type === "deleted") {
                return `
                    <div class="preview-instagram-dm__row ${isMe ? "is-me" : ""}">
                        <div class="preview-instagram-dm__deleted">
                            このメッセージは取り消されました
                        </div>
                    </div>
                `;
            }

            // ボイスメッセージ表示
            if (message.type === "voice") {
                return `
                    <div class="preview-instagram-dm__row ${isMe ? "is-me" : ""}">
                        <div class="preview-instagram-dm__voice ${isMe ? "is-me" : ""}">
                            <i class="fa-solid fa-play"></i>

                            <div class="preview-instagram-dm__voice-wave">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <span class="preview-instagram-dm__voice-time">${UI.escapeHtml(message.text || "0:08")}</span>
                        </div>

                        ${
                            isMe && block.isReadVisible
                                ? `<span class="preview-instagram-dm__read">既読</span>`
                                : ""
                        }
                    </div>
                `;
            }

            // ノート共有表示
            if (message.type === "note") {
                return `
                    <div class="preview-instagram-dm__row ${isMe ? "is-me" : ""}">
                        <div class="preview-instagram-dm__note">
                            <div class="preview-instagram-dm__note-head">
                                <i class="fa-solid fa-music"></i>
                                <span>ノート</span>
                            </div>

                            <p class="preview-instagram-dm__note-text">${UI.formatText(message.text || "ノートに流した曲への反応")}</p>
                        </div>

                        ${
                            isMe && block.isReadVisible
                                ? `<span class="preview-instagram-dm__read">既読</span>`
                                : ""
                        }
                    </div>
                `;
            }

            return `
                <div class="preview-instagram-dm__row ${isMe ? "is-me" : ""}">
                    <div class="preview-instagram-dm__bubble">${UI.escapeHtml(message.text || "メッセージ未入力")}</div>

                    ${
                        isMe && block.isReadVisible
                            ? `<span class="preview-instagram-dm__read">既読</span>`
                            : ""
                    }
                </div>
            `;
    },

    // インスタDMの通話/不在着信プレビューHTMLを作る
    createInstagramDmCallPreviewHtml(message, isMissed) {
        const isMe = message.sender === "me";

        return `
            <div class="preview-instagram-dm__call-row ${isMe ? "is-me" : ""}">
                <div class="preview-instagram-dm__call-card ${isMissed ? "is-missed" : ""}">
                    <div class="preview-instagram-dm__call-icon">
                        <i class="fa-solid ${isMissed ? "fa-phone-slash" : "fa-phone"}"></i>
                    </div>

                    <div class="preview-instagram-dm__call-text">
                        <p>
                            ${UI.escapeHtml(
                                message.text || 
                                    (isMissed ? "不在着信" : "音声通話終了しました")
                            )}
                        </p>

                        <span>
                            ${UI.escapeHtml(isMe ? "あなたから発信" : "相手から着信")}
                        </span>
                    </div>
                </div>
            </div>
        `;
    },
});