Object.assign(EditorController, {
    createNewsBlockHtml(block) {
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
                        <i class="fa-solid fa-newspaper"></i>
                        芸能ニュースブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <input type="text" data-block-input="${block.id}" data-field-name="mediaName" value="${UI.escapeHtml(block.mediaName || "")}" placeholder="メディア名 例：週刊ドリームニュース">

                    <label class="image-upload-field">
                        <input type="file" accept="image/*" data-news-image-input="${block.id}">
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

                    <input type="text" data-block-input="${block.id}" data-field-name="headline" value="${UI.escapeHtml(block.headline || "")}" placeholder="見出し 例：人気アイドルに熱愛報道">

                    <textarea data-block-input="${block.id}" data-field-name="body" placeholder="記事本文を書く">${UI.escapeHtml(block.body || "")}</textarea>

                    <textarea class="story-block__small-textarea" data-block-input="${block.id}" data-field-name="reaction" placeholder="SNSの反響・コメントまとめ">${UI.escapeHtml(block.reaction || "")}</textarea>
                </div>
            </article>
        `;
    },

    // 芸能ニュースプレビューHTML
    createNewsPreviewHtml(block) {

        return `
            <article class="preview-news">
                <div class="preview-news__media">
                    ${UI.escapeHtml(block.mediaName || "芸能ニュース")}
                </div>

                <div class="preview-news__body">
                    <div class="preview-news__image">
                        ${
                        block.imageData
                            ? `
                                <img src="${block.imageData}" alt="">
                            `
                            : `
                                <div class="news-dummy">
                                    <i class="fa-solid fa-newspaper"></i>
                                    <span>ニュース画像</span>
                                </div>
                            `
                    }
                </div>
                    <h3 class="preview-news__headline">
                        ${UI.escapeHtml(block.headline || "ニュース見出し未入力")}
                    </h3>

                    <p class="preview-news__text">${UI.escapeHtml(block.body || "記事本文が未入力です")}
                    </p>

                    <p class="preview-news__reaction">${UI.escapeHtml(block.reaction || "SNSの反響なし")}
                    </p>
                </div>
            </article>
        `;
    },
});