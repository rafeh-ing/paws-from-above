// 1. Your existing smooth scrolling (keep this exactly as is)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 2. Your counter animation (now with performance improvements)
function animateCounter() {
    const counter = document.querySelector('.highlight');
    if (!counter) return;
    
    const target = 100;
    let count = 0;
    const increment = target / 20; // Smoother animation
    
    const interval = setInterval(() => {
        count += increment;
        if (count >= target) {
            clearInterval(interval);
            counter.textContent = target + '+';
        } else {
            counter.textContent = Math.floor(count) + '+';
        }
    }, 50);
}

// 3. Back-to-top button (new addition)
const backToTop = document.createElement('a');
backToTop.href = '#';
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
});

backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initialize everything when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Uncomment to enable counter:
    // animateCounter();
    
    // Other initializations can go here
});