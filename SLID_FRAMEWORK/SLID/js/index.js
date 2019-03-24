let firebaseApp = document.createElement("script");
firebaseApp.src = "https://www.gstatic.com/firebasejs/5.8.2/firebase-app.js";
document.getElementById("SLIDScript").parentElement.insertBefore(firebaseApp, document.getElementById("SLIDScript"));
let firebaseDatabase = document.createElement("script");
firebaseDatabase.src = "https://www.gstatic.com/firebasejs/5.8.2/firebase-database.js";
document.getElementById("SLIDScript").parentElement.insertBefore(firebaseDatabase, document.getElementById("SLIDScript"));


function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', document.getElementById("setupData").attributes.src.value, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

loadJSON(function (response) {
  console.log(JSON.parse(response));
});

class Slid {
  constructor(
    { album,
      id,
      index,
      responsive,
      autoSlide,
      autoSlideTime,
      autoSlideHoverPause,
      dragEnabled,
      showArrows,
      animationNumber,
      customTransition,
      cloudControlEnabled,
      cliControlEnabled,
      voiceControlEnabled,
      platformControlEnabled
    }) {
    this.album = album;
    this.children = album.children
    this.carousel = {};
    this.leftArrow = null;
    this.rightArrow = null;
    this.responsive = [];
    this.animations = ["-webkit-transform 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)"]

    //SLID Variables
    this.id = id || "1mILdKuZZRbICLqw2IprhtmqO9g2";
    this.index = index;
    this.responsive = responsive || [];
    this.autoSlide = autoSlide || false;
    this.autoSlideTime = autoSlideTime || 1000;
    this.autoSlideHoverPause = autoSlideHoverPause || true;
    this.dragEnabled = dragEnabled || true;
    this.showArrows = showArrows || true;
    this.animationNumber = animationNumber || 1;
    this.customTransition = customTransition || null;
    this.cloudControlEnabled = cloudControlEnabled || true;
    this.cliControlEnabled = cliControlEnabled || false;
    this.voiceControlEnabled = voiceControlEnabled || false;
    this.platformControlEnabled = platformControlEnabled || false;


    //VARIABLES
    //setTimeout variables
    this.autoSlideTimer = null;
    //Slide counter for translate3D logic
    this.elementIndex = 0;

    //Variable that saves the x coordonate of the initial drag event
    this.startX = 0;

    //Drag helper variables
    this.dragLeft = false;

    //Spam blockers variables
    this.nextDisable = false;
    this.previousDisable = false;

    //Drag Functions
    this.dragStart = this.dragStart.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dragLeave = this.dragLeave.bind(this);
    this.dragEnd = this.dragEnd.bind(this);

    //CLI,CloudControl or Arrows functions
    this.goNext = this.goNext.bind(this);
    this.goPrev = this.goPrev.bind(this);

    //Position check handlers
    this.checkEnd = this.checkEnd.bind(this);

    //eventListeners handlers
    this.transitionBeginningHandler = this.transitionBeginningHandler.bind(this);
    this.transitionEndHandler = this.transitionEndHandler.bind(this);

    //Slide next/previous allow functions
    this.previousEnable = this.previousEnable.bind(this);
    this.nextEnable = this.nextEnable.bind(this);

    //AutoSlide handlers
    this.carouselMouseOver = this.carouselMouseOver.bind(this);
    this.carouselMouseLeave = this.carouselMouseLeave.bind(this);

    //Window resize handler
    this.windowResizeHandler = this.windowResizeHandler.bind(this);

    //Control functions
    this.handleFirebaseControl = this.handleFirebaseControl.bind(this);
  }

