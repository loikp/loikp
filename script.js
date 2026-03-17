// ==================== 稿件展示区横向滑动 ====================
const commissionSlider = document.querySelector('.commission-slider');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');

let isDown = false;
let startX;
let scrollLeft;

// 鼠标拖拽滑动
commissionSlider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - commissionSlider.offsetLeft;
    scrollLeft = commissionSlider.scrollLeft;
});

commissionSlider.addEventListener('mouseleave', () => {
    isDown = false;
});

commissionSlider.addEventListener('mouseup', () => {
    isDown = false;
});

commissionSlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - commissionSlider.offsetLeft;
    const walk = (x - startX) * 2;
    commissionSlider.scrollLeft = scrollLeft - walk;
});

// 触摸滑动支持
let touchStartX = 0;
let touchScrollLeft = 0;

commissionSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchScrollLeft = commissionSlider.scrollLeft;
});

commissionSlider.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    const diff = touchStartX - touchX;
    commissionSlider.scrollLeft = touchScrollLeft + diff;
});

// 按钮控制滑动
prevBtn.addEventListener('click', () => {
    commissionSlider.scrollBy({
        left: -340,
        behavior: 'smooth'
    });
});

nextBtn.addEventListener('click', () => {
    commissionSlider.scrollBy({
        left: 340,
        behavior: 'smooth'
    });
});

// ==================== 动画展示区播放列表 ====================
const playlistItems = document.querySelectorAll('.playlist-item');
const playerPlaceholder = document.querySelector('.player-placeholder');
const playIcon = document.querySelector('.play-icon');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.querySelector('.control-play');

let currentVideo = 0;
let isPlaying = false;
let progressInterval;

const videos = [
    { title: '原创短片《星空》', duration: '03:45' },
    { title: '角色动画展示', duration: '02:30' },
    { title: 'Motion Demo', duration: '01:15' },
    { title: '逐帧动画练习', duration: '00:58' },
    { title: '角色MV片段', duration: '04:20' }
];

// 点击播放列表项
playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        selectVideo(index);
    });
});

function selectVideo(index) {
    // 移除所有激活状态
    playlistItems.forEach(item => {
        item.classList.remove('playlist-item-active');
    });
    
    // 添加当前激活状态
    playlistItems[index].classList.add('playlist-item-active');
    
    // 更新播放器显示
    currentVideo = index;
    playerPlaceholder.innerHTML = `<span class="play-icon">▶</span><span style="margin-left: 16px; font-size: 20px; color: white;">${videos[index].title}</span>`;
    
    // 重置播放状态
    isPlaying = false;
    playBtn.textContent = '▶';
    progressBar.style.width = '0%';
    
    // 自动播放
    setTimeout(() => {
        playVideo();
    }, 300);
}

function playVideo() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playBtn.textContent = '⏸';
        startProgress();
    } else {
        playBtn.textContent = '▶';
        stopProgress();
    }
}

function startProgress() {
    let progress = parseFloat(progressBar.style.width) || 0;
    progressInterval = setInterval(() => {
        progress += 0.5;
        if (progress >= 100) {
            progress = 0;
            // 自动播放下一个
            if (currentVideo < videos.length - 1) {
                selectVideo(currentVideo + 1);
            } else {
                selectVideo(0);
            }
        }
        progressBar.style.width = progress + '%';
    }, 100);
}

function stopProgress() {
    clearInterval(progressInterval);
}

// 播放器控制
playBtn.addEventListener('click', playVideo);

playerPlaceholder.addEventListener('click', playVideo);

// 进度条点击
document.querySelector('.control-progress').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const progress = (clickX / width) * 100;
    progressBar.style.width = progress + '%';
});

