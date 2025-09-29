// 幻灯片控制
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const navDots = document.querySelectorAll('.nav-dot');
const totalSlides = slides.length;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    showSlide(currentSlide);
    addKeyboardNavigation();
    addTouchNavigation();
});

// 显示指定幻灯片
function showSlide(n) {
    // 隐藏所有幻灯片
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // 移除所有导航点的激活状态
    navDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // 显示当前幻灯片
    if (n >= totalSlides) {
        currentSlide = 0;
    } else if (n < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = n;
    }
    
    slides[currentSlide].classList.add('active');
    navDots[currentSlide].classList.add('active');
    
    // 添加进入动画
    const activeSlide = slides[currentSlide];
    activeSlide.style.animation = 'none';
    activeSlide.offsetHeight; // 触发重排
    activeSlide.style.animation = 'slideIn 0.5s ease-in-out';
}

// 切换幻灯片
function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

// 导航点点击事件
navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// 键盘导航
function addKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                changeSlide(-1);
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                changeSlide(1);
                break;
            case 'Home':
                e.preventDefault();
                showSlide(0);
                break;
            case 'End':
                e.preventDefault();
                showSlide(totalSlides - 1);
                break;
            case 'Escape':
                e.preventDefault();
                // 可以添加全屏退出功能
                break;
        }
    });
}

// 触摸导航
function addTouchNavigation() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // 水平滑动
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // 向右滑动，显示上一张
                changeSlide(-1);
            } else {
                // 向左滑动，显示下一张
                changeSlide(1);
            }
        }
        // 垂直滑动
        else if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                // 向下滑动，显示上一张
                changeSlide(-1);
            } else {
                // 向上滑动，显示下一张
                changeSlide(1);
            }
        }
    });
}

// 鼠标滚轮导航
document.addEventListener('wheel', function(e) {
    e.preventDefault();
    
    if (e.deltaY > 0) {
        // 向下滚动，显示下一张
        changeSlide(1);
    } else {
        // 向上滚动，显示上一张
        changeSlide(-1);
    }
}, { passive: false });

// 自动播放功能（可选）
let autoPlayInterval;
let isAutoPlaying = false;

function startAutoPlay(interval = 5000) {
    if (isAutoPlaying) return;
    
    isAutoPlaying = true;
    autoPlayInterval = setInterval(() => {
        changeSlide(1);
    }, interval);
}

function stopAutoPlay() {
    if (!isAutoPlaying) return;
    
    isAutoPlaying = false;
    clearInterval(autoPlayInterval);
}

// 全屏功能
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('无法进入全屏模式:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// 添加全屏快捷键
document.addEventListener('keydown', function(e) {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// 页面可见性变化时暂停/恢复自动播放
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoPlay();
    }
});

// 窗口大小变化时重新计算布局
window.addEventListener('resize', function() {
    // 可以在这里添加响应式布局调整
    const slideContent = document.querySelector('.slide-content');
    if (slideContent) {
        slideContent.style.height = 'calc(100vh - 160px)';
    }
});

// 添加页面加载动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 添加打印样式支持
function printSlides() {
    window.print();
}

// 添加打印事件监听
window.addEventListener('beforeprint', function() {
    // 显示所有幻灯片用于打印
    slides.forEach(slide => {
        slide.style.display = 'block';
        slide.style.pageBreakAfter = 'always';
    });
});

window.addEventListener('afterprint', function() {
    // 恢复幻灯片显示状态
    showSlide(currentSlide);
});

// 添加右键菜单（可选）
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    
    // 可以在这里添加自定义右键菜单
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = `
        <div class="menu-item" onclick="toggleFullscreen()">全屏</div>
        <div class="menu-item" onclick="startAutoPlay()">自动播放</div>
        <div class="menu-item" onclick="stopAutoPlay()">停止自动播放</div>
        <div class="menu-item" onclick="printSlides()">打印</div>
    `;
    
    menu.style.position = 'fixed';
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
    menu.style.background = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '5px';
    menu.style.padding = '10px';
    menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    menu.style.zIndex = '10000';
    
    document.body.appendChild(menu);
    
    // 点击其他地方关闭菜单
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
        });
    }, 100);
});