  dragStart(e) {
    if (this.showArrows === true) {
      this.leftArrow.style.display = "none";
      this.rightArrow.style.display = "none";
    }
    this.startX = e.clientX;
  }
  dragOver(e) {
    clearTimeout(this.autoSlideTimer);
    e.preventDefault();
    this.carousel.style.transition = "none 0s ease 0s"
    this.carousel.style.transform = `translate3d(${-this.elementIndex * this.album.getBoundingClientRect().width - (this.startX - e.clientX)}px,0,0)`;
  }
  dragLeave(e) {
    if (this.dragLeft === false) {
      this.dragLeft = true;
      this.carousel.removeEventListener("dragover", this.dragOver);
      this.carousel.style.transition = `-webkit-transform 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)`
      if (Math.abs(this.startX - e.clientX) >= this.album.getBoundingClientRect().width / 6)
        if (this.startX - e.clientX > 0)
          this.carousel.style.transform = `translate3d(${-++this.elementIndex * this.album.getBoundingClientRect().width}px,0,0)`;
        else
          this.carousel.style.transform = `translate3d(${-(--this.elementIndex * this.album.getBoundingClientRect().width)}px,0,0)`;
      else
        this.carousel.style.transform = `translate3d(${-this.elementIndex * this.album.getBoundingClientRect().width}px,0,0)`;
      this.checkStart();
      this.checkEnd();
      if (this.showArrows === true) {
        this.leftArrow.style.display = "";
        this.rightArrow.style.display = "";
      }
    }
  }
  dragEnd(e) {
    if (this.dragLeft === false) {
      this.carousel.style.transition = `-webkit-transform 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)`
      if (Math.abs(this.startX - e.clientX) >= this.album.getBoundingClientRect().width / 6)
        if (this.startX - e.clientX > 0)
          this.carousel.style.transform = `translate3d(${-++this.elementIndex * this.album.getBoundingClientRect().width}px,0,0)`;
        else
          this.carousel.style.transform = `translate3d(${-(--this.elementIndex * this.album.getBoundingClientRect().width)}px,0,0)`;
      else
        this.carousel.style.transform = `translate3d(${-this.elementIndex * this.album.getBoundingClientRect().width}px,0,0)`;
      this.checkStart();
      this.checkEnd();
      if (this.showArrows === true) {
        this.leftArrow.style.display = "";
        this.rightArrow.style.display = "";
      }
    }
    else {
      this.dragLeft = false;
      this.carousel.addEventListener("dragover", this.dragOver);
    }
  }

  checkStart() {
    if (this.elementIndex === -1) {
      this.previousDisable = true;
      this.carousel.addEventListener("transitionend", this.transitionBeginningHandler)
    }
    else {
      this.carousel.addEventListener("transitionend", this.previousEnable)
    }
  }
  checkEnd() {
    if (this.elementIndex === this.children.length - 2) {
      this.nextDisable = true;
      this.carousel.addEventListener("transitionend", this.transitionEndHandler)
    }
    else {
      this.carousel.addEventListener("transitionend", this.nextEnable)
    }
  }

  transitionBeginningHandler() {
    this.carousel.style.transition = "none"
    this.carousel.style.transform = `translate3d(${-(this.children.length - 3) * this.album.getBoundingClientRect().width}px, 0px, 0px)`
    this.elementIndex = this.children.length - 3;
    this.previousDisable = false;
    this.carousel.removeEventListener("transitionend", this.transitionBeginningHandler);
  }
  transitionEndHandler() {
    this.carousel.style.transition = "none"
    this.carousel.style.transform = `translate3d(0px, 0px, 0px)`
    this.elementIndex = 0;
    this.nextDisable = false;
    this.carousel.removeEventListener("transitionend", this.transitionEndHandler);
  }

  previousEnable() {
    this.previousDisable = false
  }
  nextEnable() {
    this.nextDisable = false
  }

  goPrev() {
    if (this.previousDisable === false) {
      this.previousDisable = true;
      this.carousel.style.transition = this.animations[this.animationNumber - 1];
      this.carousel.style.transform = `translate3d(${-(--this.elementIndex * this.album.getBoundingClientRect().width)}px,0,0)`;
      this.checkStart();
    }
  }
  goNext() {
    if (this.nextDisable === false) {
      this.nextDisable = true;
      this.carousel.style.transition = this.animations[this.animationNumber - 1];
      this.carousel.style.transform = `translate3d(${-(++this.elementIndex * this.album.getBoundingClientRect().width)}px,0,0)`;
      this.checkEnd();
    }
  }

