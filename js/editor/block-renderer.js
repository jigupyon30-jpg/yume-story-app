// エディタ側のブロック一覧描画
Object.assign(EditorController, {
    renderBlocks(episode) {
        const blockList = document.getElementById("blockList");

        if (!blockList) return;

        if (!episode || !episode.blocks || episode.blocks.length === 0) {
            blockList.innerHTML = `
                <div class="empty">
                    まだ本文がありません。<br>
                    「本文ブロック」を追加して書き始めよう。
                </div>
            `;
            return;
        }

        blockList.innerHTML = episode.blocks
            .map((block) => {
                if (block.type === "text") return this.createTextBlockHtml(block);

                if (block.type === "line") return this.createLineBlockHtml(block);

                if (block.type === "instagram") return this.createInstagramBlockHtml(block);

                if (block.type === "instagramDm") return this.createInstagramDmBlockHtml(block);

                if (block.type === "instagramStory") return this.createInstagramStoryBlockHtml(block);

                if (block.type === "twitter") return this.createTwitterBlockHtml(block);

                if (block.type === "news") return this.createNewsBlockHtml(block);

                if (block.type === "wiki") return this.createWikiBlockHtml(block);

                return "";
            })
            .join("");
    },
});