// ==================== 导航栏平滑滚动 ====================
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== 滚动时导航栏效果 ====================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(255, 107, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(255, 107, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ==================== 元素进入视口动画 ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.querySelectorAll('.section, .gallery-item, .merch-item, .resource-card, .comic-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== 英雄区动画 ====================
const heroShapes = document.querySelectorAll('.shape');

heroShapes.forEach((shape, index) => {
    shape.style.animationDelay = `${index * 2}s`;
});

// ==================== 卡片悬停效果增强 ====================
document.querySelectorAll('.gallery-item, .merch-item, .resource-card, .comic-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'all 0.4s ease';
    });
});

// ==================== 按钮点击波纹效果 ====================
document.querySelectorAll('button, .business-btn, .merch-buy-btn, .comic-btn, .resource-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// 添加波纹动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== 打字机效果（英雄区副标题） ====================
const heroSubtitle = document.querySelector('.hero-subtitle');
const subtitleText = heroSubtitle.textContent;
heroSubtitle.textContent = '';

let charIndex = 0;
function typeWriter() {
    if (charIndex < subtitleText.length) {
        heroSubtitle.textContent += subtitleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
    }
}

// 页面加载完成后启动打字机效果
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// ==================== 页面加载进度条 ====================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, #FFD600, #FF6B00);
    z-index: 9999;
    transition: width 0.3s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// ==================== 回到顶部按钮 ====================
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top-btn';
backToTopBtn.setAttribute('aria-label', '回到顶部');
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
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(255, 107, 0, 0.3);
    z-index: 999;
`;
document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

// ==================== 移动端菜单切换 ====================
const mobileMenuBtn = document.createElement('button');
mobileMenuBtn.innerHTML = '☰';
mobileMenuBtn.className = 'mobile-menu-btn';
mobileMenuBtn.setAttribute('aria-label', '打开菜单');

const navContainer = document.querySelector('.nav-container');
navContainer.insertBefore(mobileMenuBtn, navContainer.querySelector('.nav-links'));

function checkMobile() {
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth <= 768) {
        mobileMenuBtn.style.display = 'block';
        navLinks.style.display = 'none';
    } else {
        mobileMenuBtn.style.display = 'none';
        navLinks.style.display = 'flex';
        navLinks.style.position = 'static';
        navLinks.style.flexDirection = 'row';
        navLinks.style.background = 'transparent';
        navLinks.style.boxShadow = 'none';
        navLinks.style.padding = '0';
        navLinks.classList.remove('nav-links-active');
        mobileMenuBtn.innerHTML = '☰';
    }
}

checkMobile();
window.addEventListener('resize', checkMobile);

mobileMenuBtn.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    const isActive = navLinks.classList.contains('nav-links-active');
    
    if (isActive) {
        navLinks.classList.remove('nav-links-active');
        mobileMenuBtn.innerHTML = '☰';
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }, 300);
    } else {
        navLinks.style.display = 'flex';
        navLinks.classList.add('nav-links-active');
        mobileMenuBtn.innerHTML = '✕';
    }
});

// 点击菜单项后关闭菜单
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.remove('nav-links-active');
            mobileMenuBtn.innerHTML = '☰';
            setTimeout(() => {
                navLinks.style.display = 'none';
            }, 300);
        }
    });
});

// 点击页面其他区域关闭菜单
document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    const isClickInsideNav = navLinks.contains(e.target);
    const isClickOnBtn = mobileMenuBtn.contains(e.target);
    
    if (!isClickInsideNav && !isClickOnBtn && navLinks.classList.contains('nav-links-active')) {
        navLinks.classList.remove('nav-links-active');
        mobileMenuBtn.innerHTML = '☰';
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }, 300);
    }
});

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', (e) => {
    // 左右箭头控制稿件滑动
    if (e.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        nextBtn.click();
    }
    
    // 空格键控制播放/暂停
    if (e.key === ' ' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        playBtn.click();
    }
});

console.log('🎨 loikp的秘密基地 - 个人作品集网页已加载！');
console.log('✨ 所有交互功能已启用');