function appendCardToggle(){
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach(card => {
    card.addEventListener("click", () => handleCardToggle(card));
  });

  document.querySelectorAll(".project-card").forEach(card => {
    const btnBack = card.querySelector(".back-button");
    const btnClose = card.querySelector(".close-button");

    if(btnBack){
      btnBack.addEventListener("click", (e) => {
        e.stopPropagation(); // penting! biar ga trigger open lagi
        closeCard(card);
      });
    }
    if(btnClose){
      btnClose.addEventListener("click", (e) => {
        e.stopPropagation(); // penting! biar ga trigger open lagi
        closeCard(card);
      });
    }
  });
}

function appendCardSlider(){
  document.querySelectorAll(".carousel-wrapper").forEach(wrapper => {
    const carousel = wrapper.querySelector(".carousel");
    const dots = wrapper.querySelectorAll(".dot");

    let index = 0;
    let startX = 0;
    let isDragging = false;
    let interval;

    function update() {
    carousel.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle("bg-green-400", i === index);
        dot.classList.toggle("bg-gray-300", i !== index);
    });
    }

    // ===== AUTO SLIDE =====
    function startAutoSlide() {
    interval = setInterval(() => {
        index = (index + 1) % dots.length;
        update();
    }, 4000);
    }

    function stopAutoSlide() {
    clearInterval(interval);
    }

    startAutoSlide();

    // ===== DOT CLICK =====
    dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        index = i;
        update();
    });
    });

    // ===== DRAG =====
    carousel.addEventListener("mousedown", startDrag);
    carousel.addEventListener("touchstart", startDrag);

    carousel.addEventListener("mousemove", drag);
    carousel.addEventListener("touchmove", drag);

    carousel.addEventListener("mouseup", endDrag);
    carousel.addEventListener("mouseleave", endDrag);
    carousel.addEventListener("touchend", endDrag);

    function startDrag(e) {
    isDragging = true;
    startX = getX(e);
    carousel.style.transition = "none";
    stopAutoSlide(); // stop saat user interaksi
    }

    function drag(e) {
    if (!isDragging) return;

    const currentX = getX(e);
    const diff = currentX - startX;

    const move = -index * carousel.offsetWidth + diff;
    carousel.style.transform = `translateX(${move}px)`;
    }

    function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    const diff = getX(e) - startX;

    if (diff < -50 && index < dots.length - 1) index++;
    if (diff > 50 && index > 0) index--;

    carousel.style.transition = "transform 0.5s";
    update();
    startAutoSlide(); // lanjut lagi
    }

    function getX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    }

    // ===== OPTIONAL: pause saat hover =====
    wrapper.addEventListener("mouseenter", stopAutoSlide);
    wrapper.addEventListener("mouseleave", startAutoSlide);
  });
}

function handleCardToggle(card){
  const isOpen = card.classList.contains("is-open");

  if(isOpen){
    closeCard(card);
  } else {
    // close other cards (optional, biar cuma 1 terbuka)
    document.querySelectorAll(".project-card.is-open").forEach(openCardEl => {
      if(openCardEl !== card) closeCard(openCardEl);
    });

    openCard(card);
  }
}

function openCard(card){

  const elSection = document.getElementById("project");
  const elCardContainer = document.getElementById("project-card-container");

  const elCarouselContainer = card.querySelector(".carousel-container");
  const elCarouselWrapper = card.querySelector(".carousel-wrapper");
  const elHeroContainer = card.querySelector(".content-hero-container");
  const elContentContainer = card.querySelector(".content-container");
  const elMainTitle = card.querySelector(".project-main-title");
  const elExpandedContainer = card.querySelector(".expanded-content-container");
  const elQuickInfo = card.querySelector(".expanded-content-quick-info-1");
  const elStats = card.querySelector(".project-stats");
  const elBackButton = card.querySelector(".back-button");
  document.querySelectorAll(".project-card").forEach(elCard => {
    if(elCard !== card){
        elCard.classList.add("opacity-0");
        setTimeout(() => {
            elCard.classList.add("hidden");
        }, 500);
    }
  });
  // scroll to top
  const top = card.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: top,
    behavior: "smooth"
  });

  // add padding to carousel
  elCarouselContainer.classList.add("px-[26px]","pt-[26px]","xl:pb-[60px]","md:px-[120px]");

  // add radius to carousel
  elCarouselWrapper.classList.add("rounded-[12px]");
  
  // change col span
  elCarouselWrapper.classList.replace("xl:col-span-5", "xl:col-span-3");
  elHeroContainer.classList.replace("xl:col-span-5", "xl:col-span-2");

  // remove main title padding
  elHeroContainer.classList.remove("px-[20px]");
  elHeroContainer.classList.remove("py-[32px]", "pt-[32px]");
  elHeroContainer.classList.add("pt-[32px]", "xl:pt-[0px]");

  // expand card
  elCardContainer.classList.replace("max-w-[1024px]", "max-w-[2500px]");
  card.classList.add('h-screen');
  card.classList.remove('md:w-[calc(50%-16px)]', 'lg:w-[calc(33.333%-21.33px)]');          
  card.classList.remove("xl:max-h-[520px]");
  elSection.classList.remove("px-[32px]", "md:px-[120px]");

  // show back button
  elBackButton.classList.replace("hidden", "flex");
  
  // reduce stats opacity
  elStats.classList.add('opacity-0');

  // remove main description margin
  elContentContainer.classList.add("pl-[26px]", "pr-[26px]", "pb-[32px]");
  elContentContainer.classList.remove("py-[32px]");
  
  elMainTitle.classList.replace("text-[18px]","text-[24px]");

  setTimeout(() => {
    card.querySelector(".expanded-content-1").classList.remove("hidden");

    // extent card to fit to screen
    card.classList.add("fixed", "top-0", "left-0", "w-full", "z-20", "overflow-y-auto");
    card.classList.remove("rounded-[12px]");
    
    // hide stats completly
    elStats.classList.add("hidden");
    elContentContainer.classList.remove("hidden");
    elContentContainer.classList.replace("px-[20px]", "px-[26px]");
    
    elExpandedContainer.classList.remove("hidden");              
  }, 500);

  for (let index = 1; index <= 6; index++) {
    setTimeout(() => {
      card.querySelector(".expanded-content-" + index).classList.replace("opacity-0","opacity-100");
      card.querySelector(".expanded-content-" + index).classList.replace("translate-y-4","translate-y-0");

      if(index == 2){
        elQuickInfo.classList.replace("opacity-0","opacity-100");
        elQuickInfo.classList.replace("translate-y-4","translate-y-0");
      }
    }, 500 + (index * 500));
  }

  card.classList.add("is-open");
}

