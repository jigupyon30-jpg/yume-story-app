Object.assign(EditorController, {
    createInstagramStoryBlockHtml(block) {
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <div class="story-block__actions">
                        <button type="button" class="story-block__move" data-move-block-up="${block.id}">↑</button>
                        <button type="button" class="story-block__move" data-move-block-down="${block.id}">↓</button>
                        <button type="button" class="story-block__delete" data-delete-block="${block.id}">削除</button>
                    </div>
                    <span class="story-block__type">
                        <i class="fa-solid fa-circle-play"></i>
                        インスタストーリーブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <label class="image-upload-field">
                        <span>背景画像</span>
                        <input type="file" accept="image/*" data-story-bg-input="${block.id}">
                    </label>

                    <div class="story-tool-buttons">
                        <button type="button" class="button button--ghost" data-add-story-item="${block.id}" data-story-item-type="text">
                            <i class="fa-solid fa-font"></i>
                            <span>テキスト</span>
                        </button>

                        <button type="button" class="button button--ghost" data-add-story-item="${block.id}" data-story-item-type="mention">
                            <i class="fa-solid fa-at"></i>
                            <span>メンション</span>
                        </button>

                        <button type="button" class="button button--ghost" data-add-story-item="${block.id}" data-story-item-type="question">
                            <i class="fa-regular fa-circle-question"></i>
                            <span>質問箱</span>
                        </button>

                        <button type="button" class="button button--ghost" data-add-story-item="${block.id}" data-story-item-type="music">
                            <i class="fa-solid fa-music"></i>
                            <span>曲</span>
                        </button>
                    </div>

                    <div class="story-canvas" data-story-canvas="${block.id}">
                        ${
                            block.backgroundImage
                                ? `<img class="story-canvas__bg" src="${block.backgroundImage}" alt="">`
                                : `<div class="story-canvas__dummy">背景画像を選択</div>`
                        }

                        ${(block.items || [])
                        .map((item) => this.createStoryItemHtml(block.id, item))
                        .join("")}
                    </div>

                    <div class="story-item-list">
                        ${(block.items || [])
                        .map((item) => this.createStoryItemEditHtml(block.id, item))
                        .join("")}
                    </div>
                </div>
            </article>
        `;
    },

    // ストーリー上に置くパーツHTMLを作る
    createStoryItemHtml(blockId, item) {
        return `
            <div class="story-canvas-item story-canvas-item--${item.type}" style="left:${item.x}px; top:${item.y}px;" data-story-draggable="true" data-story-block-id="${blockId}" data-story-item-id="${item.id}">${this.createStoryItemContent(item)}</div>
        `;
    },

    // ストーリーパーツの中身を種類ごとに作る
    createStoryItemContent(item) {
        if (item.type === "mention") {
            return `<span>@${UI.escapeHtml(item.text || "username")}</span>`;
        }

        if (item.type === "question") {
            return `
                <div class="story-question">
                    <p>${UI.escapeHtml(item.text || "質問募集")}</p>
                    <span>質問を入力...</span>
                </div>
            `;
        }

        if (item.type === "music") {
            return `
                <div class="story-music">
                    <i class="fa-solid fa-music"></i>
                    <div>
                        <p>${UI.escapeHtml(item.text || "曲名")}</p>
                        <span>${UI.escapeHtml(item.subText || "アーティスト名")}</span>
                    </div>
                </div>
            `;
        }

        return `<span>${UI.escapeHtml(item.text || "テキスト")}</span>`;
    },

    // ストーリーパーツ編集欄HTMLを作る
    createStoryItemEditHtml(blockId, item) {
        return `
            <div class="story-item-edit">
                <div class="story-item-edit__head">
                    <strong>${this.getStoryItemLabel(item.type)}</strong>

                    <button type="button" data-delete-story-item="${blockId}" data-story-item-id="${item.id}">削除</button>
                </div>

                <input type="text" data-story-item-input="${blockId}" data-story-item-id="${item.id}" data-field-name="text" value="${UI.escapeHtml(item.text || "")}" placeholder="表示するテキスト">
                ${
                    item.type === "music"
                        ? `
                            <input type="text" data-story-item-input="${blockId}" data-story-item-id="${item.id}" data-field-name="subText" value="${UI.escapeHtml(item.subText || "")}" placeholder="アーティスト名">
                        `
                        : ""
                }
            </div>
        `;
    },

    getStoryItemLabel(type) {
        if (type === "mention") return "メンション";
        if (type === "question") return "質問箱";
        if (type === "music") return "曲";
        return "テキスト";
    },

    getDefaultStoryItemText(type) {
        if (type === "mention") return "jyutaro_milk";
        if (type === "question") return "質問募集";
        if (type === "music") return "君の恋人になったら";
        return "ライブありがとう🤍";
    },

    // ストーリー背景画像を保存する
    saveInstagramStoryBackground(blockId, file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            this.updateBlockField(blockId, "backgroundImage", reader.result);

            const episode = EpisodeUpdateService.getCurrentEpisode();

            this.renderBlocks(episode);
            this.renderPreview(episode);
        };

        reader.readAsDataURL(file);
    },

    // ストーリーにパーツを追加する
    addInstagramStoryItem(blockId, type) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        items: [
                            ...(block.items || []),
                            {
                                id: DataFactory.createId("storyItem"),
                                type,
                                text: this.getDefaultStoryItemText(type),
                                subText: type === "music" ? "アーティスト名" : "",
                                x: 90,
                                y: 220
                            }
                        ]
                    };
                })
            };
        });

        EpisodeUpdateService.rerender();
    },


    // ストーリーパーツの内容を更新する
    updateInstagramStoryItem(blockId, itemId, fieldName, value) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        items: (block.items || []).map((item) => {
                                if (item.id !== itemId) return item;
                                return {
                                    ...item,
                                    [fieldName]: value
                                };
                            })
                    };
                })
            };
        });

        const episode = EpisodeUpdateService.getCurrentEpisode();
        this.renderPreview(episode);
    },

    // ストーリーパーツの位置を更新する
    updateInstagramStoryItemPosition(blockId, itemId, x, y) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        items: (block.items || []).map((item) => {
                                if (item.id !== itemId) return item;
                                return {
                                    ...item,
                                    x,
                                    y
                                };
                            })
                    };
                })
            };
        });

        const episode = EpisodeUpdateService.getCurrentEpisode();
        this.renderPreview(episode);
    },

    // ストーリーパーツを削除する
    deleteInstagramStoryItem(blockId, itemId) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        items: (block.items || []).map((item) => {
                            return item.id !== itemId;
                            })
                    };
                })
            };
        });

        EpisodeUpdateService.rerender();
    },

    // インスタストーリープレビューHTML
    createInstagramStoryPreviewHtml(block) {

        return `
            <section class="preview-instagram-story">
                <div class="preview-instagram-story__bar">
                    <span></span>
                </div>

                <div class="preview-instagram-story__canvas">
                    ${
                        block.backgroundImage
                            ? `<img class="preview-instagram-story__bg" src="${block.backgroundImage}" alt="">`
                            : `<div class="preview-instagram-story__dummy">Story</div>`
                    }

                    ${(block.items || [])
                    .map((item) => {
                        return `
                            <div class="story-canvas-item story-canvas-item--${item.type}" style="left:${item.x}px; top:${item.y}px;">${this.createStoryItemContent(item)}</div>
                        `;
                    })
                .join("")}
                </div>
            </section>
        `;
    },
});