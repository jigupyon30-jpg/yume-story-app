// 本文ブロックのHTML・プレビューHTML
Object.assign(EditorController, {
    createTextBlockHtml(block) {
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">

                    <span class="story-block__type">
                        <i class="fa-solid fa-file-lines"></i>
                        本文ブロック
                    </span>

                    <div class="story-block__actions">
                        <button type="button" class="story-block__move" data-move-block-up="${block.id}">↑</button>
                        <button type="button" class="story-block__move" data-move-block-down="${block.id}">↓</button>
                        <button type="button" class="story-block__duplicate" data-duplicate-block="${block.id}">複製</button>
                        <button type="button" class="story-block__delete" data-delete-block="${block.id}">削除</button>
                    </div>
                </div>

                <div class="story-block__field">
                    <label>
                        <span>文字サイズ</span>
                        <select data-block-input="${block.id}" data-field-name="fontSize">
                            <option value="small" ${block.fontSize === "small" ? "selected" : ""}>小さめ</option>
                            <option value="medium" ${block.fontSize === block.fontSize === "small" ? "selected" : ""}>標準</option>
                            <option value="large" ${block.fontSize === "large" ? "selected" : ""}>大きめ</option>
                        </select>
                    </label>

                    <p class="story-block__hint">通話パートは <code>[call]通話内容[/call]</code> で囲むと薄く表示されます。</p>
                    <textarea data-block-input="${block.id}" data-field-name="content" placeholder="ここに本文を書く&#10;&#10;例：&#10;[call]柔太朗：もしもし？&#10;まりあ：今大丈夫？[/call]">${UI.escapeHtml(block.content || "")}</textarea>
                </div>
            </article>
        `;
    },

    formatTextContent(content) {
        const escapedText = UI.escapeHtml(content || "");
        const formattedText = escapedText.replace(/\n/g, "<br>");

        return escapedText.replace(
            /\[call\]([\s\S]*?)\[\/call\]/g,
            `<span class="reader-call-text">$1</span>`
        );
    },

    createTextPreviewHtml(block) {
        return `
            <div class="preview-text preview-text--${block.fontSize || "medium"}">${UI.formatText(block.content || "本文が未入力です")}</div>
        `;
    },
});