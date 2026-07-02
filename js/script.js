(function () {
  'use strict';

  /* ===== Мобильное меню ===== */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  /* ===== Тень шапки при скролле ===== */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* ===== Анимация появления элементов ===== */
  var fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ===== Обработка форм ===== */
  document.querySelectorAll('form.form__el').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.querySelector('.form__success');
      if (success) {
        form.querySelectorAll('.form__group, .form__submit').forEach(function (el) {
          el.style.display = 'none';
        });
        success.classList.add('active');
      }
    });
  });

  /* ===== Главный слайдер (hero) ===== */
  var slider = document.getElementById('heroSlider');
  if (slider) {
    var slides = slider.querySelectorAll('.slide');
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');
    var dotsContainer = document.getElementById('sliderDots');
    var current = 0;
    var total = slides.length;
    var autoplayInterval = null;
    var progressInterval = null;
    var progressEl = document.getElementById('sliderProgress');
    var autoplayDelay = 6000;
    var progressStart = 0;

    /* Создаём точки */
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var dot = document.createElement('button');
        dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Слайд ' + (idx + 1));
        dot.addEventListener('click', function () {
          goToSlide(idx);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      })(i);
    }

    var dots = dotsContainer.querySelectorAll('.slider-dot');

    function goToSlide(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + total) % total;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      resetProgress();
    }

    function nextSlide() {
      goToSlide(current + 1);
    }

    function prevSlide() {
      goToSlide(current - 1);
    }

    function resetProgress() {
      if (progressEl) {
        progressEl.style.transition = 'none';
        progressEl.style.width = '0%';
        setTimeout(function () {
          progressEl.style.transition = 'width ' + (autoplayDelay / 1000) + 's linear';
          progressEl.style.width = '100%';
        }, 50);
      }
    }

    function startAutoplay() {
      stopAutoplay();
      resetProgress();
      autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
      if (progressEl) {
        progressEl.style.transition = 'none';
        progressEl.style.width = progressEl.style.width || '0%';
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        resetAutoplay();
      });
    }

    /* Свайп на мобильных */
    var touchStartX = 0;
    var touchEndX = 0;

    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoplay();
    }, { passive: true });

    /* Пауза при наведении мыши */
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    /* Клавиатура */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay();
      }
    });

    startAutoplay();
  }

})();
