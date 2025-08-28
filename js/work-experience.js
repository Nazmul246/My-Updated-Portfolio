// Enhanced scroll animation
function animateOnScroll() {
  const elements = document.querySelectorAll(".timeline-item");
  const windowHeight = window.innerHeight;

  elements.forEach((element, index) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 200);
    }
  });
}

// Intersection Observer for better performance
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running";
    }
  });
}, observerOptions);

// Observe timeline items
document.querySelectorAll(".timeline-item").forEach((item) => {
  observer.observe(item);
});

// Add smooth scrolling behavior
window.addEventListener("scroll", animateOnScroll);

// Initialize animations on page load
document.addEventListener("DOMContentLoaded", () => {
  animateOnScroll();

  // Add stagger animation to skill tags
  document.querySelectorAll(".timeline-content").forEach((content) => {
    const skillTags = content.querySelectorAll(".skill-tag");
    skillTags.forEach((tag, index) => {
      tag.style.animationDelay = `${index * 0.1}s`;
    });
  });
});

// Add hover effects for timeline items
document.querySelectorAll(".timeline-content").forEach((content) => {
  content.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-8px) scale(1.02)";
  });

  content.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});
