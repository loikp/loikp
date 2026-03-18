const artworkData = [
    {
        id: 1,
        title: "作品标题1",
        date: "2024年1月",
        image: "images/artwork1.svg",
        tags: ["原创", "角色A"],
        ratio: "a4-portrait"
    },
    {
        id: 2,
        title: "作品标题2",
        date: "2024年2月",
        image: "images/artwork2.svg",
        tags: ["同人", "角色B"],
        ratio: "16-9"
    },
    {
        id: 3,
        title: "作品标题9",
        date: "2024年9月",
        image: "images/artwork9.svg",
        tags: ["原创", "角色I"],
        ratio: "1-1"
    },
    {
        id: 4,
        title: "作品标题3",
        date: "2024年4月",
        image: "images/artwork3.svg",
        tags: ["原创", "角色C"],
        ratio: "1-1"
    },
    {
        id: 4,
        title: "作品标题3",
        date: "2024年4月",
        image: "images/artwork3.svg",
        tags: ["原创", "角色C"],
        ratio: "4-3"
    },
    {
        id: 5,
        title: "作品标题5",
        date: "2024年5月",
        image: "images/artwork5.svg",
        tags: ["同人", "角色E"],
        ratio: "a4-landscape"
    },
    {
        id: 6,
        title: "作品标题6",
        date: "2024年6月",
        image: "images/artwork6.svg",
        tags: ["原创", "角色F"],
        ratio: "a4-portrait"
    },
    {
        id: 7,
        title: "作品标题7",
        date: "2024年7月",
        image: "images/artwork7.svg",
        tags: ["原创", "角色G"],
        ratio: "1-1"
    },
    {
        id: 8,
        title: "作品标题8",
        date: "2024年8月",
        image: "images/artwork8.svg",
        tags: ["同人", "角色H"],
        ratio: "16-9"
    }
];

const commissionData = [
    {
        id: 1,
        title: "稿件示例1",
        image: "images/commission1.svg",
        ratio: "portrait"
    },
    {
        id: 2,
        title: "稿件示例2",
        image: "images/commission2.svg",
        ratio: "square"
    },
    {
        id: 3,
        title: "稿件示例3",
        image: "images/commission3.svg",
        ratio: "landscape"
    },
    {
        id: 4,
        title: "稿件示例4",
        image: "images/commission1.svg",
        ratio: "portrait"
    },
    {
        id: 5,
        title: "稿件示例5",
        image: "images/commission2.svg",
        ratio: "square"
    }
];

const merchData = [
    {
        id: 1,
        title: "谷子1",
        price: "¥50",
        image: "images/merch1.svg",
        link: "https://weidian.com",
        sold: false
    },
    {
        id: 3,
        title: "谷子3",
        price: "¥120",
        image: "images/merch1.svg",
        link: "https://weidian.com",
        sold: false
    },
    {
        id: 5,
        title: "谷子5",
        price: "¥90",
        image: "images/merch1.svg",
        link: "https://weidian.com",
        sold: false
    },
    {
        id: 2,
        title: "谷子2",
        price: "¥80",
        image: "images/merch2.svg",
        link: "",
        sold: true
    },
    {
        id: 4,
        title: "谷子4",
        price: "¥150",
        image: "images/merch2.svg",
        link: "",
        sold: true
    }
];

const comicData = {
    chapters: [
        {
            id: 1,
            title: "第一章",
            pages: 10
        },
        {
            id: 2,
            title: "第二章（占位）",
            pages: 8
        },
        {
            id: 3,
            title: "第三章（占位）",
            pages: 12
        }
    ],
    characters: [
        {
            name: "角色A",
            image: "images/character1.svg"
        },
        {
            name: "角色B",
            image: "images/character2.svg"
        },
        {
            name: "角色C",
            image: "images/character3.svg"
        },
        {
            name: "角色D",
            image: "images/character4.svg"
        }
    ]
};

const resourceData = [
    {
        id: 1,
        title: "资源1",
        image: "images/resource1.svg",
        link: "downloads/resource1.txt",
        size: "2.5 MB"
    },
    {
        id: 2,
        title: "资源2",
        image: "images/resource2.svg",
        link: "downloads/resource2.txt",
        size: "5.8 MB"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
    initNavigation();
    initArtworkGrid();
    initCommissionSlider();
    initAnimationPlayer();
    initMerchSlider();
    initComicReader();
    initResourcesGrid();
    initThemeToggle();
    initQRModal();
    initFallingElements();
});

