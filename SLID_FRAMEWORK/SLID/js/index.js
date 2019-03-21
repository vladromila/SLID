let albums = document.querySelectorAll('.album');
function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'importantfiles/setupData.json', true);
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
  constructor({ album }) {

    this.album = album;
    this.children = album.children
    this.carousel = {};
    this.responsive = this.album.attributes.responsive.value

    //VARIABLES
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

    //Window resize handler
    this.windowResizeHandler = this.windowResizeHandler.bind(this);
  }

  dragStart(e) {
    this.startX = e.clientX;
  }
  dragOver(e) {
    e.preventDefault();
    this.carousel.style.transition = "none 0s ease 0s"
    this.carousel.style.transform = `translate3d(${-this.elementIndex * this.album.getBoundingClientRect().width - (this.startX - e.clientX)}px,0,0)`;
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
    }
    else {
      this.dragLeft = false
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
    this.carousel.style.transition = "none 0s ease 0s"
    this.carousel.style.transform = `translate3d(${-(this.children.length - 3) * this.album.getBoundingClientRect().width}px, 0px, 0px)`
    this.elementIndex = this.children.length - 3;
    this.previousDisable = false;
    this.carousel.removeEventListener("transitionend", this.transitionBeginningHandler);
  }
  transitionEndHandler() {
    this.carousel.style.transition = "none 0s ease 0s"
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
      this.carousel.style.transition = "transform 0.5s cubic-bezier(0.215, 0.610, 0.355, 1)"
      this.carousel.style.transform = `translate3d(${-(--this.elementIndex * this.album.getBoundingClientRect().width)}px,0,0)`;
      this.checkStart();
    }
  }
  goNext() {
    if (this.nextDisable === false) {
      this.nextDisable = true;
      this.carousel.style.transition = "transform 0.5s cubic-bezier(0.215, 0.610, 0.355, 1)"
      this.carousel.style.transform = `translate3d(${-(++this.elementIndex * this.album.getBoundingClientRect().width)}px,0,0)`;
      this.checkEnd();
    }
  }

  windowResizeHandler() {
    this.responsive.forEach(bp => {
      console.log(bp)
      if (window.matchMedia(`(min-width: ${bp.width}px)`).matches) {
        this.album.style.width = bp.style.width;
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
    this.carousel.draggable = true;
    this.children = carousel.childNodes;
    this.carousel.addEventListener("dragstart", this.dragStart);
    this.carousel.addEventListener("dragover", this.dragOver);
    this.carousel.addEventListener("dragend", this.dragEnd);

    let leftArrow = document.createElement("div");
    leftArrow.classList.add("left-arrow");
    let rightArrow = document.createElement("div");
    rightArrow.classList.add("right-arrow");
    this.album.appendChild(leftArrow);
    this.album.appendChild(rightArrow);
    rightArrow.onclick = this.goNext;
    leftArrow.onclick = this.goPrev;

    window.addEventListener("resize", this.windowResizeHandler);
    console.log(this.album.attributes.responsive.value);
  }
}

albums.forEach((alb, i) => {
  let s = new Slid({ album: alb });
  s.setUp();
})
