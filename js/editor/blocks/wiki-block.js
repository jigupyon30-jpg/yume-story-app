Object.assign(EditorController, {
    createWikiBlockHtml(block) {
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <div class="story-block__actions">
                        <button type="button" class="story-block__move" data-move-block-up="${block.id}">↑</button>
                        <button type="button" class="story-block__move" data-move-block-down="${block.id}">↓</button>
                        <button type="button" class="story-block__delete" data-delete-block="${block.id}">削除</button>
                    </div>
                    <span class="story-block__type">
                        <i class="fa-solid fa-id-card"></i>
                        Wikiブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <input type="text" data-block-input="${block.id}" data-field-name="name" value="${UI.escapeHtml(block.name || "")}" placeholder="名前">

                    <input type="text" data-block-input="${block.id}" data-field-name="subtitle" value="${UI.escapeHtml(block.subtitle || "")}" placeholder="肩書き 例：日本のアイドル、女優">

                    <label class="image-upload-field">
                        <span>プロフィール画像</span>
                        <input type="file" accept="image/*" data-wiki-image-input="${block.id}">
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

                    <textarea data-block-input="${block.id}" data-field-name="summary" placeholder="概要文">${UI.escapeHtml(block.summary || "")}</textarea>
                    <textarea data-block-input="${block.id}" data-field-name="profile" placeholder="プロフィール情報">${UI.escapeHtml(block.profile || "")}</textarea>
                    <textarea data-block-input="${block.id}" data-field-name="history" placeholder="略歴">${UI.escapeHtml(block.history || "")}</textarea>
                    <textarea data-block-input="${block.id}" data-field-name="drama" placeholder="出演：テレビドラマ">${UI.escapeHtml(block.drama || "")}</textarea>
                    <textarea data-block-input="${block.id}" data-field-name="movie" placeholder="出演：映画">${UI.escapeHtml(block.movie || "")}</textarea>
                </div>
            </article>
        `;
    },

    // WikiプレビューHTML
    createWikiPreviewHtml(block) {

        return `
            <article class="preview-wiki">
                <h2 class="preview-wiki__name">
                    ${UI.escapeHtml(block.name || "名前未入力")}
                </h2>
                <p class="preview-wiki__subtitle">
                    ${UI.escapeHtml(block.subtitle || "")}
                </p>

                <div class="preview-wiki__lead">
                    <p>${UI.escapeHtml(block.summary || "")}</p>
                </div>

                <div class="preview-wiki__layout">
                    <aside class="preview-wiki__side">
                        <div class="preview-wiki__image">
                            ${
                                block.imageData
                                    ? `<img src="${block.imageData}" alt="">`
                                    : `
                                        <div class="wiki-dummy">
                                            <i class="fa-solid fa-user"></i>
                                            <span>プロフィール画像</span>
                                        </div>
                                    `
                            }
                        </div>

                        <div class="preview-wiki__info">${this.createWikiProfileRows(block.profile)}
                        </div>
                    </aside>

                    <div class="preview-wiki__main">
                        <section class="preview-wiki__section">
                            <h3>略歴</h3>
                            <p>${UI.escapeHtml(block.history || "")}</p>
                        </section>

                        <section class="preview-wiki__section">
                            <h3>出演</h3>

                            <h4>テレビドラマ</h4>
                            <p>${UI.escapeHtml(block.drama || "")}</p>

                            <h4>映画</h4>
                            <p>${UI.escapeHtml(block.movie || "")}</p>
                        </section>
                    </div>
                </div>
            </article>
        `;
    },

    // Wikiプロフィール欄を表っぽく作る
    createWikiProfileRows(profileText) {
        if (!profileText) return;

        return profileText
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => {
                const index = line.indexOf(":");
                const label = index !== -1 ? line.slice(0, index) : "";
                const value = index !== -1 ? line.slice(index + 1) : line;

                return `
                    <div class="preview-wiki__row">
                        <span>${UI.escapeHtml(label)}</span>
                        <p>${UI.escapeHtml(value)}</p>
                    </div>
                `;
            })
            .join("");
    }
});