function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 12px 32px var(--shadow-lg)';
        } else {
            navbar.style.boxShadow = '0 8px 24px var(--shadow-lg)';
        }
    });
}

function initArtworkGrid() {
    const grid = document.getElementById('artwork-grid');

    artworkData.forEach(artwork => {
        const card = document.createElement('div');
        card.className = `artwork-card ratio-${artwork.ratio}`;
        card.innerHTML = `
            <img src="${artwork.image}" alt="${artwork.title}" loading="lazy">
            <div class="artwork-info">
                <h3 class="artwork-title">${artwork.title}</h3>
                <p class="artwork-date">${artwork.date}</p>
                <div class="artwork-tags">
                    ${artwork.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function initCommissionSlider() {
    const track = document.getElementById('commission-track');

    commissionData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'commission-item';
        
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
        `;
        track.appendChild(div);
    });
}

function initAnimationPlayer() {
    const video = document.getElementById('animation-video');
    const playlist = document.getElementById('playlist');
    let currentIndex = 0;

    function renderPlaylist() {
        playlist.innerHTML = '';
        config.animations.items.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `playlist-item ${index === currentIndex ? 'active' : ''}`;
            li.textContent = item.title;
            li.addEventListener('click', () => {
                currentIndex = index;
                video.src = `https://player.bilibili.com/player.html?bvid=${item.bvid}&page=1&high_quality=1&danmaku=1`;
                renderPlaylist();
            });
            playlist.appendChild(li);
        });
    }

    renderPlaylist();
}

function initMerchSlider() {
    const track = document.getElementById('merch-track');

    merchData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'merch-card';
        
        const soldBadge = item.sold ? '<div class="sold-badge">SOLD</div>' : '';
        let buttonHtml = '';
        
        if (item.sold) {
            buttonHtml = `<button class="merch-btn disabled">已售完</button>`;
        } else if (item.link) {
            buttonHtml = `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="merch-btn">购买</a>`;
        } else {
            buttonHtml = `<button class="merch-btn disabled">暂无库存</button>`;
        }

        card.innerHTML = `
            ${soldBadge}
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="merch-info">
                <h3 class="merch-title">${item.title}</h3>
                <p class="merch-price">${item.price}</p>
                ${buttonHtml}
            </div>
        `;
        track.appendChild(card);
    });
}

function initComicReader() {
    let currentChapter = 1;
    let currentPage = 1;
    let totalPages = comicData.chapters[0].pages;

    const comicTrack = document.getElementById('comic-track');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const prevChapterBtn = document.getElementById('prev-chapter');
    const nextChapterBtn = document.getElementById('next-chapter');
    const chapterSelect = document.getElementById('chapter-select');
    const showCharactersBtn = document.getElementById('show-characters');
    const characterModal = document.getElementById('character-modal');
    const closeCharactersBtn = document.getElementById('close-characters');
    const characterGallery = document.getElementById('character-gallery');

    function renderComicPages() {
        comicTrack.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const div = document.createElement('div');
            div.className = 'comic-page-container';
            div.dataset.page = i;
            div.innerHTML = `
                <img src="images/comic/chapter${currentChapter}/page${i}.svg" alt="第${i}页" loading="lazy">
            `;
            comicTrack.appendChild(div);
        }
        
        updateActivePage();
    }

    function updateActivePage() {
        const pages = comicTrack.querySelectorAll('.comic-page-container');
        pages.forEach((page, index) => {
            if (index + 1 === currentPage) {
                page.classList.add('active');
                page.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
            } else {
                page.classList.remove('active');
            }
        });
    }

    prevChapterBtn.addEventListener('click', () => {
        if (currentChapter > 1) {
            currentChapter--;
            currentPage = 1;
            totalPages = comicData.chapters[currentChapter - 1].pages;
            chapterSelect.value = currentChapter;
            renderComicPages();
            updatePageInfo();
        }
    });

    nextChapterBtn.addEventListener('click', () => {
        if (currentChapter < comicData.chapters.length) {
            currentChapter++;
            currentPage = 1;
            totalPages = comicData.chapters[currentChapter - 1].pages;
            chapterSelect.value = currentChapter;
            renderComicPages();
            updatePageInfo();
        }
    });

    chapterSelect.addEventListener('change', (e) => {
        currentChapter = parseInt(e.target.value);
        currentPage = 1;
        totalPages = comicData.chapters[currentChapter - 1].pages;
        renderComicPages();
        updatePageInfo();
    });

    showCharactersBtn.addEventListener('click', () => {
        characterGallery.innerHTML = '';
        comicData.characters.forEach(char => {
            const div = document.createElement('div');
            div.className = 'character-item';
            div.innerHTML = `
                <img src="${char.image}" alt="${char.name}" loading="lazy">
                <p class="character-name">${char.name}</p>
            `;
            characterGallery.appendChild(div);
        });
        characterModal.classList.add('active');
    });

    closeCharactersBtn.addEventListener('click', () => {
        characterModal.classList.remove('active');
    });

    characterModal.addEventListener('click', (e) => {
        if (e.target === characterModal) {
            characterModal.classList.remove('active');
        }
    });

    comicTrack.addEventListener('scroll', () => {
        const scrollPosition = comicTrack.scrollLeft;
        const containerWidth = comicTrack.offsetWidth;
        const newPage = Math.round(scrollPosition / containerWidth) + 1;
        
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            currentPage = newPage;
            updateActivePage();
            updatePageInfo();
        }
    });

    function updatePageInfo() {
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;
        prevChapterBtn.disabled = currentChapter === 1;
        nextChapterBtn.disabled = currentChapter === comicData.chapters.length;
    }

    renderComicPages();
    updatePageInfo();
}