// 添加幻灯片切换音效（可选）
function playSlideSound() {
    // 创建简单的音效
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// 在幻灯片切换时播放音效
const originalShowSlide = showSlide;
showSlide = function(n) {
    originalShowSlide(n);
    // playSlideSound(); // 取消注释以启用音效
};

// 添加幻灯片计数器
function updateSlideCounter() {
    let counter = document.querySelector('.slide-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'slide-counter';
        counter.style.position = 'fixed';
        counter.style.bottom = '20px';
        counter.style.left = '20px';
        counter.style.background = 'rgba(255, 255, 255, 0.9)';
        counter.style.padding = '10px 15px';
        counter.style.borderRadius = '20px';
        counter.style.fontSize = '14px';
        counter.style.color = '#667eea';
        counter.style.fontWeight = '600';
        counter.style.zIndex = '1000';
        document.body.appendChild(counter);
    }
    
    counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

// 更新计数器
const originalShowSlideWithCounter = showSlide;
showSlide = function(n) {
    originalShowSlideWithCounter(n);
    updateSlideCounter();
};

// 初始化计数器
updateSlideCounter();

// 图片预览弹窗功能
document.addEventListener('DOMContentLoaded', function() {
    initImageModal();
});

function initImageModal() {
    const featureCards = document.querySelectorAll('.feature-card[data-image]');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    // 为每个功能卡片添加点击事件
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const imagePath = this.getAttribute('data-image');
            const cardTitle = this.querySelector('h4').textContent;
            
            // 设置图片源和alt属性
            modalImage.src = imagePath;
            modalImage.alt = cardTitle + ' - 功能详情图片';
            
            // 显示弹窗
            showImageModal();
        });
        
        // 添加鼠标悬停效果的增强
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
    
    // 点击弹窗背景关闭弹窗
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
    });
}

function showImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    
    // 禁用幻灯片切换功能
    disableSlideNavigation();
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'hidden'; // 保持隐藏滚动条
    
    // 延迟恢复幻灯片切换功能，避免立即触发
    setTimeout(() => {
        enableSlideNavigation();
    }, 300);
}

// 临时禁用幻灯片导航
let navigationDisabled = false;

function disableSlideNavigation() {
    navigationDisabled = true;
}

function enableSlideNavigation() {
    navigationDisabled = false;
}

// 修改原有的键盘导航函数，增加弹窗状态检查
const originalKeyboardHandler = document.querySelector('body').addEventListener;

// 重写键盘事件处理，增加弹窗状态检查
document.addEventListener('keydown', function(e) {
    // 如果弹窗打开或导航被禁用，则不处理幻灯片导航
    if (navigationDisabled || document.getElementById('imageModal').classList.contains('active')) {
        return;
    }
    
    // 原有的键盘导航逻辑已经在上面定义，这里不再重复
});

// 重写滚轮事件处理
document.addEventListener('wheel', function(e) {
    // 如果弹窗打开，则不处理幻灯片导航
    if (navigationDisabled || document.getElementById('imageModal').classList.contains('active')) {
        return;
    }
    
    e.preventDefault();
    
    if (e.deltaY > 0) {
        changeSlide(1);
    } else {
        changeSlide(-1);
    }
}, { passive: false });

// 图片加载错误处理
document.addEventListener('DOMContentLoaded', function() {
    const modalImage = document.getElementById('modalImage');
    
    modalImage.addEventListener('error', function() {
        // 如果图片加载失败，显示默认提示
        this.alt = '图片加载失败 - 请检查图片路径是否正确';
        this.style.display = 'none';
        
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            color: white;
            font-size: 1.2rem;
            text-align: center;
            padding: 50px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            border: 2px dashed rgba(255, 255, 255, 0.3);
        `;
        errorDiv.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 20px;">📷</div>
            <div>图片暂未上传</div>
            <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">请添加对应的功能演示图片</div>
        `;
        
        // 替换图片内容
        const modalContent = this.parentElement;
        modalContent.insertBefore(errorDiv, this);
    });
    
    modalImage.addEventListener('load', function() {
        // 图片加载成功时，确保错误提示被移除
        const errorDiv = this.parentElement.querySelector('div[style*="color: white"]');
        if (errorDiv) {
            errorDiv.remove();
        }
        this.style.display = 'block';
    });
});
