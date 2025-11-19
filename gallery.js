// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Lightbox functionality (simplified)
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('figcaption');
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                    <img src="${img.src}" alt="${img.alt}">
                    <div class="lightbox-caption">${caption.textContent}</div>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Add lightbox styles if not already added
            if (!document.querySelector('#lightbox-styles')) {
                const styles = document.createElement('style');
                styles.id = 'lightbox-styles';
                styles.textContent = `
                    .lightbox {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.9);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10000;
                        animation: fadeIn 0.3s ease;
                    }
                    .lightbox-content {
                        position: relative;
                        max-width: 90%;
                        max-height: 90%;
                    }
                    .lightbox-content img {
                        max-width: 100%;
                        max-height: 80vh;
                        border-radius: 8px;
                    }
                    .lightbox-close {
                        position: absolute;
                        top: -40px;
                        right: 0;
                        background: none;
                        border: none;
                        color: white;
                        font-size: 2rem;
                        cursor: pointer;
                    }
                    .lightbox-caption {
                        color: white;
                        text-align: center;
                        margin-top: 1rem;
                        font-size: 1.125rem;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `;
                document.head.appendChild(styles);
            }
            
            // Close lightbox functionality
            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.addEventListener('click', () => {
                lightbox.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(lightbox);
                }, 300);
            });
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        document.body.removeChild(lightbox);
                    }, 300);
                }
            });
            
            // Keyboard support
            document.addEventListener('keydown', function lightboxKeyHandler(e) {
                if (e.key === 'Escape') {
                    lightbox.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        document.body.removeChild(lightbox);
                        document.removeEventListener('keydown', lightboxKeyHandler);
                    }, 300);
                }
            });
        });
    });
}