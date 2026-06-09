Object.assign(EditorController, {
    createTikTokBlockHtml(block) { 
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <span class="story-block__type">
                        <i class="fa-brands fa-tiktok"></i>
                        TikTokブブロック
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
                        <span>投稿者</span>
                        <select data-block-character-select="${block.id}" data-block-type="tiktok">${this.createCharacterOptions(block.characterId)}</select>
                    </label>

                    <input type="text" data-block-input="${block.id}" data-field-name="displayName" value="${UI.escapeHtml(block.displayName || "")}" placeholder="表示名">
                    <label>
                        <span>動画サムネイル</span>
                        <input type="file" accept="image/*" data-tiktok-image-input="${block.id}">
                    </label>

                    ${
                        block.imageData
                        ? `
                            <div class="image-preview">
                                <img src="${block.imageData}">
                            </div>
                        `
                        : ""
                    }

                    <textarea data-block-input="${block.id}" data-field-name="caption" placeholder="動画説明">${UI.escapeHtml(block.caption || "")}</textarea>

                    <input type="text" data-block-input="${block.id}" data-field-name="musicName" value="${UI.escapeHtml(block.musicName || "")}" placeholder="使用音源">

                    <div class="tiktok-grid">
                        <input type="text" data-block-input="${block.id}" data-field-name="likes" value="${UI.escapeHtml(block.likes || "")}" placeholder="いいね">
                        <input type="text" data-block-input="${block.id}" data-field-name="comments" value="${UI.escapeHtml(block.comments || "")}" placeholder="コメント">
                        <input type="text" data-block-input="${block.id}" data-field-name="saves" value="${UI.escapeHtml(block.saves || "")}" placeholder="保存">
                        <input type="text" data-block-input="${block.id}" data-field-name="shares" value="${UI.escapeHtml(block.shares || "")}" placeholder="シェア">
                    </div>
                </div>
            </article>
        `;
    },

    createTikTokPreviewHtml(block) {
        return `
            <section class="preview-tiktok">
                <div class="preview-tiktok__video">
                    ${
                        block.imageData
                        ? `
                            <img src="${block.imageData}" alt="">
                        `
                        : `
                            <div class="preview-tiktok__dummy">TikTok</div>
                        `
                    }

                    <div class="preview-tiktok__overlay">
                        <div class="preview-tiktok__info">
                            <strong>${UI.escapeHtml(block.displayName || "ユーザー")}</strong>
                            <span>${UI.formatText(block.caption || "動画説明")}</span>
                            <small>♪${UI.escapeHtml(block.musicName || "音源")}</small>
                        </div>

                        <div class="preview-tiktok__actions">
                            <div>❤️<span>${block.likes || "0"}</span></div>
                            <div>💬<span>${block.comments || "0"}</span></div>
                            <div>🔖<span>${block.saves || "0"}</span></div>
                            <div>↗<span>${block.shares || "0"}</span></div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
});