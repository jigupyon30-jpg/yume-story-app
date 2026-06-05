// 本文ブロックの追加・編集・削除をまとめる
// 後からLINE/インスタ/ニュースブロックもここに足していく
const EditorController = {
    // ブロック一覧を描画する
    renderBlocks(project) {
        const blockList = document.getElementById("blockList");

        if (!project.blocks || project.blocks.length === 0) {
            blockList.innerHTML = `
                <div class="empty">
                    まだ本文がありません。<br>
                    「本文ブロック」を追加して書き始めよう。
                </div>
            `;
            return;
        }

        blockList.innerHTML = project.blocks
            .map((block) => {
                if (block.type === "text") {
                    return this.createTextBlockHtml(block);
                }

                if (block.type === "line") {
                    return this.createLineBlockHtml(block);
                }

                if (block.type === "instagram") {
                    return this.createInstagramBlockHtml(block);
                }

                if (block.type === "instagramDm") {
                    return this.createInstagramDmBlockHtml(block);
                }

                if (block.type === "instagramStory") {
                    return this.createInstagramStoryBlockHtml(block);
                }
                if (block.type === "twitter") {
                    return this.createTwitterBlockHtml(block);
                }

                if (block.type === "news") {
                    return this.createNewsBlockHtml(block);
                }

                if (block.type === "wiki") {
                    return this.createWikiBlockHtml(block);
                }

                // 後からSNSブロックを追加した時の保険
                return "";
            })
            .join("");

            this.fillTextareaValues(project);
    },

    // 本文ブロックのHTMLを作る
    createTextBlockHtml(block) {
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <span class="story-block__type">
                        <i class="fa-solid fa-file-lines"></i>
                        本文ブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <textarea data-block-input="${block.id}" data-field-name="content" placeholder="ここに本文を書く"></textarea>
            </article>
        `;
    },

    // LINEブロックのHTMLを作る
    createLineBlockHtml(block) {
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <span class="story-block__type">
                        <i class="fa-solid fa-comment"></i>
                        LINEブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <input type="text" data-block-input="${block.id}" data-field-name="partnerName" value="${UI.escapeHtml(block.partnerName)}" placeholder="相手の名前 例：柔太朗">

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

                    <textarea data-block-input="${block.id}" data-field-name="messages" placeholder="LINE内容&#10;例：&#10;まりあ：今なにしてる？&#10;柔太朗：まりあのこと考えてた">${UI.escapeHtml(block.messages)}</textarea>

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

    // インスタ投稿ブロックのHTMLを作る
    createInstagramBlockHtml(block) {
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <span class="story-block__type">
                        <i class="fa-brands fa-instagram"></i>
                        インスタ投稿ブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <input type="text" data-block-input="${block.id}" data-field-name="username" value="${UI.escapeHtml(block.username)}" placeholder="ユーザー名 例：kusakawa_milk">

                    <label class="image-upload-field">
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

                    <textarea data-block-input="${block.id}" data-field-name="caption" placeholder="キャプションを書く"></textarea>
                    
                    <input type="text" data-block-input="${block.id}" data-field-name="likes" value="${UI.escapeHtml(block.likes)}" placeholder="いいね数 例：128,932">

                    <textarea class="story-block__small-textarea" data-block-input="${block.id}" data-field-name="comments" placeholder="コメント&#10;例：&#10;@aaa 可愛すぎる&#10;@bbb 匂わせ？"></textarea>
                </div>
            </article>
        `;
    },

    // インスタDMブロックのHTMLを作る
    createInstagramDmBlockHtml(block) {
        const messages = block.messages || [];

        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <span class="story-block__type">
                        <i class="fa-solid fa-paper-plane"></i>
                        インスタDMブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <input type="text" data-block-input="${block.id}" data-field-name="partnerName" value="${UI.escapeHtml(block.partnerName)}" placeholder="相手の名前 例：柔太朗">

                    <input type="text" data-block-input="${block.id}" data-field-name="partnerUsername" value="${UI.escapeHtml(block.partnerUsername)}" placeholder="相手のユーザー名 例：jyutaro_milk">

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
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        project.blocks = project.blocks.map((block) => {
            if (block.id === blockId) {
                const messages = block.messages || [];

                return {
                    ...block,
                    messages: [
                        ...messages,
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
            }

            return block;
        });

        ProjectController.updateCurrentProject(project);

        const updatedProject = ProjectController.getCurrentProject();

        this.renderBlocks(updatedProject);
        this.renderPreview(updatedProject);
    },

    // インスタDMメッセージを更新する
    updateInstagramDmMessage(blockId, messageId, fieldName, value, shouldRenderBlocks = false) {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        project.blocks = project.blocks.map((block) => {
            if (block.id !== blockId) {
                return block;
            }
                const messages = (block.messages || []).map((message) => {
                    if (message.id === messageId) {
                        return {
                            ...message,
                            [fieldName]: value
                        };
                    }

                    return message;
                });

                return {
                    ...block,
                    messages
                };
        });

        ProjectController.updateCurrentProject(project);

        const updatedProject = ProjectController.getCurrentProject();

        if (shouldRenderBlocks){
            this.renderBlocks(updatedProject);
        }
        this.renderPreview(updatedProject);
    },

    // インスタDMメッセージを削除する
    deleteInstagramDmMessage(blockId, messageId) {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        project.blocks = project.blocks.map((block) => {
            if (block.id !== blockId) {
                return block;
            }

            return {
                ...block,
                messages: (block.messages || []).filter((message) => {
                    return message.id !== messageId;
                })
            };
        });

        ProjectController.updateCurrentProject(project);

        const updatedProject = ProjectController.getCurrentProject();

        this.renderBlocks(updatedProject);
        this.renderPreview(updatedProject);
    },

    // ストーリー引用画像を保存する
    saveInstagramDmStoryImage(blockId, messageId, file) {
        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            this.updateInstagramDmMessage(
                blockId,
                messageId,
                "imageData",
                reader.result
            );
        };

        reader.readAsDataURL(file);
    },

    // インスタストーリーブロックのHTMLを作る
    createInstagramStoryBlockHtml(block) {
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
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

    // ストーリー背景画像を保存する
    saveInstagramStoryBackground(blockId, file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            this.updateBlockField(blockId, "backgroundImage", reader.result);

            const project = ProjectController.getCurrentProject();
            this.renderBlocks(project);
            this.renderPreview(project);
        };

        reader.readAsDataURL(file);
    },

    // ストーリーにパーツを追加する
    addInstagramStoryItem(blockId, type) {
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        project.blocks = project.blocks.map((block) => {
            if (block.id !== blockId) return block;

            const item = {
                id: DataFactory.createId("storyItem"),
                type,
                text: this.getDefaultStoryItemText(type),
                subText: type === "music" ? "アーティスト名" : "",
                x: 90,
                y: 220
            };

            return {
                ...block,
                items: [...(block.items || []), item]
            };
        });

        ProjectController.updateCurrentProject(project);

        const updatedProject = ProjectController.getCurrentProject();
        this.renderBlocks(updatedProject);
        this.renderPreview(updatedProject);
    },

    getDefaultStoryItemText(type) {
        if (type === "mention") return "jyutaro_milk";
        if (type === "question") return "質問募集";
        if (type === "music") return "君の恋人になったら";
        return "ライブありがとう🤍";
    },

    // ストーリーパーツの内容を更新する
    updateInstagramStoryItem(blockId, itemId, fieldName, value) {
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        project.blocks = project.blocks.map((block) => {
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
        });

        ProjectController.updateCurrentProject(project);

        const updatedProject = ProjectController.getCurrentProject();
        this.renderPreview(updatedProject);
    },

    // ストーリーパーツの位置を更新する
    updateInstagramStoryItemPosition(blockId, itemId, x, y) {
        this.updateInstagramStoryItem(blockId, itemId, "x", x);
        this.updateInstagramStoryItem(blockId, itemId, "y", y);
    },

    // ストーリーパーツを削除する
    deleteInstagramStoryItem(blockId, itemId) {
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        project.blocks = project.blocks.map((block) => {
            if (block.id !== blockId) return block;

            return {
                ...block,
                items: (block.item || []).filter((item) => item.id !== itemId)
            };
        });

        ProjectController.updateCurrentProject(project);

        const updatedProject = ProjectController.getCurrentProject();
        this.renderBlocks(updatedProject);
        this.renderPreview(updatedProject);
    },

    // Twitter / XブロックのHTMLを作る
    createTwitterBlockHtml(block) {

        const posts = block.posts || [];

        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
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
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        project.blocks = project.blocks.map((block) => {
            if (block.id !== blockId) return block;

            return {
                ...block,
                posts: [
                    ...EditorController(block.posts || []),
                    {
                        id: DataFactory.createId("tweet"),
                        accountType: "member",
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
        });

        ProjectController.updateCurrentProject(project);

        const updatedProject = ProjectController.getCurrentProject();
        this.renderBlocks(updatedProject);
        this.renderPreview(updatedProject);
    },

    // Twitter / X投稿の内容を更新する
    updateTwitterPost(blockId, postId, fieldName, value) {
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        project.blocks = project.blocks.map((block) => {
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
        });

        ProjectController.updateCurrentProject(project);

        const updatedProject = ProjectController.getCurrentProject();
        this.renderPreview(updatedProject);
    },

    // Twitter / X投稿を削除する
    deleteTwitterPost(blockId, postId) {
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        project.blocks = project.blocks.map((block) => {
            if (block.id !== blockId) return block;

            return {
                ...block,
                posts: (block.posts || []).filter((post) => post.id !== postId)
            };
        });

        ProjectController.updateCurrentProject(project);

        const updatedProject = ProjectController.getCurrentProject();
        this.renderBlocks(updatedProject);
        this.renderPreview(updatedProject);
    },

    // Twitter / X投稿画像を保存する
    saveTwitterPostImage(blockId, postId, file) {
        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            this.updateTwitterPost(
                blockId,
                postId,
                "imageData",
                reader.result
            );

            const updatedProject = ProjectController.getCurrentProject();
            this.renderBlocks(project);
            this.renderPreview(project);
        };

        reader.readAsDataURL(file);
    },

    // 芸能ニュースブロックのHTMLを作る
    createNewsBlockHtml(block) {
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <span class="story-block__type">
                        <i class="fa-solid fa-newspaper"></i>
                        芸能ニュースブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <input type="text" data-block-input="${block.id}" data-field-name="mediaName" value="${UI.escapeHtml(block.mediaName)}" placeholder="メディア名 例：週刊ドリームニュース">

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

                    <input type="text" data-block-input="${block.id}" data-field-name="headline" value="${UI.escapeHtml(block.headline)}" placeholder="見出し 例：人気アイドルに熱愛報道">

                    <textarea data-block-input="${block.id}" data-field-name="body" placeholder="記事本文を書く"></textarea>

                    <textarea class="story-block__small-textarea" data-block-input="${block.id}" data-field-name="reaction" placeholder="SNSの反響・コメントまとめ"></textarea>
                </div>
            </article>
        `;
    },

    // WikiブロックのHTMLを作る
    createWikiBlockHtml(block) {
        return `
            <article class="story-block" data-block-id="${block.id}">
                <div class="story-block__head">
                    <span class="story-block__type">
                        <i class="fa-solid fa-id-card"></i>
                        Wikiブロック
                    </span>

                    <button class="story-block__delete" data-delete-block="${block.id}">
                    削除
                    </button>
                </div>

                <div class="story-block__fields">
                    <input type="text" data-block-input="${block.id}" data-field-name="name" value="${UI.escapeHtml(block.name)}" placeholder="名前">

                    <input type="text" data-block-input="${block.id}" data-field-name="subtitle" value="${UI.escapeHtml(block.subtitle)}" placeholder="肩書き 例：日本のアイドル、女優">

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

                    <textarea data-block-input="${block.id}" data-field-name="summary" placeholder="概要文">${UI.escapeHtml(block.summary)}</textarea>
                    <textarea data-block-input="${block.id}" data-field-name="profile" placeholder="プロフィール情報">${UI.escapeHtml(block.profile)}</textarea>
                    <textarea data-block-input="${block.id}" data-field-name="history" placeholder="略歴">${UI.escapeHtml(block.history)}</textarea>
                    <textarea data-block-input="${block.id}" data-field-name="drama" placeholder="出演：テレビドラマ">${UI.escapeHtml(block.drama)}</textarea>
                    <textarea data-block-input="${block.id}" data-field-name="movie" placeholder="出演：映画">${UI.escapeHtml(block.movie)}</textarea>
                </div>
            </article>
        `;
    },

    // 本文ブロックを追加する
    addBlock(type) {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        const newBlock = DataFactory.createBlockByType(type);

        if (!newBlock) {
            return;
        }

        project.blocks.push(newBlock);

        ProjectController.updateCurrentProject(project);
        this.renderBlocks(project);
        this.renderPreview(project);
    },

    // 本文ブロックの内容を保存する
    updateBlockField(blockId, fieldName, value) {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        project.blocks = project.blocks.map((block) => {
            if (block.id === blockId) {
                return {
                    ...block,
                    [fieldName]: value
                };
            }

            return block;
        });

        ProjectController.updateCurrentProject(project);
        this.renderPreview(project);
    },

    // プレビュー全体を描画する
    renderPreview(project) {
        const previewList = document.getElementById("previewList");

        if (!project || !project.blocks || project.blocks.length === 0) {
            previewList.innerHTML = `
                <div class="empty">
                    まだプレビューできるブロックがありません。
                </div>
            `;
            return;
        }

        previewList.innerHTML = project.blocks
            .map((block) => {
                if (block.type === "text") {
                    return this.createTextPreviewHtml(block);
                }

                if (block.type === "line") {
                    return this.createLinePreviewHtml(block);
                }

                if (block.type === "instagram") {
                    return this.createInstagramPreviewHtml(block);
                }

                if (block.type === "instagramDm") {
                    return this.createInstagramDmPreviewHtml(block);
                }

                if (block.type === "instagramStory") {
                    return this.createInstagramStoryPreviewHtml(block);
                }

                if (block.type === "twitter") {
                    return this.createTwitterPreviewHtml(block);
                }

                if (block.type === "news") {
                    return this.createNewsPreviewHtml(block);
                }

                if (block.type === "wiki") {
                    return this.createWikiPreviewHtml(block);
                }

                return "";
            })
            .join("");
    },

    // 本文プレビューHTML
    createTextPreviewHtml(block) {
        return `
            <div class="preview-text">${UI.escapeHtml(block.content || "本文が未入力です")}
            </div>
        `;
    },

    // LINEプレビューHTML
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
                                            ${
                                                block.isReadVisible
                                                    ? `<span>既読</span>`
                                                    : ""
                                            }
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
        if (!text) {
            return [];
        }

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

        const nextHour = String(date.getHours()).padStart(2, "0");
        const nextMinute = String(date.getMinutes()).padStart(2, "0");

        return `${nextHour}:${nextMinute}`;
    },

    // LINE画像を保存する
    saveLineImage(blockId, file) {
        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            this.updateBlockField(blockId, "imageData", reader.result);

            const project = ProjectController.getCurrentProject();

            if (project) {
                this.renderBlocks(project);
                this.renderPreview(project);
            }
        };

        reader.readAsDataURL(file);
    },

    // Instagram・News画像保存
    saveBlockImage(blockId, file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const project =
                ProjectController.getCurrentProject();

            if (!project) return;

            project.blocks =
                project.blocks.map((block) => {
                    if (block.id === blockId) {
                        return {
                            ...block,
                            imageData: reader.result
                        };
                    }

                    return block;
                });

                ProjectController.updateCurrentProject(
                    project
                );

                const updatedProject =
                    ProjectController.getCurrentProject();

                this.renderBlocks(updatedProject);
                this.renderPreview(updatedProject);
        };

        reader.readAsDataURL(file);
    },

    // LINE画像を削除する
    deleteLineImage(blockId) {
        this.updateBlockField(blockId, "imageData", "");

        const project = ProjectController.getCurrentProject();

        if (project) {
            this.renderBlocks(project);
            this.renderPreview(project);
        }
    },

    // インスタ投稿プレビューHTML
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

                            <p class="preview-instagram-dm__note-text">${UI.escapeHtml(message.text || "ノートに流した曲への反応")}</p>
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
                            : `
                                <div class="preview-instagram-story__dummy">Story</div>`
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

                    <p class="preview-twitter-post__text">${UI.escapeHtml(post.text || "投稿内容が未入力です")}</p>

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
    // 芸能ニュースプレビューHTML
    createNewsPreviewHtml(block) {

        return `
            <article class="preview-news">
                <div class="preview-news__media">
                    画像プレビューは次の段階で追加
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

                        <div class="preview-wiki__info">
                            ${this.createWikiProfileRows(block.profile)}
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
        if (!profileText) {
            return "";
        }

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
    },
    // ブロックを削除する
    deleteBlock(blockId) {
        const isOk = confirm("このブロックを削除しますか？");

        if (!isOk) {
            return;
        }

        const project = ProjectController.getCurrentProject();
        
        if (!project) {
            return;
        }

        project.blocks = project.blocks.filter((block) => block.id !==blockId);

        ProjectController.updateCurrentProject(project);
        this.renderBlocks(project);
        this.renderPreview(project);
    },

    fillTextareaValues(project) {
        project.blocks.forEach((block) => {
            Object.keys(block).forEach((fieldName) => {
                const textarea = document.querySelector(
                    `textarea[data-block-input="${block.id}"][data-field-name="${fieldName}"]`
                );

                if (textarea) {
                    textarea.value = block[fieldName] || "";
                }
            });
        });
    },

    // 設定別テンプレートを本文にまとめて追加する
    addTemplateBlocks(templateId) {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        const templateBlocks = TemplateService.createBlocksByTemplate(templateId);

        if (templateBlocks.length === 0) {
            return;
        }

        const templateName = TemplateService.getTemplateName(templateId);
        const isOk = confirm(`${templateName}を追加しますか？`);

        if (!isOk) {
            return;
        }

        project.blocks = [
            ...(project.blocks || []),
            ...templateBlocks
        ];

        ProjectController.updateCurrentProject(project);

        const updatedProject = ProjectController.getCurrentProject();

        this.renderBlocks(updatedProject);
        this.renderPreview(updatedProject);
    },
};