  windowResizeHandler() {
    this.responsive.forEach(bp => {
      if (window.matchMedia(`(min-width: ${bp.width}px)`).matches) {
        this.album.style.width = bp.style.width;
      }
    })
    this.carousel.style.transition = "none 0s ease 0s"
    this.carousel.style.transform = `translate3d(${-this.elementIndex * this.album.getBoundingClientRect().width}px, 0px, 0px)`;
  }

  autoSlideHandler() {
    this.autoSlideTimer = setTimeout(() => {
      this.goNext();
      this.autoSlideHandler();
    }, this.autoSlideTime)
  }

  carouselMouseOver() {
    clearTimeout(this.autoSlideTimer)
  }
  carouselMouseLeave() {
    this.autoSlideHandler();
  }

  handleFirebaseControl() {
    firebase.database().ref(`/${this.id}/controls/`)
      .on("value", snapshot => {
        if (snapshot.val()) {
          if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].type === "nextSlide") {
            this.goNext();
          }
          else
            if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].type === "nextSlide") {
              this.goPrev();
            }
        }
      })
  }

  setUp() {
    let carousel = document.createElement("div");
    carousel.classList = "carousel";

    let arr = Array.prototype.slice.call(this.children);

    let firstDuplicate = arr[0].cloneNode(true);
    let finalDuplicate = arr[arr.length - 1].cloneNode(true);

    arr.unshift(finalDuplicate);
    arr.push(firstDuplicate);

    arr.forEach((el, i) => {
      let carouselElement = document.createElement("div");
      carouselElement.className = `carousel-element ${i}`;
      carouselElement.appendChild(el);
      carousel.appendChild(carouselElement);
    })

    this.album.appendChild(carousel);
    this.carousel = carousel;
    this.children = carousel.childNodes;

    if (this.dragEnabled === true) {
      this.carousel.addEventListener("dragstart", this.dragStart);
      this.carousel.addEventListener("dragover", this.dragOver);
      this.carousel.addEventListener("dragleave", this.dragLeave);
      this.carousel.addEventListener("dragend", this.dragEnd);
    }

    if (this.showArrows === true) {
      let leftArrow = document.createElement("div");
      leftArrow.classList.add("left-arrow");
      let rightArrow = document.createElement("div");
      rightArrow.classList.add("right-arrow");

      this.album.appendChild(leftArrow);
      this.album.appendChild(rightArrow);
      this.rightArrow = rightArrow;
      this.leftArrow = leftArrow;

      rightArrow.onclick = this.goNext;
      leftArrow.onclick = this.goPrev;
      if (this.autoSlide === true && this.autoSlideHoverPause === true) {
        rightArrow.onmouseover = this.carouselMouseOver;
        rightArrow.onmouseleave = this.carouselMouseLeave;
        leftArrow.onmouseover = this.carouselMouseOver;
        leftArrow.onmouseleave = this.carouselMouseLeave
      }
    }
    if (this.autoSlide === true) {
      if (this.autoSlideHoverPause === true) {
        this.album.onmouseover = this.carouselMouseOver;
        this.album.onmouseleave = this.carouselMouseLeave;
      }
      this.autoSlideHandler();
    }

    window.addEventListener("resize", this.windowResizeHandler);

    if (this.cliControlEnabled === true || this.cloudControlEnabled === true || this.platformControlEnabled === true)
      this.handleFirebaseControl();
  }
  start() {
    this.setUp();
  }
}

firebaseApp.onload = async () => {
  firebaseDatabase.onload = async () => {
    document.querySelectorAll(".album").forEach(album => {
      let s = new Slid({ album: album });
      s.start();
    })
  }
}
