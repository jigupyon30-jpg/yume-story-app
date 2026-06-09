Object.assign(EditorController, {
    createTwitterBlockHtml(block) {

        const posts = block.posts || [];

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
                        <i class="fa-brands fa-x-twitter"></i>
                        Twitter / Xブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <div class="twitter-editor-head">
                        <span>投稿一覧</span>

                        <button type="button" class="button button--ghost" data-add-twitter-post="${block.id}">
                            <i class="fa-solid fa-plus"></i>
                            <span>投稿追加</span>
                        </button>
                    </div>

                    <div class="twitter-post-list">
                        ${posts.map((post, index) => {
                            return this.createTwitterPostFormHtml(block.id, post, index);
                        })
                    .join("")}
                </div>
                </div>
            </article>
        `;
    },

    // Twitter / X投稿1件分の入力欄
    createTwitterPostFormHtml(blockId, post, index) {
        return `
            <div class="twitter-post-form">
                <div class="twitter-post-form__head">
                    <strong>投稿 ${index + 1}</strong>

                    <button type="button" data-delete-twitter-post="${blockId}" data-twitter-post-id="${post.id}">削除</button>
                </div>

                <label>
                    <span>登録アカウントから選択</span>
                    <select data-twitter-character-select="${blockId}" data-twitter-post-id="${post.id}">${this.createCharacterOptions(post.characterId)}</select>
                </label>
                <label>
                    <span>アカウント種類</span>
                    <select data-twitter-post-input="${blockId}" data-twitter-post-id="${post.id}" data-field-name="accountType">
                        <option value="official" ${post.accountType === "official" ? "selected" : ""}>グループ公式</option>
                        <option value="member" ${post.accountType === "member" ? "selected" : ""}>メンバー</option>
                        <option value="me" ${post.accountType === "me" ? "selected" : ""}>自分</option>
                        <option value="fan" ${post.accountType === "fan" ? "selected" : ""}>オタク / 一般アカウント</option>
                    </select>
                </label>

                <div class="twitter-post-form__grid">
                    <label>
                        <span>アカウント名</span>
                        <input type="text" data-twitter-post-input="${blockId}" data-twitter-post-id="${post.id}" data-field-name="displayName" value="${UI.escapeHtml(post.displayName || "")}" placeholder="例：M!LK OFFICIAL">
                    </label>

                    <label>
                        <span>ユーザー名</span>
                        <input type="text" data-twitter-post-input="${blockId}" data-twitter-post-id="${post.id}" data-field-name="username" value="${UI.escapeHtml(post.username || "")}" placeholder="例：milk_official">
                    </label>
                </div>

                <textarea data-twitter-post-input="${blockId}" data-twitter-post-id="${post.id}" data-field-name="text" placeholder="投稿内容">${UI.escapeHtml(post.text || "")}</textarea>
                
                <label class="image-upload-field">
                    <span>投稿画像</span>
                    <input type="file" accept="image/*" data-twitter-image-input="${blockId}" data-twitter-post-id="${post.id}">
                </label>

                ${
                    post.imageData
                        ? `
                            <div class="image-preview">
                                <img src="${post.imageData}" alt="">
                            </div>
                        `
                        : ""
                }

                <div class="twitter-post-form__grid twitter-post-form__grid--three"">
                    <label>
                        <span>返信</span>
                        <input type="text" data-twitter-post-input="${blockId}" data-twitter-post-id="${post.id}" data-field-name="replies" value="${UI.escapeHtml(post.replies || "")}" placeholder="12">
                    </label>

                    <label>
                        <span>リポスト</span>
                        <input type="text" data-twitter-post-input="${blockId}" data-twitter-post-id="${post.id}" data-field-name="reposts" value="${UI.escapeHtml(post.reposts || "")}" placeholder="345">
                    </label>

                    <label>
                        <span>いいね</span>
                        <input type="text" data-twitter-post-input="${blockId}" data-twitter-post-id="${post.id}" data-field-name="likes" value="${UI.escapeHtml(post.likes || "")}" placeholder="1.2万">
                    </label>
                </div>
            </div>
        `;
    },

    // Twitter / X投稿を追加する
    addTwitterPost(blockId) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        posts: [
                            ...(block.posts || []),
                            {
                                id: DataFactory.createId("tweet"),
                                accountType: "member",
                                characterId: "",
                                displayName: "",
                                username: "",
                                text: "",
                                likes: "",
                                reposts: "",
                                replies: "",
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

    // Twitter / X投稿の内容を更新する
    updateTwitterPost(blockId, postId, fieldName, value) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        posts: (block.posts || []).map((post) => {
                                if (post.id !== postId) return post;
                                return {
                                    ...post,
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

    // Twitter / X投稿を削除する
    deleteTwitterPost(blockId, postId) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (block.id !== blockId) return block;

                    return {
                        ...block,
                        posts: (block.posts || []).map((post) => {
                            return post.id !== postId;
                            })
                    };
                })
            };
        });

        EpisodeUpdateService.rerender();
    },

    // Twitter / X投稿画像を保存する
    saveTwitterPostImage(blockId, postId, file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            this.updateTwitterPost(
                blockId,
                postId,
                "imageData",
                reader.result
            );

            const episode = EpisodeUpdateService.getCurrentEpisode();
            this.renderBlocks(episode);
            this.renderPreview(episode);
        };

        reader.readAsDataURL(file);
    },

    // Twitter / XブロックのプレビューHTMLを作る
    createTwitterPreviewHtml(block) {
        const posts = block.posts || [];

        return `
            <section class="preview-twitter">
                ${
                    posts.length === 0
                        ? `<div class="empty">投稿がありません</div>`
                        : posts
                            .map((post) => {
                                return this.createTwitterPostPreviewHtml(post);
                            })
                            .join("")
                }
            </section>
        `;
    },

    // Twitter / X投稿1件分のプレビューHTMLを作る
    createTwitterPostPreviewHtml(post) {
        return `
            <article class="preview-twitter-post preview-twitter-post--${post.accountType}">
                <div class="preview-twitter-post__avatar">
                    ${this.getTwitterAccountIcon(post.accountType)}
                </div>

                <div class="preview-twitter-post__body">
                    <div class="preview-twitter-post__account">
                        <strong>${UI.escapeHtml(post.displayName || "アカウント名")}</strong>
                        <span>@${UI.escapeHtml(post.username || "username")}</span>
                    </div>

                    <p class="preview-twitter-post__text">${UI.formatText(post.text || "投稿内容が未入力です")}</p>

                    ${
                        post.imageData
                            ? `
                                <div class="preview-twitter-post__image">
                                    <img src="${post.imageData}" alt="">
                                </div>
                            `
                            : ""
                    }

                    <div class="preview-twitter-post__actions">
                        <span>
                            <i class="fa-regular fa-comment"></i>
                            ${UI.escapeHtml(post.replies || "0")}
                        </span>

                        <span>
                            <i class="fa-solid fa-retweet"></i>
                            ${UI.escapeHtml(post.reposts || "0")}
                        </span>

                        <span>
                            <i class="fa-regular fa-heart"></i>
                            ${UI.escapeHtml(post.likes || "0")}
                        </span>
                    </div>
                </div>
            </article>
        `;
    },

    // Twitter / X投稿のアカウント種類ごとにアイコン文字を返す
    getTwitterAccountIcon(accountType) {
        if (accountType === "official") return "公";
        if (accountType === "member") return "M";
        if (accountType === "me") return "私";
        return "♡";
    },
});