function closeCard(card){
  card.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  const elSection = document.getElementById("project");
  const elCardContainer = document.getElementById("project-card-container");

  const elCarouselContainer = card.querySelector(".carousel-container");
  const elCarouselWrapper = card.querySelector(".carousel-wrapper");
  const elHeroContainer = card.querySelector(".content-hero-container");
  const elContentContainer = card.querySelector(".content-container");
  const elMainTitle = card.querySelector(".project-main-title");
  const elExpandedContainer = card.querySelector(".expanded-content-container");
  const elQuickInfo = card.querySelector(".expanded-content-quick-info-1");
  const elStats = card.querySelector(".project-stats");
  const elBackButton = card.querySelector(".back-button");

  document.querySelectorAll(".project-card").forEach(elCard => {
    if(elCard !== card){
      elCard.classList.remove("opacity-0");
      
      if(!elCard.classList.contains("secondary-extra-card")){
        setTimeout(() => {
            elCard.classList.remove("hidden");
        }, 500);
      }
    }
  });
  // 1. LANGSUNG shrink card (no delay)
  card.classList.remove("fixed", "top-0", "left-0", "w-full", "z-20", "overflow-y-auto");
  card.classList.add("rounded-[12px]");

  card.classList.remove('h-screen');
  card.classList.add('md:w-[calc(50%-16px)]', 'lg:w-[calc(33.333%-21.33px)]');          
  card.classList.add("xl:max-h-[520px]");
  elCardContainer.classList.replace("max-w-[2500px]", "max-w-[1024px]");

  // layout langsung balik
  elCarouselWrapper.classList.replace("xl:col-span-3", "xl:col-span-5");
  elHeroContainer.classList.replace("xl:col-span-2", "xl:col-span-5");

  elCarouselContainer.classList.remove("px-[26px]","pt-[26px]","xl:pb-[60px]","md:px-[120px]");
  elCarouselWrapper.classList.remove("rounded-[12px]");

  elHeroContainer.classList.add("px-[20px]", "py-[32px]");
  elHeroContainer.classList.remove("xl:pt-[0px]");

  elSection.classList.add("px-[32px]", "md:px-[120px]");

  // 2. BARU animasi konten (paralel, ga nahan shrink)
  for (let index = 1; index <= 6; index++) {
    setTimeout(() => {
      const el = card.querySelector(".expanded-content-" + index);
      if (!el) return;

      el.classList.replace("opacity-100","opacity-0");
      el.classList.replace("translate-y-0","translate-y-4");

      if(index == 2){
        elQuickInfo.classList.replace("opacity-100","opacity-0");
        elQuickInfo.classList.replace("translate-y-0","translate-y-4");
      }
    }, index * 40);
  }

  // 3. cleanup setelah animasi (tidak mengganggu awal)
  setTimeout(() => {
    elExpandedContainer.classList.add("hidden");
    card.querySelector(".expanded-content-1")?.classList.add("hidden");

    elBackButton.classList.replace("flex", "hidden");

    elStats.classList.remove("hidden");
    elStats.classList.remove("opacity-0");

    elContentContainer.classList.remove("pl-[26px]", "pr-[26px]", "pb-[32px]");
    elContentContainer.classList.add("py-[32px]");
    elContentContainer.classList.replace("px-[26px]", "px-[20px]");
    elContentContainer.classList.add("hidden");

    elMainTitle.classList.replace("text-[24px]","text-[18px]");

    card.classList.remove("is-open");

  }, 300);
}

document.querySelectorAll(".project-card").forEach(card => {
  const btnBack = card.querySelector(".back-button");

  if(btnBack){
    btnBack.addEventListener("click", (e) => {
      e.stopPropagation(); // penting! biar ga trigger open lagi
      closeCard(card);
    });
  }
});