// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化...');
    
    // ==================== 移动端菜单切换 ====================
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.nav-mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        
        // 点击菜单项关闭菜单
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
        
        // 点击页面其他区域关闭菜单
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }
    
    // ==================== 导航栏滚动效果 ====================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ==================== 平滑滚动 ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ==================== 滚动进度条 ====================
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #FFD600, #FF6B00);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
    
    // ==================== 回到顶部按钮 ====================
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #FFD600, #FF6B00);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 24px;
        cursor: pointer;
        z-index: 999;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 16px rgba(255, 107, 0, 0.3);
    `;
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.transform = 'translateY(0)';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(20px)';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ==================== 稿件展示区触摸滑动 ====================
    const commissionSlider = document.querySelector('.commission-slider');
    
    if (commissionSlider) {
        let isDragging = false;
        let startX;
        let scrollLeft;
        
        commissionSlider.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.pageX - commissionSlider.offsetLeft;
            scrollLeft = commissionSlider.scrollLeft;
            commissionSlider.style.cursor = 'grabbing';
        });
        
        commissionSlider.addEventListener('mouseleave', function() {
            isDragging = false;
            commissionSlider.style.cursor = 'grab';
        });
        
        commissionSlider.addEventListener('mouseup', function() {
            isDragging = false;
            commissionSlider.style.cursor = 'grab';
        });
        
        commissionSlider.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - commissionSlider.offsetLeft;
            const walk = (x - startX) * 2;
            commissionSlider.scrollLeft = scrollLeft - walk;
        });
        
        // 触摸滑动
        let touchStartX;
        commissionSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        });
        
        commissionSlider.addEventListener('touchmove', function(e) {
            if (!touchStartX) return;
            const touchX = e.touches[0].clientX;
            const diff = touchStartX - touchX;
            commissionSlider.scrollLeft += diff;
            touchStartX = touchX;
        });
        
        commissionSlider.addEventListener('touchend', function() {
            touchStartX = null;
        });
    }
    
    // ==================== 谷子展示区触摸滑动 ====================
    const merchSlider = document.querySelector('.merch-slider');
    
    if (merchSlider) {
        let isDragging = false;
        let startX;
        let scrollLeft;
        
        merchSlider.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.pageX - merchSlider.offsetLeft;
            scrollLeft = merchSlider.scrollLeft;
            merchSlider.style.cursor = 'grabbing';
        });
        
        merchSlider.addEventListener('mouseleave', function() {
            isDragging = false;
            merchSlider.style.cursor = 'grab';
        });
        
        merchSlider.addEventListener('mouseup', function() {
            isDragging = false;
            merchSlider.style.cursor = 'grab';
        });
        
        merchSlider.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - merchSlider.offsetLeft;
            const walk = (x - startX) * 2;
            merchSlider.scrollLeft = scrollLeft - walk;
        });
        
        // 触摸滑动
        let merchTouchStartX;
        merchSlider.addEventListener('touchstart', function(e) {
            merchTouchStartX = e.touches[0].clientX;
        });
        
        merchSlider.addEventListener('touchmove', function(e) {
            if (!merchTouchStartX) return;
            const touchX = e.touches[0].clientX;
            const diff = merchTouchStartX - touchX;
            merchSlider.scrollLeft += diff;
            merchTouchStartX = touchX;
        });
        
        merchSlider.addEventListener('touchend', function() {
            merchTouchStartX = null;
        });
    }
    
    // ==================== 动画播放器功能 ====================
    const playerScreen = document.querySelector('.player-screen');
    const playIcon = document.querySelector('.play-icon');
    const playBtn = document.querySelector('.control-play');
    const progressBar = document.querySelector('.progress-bar');
    const controlProgress = document.querySelector('.control-progress');
    let isPlaying = false;
    let progress = 30;
    
    if (playerScreen && playBtn) {
        function togglePlay() {
            isPlaying = !isPlaying;
            playBtn.textContent = isPlaying ? '⏸' : '▶';
            if (playIcon) {
                playIcon.textContent = isPlaying ? '⏸' : '▶';
            }
        }
        
        playerScreen.addEventListener('click', togglePlay);
        playBtn.addEventListener('click', togglePlay);
        
        // 进度条控制
        if (controlProgress) {
            controlProgress.addEventListener('click', function(e) {
                const rect = controlProgress.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                progress = percent;
                progressBar.style.width = progress + '%';
            });
        }
    }
    
    // ==================== 动画合集切换 ====================
    const animationTags = document.querySelectorAll('.animation-tag');
    console.log('找到合集标签:', animationTags.length);
    
    // 不同合集的播放列表数据
    const playlistData = {
        original: [
            { number: '01', title: '原创短片《星空》', duration: '03:45' },
            { number: '02', title: '角色动画展示', duration: '02:30' },
            { number: '03', title: 'Motion Demo', duration: '01:15' },
            { number: '04', title: '逐帧动画练习', duration: '00:58' },
            { number: '05', title: '角色MV片段', duration: '04:20' }
        ],
        character: [
            { number: '01', title: '角色A动画', duration: '02:00' },
            { number: '02', title: '角色B动画', duration: '01:45' },
            { number: '03', title: '角色C动画', duration: '02:30' }
        ],
        practice: [
            { number: '01', title: '走路动画练习', duration: '00:30' },
            { number: '02', title: '跑步动画练习', duration: '00:45' },
            { number: '03', title: '跳跃动画练习', duration: '00:35' },
            { number: '04', title: '攻击动画练习', duration: '01:00' }
        ]
    };
    
    function updatePlaylist(playlistType) {
        const playlistContainer = document.getElementById('playlist-items');
        if (!playlistContainer) {
            console.error('找不到播放列表容器');
            return;
        }
        
        const items = playlistData[playlistType] || playlistData.original;
        playlistContainer.innerHTML = '';
        
        items.forEach((item, index) => {
            const isActive = index === 0;
            const itemElement = document.createElement('div');
            itemElement.className = `playlist-item ${isActive ? 'playlist-item-active' : ''}`;
            itemElement.setAttribute('data-playlist', playlistType);
            itemElement.innerHTML = `
                <div class="playlist-number">${item.number}</div>
                <div class="playlist-info">
                    <h4>${item.title}</h4>
                    <p>${item.duration}</p>
                </div>
            `;
            playlistContainer.appendChild(itemElement);
        });
        
        // 重新绑定点击事件
        bindPlaylistClickEvents();
        
        console.log('切换到合集:', playlistType, '共', items.length, '个视频');
    }
    
    function bindPlaylistClickEvents() {
        const newPlaylistItems = document.querySelectorAll('.playlist-item');
        console.log('绑定播放列表点击事件，共', newPlaylistItems.length, '个');
        newPlaylistItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                console.log('点击播放列表项:', index);
                newPlaylistItems.forEach(i => i.classList.remove('playlist-item-active'));
                this.classList.add('playlist-item-active');
                
                // 重置播放状态
                isPlaying = false;
                if (playBtn) playBtn.textContent = '▶';
                if (playIcon) playIcon.textContent = '▶';
                progress = 0;
                if (progressBar) progressBar.style.width = '0%';
            });
        });
    }
    
    // 初始化播放列表点击事件
    bindPlaylistClickEvents();
    
    // 绑定合集切换事件
    animationTags.forEach((tag, index) => {
        console.log('绑定合集标签点击事件:', index, tag.textContent);
        tag.addEventListener('click', function() {
            animationTags.forEach(t => t.classList.remove('animation-tag-active'));
            this.classList.add('animation-tag-active');
            
            const playlistType = this.getAttribute('data-playlist');
            console.log('点击合集:', playlistType);
            updatePlaylist(playlistType);
        });
    });
    
    // ==================== 漫画翻页功能 ====================
    let currentChapter = 1;
    let totalChapters = 3;
    let currentPage = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    function getChapterPages(chapterNum) {
        const chapter = document.querySelector(`.comic-chapter[data-chapter="${chapterNum}"]`);
        if (!chapter) {
            console.error('找不到章节:', chapterNum);
            return [];
        }
        const pages = chapter.querySelectorAll('.comic-page');
        console.log('第', chapterNum, '话共有', pages.length, '页');
        return pages;
    }
    
    function updateComicPage() {
        const pages = getChapterPages(currentChapter);
        if (pages.length === 0) {
            console.error('当前章节没有页面');
            return;
        }
        
        pages.forEach((page, index) => {
            page.classList.remove('comic-page-active', 'prev-page');
            if (index === currentPage) {
                page.classList.add('comic-page-active');
            } else if (index < currentPage) {
                page.classList.add('prev-page');
            }
        });
        
        const comicPrevBtn = document.querySelector('.comic-nav-prev');
        const comicNextBtn = document.querySelector('.comic-nav-next');
        const pageIndicator = document.querySelector('.comic-page-indicator');
        
        if (comicPrevBtn) {
            comicPrevBtn.disabled = currentPage === 0;
        }
        if (comicNextBtn) {
            comicNextBtn.disabled = currentPage === pages.length - 1;
        }
        if (pageIndicator) {
            pageIndicator.textContent = `${currentPage + 1} / ${pages.length}`;
        }
        
        console.log('漫画翻页: 第', currentChapter, '话，第', currentPage + 1, '/', pages.length, '页');
    }
    
    function updateChapter() {
        // 隐藏所有章节
        document.querySelectorAll('.comic-chapter').forEach(chapter => {
            chapter.style.display = 'none';
        });
        
        // 显示当前章节
        const currentChapterEl = document.querySelector(`.comic-chapter[data-chapter="${currentChapter}"]`);
        if (currentChapterEl) {
            currentChapterEl.style.display = 'block';
            console.log('显示第', currentChapter, '话');
        } else {
            console.error('找不到第', currentChapter, '话');
        }
        
        // 更新章节导航按钮
        const chapterPrev = document.querySelector('.chapter-prev');
        const chapterNext = document.querySelector('.chapter-next');
        const chapterLabel = document.querySelector('.comic-chapter');
        
        if (chapterPrev) {
            chapterPrev.disabled = currentChapter === 1;
        }
        if (chapterNext) {
            chapterNext.disabled = currentChapter === totalChapters;
        }
        if (chapterLabel) {
            chapterLabel.textContent = `第${currentChapter}话`;
        }
        
        // 重置页数
        currentPage = 0;
        updateComicPage();
        
        console.log('切换到第', currentChapter, '话');
    }
    
    // 页数导航
    const comicPrevBtn = document.querySelector('.comic-nav-prev');
    const comicNextBtn = document.querySelector('.comic-nav-next');
    
    if (comicPrevBtn) {
        comicPrevBtn.addEventListener('click', function() {
            console.log('点击上一页');
            if (currentPage > 0) {
                currentPage--;
                updateComicPage();
            }
        });
    }
    
    if (comicNextBtn) {
        comicNextBtn.addEventListener('click', function() {
            console.log('点击下一页');
            const pages = getChapterPages(currentChapter);
            if (currentPage < pages.length - 1) {
                currentPage++;
                updateComicPage();
            }
        });
    }
    
    // 章节导航
    const chapterPrevBtn = document.querySelector('.chapter-prev');
    const chapterNextBtn = document.querySelector('.chapter-next');
    
    if (chapterPrevBtn) {
        chapterPrevBtn.addEventListener('click', function() {
            console.log('点击上一章');
            if (currentChapter > 1) {
                currentChapter--;
                updateChapter();
            }
        });
    }
    
    if (chapterNextBtn) {
        chapterNextBtn.addEventListener('click', function() {
            console.log('点击下一章');
            if (currentChapter < totalChapters) {
                currentChapter++;
                updateChapter();
            }
        });
    }
    
    // 漫画触摸滑动翻页
    const comicViewer = document.querySelector('.comic-viewer');
    
    if (comicViewer) {
        comicViewer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        comicViewer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                const pages = getChapterPages(currentChapter);
                if (diff > 0) {
                    // 左滑，下一页
                    if (currentPage < pages.length - 1) {
                        currentPage++;
                        updateComicPage();
                    }
                } else {
                    // 右滑，上一页
                    if (currentPage > 0) {
                        currentPage--;
                        updateComicPage();
                    }
                }
            }
        }
    }
    
    // 键盘翻页
    document.addEventListener('keydown', function(e) {
        const pages = getChapterPages(currentChapter);
        if (e.key === 'ArrowLeft' && currentPage > 0) {
            currentPage--;
            updateComicPage();
        } else if (e.key === 'ArrowRight' && currentPage < pages.length - 1) {
            currentPage++;
            updateComicPage();
        }
    });
    
    // 初始化漫画页面
    console.log('初始化漫画页面...');
    updateChapter();
    
    // ==================== 人设查看弹窗 ====================
    const characterDesignBtn = document.getElementById('character-design-btn');
    const characterModal = document.getElementById('character-modal');
    const characterModalClose = document.getElementById('character-modal-close');
    const characterSlides = document.querySelectorAll('.character-slide');
    const characterPrevBtn = document.querySelector('.character-prev');
    const characterNextBtn = document.querySelector('.character-next');
    const characterIndicator = document.querySelector('.character-indicator');
    let currentCharacterSlide = 0;
    
    function updateCharacterSlide() {
        characterSlides.forEach((slide, index) => {
            slide.classList.remove('character-slide-active', 'prev-slide');
            if (index === currentCharacterSlide) {
                slide.classList.add('character-slide-active');
            } else if (index < currentCharacterSlide) {
                slide.classList.add('prev-slide');
            }
        });
        
        if (characterPrevBtn) {
            characterPrevBtn.disabled = currentCharacterSlide === 0;
        }
        if (characterNextBtn) {
            characterNextBtn.disabled = currentCharacterSlide === characterSlides.length - 1;
        }
        if (characterIndicator) {
            characterIndicator.textContent = `${currentCharacterSlide + 1} / ${characterSlides.length}`;
        }
    }
    
    if (characterDesignBtn) {
        characterDesignBtn.addEventListener('click', function() {
            if (characterModal) {
                characterModal.classList.add('active');
            }
        });
    }
    
    if (characterModalClose) {
        characterModalClose.addEventListener('click', function() {
            if (characterModal) {
                characterModal.classList.remove('active');
            }
        });
    }
    
    if (characterModal) {
        characterModal.addEventListener('click', function(e) {
            if (e.target === characterModal) {
                characterModal.classList.remove('active');
            }
        });
    }
    
    if (characterPrevBtn) {
        characterPrevBtn.addEventListener('click', function() {
            if (currentCharacterSlide > 0) {
                currentCharacterSlide--;
                updateCharacterSlide();
            }
        });
    }
    
    if (characterNextBtn) {
        characterNextBtn.addEventListener('click', function() {
            if (currentCharacterSlide < characterSlides.length - 1) {
                currentCharacterSlide++;
                updateCharacterSlide();
            }
        });
    }
    
    // 人设弹窗键盘控制
    document.addEventListener('keydown', function(e) {
        if (characterModal && characterModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft' && currentCharacterSlide > 0) {
                currentCharacterSlide--;
                updateCharacterSlide();
            } else if (e.key === 'ArrowRight' && currentCharacterSlide < characterSlides.length - 1) {
                currentCharacterSlide++;
                updateCharacterSlide();
            } else if (e.key === 'Escape') {
                characterModal.classList.remove('active');
            }
        }
    });
    
    // ==================== 滚动动画 ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // 英雄区立即显示
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }
    
    console.log('iFlow Blog - 初始化完成！');
});