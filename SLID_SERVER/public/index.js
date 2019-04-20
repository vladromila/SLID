var is_chrome = /chrome/i.test(navigator.userAgent);

let firebaseApp = document.createElement("script");
firebaseApp.src = "https://www.gstatic.com/firebasejs/5.8.2/firebase-app.js";
document.getElementById("SLIDScript").parentElement.insertBefore(firebaseApp, document.getElementById("SLIDScript"));
let firebaseDatabase = document.createElement("script");
firebaseDatabase.src = "https://www.gstatic.com/firebasejs/5.8.2/firebase-database.js";
document.getElementById("SLIDScript").parentElement.insertBefore(firebaseDatabase, document.getElementById("SLIDScript"));

let selectedForVoice = -1;
let isVoiceCommandOn = false;

var recognition = null;
var speechRecognitionList = null;
if (is_chrome === true) {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

  var commands = ["next", "nextslide", "next slide", "prev", "previous", "previousslide", "previous slide"];
  var grammar = '#JSGF V1.0; grammar colors; public <command> = ' + commands.join(' | ') + ' ;'

  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

if (recognition)
  recognition.onnomatch = function (e) {
    recognition.abort();
    isVoiceCommandOn = false;
  }
function loadJSON(callback) {
  if (document.getElementById("setupData")) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', document.getElementById("setupData").attributes.src.value, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }
  else
    callback(false);
}


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
      cloudControlEnabled,
      cliControlEnabled,
      cliWebControlEnabled,
      voiceControlEnabled,
      arrowsColor
    }) {
    this.album = album;
    this.children = album.children
    this.carousel = {};
    this.leftArrow = null;
    this.rightArrow = null;
    this.responsive = [];
    this.animations = ["-webkit-transform 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)"]


    //SLID variables
    this.id = id || null;
    this.index = index || null;
    this.responsive = responsive ? responsive.sort((a, b) => (a.width > b.width) ? 1 : -1) : [];
    this.autoSlide = autoSlide !== undefined ? autoSlide : false;
    this.autoSlideTime = autoSlideTime || 1000;
    this.autoSlideHoverPause = autoSlideHoverPause !== undefined ? autoSlideHoverPause : false;
    this.dragEnabled = dragEnabled !== undefined ? dragEnabled : true;
    this.showArrows = showArrows !== undefined ? showArrows : true;
    this.cloudControlEnabled = cloudControlEnabled || true;
    this.cliControlEnabled = cliControlEnabled !== undefined ? cliControlEnabled : true;
    this.cliWebControlEnabled = cliWebControlEnabled !== undefined ? cliWebControlEnabled : true;
    this.voiceControlEnabled = voiceControlEnabled !== undefined ? voiceControlEnabled : true;
    this.arrowsColor = arrowsColor || "#333";


    //letIABLES
    //setTimeout letiables
    this.autoSlideTimer = null;
    //Slide counter for translate3D logic
    this.elementIndex = 0;

    //letiable that saves the x coordonate of the initial drag event
    this.startX = 0;

    //Drag helper letiables
    this.dragLeft = false;

    //Spam blockers letiables
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

    //arrowListener handler and letiable
    this.isArrowControlEnaled = true;
    this.arrowListener = this.arrowListener.bind(this);

    //onClick handlers and variables
    this.onClick = this.onClick.bind(this);

    //Voice command handlers
    this.onRecognitionResult = this.onRecognitionResult.bind(this);
    this.responsiveHandler = this.responsiveHandler.bind(this);

    this.onMatchChange = this.onMatchChange.bind(this);

    this.addFilesFromServer = this.addFilesFromServer.bind(this);
  }

  dragStart(e) {
    e.dataTransfer.setData("text/url", "slid.com");
    let img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);
    if (this.showArrows === true) {
      this.leftArrow.style.display = "none";
      this.rightArrow.style.display = "none";
    }
    this.startX = e.clientX;
  }
  dragOver(e) {
    e.preventDefault();
    this.carousel.style.transition = "none 0s ease 0s"
    this.carousel.style.transform = `translate3d(${-this.elementIndex * this.album.getBoundingClientRect().width - (this.startX - e.clientX)}px,0,0)`;
  }
  dragLeave(e) {
    if (this.dragLeft === false) {
      let rect = this.album.getBoundingClientRect();
      if (e.x >= rect.left + rect.width || e.x <= rect.left
        || e.y >= rect.top + rect.height || e.y <= rect.top) {
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
    if (this.elementIndex === -1) {
      this.carousel.style.transition = "none"
      this.carousel.style.transform = `translate3d(${-(this.children.length - 3) * this.album.getBoundingClientRect().width}px, 0px, 0px)`
      this.elementIndex = this.children.length - 3;
    }
    this.previousDisable = false;
    this.carousel.removeEventListener("transitionend", this.transitionBeginningHandler);
  }
  transitionEndHandler() {
    this.carousel.style.transition = "none"
    this.carousel.style.transform = `translate3d(0, 0, 0)`
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
      this.carousel.style.transition = "-webkit-transform 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)";
      this.carousel.style.transform = `translate3d(${-(--this.elementIndex * this.album.getBoundingClientRect().width)}px,0,0)`;
      this.checkStart();
    }
  }
  goNext() {
    if (this.nextDisable === false) {
      this.nextDisable = true;
      this.carousel.style.transition = "-webkit-transform 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)";
      this.carousel.style.transform = `translate3d(${-(++this.elementIndex * this.album.getBoundingClientRect().width)}px,0,0)`;
      this.checkEnd();
    }
  }

  windowResizeHandler() {
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
    this.isArrowControlEnaled = true;
    if (this.autoSlideHoverPause === true && this.autoSlide === true)
      clearTimeout(this.autoSlideTimer)
  }
  carouselMouseLeave() {
    this.isArrowControlEnaled = false;
    if (this.autoSlideHoverPause === true && this.autoSlide === true)
      this.autoSlideHandler();
  }
  addFilesFromServer() {
    fetch("https://slidserver.herokuapp.com/getonlineresources/", {
      method: "POST",

      method: "POST",
      mode: "cors",
      headers: {
        'Content-Type': 'application/json',
        'Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        uid: this.id
      })
    })
      .then(res => res.json())
      .then(res => {
        res.resources.forEach(file => {
          if (file.type === "image") {
            let newCarouselElement = document.createElement("div");
            newCarouselElement.classList = "carousel-element";
            let newItem = document.createElement("img");
            newItem.src = file.link;
            newCarouselElement.appendChild(newItem);
            this.carousel.insertBefore(newCarouselElement, this.children[this.children.length - 1])
          }
          if (file.type === "video") {
            let newCarouselElement = document.createElement("div");
            newCarouselElement.classList = "carousel-element";
            let newItem = document.createElement("video");
            newItem.src = file.link;
            newItem.controls = true;
            newCarouselElement.appendChild(newItem);
            this.carousel.insertBefore(newCarouselElement, this.children[this.children.length - 1])
          }
          if (file.type === "audio") {
            let newCarouselElement = document.createElement("div");
            newCarouselElement.classList = "carousel-element";
            let newItem = document.createElement("audio");
            newItem.src = file.link;
            newItem.controls = true;
            newCarouselElement.appendChild(newItem);
            this.carousel.insertBefore(newCarouselElement, this.children[this.children.length - 1])
          }
        })
        let clonedChild = this.children[this.children.length-1].cloneNode();
        this.carousel.replaceChild(clonedChild,this.children[0]);
      })
  }
  onMatchChange(i) {
    if (this.responsive[i].settings) {
      if (this.responsive[i].settings.albumWidth)
        this.album.style.width = this.responsive[i].settings.albumWidth;

      if (this.responsive[i].settings.albumHeight)
        this.album.style.height = this.responsive[i].settings.albumHeight;

      if (this.responsive[i].settings.albumBackgroundColor)
        this.album.style.backgroundColor = this.responsive[i].settings.albumBackgroundColor;

      if (this.responsive[i].settings.autoSlide)
        this.autoSlide = this.responsive[i].settings.autoSlide

      if (this.responsive[i].settings.autoSlideTime)
        this.autoSlideTime = this.responsive[i].settings.autoSlideTime

      if (this.responsive[i].settings.autoSlideHoverPause)
        this.autoSlideHoverPause = this.responsive[i].settings.autoSlideHoverPause;

      if (this.responsive[i].settings.dragEnabled)
        this.dragEnabled = this.responsive[i].settings.dragEnabled;

      if (this.responsive[i].settings.showArrows)
        this.showArrows = this.responsive[i].settings.showArrows;

      if (this.responsive[i].settings.cloudControlEnabled)
        this.cloudControlEnabled = this.responsive[i].settings.cloudControlEnabled;

      if (this.responsive[i].settings.cliControlEnabled)
        this.cliControlEnabled = this.responsive[i].settings.cliControlEnabled;

      if (this.responsive[i].settings.cliWebControlEnabled)
        this.cliWebControlEnabled = this.responsive[i].settings.cliWebControlEnabled;

      if (this.responsive[i].settings.voiceControlEnabled)
        this.voiceControlEnabled = this.responsive[i].settings.voiceControlEnabled;

      if (this.responsive[i].settings.arrowsColor) {
        this.leftArrow.style.backgroundColor = this.responsive[i].settings.arrowsColor;
        this.rightArrow.style.backgroundColor = this.responsive[i].settings.arrowsColor;
      }
    }
  }
  responsiveHandler() {
    let hadInitiallyMatched = false;
    for (let i = this.responsive.length - 1; i >= 0; i--) {
      {
        if (window.matchMedia(`(min-width: ${this.responsive[i].width}px)`).matches && hadInitiallyMatched === false) {
          this.onMatchChange(i);
          hadInitiallyMatched = true
        }
        window.matchMedia(`(min-width: ${this.responsive[i].width}px)`).addEventListener("change", (e) => {
          if (e.matches) {
            this.onMatchChange(i);
          }
          else {
            this.onMatchChange(i - 1);
          }
        })
      }
    }
  }


  handleFirebaseControl() {
    if (this.id)
      firebase.database().ref(`/${this.id}/controls/`)
        .on("value", snapshot => {
          if (snapshot.val()) {
            firebase.database().ref(`/${this.id}/controls/${Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]}`)
              .remove();
            if (this.cliControlEnabled === true || this.cloudControlEnabled === true || this.platformControlEnabled === true) {
              if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].type === "nextSlide") {
                if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].from === "cca") {
                  if (this.cloudControlEnabled === true)
                    this.goNext();
                }
                else
                  if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].from === "cli_web") {
                    if (this.cliWebControlEnabled === true)
                      this.goNext();
                  } else
                    if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].from === "cli")
                      if (this.cliControlEnabled === true)
                        this.goNext();
              }
              else
                if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].type === "previousSlide") {
                  if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].from === "cca") {
                    if (this.cloudControlEnabled === true)
                      this.goPrev();
                  }
                  else
                    if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].from === "cli_web") {
                      if (this.cliWebControlEnabled === true)
                        this.goPrev();
                    } else
                      if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].from === "cli")
                        if (this.cliControlEnabled === true)
                          this.goPrev();
                }
                else
                  if (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].type === "enableVoice") {
                    if (this.voiceControlEnabled === true)
                      if (isVoiceCommandOn === false) {
                        recognition.onresult = this.onRecognitionResult;
                        recognition.start();
                        isVoiceCommandOn = true;
                        selectedForVoice = this.id;
                      }
                  }
            }
          }
        })
  }

  arrowListener(e) {
    if (this.isArrowControlEnaled === true) {
      if (e.keyCode === 37)
        this.goPrev();
      if (e.keyCode === 39)
        this.goNext();
    }
  }

  onClick() {
    if (recognition) {
      if (this.voiceControlEnabled === true)
        if (isVoiceCommandOn === false) {
          isVoiceCommandOn = true;
          recognition.onresult = this.onRecognitionResult
          selectedForVoice = this.id;
          recognition.start();
        }
    }
  }

  onRecognitionResult(e) {
    if (this.index === selectedForVoice || this.id === selectedForVoice) {
      var last = event.results.length - 1;
      var command = event.results[last][0].transcript;
      if (command.toLowerCase().indexOf("next") > -1)
        this.goNext();
      else
        if (command.toLowerCase().indexOf("prev") > -1)
          this.goPrev();
    }
    isVoiceCommandOn = false;
    recognition.abort();
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
      el.draggable = false;
      carouselElement.appendChild(el);
      carouselElement.draggable = false;
      carousel.appendChild(carouselElement);
    })

    this.album.appendChild(carousel);
    this.carousel = carousel;
    this.carousel.draggable = true;
    this.children = carousel.childNodes;

    if (this.dragEnabled === true) {
      this.carousel.addEventListener("dragstart", this.dragStart);
      this.carousel.addEventListener("dragover", this.dragOver);
      this.album.addEventListener("dragleave", this.dragLeave);
      this.carousel.addEventListener("dragend", this.dragEnd);
    }
    else {
      this.carousel.draggable = false;
    }

    if (this.showArrows === true) {
      let leftArrow = document.createElement("div");
      leftArrow.classList.add("left-arrow");
      let rightArrow = document.createElement("div");
      rightArrow.classList.add("right-arrow");

      rightArrow.style.backgroundColor = this.arrowsColor;
      leftArrow.style.backgroundColor = this.arrowsColor;

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
    this.album.onmouseover = this.carouselMouseOver;
    this.album.onmouseleave = this.carouselMouseLeave;

    this.carousel.onclick = this.onClick;

    if (this.autoSlide === true) {
      this.autoSlideHandler();
    }

    window.addEventListener("resize", this.windowResizeHandler);
    window.addEventListener("keydown", this.arrowListener);

    this.handleFirebaseControl();

    if (this.responsive.length > 0)
      this.responsiveHandler();
    if (this.id)
      this.addFilesFromServer();
  }
  start() {
    this.setUp();
  }
}


firebaseApp.onload = async () => {
  firebase.initializeApp({
    apiKey: "AIzaSyBZwaUfj4RaI9kVGXWgHUz23jroUGd-mn0",
    authDomain: "slidalbums.firebaseapp.com",
    databaseURL: "https://slidalbums.firebaseio.com",
    projectId: "slidalbums",
    storageBucket: "slidalbums.appspot.com",
    messagingSenderId: "167009021016"
  })
  firebaseDatabase.onload = async () => {
    loadJSON(function (response) {
      document.querySelectorAll(".album").forEach((album, i) => {
        let s = new Slid({ album: album, index: i, ...JSON.parse(response)[i] });
        s.start();
      })
    });

  }
}
