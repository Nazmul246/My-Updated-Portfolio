// Form validation and submission
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

// Validation patterns
const validationRules = {
  firstName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
  },
  lastName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  subject: {
    required: true,
    minLength: 5,
  },
  message: {
    required: true,
    minLength: 20,
  },
};

// Validate individual field
function validateField(fieldName, value) {
  const rules = validationRules[fieldName];
  const errors = [];

  if (rules.required && !value.trim()) {
    errors.push("This field is required");
  }

  if (
    value.trim() &&
    rules.minLength &&
    value.trim().length < rules.minLength
  ) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  if (value.trim() && rules.pattern && !rules.pattern.test(value)) {
    if (fieldName === "email") {
      errors.push("Please enter a valid email address");
    } else if (fieldName === "firstName" || fieldName === "lastName") {
      errors.push("Only letters and spaces are allowed");
    }
  }

  return errors;
}

// Show field error
function showFieldError(fieldName, errors) {
  const field = document.getElementById(fieldName);
  const errorDiv = document.getElementById(fieldName + "Error");

  if (errors.length > 0) {
    field.classList.add("invalid");
    field.classList.remove("valid");
    errorDiv.textContent = errors[0];
    errorDiv.style.display = "block";
  } else {
    field.classList.remove("invalid");
    field.classList.add("valid");
    errorDiv.style.display = "none";
  }
}

// Real-time validation
Object.keys(validationRules).forEach((fieldName) => {
  const field = document.getElementById(fieldName);

  field.addEventListener("blur", () => {
    const errors = validateField(fieldName, field.value);
    showFieldError(fieldName, errors);
  });

  field.addEventListener("input", () => {
    if (field.classList.contains("invalid")) {
      const errors = validateField(fieldName, field.value);
      showFieldError(fieldName, errors);
    }
  });
});

// Form submission
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Hide previous messages
  successMessage.style.display = "none";
  errorMessage.style.display = "none";

  // Validate all fields
  let isValid = true;
  const formData = new FormData(contactForm);

  Object.keys(validationRules).forEach((fieldName) => {
    const value = formData.get(fieldName) || "";
    const errors = validateField(fieldName, value);
    showFieldError(fieldName, errors);

    if (errors.length > 0) {
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  // Show loading state
  submitBtn.classList.add("loading");
  submitBtn.textContent = "Sending...";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      // Show success message
      successMessage.style.display = "block";
      contactForm.reset();

      // Remove validation classes
      document.querySelectorAll(".form-control").forEach((field) => {
        field.classList.remove("valid", "invalid");
      });

      // Scroll to success message
      successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    errorMessage.style.display = "block";
  } finally {
    // Reset button state
    submitBtn.classList.remove("loading");
    submitBtn.textContent = "Send Message";
  }
});

// Smooth animations on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = "0s";
      entry.target.style.animationPlayState = "running";
    }
  });
}, observerOptions);

// Observe contact items for stagger animation
document.querySelectorAll(".contact-item").forEach((item, index) => {
  item.style.opacity = "0";
  item.style.transform = "translateX(-30px)";
  item.style.transition = "all 0.6s ease";
  item.style.transitionDelay = `${index * 0.1}s`;

  observer.observe(item);
});

// Animate contact items on scroll
const contactObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll(".contact-item");
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateX(0)";
        }, index * 100);
      });
    }
  });
}, observerOptions);

contactObserver.observe(document.querySelector(".contact-details"));

// Add ripple effect to submit button
submitBtn.addEventListener("click", function (e) {
  const ripple = document.createElement("span");
  const rect = this.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.classList.add("ripple");

  this.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
});

// Add ripple CSS
const style = document.createElement("style");
style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);
