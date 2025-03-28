import Swiper from 'swiper';

document.addEventListener('DOMContentLoaded', () => {
    const relatedPostsBlocks = document.querySelectorAll('.wp-block-custom-blocks-related-posts');
    
    relatedPostsBlocks.forEach(block => {
        const swiperContainer = block.querySelector('.swiper');
        if (!swiperContainer) return;

        const slides = swiperContainer.querySelectorAll('.swiper-slide');
        const slidesPerView = parseInt(block.dataset.slidesPerView) || 3;
        const autoplay = block.dataset.autoplay === 'true';
        const delay = parseInt(block.dataset.delay) || 3000;
        
        // Only enable loop if we have more slides than slidesPerView
        const shouldLoop = slides.length > slidesPerView;
        const loop = shouldLoop && (block.dataset.loop === 'true');

        // Only initialize Swiper if we have more than 1 slide
        if (slides.length <= 1) {
            // Remove navigation and pagination if only one slide
            const nav = block.querySelectorAll('.swiper-button-next, .swiper-button-prev, .swiper-pagination');
            nav.forEach(el => el.style.display = 'none');
            return;
        }

        new Swiper(swiperContainer, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: loop,
            autoplay: autoplay && shouldLoop ? {
                delay: delay,
                disableOnInteraction: false,
            } : false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: Math.min(2, Math.min(slides.length, slidesPerView)),
                },
                1024: {
                    slidesPerView: Math.min(slides.length, slidesPerView),
                },
            },
        });
    });
});
