/* VIDEO AND IMAGE HANDLING */
document.addEventListener("DOMContentLoaded", () => {

  const videos = document.querySelectorAll(".lazy-video");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;

      if (entry.isIntersecting) {
        const source = video.querySelector("source");

        if (!source.src) {
          source.src = source.dataset.src;
          video.load();
        }

        video.play();
      } else {
        video.pause();
      }
    });
  }, {
    //rootMargin: "500px",
    threshold: 0.01
  });

  videos.forEach(video => {
    video.addEventListener("contextmenu", e => e.preventDefault());
    observer.observe(video);
  });

  const images = document.querySelectorAll("img");

  images.forEach(image => {
      image.addEventListener("contextmenu", e => e.preventDefault());
  });

});

/* CARDS + CAROUSEL */
document.addEventListener('DOMContentLoaded', function() {    
    const carousel = document.getElementById('carousel');
    console.log('Carousel element:', carousel);
    
    if (!carousel) {
        console.error('Carousel element not found!');
        return;
    }
    
    const carousel_items = carousel.querySelectorAll('img');
    console.log('Number of carousel images found:', carousel_items.length);
    
    const c_count = carousel_items.length;
    const c_radius = 400;
    let currentSpeed = 24;
    let isReversed = false;

    carousel_items.forEach((item, i) => {
        const angle = (360 / c_count) * i;
        const angleRad = (angle * Math.PI) / 180;
        
        const x = Math.cos(angleRad) * c_radius;
        const y = Math.sin(angleRad) * c_radius;
        const baseTransform = `
            translate(-50%, -50%)
            translate(${x}px, ${y}px)
            rotate(${angle + 90}deg)
        `;
        
        item.style.transform = baseTransform;
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = baseTransform + ' scale(1.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = baseTransform;
        });
        
        console.log(`Image ${i}: x=${x}, y=${y}, rotation=${angle + 90}`);
    });

    const process = document.getElementById('process');
    const cards = process.querySelectorAll('.process-card');
    cards[0].classList.add('active');

    const count = cards.length;
    const radius = 115;
    zIndCount = 6;
    currZInd = 0;

    let currentRotation = 0;

    cards.forEach((card, i) => {
    const baseAngle = (360 / count) * i - 90;
    card.dataset.baseAngle = baseAngle;

    card.style.zIndex = zIndCount;
        zIndCount = zIndCount - 1;
    });

    function layoutCards(rotation = 0) {
    const sorted = Array.from(cards).sort((a, b) => {
        const aAngle = Number(a.dataset.baseAngle) + rotation;
        const bAngle = Number(b.dataset.baseAngle) + rotation;
        return Math.sin(aAngle * Math.PI / 180) -
            Math.sin(bAngle * Math.PI / 180);
    });

    sorted.forEach((card, index) => {
        const angle = Number(card.dataset.baseAngle) + rotation;
        const rad = angle * Math.PI / 180;

        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        card.style.transform = `
        translate(-50%, -50%)
        translate(${x}px, ${y}px)
        rotate(${angle + 90}deg)
        `;
    });
    }

    layoutCards(currentRotation);

    cards.forEach(card => {
    card.addEventListener('click', () => {
        const baseAngle = Number(card.dataset.baseAngle);

        currentRotation = -baseAngle - 90;

        layoutCards(currentRotation);

        const activeCard = process.querySelector('.process-card.active');
        if (activeCard) {
            activeCard.style.zIndex = currZInd;
        }
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currZInd = card.style.zIndex;
        card.style.zIndex = 8;
    });

    card.addEventListener('mouseenter', () => {
        card.style.transform += ' scale(1.05)';
    });

    card.addEventListener('mouseleave', () => {
        layoutCards(currentRotation);
    });
    });

});

/* CS QUICK NAV BAR */
document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll(".cs-step");
    const sections = document.querySelectorAll(".cs-section");
    const progressNav = document.getElementById("cs-progress");
    const reflectionSection = document.getElementById("cs-reflection");

    let currentActiveId = null;
    let isNavHidden = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const id = entry.target.id;

                if (id !== currentActiveId) {
                    currentActiveId = id;

                    steps.forEach((step) => {
                        step.classList.toggle(
                            "active",
                            step.dataset.target === id
                        );
                    });
                }
            });
        },
        {
            root: null,
            rootMargin: "-35% 0px -85% 0px",
            threshold: 0,
        }
    );

    const hideNavObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const rect = entry.target.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (entry.isIntersecting && rect.top < windowHeight && !isNavHidden) {
                    isNavHidden = true;
                    progressNav.style.opacity = "0";
                    progressNav.style.transform = "translateY(-100%)";
                    progressNav.style.pointerEvents = "none";
                } else if (entry.isIntersecting && isNavHidden) {
                    isNavHidden = false;
                    progressNav.style.opacity = "1";
                    progressNav.style.transform = "translateY(0)";
                    progressNav.style.pointerEvents = "auto";
                } else if (!entry.isIntersecting && rect.top > windowHeight && isNavHidden) {
                    isNavHidden = false;
                    progressNav.style.opacity = "1";
                    progressNav.style.transform = "translateY(0)";
                    progressNav.style.pointerEvents = "auto";
                }
            });
        },
        {
            root: null,
            rootMargin: "-0% 0px -99% 0px",
            threshold: 0,
        }
    );

    sections.forEach((section) => {
        if (section.id) observer.observe(section);
    });

    if (reflectionSection) {
        hideNavObserver.observe(reflectionSection);
    }

    steps.forEach(step => {
        step.addEventListener("click", () => {
            const target = document.getElementById(step.dataset.target);
            if (!target) return;

            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });
});

/* IMAGE AUTO SCROLL */
const featureScroll = document.querySelector('.feature-scroll');
const featureSection = document.querySelector('#feature-structured');

if (featureScroll && featureSection) {
    let scrollSpeed = 0.35;
    let animationFrame;
    let isScrolling = false;

    function autoScroll() {
        featureScroll.scrollTop += scrollSpeed;

        if (
            featureScroll.scrollTop + featureScroll.clientHeight >=
            featureScroll.scrollHeight
        ) {
            featureScroll.scrollTop = 0;
        }

        animationFrame = requestAnimationFrame(autoScroll);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isScrolling) {
                    isScrolling = true;
                    autoScroll();
                }
            } else {
                isScrolling = false;
                cancelAnimationFrame(animationFrame);
            }
        });
    }, {
        threshold: 0.8
    });

    observer.observe(featureSection);
}