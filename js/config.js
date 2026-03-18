const config = {
    site: {
        title: "我的作品集",
        description: "个人作品集 - 绘画、动画、漫画展示",
        author: "你的名字"
    },

    about: {
        introduction: "这里填写个人介绍...",
        avatar: "images/avatar.jpg",
        socialLinks: [
            {
                name: "Lofter",
                url: "https://lofter.com",
                icon: "lofter"
            },
            {
                name: "微博",
                url: "https://weibo.com",
                icon: "weibo"
            },
            {
                name: "B站",
                url: "https://bilibili.com",
                icon: "bilibili"
            },
            {
                name: "Pixiv",
                url: "https://pixiv.net",
                icon: "pixiv"
            }
        ]
    },

    artwork: {
        filterButtons: [
            { label: "全部", value: "all" },
            { label: "原创", value: "original" },
            { label: "同人", value: "fanart" }
        ],
        items: [
            {
                id: 1,
                title: "作品标题1",
                date: "2024年1月",
                image: "images/artwork1.jpg",
                tags: ["原创", "角色A"],
                category: "original"
            },
            {
                id: 2,
                title: "作品标题2",
                date: "2024年2月",
                image: "images/artwork2.jpg",
                tags: ["同人", "角色B"],
                category: "fanart"
            },
            {
                id: 3,
                title: "作品标题3",
                date: "2024年3月",
                image: "images/artwork3.jpg",
                tags: ["原创", "角色C"],
                category: "original"
            }
        ]
    },

    commissions: {
        items: [
            {
                id: 1,
                title: "稿件示例1",
                image: "images/commission1.jpg",
                ratio: "portrait"
            },
            {
                id: 2,
                title: "稿件示例2",
                image: "images/commission2.jpg",
                ratio: "square"
            },
            {
                id: 3,
                title: "稿件示例3",
                image: "images/commission3.jpg",
                ratio: "landscape"
            }
        ],
        pricing: [
            { type: "头像", price: "¥50-100", description: "简单背景" },
            { type: "半身像", price: "¥150-300", description: "简单背景" },
            { type: "全身像", price: "¥300-500", description: "简单背景" },
            { type: "插画", price: "¥500-1000", description: "复杂背景" }
        ]
    },

    animations: {
        items: [
            {
                id: 1,
                title: "【Undertale/meme】请给我50000G【正宗雪镇口音】",
                bvid: "BV1wMZ2B2Etr"
            },
            {
                id: 2,
                title: "鳝丝大碟在线跳【惊喜爱】¿",
                bvid: "BV1qrfkBhEqz"
            },
            {
                id: 3,
                title: "《顶富》衫出没之sans快跑试玩",
                bvid: "BV1mYw2zPEza"
            }
        ]
    },

    merchandise: {
        items: [
            {
                id: 1,
                title: "谷子1",
                price: "¥50",
                image: "images/merch1.jpg",
                link: "https://example.com",
                sold: false
            },
            {
                id: 2,
                title: "谷子2",
                price: "¥80",
                image: "images/merch2.jpg",
                link: "",
                sold: true
            }
        ]
    },

    comic: {
        chapters: [
            {
                id: 1,
                title: "第一章",
                pages: 10
            }
        ],
        characters: [
            {
                name: "角色A",
                image: "images/character1.jpg"
            },
            {
                name: "角色B",
                image: "images/character2.jpg"
            }
        ]
    },

    resources: {
        items: [
            {
                id: 1,
                title: "资源1",
                image: "images/resource1.jpg",
                link: "downloads/resource1.zip"
            },
            {
                id: 2,
                title: "资源2",
                image: "images/resource2.jpg",
                link: "downloads/resource2.zip"
            }
        ]
    },

    support: {
        wechatQR: "images/wechat-qr.jpg",
        text: "如果您喜欢我的作品，欢迎通过微信赞赏码支持我"
    },

    theme: {
        default: "light",
        colors: {
            primary: "#6366f1",
            secondary: "#8b5cf6",
            background: "#ffffff",
            text: "#0f172a"
        }
    }
};
