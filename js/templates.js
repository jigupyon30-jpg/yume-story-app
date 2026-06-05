// 設定別に使うブロックテンプレートをまとめる
const TemplateService = {
    // テンプレート一覧
    templates: {
        onlyGirl: {
            name: "紅一点セット",
            blocks: [
                {
                    type: "wiki",
                    values: {
                        name: "草川まりあ",
                        subtitle: "日本のアイドル、女優"
                    }
                },
                {
                    type: "instagram",
                    values: {
                        username: "kusakawa_milk",
                        caption: "今日もありがとうございました🤍\nまたすぐ会おうね",
                        likes: "128,932",
                        comments: "@aaa まりあちゃん可愛すぎる\n@bbb メンバーとの写真待ってる\n@ccc 今日の衣装天才だった"
                    }
                },

                {
                    type: "instagramStory",
                    values: {}
                },

                {
                    type: "line",
                    values: {
                        partnerName: "柔太朗",
                        startTime: "22:00",
                        minuteStep: 1,
                        messages: "まりあ:今日もおつかれさま\n柔太朗:まりあもおつかれ\nまりあ:明日早い？\n柔太朗:まりあ次第"
                    }
                },
                {
                    type: "instagramDm",
                    values: {
                        partnerName: "柔太朗",
                        partnerUsername: "jyutaro_milk",
                        messages: [
                            {
                                id: DataFactory.createId("dm"),
                                type: "note",
                                sender: "partner",
                                text: "♪ 君の恋人になったら / back number\n\nこれ俺に向けて？",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            },

                            {
                                id: DataFactory.createId("dm"),
                                type: "text",
                                sender: "me",
                                text: "自意識過剰じゃない？",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            },
                        ]
                    }
                },

                {
                    type: "news",
                    values: {
                        mediaName: "週刊ドリームニュース",
                        headline: "人気アイドル同士に熱愛報道　SNSでは“匂わせ”指摘も",
                        body: "人気グループのメンバーとして活躍する草川まりあに、同じ事務所の人気アイドルとの熱愛疑惑が浮上した。\n\n双方のファンの間では、以前からSNS投稿の一致や発言の共通点が話題になっていた。",
                        reaction: "@aaa お似合いすぎる\n@bbb 匂わせだったの？\n@ccc 顔面強すぎカップル"
                    }
                },

                {
                    type: "twitter",
                    values: {
                        posts: [
                            {
                                id: DataFactory.createId("tweet"),
                                accountType: "official",
                                displayName: "M!LK",
                                username: "milk_official",
                                text: "本日もご来場ありがとうございました！\n次の公演もよろしくお願いします🤍",
                                likes: "2.3万",
                                reposts: "5,432",
                                replies: "812",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            },
                            {
                                id: DataFactory.createId("tweet"),
                                accountType: "fan",
                                displayName: "a",
                                username: "aaa",
                                text: "今日のまりあちゃんビジュ強すぎて記憶ない",
                                likes: "12",
                                reposts: "3",
                                replies: "1",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            }
                        ]
                    }
                },
            ]
        },

        school: {
            name: "学パロセット",
            blocks: [
                {
                    type: "text",
                    values: {
                        content: "放課後の教室には、まだ少しだけ夕日の色が残っていた。\n\n誰もいないはずの教室で、彼の声だけがやけに近く聞こえる。"
                    }
                },
                {
                    type: "instagram",
                    values: {
                        username: "maria_0326",
                        caption: "放課後、寄り道した",
                        likes: "328",
                        comments: "@aaa 誰と？\n@bbb この写真の雰囲気好き"
                    }
                },

                {
                    type: "instagramStory",
                    values: {}
                },

                {
                    type: "instagramDm",
                    values: {
                        partnerName: "柔太朗",
                        partnerUsername: "jyutaro_yama",
                        messages: [
                            {
                                id: DataFactory.createId("dm"),
                                type: "text",
                                sender: "partner",
                                text: "今日一緒に帰ったの、誰にも言わないで",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            },

                            {
                                id: DataFactory.createId("dm"),
                                type: "text",
                                sender: "me",
                                text: "なんで？",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            },
                        ]
                    }
                },

                {
                    type: "line",
                    values: {
                        partnerName: "柔太朗",
                        startTime: "22:00",
                        minuteStep: 1,
                        messages: "まりあ:今日ありがと\n柔太朗:なにが？\nまりあ:荷物持ってくれたやつ\n柔太朗:別に。まりあだから持っただけ"
                    }
                },
            ]
        },

        office: {
            name: "社会人セット",
            blocks: [
                {
                    type: "text",
                    values: {
                        content: "残業終わりのオフィスは、昼間とは違う静けさに包まれていた。\n\n隣の席から聞こえるキーボードの音が止まって、彼がこちらを見た。"
                    }
                },
                {
                    type: "line",
                    values: {
                        partnerName: "山中",
                        startTime: "22:00",
                        minuteStep: 1,
                        messages: "まりあ:もう帰れそう？\n後輩:先輩待ってます\nまりあ:先帰っていいのに\n後輩:一緒に帰りたいんで"
                    }
                },

                {
                    type: "instagramDm",
                    values: {
                        partnerName: "山中",
                        partnerUsername: "jyutaro_yama",
                        messages: [
                            {
                                id: DataFactory.createId("dm"),
                                type: "text",
                                sender: "partner",
                                text: "飲み会抜けだそ",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            },

                            {
                                id: DataFactory.createId("dm"),
                                type: "text",
                                sender: "me",
                                text: "いいよ",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            },
                        ]
                    }
                },

                {
                    type: "instagramStory",
                    values: {}
                },
            ]
        },

        entertainment: {
            name: "芸能界セット",
            blocks: [
                {
                    type: "wiki",
                    values: {
                        name: "柚姫まりあ",
                        subtitle: "日本のアイドル、女優"
                    }
                },
                {
                    type: "instagram",
                    values: {
                        username: "yuzuki_official",
                        caption: "情報解禁されました。\n素敵な作品に参加させていただきます。\nよろしくお願いします！",
                        likes: "98,421",
                        comments: "@aaa おめでとう\n@bbb 楽しみすぎる\n@ccc 絶対リアタイする"
                    }
                },

                {
                    type: "instagramStory",
                    values: {}
                },
                {
                    type: "instagramDm",
                    values: {
                        partnerName: "じゅう",
                        partnerUsername: "jyu__1223",
                        messages: [
                            {
                                id: DataFactory.createId("dm"),
                                type: "text",
                                sender: "partner",
                                text: "今日家来てよ",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            },

                            {
                                id: DataFactory.createId("dm"),
                                type: "text",
                                sender: "me",
                                text: "バレるよ？",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            },
                        ]
                    }
                },

                {
                    type: "news",
                    values: {
                        mediaName: "ORICON風ニュース",
                        headline: "草川まりあ、話題作への出演決定　共演者との掛け合いにも注目",
                        body: "アイドルとしても活躍する草川まりあが、新ドラマに出演することが発表された。\n\n今回の作品では、これまでとは違う大人びた役柄に挑戦する",
                        reaction: "@aaa 絶対見る\n@bbb キャスト強すぎ\n@ccc 共演者との絡み楽しみ"
                    }
                },

                {
                    type: "twitter",
                    values: {
                        posts: [
                            {
                                id: DataFactory.createId("tweet"),
                                accountType: "official",
                                displayName: "ドラマ公式",
                                username: "drama_official",
                                text: "新キャスト解禁📢\n柚姫まりあさんの出演が決定しました！\nコメントも到着しています。",
                                likes: "4.8万",
                                reposts: "1.2万",
                                replies: "932",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            },
                            {
                                id: DataFactory.createId("tweet"),
                                accountType: "fan",
                                displayName: "b",
                                username: "bbb",
                                text: "まりあちゃんドラマ出演おめでとう😭 絶対見る",
                                likes: "54",
                                reposts: "8",
                                replies: "2",
                                ImageData: null,
                                createdAt: new Date().toISOString()
                            }
                        ]
                    }
                },
            ]
        }
    },

    // テンプレートからブロックを作る
    createBlocksByTemplate(templateId) {
        const template = this.templates[templateId];

        if (!template) {
            return [];
        }

        return template.blocks
            .map((templateBlock) => {
                const block = DataFactory.createBlockByType(templateBlock.type);

                if (!block) {
                    return null;
                }

                return {
                    ...block,
                    ...(templateBlock.values || {})
                };
            })
            .filter(Boolean);
    },

    // テンプレート名を取得する
    getTemplateName(templateId) {
        return this.templates[templateId]?.name || "テンプレート";
    }
};