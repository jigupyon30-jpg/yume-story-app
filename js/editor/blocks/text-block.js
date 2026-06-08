// 本文ブロックのHTML・プレビューHTML
Object.assign(EditorController, {
    createTextBlockHtml(block) {
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
                        <i class="fa-solid fa-file-lines"></i>
                        本文ブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <textarea data-block-input="${block.id}" data-field-name="content" placeholder="ここに本文を書く">${UI.escapeHtml(block.content || "")}</textarea>
            </article>
        `;
    },

    createTextPreviewHtml(block) {
        return `
            <div class="preview-text">${UI.escapeHtml(block.content || "本文が未入力です")}
            </div>
        `;
    },
});