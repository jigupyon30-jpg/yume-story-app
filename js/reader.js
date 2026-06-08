// 存済みエピソードを読むページとして表示する
const ReaderController = {
    // 指定したエピソードを読むページに描画する
    render(episode) {
        const project = ProjectController.getCurrentProject();
        const title = document.getElementById("readerEpisodeTitle");
        const projectTitle = document.getElementById("readerProjectTitle");
        const content = document.getElementById("readerContent");

        if (!episode || !content) {
            return;
        }

        projectTitle.textContent = project?.title || "作品";
        title.textContent = episode.title || "お話";

        const blocks = episode.blocks || [];

        if (blocks.length === 0) {
            content.innerHTML = `
                <p class="reader-empty">まだ本文がありません</p>
            `;
            return;
        }

        content.innerHTML = blocks.map((block) => {
            return this.createReaderBlockHtml(block);
        })
        .join("");
    },

    // ブロックの種類ごとに読み物用HTMLを作る
    createReaderBlockHtml(block) {
        if (block.type === "text") {
            return `
                <section class="reader-block">
                    <p class="reader-text">${UI.escapeHtml(block.content || "")}</p>
                </section>
            `;
        }

        if (block.type === "line") {
            return `
                <section class="reader-block reader-sns">
                    ${EditorController.createLinePreviewHtml(block)}
                </section>
            `;
        }

        if (block.type === "instagram") {
            return `
                <section class="reader-block reader-sns">
                    ${EditorController.createInstagramPreviewHtml(block)}
                </section>
            `;
        }

        if (block.type === "instagramDm") {
            return `
                <section class="reader-block reader-sns">
                    ${EditorController.createInstagramDmPreviewHtml(block)}
                </section>
            `;
        }

        if (block.type === "instagramStory") {
            return `
                <section class="reader-block reader-sns">
                    ${EditorController.createInstagramStoryPreviewHtml(block)}
                </section>
            `;
        }

        if (block.type === "instagramLive") {
            return `
                <section class="reader-block reader-sns">
                    ${EditorController.createInstagramLivePreviewHtml(block)}
                </section>
            `;
        }

        if (block.type === "twitter") {
            return `
                <section class="reader-block reader-sns reader-sns--wide">
                    ${EditorController.createTwitterPreviewHtml(block)}
                </section>
            `;
        }

        if (block.type === "news") {
            return `
                <section class="reader-block reader-sns reader-sns--wide">
                    ${EditorController.createNewsPreviewHtml(block)}
                </section>
            `;
        }

        if (block.type === "wiki") {
            return `
                <section class="reader-block reader-sns reader-sns--wide">
                    ${EditorController.createWikiPreviewHtml(block)}
                </section>
            `;
        }

        return "";
    }
};