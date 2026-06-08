// プレビュー全体の描画
Object.assign(EditorController, {
    renderPreview(episode) {
        const previewList = document.getElementById("previewList");

        if (!previewList) return;

        if (!episode || !episode.blocks || episode.blocks.length === 0) {
            previewList.innerHTML = `
                <div class="empty">
                    まだプレビューできるブロックがありません。
                </div>
            `;
            return;
        }

        previewList.innerHTML = episode.blocks
            .map((block) => {
                if (block.type === "text") return this.createTextPreviewHtml(block);

                if (block.type === "line") return this.createLinePreviewHtml(block);

                if (block.type === "instagram") return this.createInstagramPreviewHtml(block);

                if (block.type === "instagramDm") return this.createInstagramDmPreviewHtml(block);

                if (block.type === "instagramStory") return this.createInstagramStoryPreviewHtml(block);

                if (block.type === "twitter") return this.createTwitterPreviewHtml(block);

                if (block.type === "news") return this.createNewsPreviewHtml(block);

                if (block.type === "wiki") return this.createWikiPreviewHtml(block);

                return "";
            })
            .join("");
    },
});