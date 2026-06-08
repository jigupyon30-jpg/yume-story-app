// ID作成・作品データ・ブロックデータの形を作る

const DataFactory = {
    // 重複しにくいIDを作る
    createId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    },

    // 新しい作品データを作る
    createProject({ title, genre, memo}) {
        const now = new Date().toISOString();

        return {
            id: this.createId("project"),
            title,
            genre,
            memo,

            characters: [],
            relationships: [],

            episodes: [
                {
                    id: this.createId("episode"),
                    title: "第1話",
                    blocks: [],

                    createdAt: now,
                    updatedAt: now,
                }
            ],
            
            createdAt: now,
            updatedAt: now,
        };
    },

    // 本文ブロックを作る
    createTextBlock() {
        return {
            id: this.createId("block"),
            type: "text",
            content: "",
            createdAt: new Date().toISOString()
        };
    },

    // LINEブロック
    createLineBlock() {
        return {
            id: this.createId("block"),
            type: "line",
            partnerCharacterId: "",
            title: "LINE",
            partnerName: "",
            startTime: "22:00",
            minuteStep: 1,
            isReadVisible: true,
            messages: "",
            imageData: "",
            createdAt: new Date().toISOString()
        };
    },

    // インスタ投稿ブロック
    createInstagramBlock() {
        return {
            id: this.createId("block"),
            type: "instagram",
            characterId: "",
            username: "",
            caption: "",
            likes: "",
            comments: "",
            imageData: null,
            createdAt: new Date().toISOString()
        };
    },

    // インスタDMブロック
    createInstagramDmBlock() {
        return {
            id: this.createId("block"),
            type: "instagramDm",
            partnerCharacterId: "",
            partnerName: "",
            partnerUsername: "",
            isReadVisible: true,
            messages: [
                {
                    id: this.createId("dm"),
                    type: "text",
                    sender: "me",
                    text: "",
                    imageData: null,
                    createdAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString()
        };
    },

    // インスタストーリーブロック
    createInstagramStoryBlock() {
        return {
            id: this.createId("block"),
            type: "instagramStory",
            backgroundImage: null,
            items: [],
            createdAt: new Date().toISOString()
        };
    },

    // インライブロック
    createInstagramLiveBlock() {
        return {
            id: this.createId("block"),
            type: "instagramLive",
            characterId: "",
            username: "kusakawa_milk",
            messages: [
                {
                    id: this.createId("liveMessage"),
                    username: "host",
                    text: "みんな来てくれてありがとう〜！"
                },
                {
                    id: this.createId("liveMessage"),
                    type: "viewer",
                    username: "aaa",
                    text: "今日ビジュ良すぎる"
                }
            ],
            createdAt: new Date().toISOString()
        };
    },

    // Twitter / Xブロック
    createTwitterBlock() {
        return {
            id: this.createId("block"),
            type: "twitter",
            posts: [
                {
                    id: this.createId("tweet"),
                    accountType: "official",
                    characterId: "",
                    displayName: "M!LK",
                    username: "milk_official",
                    text: "",
                    likes: "",
                    reposts: "",
                    replies: "",
                    imageData: null,
                    createdAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString()
        };
    },

    // 芸能ニュースブロック
    createNewsBlock() {
        return {
            id: this.createId("block"),
            type: "news",
            mediaName: "",
            headline: "",
            body: "",
            reaction: "",
            imageData: null,
            createdAt: new Date().toISOString()
        };
    },

    // Wikiブロック
    createWikiBlock() {
        return {
            id: this.createId("block"),
            type: "wiki",
            name: "草川まりあ",
            subtitle: "日本のアイドル、女優",
            summary: "草川まりあ(くさかわ まりあ、2002年3月26日-)は、日本のアイドル、女優。\nダンスボーカルM!LKのメンバー。",
            imageData: null,
            profile: "生年月日：2002年3月26日\n出身地：日本 東京都\n身長：162cm\n血液型：O型\n職業：アイドル、女優\nジャンル：テレビドラマ、映画、CM\n著名な家族：草川拓弥、草川直弥(兄)\n活動期間：2012年-\n事務所：スターダストプロモーション\n公式サイト：STARDUST PROMOTION M!LK",
            history: "2012年、母親と原宿を歩いていたところをスカウトを受け芸能界入り。\n同年にアイドルグループ『ショコラ♡』を結成し2013年にデビューするも1年足らずで解散。\nグループ解散後は子役として活躍。\n\n2014年に事務所内で行われたオーディションを受けてみないかと声をかけられ参加したところ見事合格し、現在のM!LKのメンバーに初期メンバーとして選ばれ同時にEBiDAN加入。\n\n2018年に出演した『花のち晴れ〜花男Next Season〜』で真矢愛莉役を演じたところ、ビジュアルの強さが注目されメディア露出が増加。\n\n2021年11月24日、M!LKとしてシングル『Ribbon』でメジャーデビュー。",
            drama: "・花のち晴れ(2018年) 真矢愛莉役\n・俺のスカート、どこいった？(2019年) 川崎結衣役\n・恋の病と野郎組(2019年) 原アスカ役\n・真夏の少年〜19452020〜(2020年) 牟呂由真役\n・ドラゴン桜第2シリーズ(2021年) 岩崎楓役\n・ナイト・ドクター(2021年) 深澤心美役\n・真犯人フラグ(2021年) 相良光莉役\n・モトカレ←リトライ(2022) 羽木蜜役\n・silent(2023年) 佐倉萌役\n・夕暮れに、手をつなぐ(2023年) 浅葱空豆役\n・王様に捧ぐ薬指(2023) 羽田綾華役\n・トリリオンゲーム(2023年) 高橋凛々(リンリン)役\n・ビリオン×スクール(2024年) 藤宮柊華役\n・若草物語-恋する姉妹と恋せぬ私-(2024) 町田芽役\n・あやしいパートナー(2025) 宮下さくら役\n・君がトクベツ(2025) 主演・若梅さほ子役\n・御曹司に恋はムズすぎる(2025年) 花倉まどか役\n・ESCAPE-それは誘拐のはずだった-(2025年) 八神結衣(ハチ)役",
            movie: "・かぐや様は告らせたい〜天才たちの恋愛頭脳戦〜 (2019年) 藤原千花役\n・胸が鳴るのは君のせい(2021年) 篠原つかさ役\n・うちの弟どもがすみません(2024) 主演・成田糸役\n・君がトクベツ(2025) 若梅さほ子役\n・劇場版トリリオンゲーム(2025年) 高橋凛々(リンリン)役",
            createdAt: new Date().toISOString()
        };
    },

    // ブロックタイプごとに作成する
    createBlockByType(type) {
        if (type === "text") {
            return this.createTextBlock();
        }

        if (type === "line") {
            return this.createLineBlock();
        }

        if (type === "instagram") {
            return this.createInstagramBlock();
        }

        if (type === "news") {
            return this.createNewsBlock();
        }

        if (type === "wiki") {
            return this.createWikiBlock();
        }

        if (type === "instagramDm") {
            return this.createInstagramDmBlock();
        }

        if (type === "instagramStory") {
            return this.createInstagramStoryBlock();
        }
        if (type === "instagramLive") {
            return this.createInstagramLiveBlock();
        }
        if (type === "twitter") {
            return this.createTwitterBlock();
        }

        return null;
    }
};