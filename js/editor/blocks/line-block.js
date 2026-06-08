// LINEブロックのHTML・プレビューHTML
Object.assign(EditorController, {
    createLineBlockHtml(block) {
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
                        <i class="fa-solid fa-comment"></i>
                        LINEブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <label>
                        <span>相手キャラクター</span>
                        <select data-block-character-select="${block.id}" data-block-type="line">${this.createCharacterOptions(block.partnerCharacterId)}</select>
                    </label>

                    <input type="text" data-block-input="${block.id}" data-field-name="partnerName" value="${UI.escapeHtml(block.partnerName || "")}" placeholder="相手の名前 例：柔太朗">

                    <div class="line-settings-grid">
                        <label>
                            <span>開始時間</span>
                            <input type="time" data-block-input="${block.id}" data-field-name="startTime" value="${UI.escapeHtml(block.startTime || "22:00")}">
                        </label>

                        <label>
                            <span>何分ずつ進める？</span>
                            <input type="number" data-block-input="${block.id}" data-field-name="minuteStep" value="${UI.escapeHtml(block.minuteStep || 1)}">
                        </label>
                    </div>

                    <label class="line-check">
                        <input type="checkbox" data-block-check="${block.id}" data-field-name="isReadVisible" value="${block.isReadVisible ? "checked" : ""}">
                        <span>自分のメッセージに既読を表示する</span>
                    </label>

                    <textarea data-block-input="${block.id}" data-field-name="messages" placeholder="LINE内容&#10;例：&#10;まりあ:今なにしてる？&#10;柔太朗:まりあのこと考えてた">${UI.escapeHtml(block.messages || "")}</textarea>

                    <label>
                        <span>送信画像</span>
                        <input type="file" accept="image/*" data-line-image-input="${block.id}">
                    </label>

                    ${
                        block.imageData
                            ? `
                                <div class="line-image-preview">
                                    <img src="${block.imageData}" alt="LINE送信画像">
                                    <button type="button" data-delete-line-image="${block.id}">画像を削除</button>
                                </div>
                            `
                            : ""
                    }
                </div>
            </article>
        `;
    },

    createLinePreviewHtml(block) {
        const messages = this.parseLineMessages(block.messages);
        const previewItems = this.createLinePreviewItems(block, messages);

        return `
            <div class="preview-line">
                <div class="preview-line__header">
                    ${UI.escapeHtml(block.partnerName || "LINE")}
                </div>

                <div class="preview-line__messages">${previewItems
                        .map((item) => {
                            if (item.type === "image") {
                                return `
                                    <div class="preview-line__row is-me">
                                        <div class="preview-line__meta">
                                            ${block.isReadVisible ? `<span>既読</span>` : ""}
                                            <span>${UI.escapeHtml(item.time)}</span>
                                        </div>

                                        <div class="preview-line__image">
                                            <img src="${item.imageData}" alt="送信画像">
                                        </div>
                                    </div>
                                `;
                            }

                            return `
                                <div class="preview-line__row ${item.isMe ? "is-me" : ""}">
                                    ${item.isMe
                                        ? `
                                            <div class="preview-line__meta">
                                                ${
                                                block.isReadVisible
                                                    ? `<span>既読</span>`
                                                    : ""
                                            }
                                            <span>${UI.escapeHtml(item.time)}</span>
                                        </div>
                                        `
                                    : ""
                                }

                                <div class="preview-line__bubble ${item.isMe ? "is-me" : ""}">
                                    ${UI.escapeHtml(item.text)}
                                </div>

                                ${
                                    !item.isMe
                                        ? `
                                            <div class="preview-line__meta">
                                                <span>${UI.escapeHtml(item.time)}</span>
                                            </div>
                                        `
                                        : ""
                                }
                            </div>
                            `;
                        })
                    .join("")}
                </div>
            </div>
        `;
    },

    // LINE入力テキストを吹き出し用データに変換する
    parseLineMessages(text) {
        if (!text) return [];

        return text
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => {
                const index = line.indexOf(":");
                const speaker = index !== -1 ? line.slice(0, index).trim() : "";
                const message = index !== -1 ? line.slice(index + 1).trim() : line.trim();

                return {
                    type: "text",
                    text: message,
                    isMe: speaker.includes("まりあ") || speaker.includes("私")
                };
            });
    },

    // LINEの時間つきプレビュー用データを作る
    createLinePreviewItems(block, messages) {
        const items = [...messages];

        if (block.imageData) {
            items.push({
                type: "image",
                imageData: block.imageData,
                isMe: true
            });
        }

        if (items.length === 0) {
            return [
                {
                    type: "text",
                    text: "LINE内容が未入力です",
                    isMe: false,
                    time: block.startTime || "22:00"
                }
            ];
        }

        return items.map((item, index) => {
            return {
                ...item,
                time: this.addMinutesToTime(block.startTime || "22:00", index * Number(block.minuteStep || 1))
            };
        });
    },

    // 22:00 + 1分 = 22:01 のように時間を進める
    addMinutesToTime(baseTime, addMinutes) {
        const [hour, minute] = baseTime.split(":").map(Number);

        const date = new Date();
        date.setHours(hour);
        date.setMinutes(minute + addMinutes);

        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    },

    saveLineImage(blockId, file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            this.updateBlockField(blockId, "imageData", reader.result);

            const episode = EpisodeUpdateService.getCurrentEpisode();

            this.renderBlocks(episode);
            this.renderPreview(episode);
        };

        reader.readAsDataURL(file);
    },

    // LINE画像を削除する
    deleteLineImage(blockId) {
        this.updateBlockField(blockId, "imageData", "");

        const episode = EpisodeUpdateService.getCurrentEpisode();

            this.renderBlocks(episode);
            this.renderPreview(episode);
    },
});