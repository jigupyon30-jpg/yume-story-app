// ブロック追加・削除・保存・画像保存
Object.assign(EditorController, {
    addBlock(type) {
        const newBlock = DataFactory.createBlockByType(type);

        if (!newBlock) return;

        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: [
                    ...(episode.blocks || []),
                    newBlock
                ]
            };
        });

        EpisodeUpdateService.rerender();
    },

    // 本文ブロックの内容を保存する
    updateBlockField(blockId, fieldName, value) {
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).map((block) => {
                    if (
                        block.id !== blockId
                    ) {
                        return block;
                    }
                    return {
                        ...block,
                        [fieldName]: value
                    };
                })
            };
        });

        const episode = ProjectController.getCurrentEpisode();
        this.renderPreview(episode);
    },

    deleteBlock(blockId) {

        const isOk = confirm("このブロックを削除しますか？");
        if (!isOk) return;
        
        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: (episode.blocks || []).filter((block) =>{
                    return block.id !== blockId;
                })
            };
        });

        EpisodeUpdateService.rerender();
    },

    saveBlockImage(blockId, file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            this.updateBlockField(blockId, "imageData", reader.result);

            const episode = EpisodeUpdateService.getCurrentEpisode();

                this.renderBlocks(episode);
                this.renderPreview(episode);
        };

        reader.readAsDataURL(file);
    },

    // 設定別テンプレートを本文にまとめて追加する
    addTemplateBlocks(templateId) {
        const templateBlocks = TemplateService.createBlocksByTemplate(templateId);

        if (templateBlocks.length === 0) return;

        const templateName = TemplateService.getTemplateName(templateId);
        const isOk = confirm(`${templateName}を追加しますか？`);

        if (!isOk) return;

        EpisodeUpdateService.update((episode) => {
            return {
                ...episode,
                blocks: [
                    ...(episode.blocks || []),
                    ...(templateBlocks)
                ]
            };
        });

        EpisodeUpdateService.rerender();
    },

    // ブロック順を上へ
    moveBlockUp(blockId) {
        EpisodeUpdateService.update((episode) => {
            const blocks = [...(episode.blocks || [])];

            const index = blocks.findIndex(
                block =>
                block.id === blockId
            );

            if (index <= 0) {
                return episode;
            }
            [
                blocks[index - 1],
                blocks[index]
            ] = [
                blocks[index],
                blocks[index - 1]
            ];

            return {
                ...episode,
                blocks
            };
        });

        EpisodeUpdateService.rerender();
    },

    // ブロック順を下へ
    moveBlockDown(blockId) {
        EpisodeUpdateService.update((episode) => {
            const blocks = [...(episode.blocks || [])];

            const index = blocks.findIndex(
                block =>
                block.id === blockId
            );

            if (index === -1 || index >= blocks.length -1
            ) {
                return episode;
            }
            [
                blocks[index],
                blocks[index + 1]
            ] = [
                blocks[index + 1],
                blocks[index]
            ];

            return {
                ...episode,
                blocks
            };
        });

        EpisodeUpdateService.rerender();
    },

    // ブロックを複製
    duplicateBlock(blockId) {
        EpisodeUpdateService.update((episode) => {
            const blocks = [...(episode.blocks || [])];

            const index = blocks.findIndex((block) => {
                return block.id === blockId;
            });

            if (index === -1) {
                return episode;
            }

            const duplicateBlock = {
                ...structuredClone(blocks[index]),
                id: DataFactory.createId("block"),
                createdAt: new Date().toISOString()
            };

            blocks.splice(index + 1, 0, duplicateBlock);

            return {
                ...episode,
                blocks
            };
        });

        EpisodeUpdateService.rerender();
    },
});