function initResourcesGrid() {
    const grid = document.getElementById('resources-grid');

    resourceData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="resource-info">
                <h3 class="resource-title">${item.title}</h3>
                <div class="resource-meta">
                    <span class="resource-size">${item.size}</span>
                </div>
                <a href="${item.link}" download class="resource-btn">下载</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l-1.42-1.42M12 1v2"/>
        </svg>
    `;
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 8px 24px var(--shadow-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        transition: transform 0.3s;
        border: 3px solid white;
    `;
    themeToggle.querySelector('.icon').style.cssText = 'width: 28px; height: 28px;';

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    themeToggle.addEventListener('mouseenter', () => {
        themeToggle.style.transform = 'scale(1.1) rotate(15deg)';
    });

    themeToggle.addEventListener('mouseleave', () => {
        themeToggle.style.transform = 'scale(1) rotate(0deg)';
    });

    document.body.appendChild(themeToggle);
}

function initQRModal() {
    const qrModal = document.getElementById('qr-modal');
    const qrModalClose = document.querySelector('.qr-modal-close');
    const qrTitle = document.getElementById('qr-title');
    const qrLinks = document.querySelectorAll('.qr-link');

    const qrData = {
        'qq': {
            title: 'QQ：3274053698',
            image: 'images/qrcode.svg'
        },
        'group1': {
            title: '谷子拼团群：123456789',
            image: 'images/qrcode.svg'
        },
        'group2': {
            title: '稿件通知群：123456789',
            image: 'images/qrcode.svg'
        }
    };

    qrLinks.forEach(link => {
        link.addEventListener('click', () => {
            const qrType = link.dataset.qr;
            const data = qrData[qrType];
            
            qrTitle.textContent = data.title;
            qrModal.querySelector('.qr-modal-image').src = data.image;
            qrModal.classList.add('active');
        });
    });

    qrModalClose.addEventListener('click', () => {
        qrModal.classList.remove('active');
    });

    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.classList.remove('active');
        }
    });
}

function initFallingElements() {
    const container = document.getElementById('falling-elements');
    if (!container) return;

    const emojis = ['⭐', '💖', '🌟', '✨', '💫', '💗', '💕', '🎀', '🌸', '🍀', '🎈', '🎁', '🌈', '🦋', '🦄'];
    
    function createFallingElement() {
        const element = document.createElement('div');
        element.className = 'falling-element';
        element.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        const left = Math.random() * 100;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 5;
        const size = 1 + Math.random() * 1.5;
        
        element.style.left = `${left}%`;
        element.style.animationDuration = `${duration}s`;
        element.style.animationDelay = `${delay}s`;
        element.style.fontSize = `${size}rem`;
        
        container.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, (duration + delay) * 1000);
    }

    setInterval(createFallingElement, 800);
}
