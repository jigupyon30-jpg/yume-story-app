// エディタ画面のブロック追加・編集・削除・プレビュー描画をまとめる
const EditorController = {
    elements: {},

    init() {
        this.cacheElements();
        this.bindEvents();
        this.renderSnsForm();
        this.render();
    },

    cacheElements() {
        this.elements.form = document.getElementById("textBlockForm");
        this.elements.blockId = document.getElementById("blockId");
        this.elements.textInput = document.getElementById("textBlockInput");
        this.elements.blockList = document.getElementById("blockList");
        this.elements.editorProjectLabel = document.getElementById("editorProjectLabel");
        this.elements.previewTitle = document.getElementById("previewTitle");
        this.elements.previewGenre = document.getElementById("previewGenre");
        this.elements.previewBody = document.getElementById("previewBody");
        this.elements.resetButton = document.getElementById("resetBlockFormButton");

        this.elements.snsBlockType = document.getElementById("snsBlockType");
        this.elements.snsDynamicForm = document.getElementById("snsDynamicForm");
        this.elements.addSnsBlockButton = document.getElementById("addSnsBlockButton");
    },

    bindEvents() {
        this.elements.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.saveTextBlock();
        });

        this.elements.resetButton.addEventListener("click", () => {
            this.resetForm();
        });

        this.elements.snsBlockType.addEventListener("change", () => {
            this.renderSnsForm();
        });

        this.elements.addSnsBlockButton.addEventListener("click", async () => {
            await this.saveSnsBlock();
        });
    },

    saveTextBlock() {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            alert("先に作品を選択してね");
            return;
        }

        const text = this.elements.textInput.value.trim();

        if (!text) {
            alert("本文を入力してね");
            return;
        }

        const now = new Date().toISOString();

        project.blocks.push({
            id: crypto.randomUUID(),
            type: "text",
            content: { text },
            createdAt: now,
            updatedAt: now,
        });

        project.updatedAt = now;

        ProjectController.updateProject(project);
        this.resetForm();
        this.render();
    },

    async saveSnsBlock() {

        const project = ProjectController.getCurrentProject();

        if (!project) {
            alert("先に作品を選択してね");
            return;
        }

        const type = this.elements.snsBlockType.value;

        if (type === "line") {
            this.createLineBlock();
            return;
        }

        if (type === "instagramDm") {
            this.createDmBlock();
            return;
        }
        const now = new Date().toISOString();
        const content = await this.getSnsFormContent(type);

        project.blocks.push({
            id: crypto.randomUUID(),
            type,
            content,
            createdAt: now,
            updatedAt: now,
        });

        project.updatedAt = now;

        ProjectController.updateProject(project);
        this.renderSnsForm();
        this.render();
    },

    async getSnsFormContent(type) {
        if (type === "line") {
            return {
                partnerName: this.getValue("linePartnerName"),
                partnerIcon: await this.readImageFile("linePartnerIcon"),
                messageType: this.getValue("lineMessageType"),
                text: this.getValue("lineText"),
                callTime: this.getValue("lineCallTime"),
            };
        }

        if (type === "instagramPost") {
            return {
                displayName: this.getValue("instaDisplayName"),
                userName: this.getValue("instaUserName"),
                icon: await this.readImageFile("instaIcon"),
                image: await this.readImageFile("instaImage"),
                text: this.getValue("instaText"),
                likeCount: this.getValue("instaLikeCount"),
                commentCount: this.getValue("instaCommentCount"),
                rtCount: this.getValue("instaRtCount"),
                comments: this.getValue("instaComments"),
            };
        }

        if (type === "instagramDm") {
            return {
                partnerName: this.getValue("dmPartnerName"),
                partnerIcon: await this.readImageFile("dmPartnerIcon"),
                messageType: this.getValue("dmMessageType"),
                text: this.getValue("dmText"),
                callTime: this.getValue("dmCallTime"),
                quoteImage: await this.readImageFile("dmQuoteImage"),
            };
        }

        if (type === "twitter") {
            return {
                displayName: this.getValue("twitterDisplayName"),
                userName: this.getValue("twitterUserName"),
                icon: await this.readImageFile("twitterIcon"),
                text: this.getValue("twitterText"),
                image: await this.readImageFile("twitterImage"),
                likeCount: this.getValue("twitterLikeCount"),
                commentCount: this.getValue("twitterCommentCount"),
                rtCount: this.getValue("twitterRtCount"),
                saveCount: this.getValue("twitterSaveCount"),
                comments: this.getValue("twitterComments"),
            };
        }

        return {};
    },

    getValue(id) {
        return document.getElementById(id)?.value.trim() || "";
    },

    renderSnsForm() {
        const type = this.elements.snsBlockType.value;

        if (type === "line") {
            this.elements.snsDynamicForm.innerHTML = this.getLineForm();
        }

        if (type === "instagramPost") {
            this.elements.snsDynamicForm.innerHTML = this.getInstagramPostForm();
        }

        if (type === "instagramDm") {
            this.elements.snsDynamicForm.innerHTML = this.getInstagramDmForm();
        }

        if (type === "twitter") {
            this.elements.snsDynamicForm.innerHTML = this.getTwitterForm();
        }
    },

    getLineForm() {
        return `
            <label class="form-field">
                <span>相手の名前</span>
                <input type="text" id="linePartnerName" placeholder="例：柔太朗">
            </label>

            <label class="form-field">
                <span>相手アイコン画像</span>
                <input type="file" id="linePartnerIcon" accept="image/*">
            </label>

            <label class="form-field">
                <span>種類</span>
                <select id="lineMessageType">
                    <option value="partner">相手メッセージ</option>
                    <option value="me">自分メッセージ</option>
                    <option value="call">音声通話</option>
                    <option value="missed">不在着信</option>
                </select>
            </label>

            <label class="form-field">
                <span>本文</span>
                <textarea id="lineText" placeholder="LINEの内容"></textarea>
            </label>

            <label class="form-field">
                <span>通話時間</span>
                <input type="text" id="lineCallTime" placeholder="例：00:12">
            </label>
        `;
    },

    getInstagramPostForm() {
        return `
            <label class="form-field">
                <span>表示名</span>
                <input type="text" id="instaDisplayName" placeholder="例：まりあ">
            </label>

            <label class="form-field">
                <span>ユーザー名</span>
                <input type="text" id="instaUserName" placeholder="例：maria_official">
            </label>

            <label class="form-field">
                <span>アイコン画像</span>
                <input type="file" id="instaIcon" accept="image/*">
            </label>

            <label class="form-field">
                <span>投稿画像</span>
                <input type="file" id="instaImage" accept="image/*">
            </label>

            <label class="form-field">
                <span>投稿本文</span>
                <textarea id="instaText" placeholder="本文、タグなど"></textarea>
            </label>

            <label class="form-field">
                <span>いいね数</span>
                <input type="text" id="instaLikeCount" placeholder="例：12万">
            </label>

            <label class="form-field">
                <span>コメント数</span>
                <input type="text" id="instaCommentCount" placeholder="例：3,210">
            </label>

            <label class="form-field">
                <span>RT数</span>
                <input type="text" id="instaRtCount" placeholder="例：1,204">
            </label>

            <label class="form-field">
                <span>コメント欄</span>
                <textarea id="instaComments" placeholder="1行ごとに「ユーザー名: コメント」"></textarea>
            </label>
        `;
    },

    getInstagramDmForm() {
        return `
            <label class="form-field">
                <span>相手ユーザ名</span>
                <input type="text" id="dmPartnerName" placeholder="例：jyu__taro">
            </label>

            <label class="form-field">
                <span>相手アイコン画像</span>
                <input type="file" id="dmPartnerIcon" accept="image/*">
            </label>

            <label class="form-field">
                <span>種類</span>
                <select id="dmMessageType">
                    <option value="partner">相手メッセージ</option>
                    <option value="me">自分メッセージ</option>
                    <option value="call">音声通話</option>
                    <option value="missed">不在着信</option>
                    <option value="note">ノートに反応</option>
                    <option value="story">ストーリー引用</option>
                </select>
            </label>

            <label class="form-field">
                <span>本文</span>
                <textarea id="dmText" placeholder="DMの内容"></textarea>
            </label>

            <label class="form-field">
                <span>通話時間</span>
                <input type="text" id="dmCallTime" placeholder="例：00:12">
            </label>

            <label class="form-field">
                <span>ストーリー引用画像</span>
                <input type="file" id="dmQuoteImage" accept="image/*">
            </label>
        `;
    },

    getTwitterForm() {
        return `
            <label class="form-field">
                <span>アカウント名</span>
                <input type="text" id="twitterDisplayName" placeholder="例：まりあ">
            </label>

            <label class="form-field">
                <span>ユーザー名</span>
                <input type="text" id="twitterUserName" placeholder="例：@maria_official">
            </label>

            <label class="form-field">
                <span>アイコン画像</span>
                <input type="file" id="twitterIcon" accept="image/*">
            </label>

            <label class="form-field">
                <span>投稿本文</span>
                <textarea id="twitterText" placeholder="ツイート本文"></textarea>
            </label>

            <label class="form-field">
                <span>投稿画像</span>
                <input type="file" id="twitterImage" accept="image/*">
            </label>

            <label class="form-field">
                <span>コメント数</span>
                <input type="text" id="twitterCommentCount" placeholder="例：120">
            </label>

            <label class="form-field">
                <span>RT数</span>
                <input type="text" id="twitterRtCount" placeholder="例：3,200">
            </label>

            <label class="form-field">
                <span>いいね数</span>
                <input type="text" id="twitterLikeCount" placeholder="例：12万">
            </label>

            <label class="form-field">
                <span>保存数</span>
                <input type="text" id="twitterSaveCount" placeholder="例：940">
            </label>

            <label class="form-field">
                <span>コメント欄</span>
                <textarea id="twitterComments" placeholder="1行ごとに「ユーザー名: コメント」"></textarea>
            </label>
        `;
    },

    deleteBlock(id) {
        const project = ProjectController.getCurrentProject();

        if (!project) return;

        const isConfirmed = confirm("このブロックを削除する？");

        if (!isConfirmed) return;

        project.blocks = project.blocks.filter((block) => block.id !== id);
        project.updatedAt = new Date().toISOString();

        ProjectController.updateProject(project);
        this.render();
    },

    moveBlock(id, direction) {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            return;
        }

        const currentIndex = project.blocks.findIndex((block) => block.id === id);
        const nextIndex = currentIndex + direction;

        if (nextIndex < 0 || nextIndex >= project.blocks.length) {
            return;
        }

        const targetBlock = project.blocks[currentIndex];

        project.blocks.splice(currentIndex, 1);
        project.blocks.splice(nextIndex, 0, targetBlock);

        project.updatedAt = new Date().toISOString();

        ProjectController.updateProject(project);
        this.render();
    },

    getBlockById(project, id) {
        return project?.blocks.find((block) => block.id === id);
    },

    resetForm() {
        this.elements.form.reset();
        this.elements.blockId.value = "";
    },

    render() {
        this.renderEditor();
        this.renderPreview();
    },

    renderEditor() {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            this.elements.editorProjectLabel.textContent = "作品を選択してください";
            this.elements.blockList.innerHTML = `
                <div class="empty-message">作品を選択すると本文を書けます。</div>
            `;
            return;
        }

        this.elements.editorProjectLabel.textContent = `編集中：${project.title}`;

        if (project.blocks.length === 0) {
            this.elements.blockList.innerHTML = `
                <div class="empty-message">まだブロックがありません。</div>
            `;
            return;
        }

        this.elements.blockList.innerHTML = project.blocks.map((block, index) => {
            return `
                <article class="block-card">
                    <div class="block-card__top">
                        <div>
                            <span class="block-badge">${AppData.blockTypes[block.type]}</span>
                            <h4>ブロック ${index + 1}</h4>
                        </div>
                    </div>

                    <p>${this.getBlockSummary(block)}</p>
                    ${block.type === "line" ? this.renderLineMessageForm(block) : ""}
                    ${block.type === "instagramDm" ? this.renderDmMessageForm(block) : ""}

                    <div class="card-actions">
                        <button class="ghost-button" onclick="EditorController.moveBlock('${block.id}', -1)">
                            <i class="fa-solid fa-arrow-up"></i>
                        </button>
                        <button class="ghost-button" onclick="EditorController.moveBlock('${block.id}', 1)">
                            <i class="fa-solid fa-arrow-down"></i>
                        </button>
                        <button class="danger-button" onclick="EditorController.deleteBlock('${block.id}')">
                            削除
                        </button>
                    </div>
                </article>
            `;
        }).join("");
    },

    renderLineMessageForm(block) {
        return `
            <div class="chat-add-form">
                <input type="hidden" id="lineEditMessageId-${block.id}">

                <select id="lineSender-${block.id}">
                    <option value="partner">相手</option>
                    <option value="me">自分</option>
                </select>

                <select id="lineKind-${block.id}">
                    <option value="text">メッセージ</option>
                    <option value="call">音声通話</option>
                    <option value="missed">不在着信</option>
                </select>

                <textarea id="lineText-${block.id}" placeholder="メッセージ内容"></textarea>

                <input type="text" id="lineCallTime-${block.id}" placeholder="通話時間 例：00:12">

                <div class="chat-form-actions">
                <button class="primary-button" type="button" onclick="EditorController.addLineMessage('${block.id}')">
                    <i class="fa-solid fa-floppy-disk"></i>
                    追加 / 保存
                </button>

                <button class="ghost-button" type="button" onclick="EditorController.cancelEditChatMessage('${block.id}', 'line')">
                    キャンセル
                </button>
                </div>

                ${this.renderChatMessageEditorList(block)}
            </div>
        `;
    },

    renderDmMessageForm(block) {
        return `
            <div class="chat-add-form">
            <input type="hidden" id="dmEditMessageId-${block.id}">

                <select id="dmSender-${block.id}">
                    <option value="partner">相手</option>
                    <option value="me">自分</option>
                </select>

                <select id="dmKind-${block.id}">
                    <option value="text">メッセージ</option>
                    <option value="call">音声通話</option>
                    <option value="missed">不在着信</option>
                    <option value="note">ノートに反応</option>
                    <option value="story">ストーリー引用</option>
                </select>

                <textarea id="dmText-${block.id}" placeholder="DM内容"></textarea>

                <input type="text" id="dmCallTime-${block.id}" placeholder="通話時間 例：00:12">
                <input type="file" id="dmQuoteImage-${block.id}" accept="image/*">

                <div class="chat-form-actions">
                <button class="primary-button" type="button" onclick="EditorController.addDmMessage('${block.id}')">
                    <i class="fa-solid fa-floppy-disk"></i>
                    追加 / 保存
                </button>
                <button class="ghost-button" type="button" onclick="EditorController.cancelEditChatMessage('${block.id}', 'line')">
                    キャンセル
                </button>
                </div>

                ${this.renderChatMessageEditorList(block)}
            </div>
        `;
    },

    renderChatMessageEditorList(block) {
        if (!block.content.messages || block.content.messages.length === 0) {
            return `<p class="chat-empty-text">まだメッセージがありません。</p>`;
        }

        return `
            <div class="chat-editor-list">
                ${block.content.messages.map((message, index) => {
                    return `
                        <div class="chat-editor-item">
                            <div>
                                <span class="chat-editor-badge">
                                    ${message.sender === "me" ? "自分" : "相手"} / ${this.getChatKindLabel(message.kind)}
                                </span>
                                <p>${UI.escapeHtml(this.getChatMessageSummary(message))}</p>
                            </div>

                            <div class="chat-editor-actions">
                                <button type="button" class="ghost-button" onclick="EditorController.moveChatMessage('${block.id}', '${message.id}', -1)">
                                    <i class="fa-solid fa-arrow-up"></i>
                                </button>
                                <button type="button" class="ghost-button" onclick="EditorController.moveChatMessage('${block.id}', '${message.id}', 1)">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </button>
                                <button type="button" class="ghost-button" onclick="EditorController.editChatMessage('${block.id}', '${message.id}')">
                                    編集
                                </button>
                                <button type="button" class="danger-button" onclick="EditorController.deleteChatMessage('${block.id}', '${message.id}')">
                                    削除
                                </button>
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
    },

    getChatKindLabel(kind) {
        const labels = {
            text: "メッセージ",
            call: "音声通話",
            missed: "不在着信",
            note: "ノート反応",
            story: "ストーリー返信",
        };

        return labels[kind] || "メッセージ";
    },
    getChatMessageSummary(message) {
        if (message.kind === "call") {
            return `音声通話 ${message.callTime || "00:00"}`;
        }

        if (message.kind === "missed") {
            return `不在着信`;
        }

        if (message.kind === "story") {
            return `ストーリー返信 ${message.text || "本文なし"}`;
        }

        if (message.kind === "note") {
            return `ノート反応 ${message.text || "本文なし"}`;
        }

        return message.text || "本文なし";
    },
    
    getBlockSummary(block) {
        if (block.type === "text") {
            return UI.escapeHtml(block.content.text).replaceAll("\n", "<br>");
        }

        if (block.type === "line") {
            return `LINE：${UI.escapeHtml(block.content.text || block.content.messageType)}`;
        }

        if (block.type === "instagramPost") {
            return `Instagram投稿：${UI.escapeHtml(block.content.userName || block.content.displayName)}`;
        }

        if (block.type === "instagramDm") {
            return `InstagramDM：${UI.escapeHtml(block.content.text || block.content.messageType)}`;
        }

        if (block.type === "twitter") {
            return `Twitter：${UI.escapeHtml(block.content.text)}`;
        }

        return "SNSブロック";
    },
    
    // LINE会話ブロックを新規作成
    async createLineBlock() {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            alert("先に作品を選択してね");
            return;
        }

        const now = new Date().toISOString();

        project.blocks.push({
            id: crypto.randomUUID(),
            type: "line",
            content: {
                partnerName: this.getValue("linePartnerName"),
                partnerIcon: await this.readImageFile("linePartnerIcon"),
                messages: [],
            },
            createdAt: now,
            updatedAt: now,
        });

        project.updatedAt = now;

        ProjectController.updateProject(project);
        this.render();
    },

    addLineMessage(blockId) {
        const project = ProjectController.getCurrentProject();
        const block = this.getBlockById(project, blockId);

        if (!block) return;

        const editMessageId = this.getValue(`lineEditMessageId-${blockId}`);

        const messageData ={
            id: editMessageId || crypto.randomUUID(),
            sender: this.getValue(`lineSender-${blockId}`),
            kind: this.getValue(`lineKind-${blockId}`),
            text: this.getValue(`lineText-${blockId}`),
            callTime: this.getValue(`lineCallTime-${blockId}`),
            isRead: true,
        };

        if (editMessageId) {
            block.content.messages = block.content.messages.map((message) => {
                return message.id === editMessageId ? messageData : message;
            });
        } else {
            block.content.messages.push(messageData);
        }

        project.updatedAt = new Date().toISOString();

        ProjectController.updateProject(project);
        this.render();
    },

    async createDmBlock() {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            alert("先に作品を選択してね");
            return;
        }

        const now = new Date().toISOString();

        project.blocks.push({
            id: crypto.randomUUID(),
            type: "instagramDm",
            content: {
                partnerName: this.getValue("dmPartnerName"),
                partnerIcon: await this.readImageFile("dmPartnerIcon"),
                messages: [],
            },
            createdAt: now,
            updatedAt: now,
        });

        project.updatedAt = now;

        ProjectController.updateProject(project);
        this.render();
    },

    async addDmMessage(blockId) {
        const project = ProjectController.getCurrentProject();
        const block = this.getBlockById(project, blockId);

        if (!block) return;

        const editMessageId = this.getValue(`dmEditMessageId-${blockId}`);

        const messageData = {
            id: editMessageId || crypto.randomUUID(),
            sender: this.getValue(`dmSender-${blockId}`),
            kind: this.getValue(`dmKind-${blockId}`),
            text: this.getValue(`dmText-${blockId}`),
            callTime: this.getValue(`dmCallTime-${blockId}`),
            quoteImage: await this.readImageFile(`dmQuoteImage-${blockId}`),
            isRead: true,
        };

        if (editMessageId) {
            block.content.messages = block.content.messages.map((message) => {
                return message.id === editMessageId ? messageData : message;
            });
        } else {
            block.content.messages.push(messageData);
        }

        project.updatedAt = new Date().toISOString();

        ProjectController.updateProject(project);
        this.render();
    },

    deleteChatMessage(blockId, messageId) {
        const project = ProjectController.getCurrentProject();
        const block = this.getBlockById(project, blockId);

        if (!block) return;

        block.content.messages = block.content.messages.filter((message) => {
            return message.id !== messageId;
        });

        project.updatedAt = new Date().toISOString();

        ProjectController.updateProject(project);
        this.render();
    },

    moveChatMessage(blockId, messageId, direction) {
        const project = ProjectController.getCurrentProject();
        const block = this.getBlockById(project, blockId);

        if (!block || !block.content.messages) return;

        const currentIndex = block.content.messages.findIndex((message) => {
            return message.id === messageId;
        });

        const nextIndex = currentIndex + direction;

        if (nextIndex < 0 || nextIndex >= block.content.messages.length) return;

        const targetMessage = block.content.messages[currentIndex];

        block.content.messages.splice(currentIndex, 1);
        block.content.messages.splice(nextIndex, 0, targetMessage);

        block.updatedAt = new Date().toISOString();
        project.updatedAt = new Date().toISOString();

        ProjectController.updateProject(project);
        this.render();
    },

    editChatMessage(blockId, messageId) {
        const project = ProjectController.getCurrentProject();
        const block = this.getBlockById(project, blockId);

        if (!block || !block.content.messages) return;

        const message = block.content.messages.find((item) => {
            return item.id === messageId;
        });

        if (!message) return;

        if (block.type === "line") {
            document.getElementById(`lineEditMessageId-${blockId}`).value = message.id;
            document.getElementById(`lineSender-${blockId}`).value = message.sender || "partner";
            document.getElementById(`lineKind-${blockId}`).value = message.kind || "text";
            document.getElementById(`lineText-${blockId}`).value = message.text || "";
            document.getElementById(`lineCallTime-${blockId}`).value = message.callTime || "";
        }

        if (block.type === "instagramDm") {
            document.getElementById(`dmEditMessageId-${blockId}`).value = message.id;
            document.getElementById(`dmSender-${blockId}`).value = message.sender || "partner";
            document.getElementById(`dmKind-${blockId}`).value = message.kind || "text";
            document.getElementById(`dmText-${blockId}`).value = message.text || "";
            document.getElementById(`dmCallTime-${blockId}`).value = message.callTime || "";
            document.getElementById(`dmQuoteImage-${blockId}`).value = message.quoteImage || "";
        }
    },

    cancelEditChatMessage(blockId, type) {
        if (type === "line") {
            document.getElementById(`lineEditMessageId-${blockId}`).value = "";
            document.getElementById(`lineSender-${blockId}`).value = "partner";
            document.getElementById(`lineKind-${blockId}`).value = "text";
            document.getElementById(`lineText-${blockId}`).value = "";
            document.getElementById(`lineCallTime-${blockId}`).value = "";
        }

        if (type === "instagramDm") {
            document.getElementById(`dmEditMessageId-${blockId}`).value = "";
            document.getElementById(`dmSender-${blockId}`).value = "partner";
            document.getElementById(`dmKind-${blockId}`).value = "text";
            document.getElementById(`dmText-${blockId}`).value = "";
            document.getElementById(`dmCallTime-${blockId}`).value =  "";
            document.getElementById(`dmQuoteImage-${blockId}`).value =  "";
        }
    },

    renderPreview() {
        const project = ProjectController.getCurrentProject();

        if (!project) {
            this.elements.previewTitle.textContent = "作品を選択してください";
            this.elements.previewGenre.textContent = "Genre";
            this.elements.previewBody.innerHTML = `
                <div class="empty-message">プレビューする作品がありません。</div>
            `;
            return;
        }

        this.elements.previewTitle.textContent = project.title;
        this.elements.previewGenre.textContent = project.genre;

        if (project.blocks.length === 0) {
            this.elements.previewBody.innerHTML = `
                <div class="empty-message">本文ブロックがまだありません。</div>
            `;
            return;
        }

        this.elements.previewBody.innerHTML = project.blocks.map((block) => {
            if (block.type === "text") return this.renderTextPreview(block);
            if (block.type === "line") return this.renderLinePreview(block);
            if (block.type === "instagramPost") return this.renderInstagramPostPreview(block);
            if (block.type === "instagramDm") return this.renderInstagramDmPreview(block);     
            if (block.type === "twitter") return this.renderTwitterPreview(block);       
            return "";
        }).join("");
    },

    renderTextPreview(block) {
        return `
            <div class="preview-text">${UI.escapeHtml(block.content.text)}
            </div>
        `;
    },

    renderLinePreview(block) {
        const content = block.content;

        const messages = content.messages || [];

        return `
            <div class="sns-preview line-preview">
                ${messages.map((message) => {
                    if (message.kind === "call" || message.kind === "missed") {
                        const isMe = message.sender === "me";
                        const callText = message.kind === "call"
                            ? `音声通話 ${UI.escapeHtml(message.callTime || "00:00")}`
                            : "不在着信";

                        const iconClass = message.kind === "call"
                            ? "fa-solid fa-phone"
                            : "fa-solid fa-phone-slash";

                        return `
                            <div class="line-message ${isMe ? "is-me" : ""}">
                                ${!isMe ? `<img class="line-icon" src="${UI.escapeHtml(content.partnerIcon)}" alt="">` : ""}
                                <div>
                                    <div class="line-call-bubble">
                                        <i class="${iconClass}"></i>
                                        ${callText}
                                    </div>
                                    ${isMe ? `<span class="read-label">既読</span>` : ""}
                                </div>
                            </div>
                        `;
                    }

                    const isMe = message.sender === "me";

                    return `
                        <div class="line-message ${isMe ? "is-me" : ""}">
                            ${!isMe ? `<img class="line-icon" src="${UI.escapeHtml(content.partnerIcon)}" alt="">` : ""}
                            <div>
                                <div class="line-bubble">${UI.escapeHtml(message.text)}</div>
                                ${isMe ? `<span class="read-label">既読</span>` : ""}
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
    },

    renderInstagramPostPreview(block) {
        const content = block.content;

        return `
            <article class="sns-preview">
                <div class="insta-header">
                    <img class="sns-icon" src="${UI.escapeHtml(content.icon)}" alt="">
                    <div>
                        <p class="insta-user-name">${UI.escapeHtml(content.displayName)}</p>
                        <p class="twitter-user-name">@${UI.escapeHtml(content.userName)}</p>
                    </div>
                </div>

                ${content.image ? `<img class="insta-image" src="${UI.escapeHtml(content.image)}" alt="">` : ""}

                <div class="insta-body">
                    <div class="sns-counts">
                        <span>♡ ${UI.escapeHtml(content.likeCount || "0")}</span>
                        <span>💬 ${UI.escapeHtml(content.commentCount || "0")}</span>
                        <span>↻ ${UI.escapeHtml(content.rtCount || "0")}</span>
                    </div>

                    <p class="sns-text">${UI.escapeHtml(content.text)}</p>

                    ${this.renderComments(content.comments)}
                </div>
            </article>
        `;
    },

    renderInstagramDmPreview(block) {
        const content = block.content;

        const messages = content.messages || [];

        return `
            <article class="sns-preview dm-preview">
                <div class="dm-header">
                    <img class="sns-icon" src="${UI.escapeHtml(content.partnerIcon)}" alt="">
                    <p class="dm-user-name">${UI.escapeHtml(content.partnerName)}</p>
                </div>

                <div class="dm-talk">
                ${messages.map((message) => {
                    if (message.kind === "call" || message.kind === "missed") {
                        const isMe = message.sender === "me";
                        const callText = message.kind === "call"
                            ? `音声通話 ${UI.escapeHtml(message.callTime || "00:00")}`
                            : "不在着信";

                        const iconClass = message.kind === "call"
                            ? "fa-solid fa-phone"
                            : "fa-solid fa-phone-slash";

                        return `
                            <div class="dm-message ${isMe ? "is-me" : ""}">
                                ${!isMe ? `<img class="line-icon" src="${UI.escapeHtml(content.partnerIcon)}" alt="">` : ""}
                                <div>
                                    <div class="dm-call-bubble">
                                        <i class="${iconClass}"></i>
                                        ${callText}
                                    </div>
                                    ${isMe ? `<span class="read-label">既読</span>` : ""}
                                </div>
                            </div>
                        `;
                    }

                    if (message.kind === "note") {
                        const isMe = message.sender === "me";

                        return `
                            <div class="dm-message ${isMe ? "is-me" : ""}">
                                ${!isMe ? `<img class="line-icon" src="${UI.escapeHtml(content.partnerIcon)}" alt="">` : ""}
                                <div>
                                    <div class="dm-note-bubble">
                                        <i class="fa-solid fa-music"></i>
                                        ノートに反応：${UI.escapeHtml(message.text)}
                                    </div>
                                    ${isMe ? `<span class="read-label">既読</span>` : ""}
                                </div>
                            </div>
                        `;
                    }

                    if (message.kind === "story") {

                        const isMe = message.sender === "me";

                        return `
                            <div class="dm-message ${isMe ? "is-me" : ""}">
                                ${!isMe ? `<img class="line-icon" src="${UI.escapeHtml(content.partnerIcon)}" alt="">` : ""}
                                <div class="dm-story-wrap">
                                    <div class="dm-story-label">
                                        <i class="fa-regular fa-images"></i>
                                        ストーリーに返信
                                    </div>

                                    ${message.quoteImage ? `
                                            <img class="dm-story-image" src="${UI.escapeHtml(message.quoteImage)}" alt="">
                                        ` : ""}

                                    <div class="dm-bubble">${UI.escapeHtml(message.text)}</div>

                                    ${isMe ? `<span class="read-label">既読</span>` : ""}
                                </div>
                            </div>
                        `;
                    }

                    const isMe = message.sender === "me";

                    return `
                        <div class="dm-message ${isMe ? "is-me" : ""}">
                            ${!isMe ? `<img class="line-icon" src="${UI.escapeHtml(content.partnerIcon)}" alt="">` : ""}
                            <div>
                                <div class="dm-bubble">${UI.escapeHtml(message.text)}</div>
                                ${isMe ? `<span class="read-label">既読</span>` : ""}
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
            </article>
        `;
    },

    renderTwitterPreview(block) {
        const content = block.content;

        return `
            <article class="sns-preview">
                <div class="twitter-header">
                    <img class="sns-icon" src="${UI.escapeHtml(content.icon)}" alt="">
                    <div>
                        <p class="twitter-name">${UI.escapeHtml(content.displayName)}</p>
                        <p class="twitter-user-name">@${UI.escapeHtml(content.userName)}</p>
                    </div>
                </div>

                <div class="insta-body">
                    <p class="sns-text">${UI.escapeHtml(content.text)}</p>

                    ${content.image ? `<img class="twitter-image" src="${UI.escapeHtml(content.image)}" alt="">` : ""}
                    <div class="sns-counts">
                        <span>💬 ${UI.escapeHtml(content.commentCount || "0")}</span>
                        <span>↻ ${UI.escapeHtml(content.rtCount || "0")}</span>
                        <span>♡ ${UI.escapeHtml(content.likeCount || "0")}</span>
                        <span>🔖 ${UI.escapeHtml(content.saveCount || "0")}</span>
                    </div>

                    ${this.renderComments(content.comments)}
                </div>
            </article>
        `;
    },

    readImageFile(inputId) {
        const fileInput = document.getElementById(inputId);
        const file = fileInput?.files[0];

        if (!file) {
            return Promise.resolve("");
        }

        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.readAsDataURL(file);
        });
    },

    renderComments(commentsText) {
        if (!commentsText) return "";

        const comments = commentsText
            .split("\n")
            .map((comment) => comment.trim())
            .filter(Boolean);

        if (comments.length === 0) return "";

        return `
            <div class="comment-list">
                ${comments.map((comment) => {
                    const [name, ...body] = comment.split(":");

                    return `
                        <p class="comment-item">
                            <strong>${UI.escapeHtml(name)}</strong>
                            ${UI.escapeHtml(body.join(":").trim())}
                        </p>
                    `;
                }).join("")}
            </div>
        `;
    },
};