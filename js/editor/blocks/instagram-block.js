Object.assign(EditorController, {
    createInstagramBlockHtml(block) {
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <div class="story-block__actions">
                        <button type="button" class="story-block__move" data-move-block-up="${block.id}">↑</button>
                        <button type="button" class="story-block__move" data-move-block-down="${block.id}">↓</button>
                        <button type="button" class="story-block__delete" data-delete-block="${block.id}">削除</button>
                    </div>
                    <span class="story-block__type">
                        <i class="fa-brands fa-instagram"></i>
                        インスタ投稿ブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <label>
                        <span>投稿アカウント</span>
                        <select data-block-character-select="${block.id}" data-block-type="instagram">${this.createCharacterOptions(block.characterId)}</select>
                    </label>
                    <input type="text" data-block-input="${block.id}" data-field-name="username" value="${UI.escapeHtml(block.username || "")}" placeholder="ユーザー名 例：kusakawa_milk">

                    <label class="image-upload-field">
                        <span>投稿画像</span>
                        <input type="file" accept="image/*" data-instagram-image-input="${block.id}">
                    </label>
                    ${
                        block.imageData
                            ? `
                                <div class="image-preview">
                                    <img src="${block.imageData}" alt="">
                                </div>
                            `
                            : ""
                    }

                    <textarea data-block-input="${block.id}" data-field-name="caption" placeholder="キャプションを書く">${UI.escapeHtml(block.caption || "")}</textarea>
                    
                    <input type="text" data-block-input="${block.id}" data-field-name="likes" value="${UI.escapeHtml(block.likes || "")}" placeholder="いいね数 例：128,932">

                    <textarea class="story-block__small-textarea" data-block-input="${block.id}" data-field-name="comments" placeholder="コメント&#10;例：&#10;@aaa 可愛すぎる&#10;@bbb 匂わせ？">${UI.escapeHtml(block.comments || "")}</textarea>
                </div>
            </article>
        `;
    },

    createInstagramPreviewHtml(block) {

        return `
            <div class="preview-instagram">
                <div class="preview-instagram__header">
                    <div class="preview-instagram__avatar"></div>
                    <p class="preview-instagram__username">${UI.escapeHtml(block.username || "username")}</p>
                </div>

                <div class="preview-instagram__image">
                    ${
                        block.imageData
                            ? `
                                <img src="${block.imageData}" alt="">
                            `
                            : `
                                <div class="instagram-dummy">
                                    <i class="fa-solid fa-image"></i>
                                    <span>投稿画像</span>
                                </div>
                            `
                    }
                </div>

                <div class="preview-instagram__body">
                    <p class="preview-instagram__likes">${UI.escapeHtml(block.likes || "0")}件のいいね
                    </p>

                    <p class="preview-instagram__caption"><strong>${UI.escapeHtml(block.username || "username")}</strong>${UI.escapeHtml(block.caption || "キャプション未入力")}</p>

                    <p class="preview-instagram__comments">${UI.escapeHtml(block.comments || "コメントなし")}
                    </p>
                </div>
            </div>
        `;
    },
});