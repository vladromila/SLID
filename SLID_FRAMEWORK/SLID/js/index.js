let album = document.getElementById("album");
let carousel = document.getElementById("carousel");
let seats = document.querySelectorAll("ul > li");

let leftArrow = document.createElement("div")
let rightArrow = document.createElement("div");
leftArrow.id = "left-arrow";
rightArrow.id = "right-arrow";
leftArrow.classList = "left-arrow";
rightArrow.classList = "right-arrow";
album.appendChild(leftArrow);
album.appendChild(rightArrow);

firebase.initializeApp({
  apiKey: "AIzaSyBZwaUfj4RaI9kVGXWgHUz23jroUGd-mn0",
  authDomain: "slidalbums.firebaseapp.com",
  databaseURL: "https://slidalbums.firebaseio.com",
  projectId: "slidalbums",
  storageBucket: "slidalbums.appspot.com",
  messagingSenderId: "167009021016"
})

if (seats.length === 1)
  carousel.style.left = 0;

class SLID {
  constructor() {
    this.nextDisable = false;
    this.prevDisable = false;
    this.startX = 0;
    this.finalX = 0;
    this.lastX = 0;
    this.didTheTouchMove = false;
  }

  goToNext() {
    this.nextDisable = true;
    var el, i, j, new_seat, ref;
    el = document.querySelector("ul > li.is-ref");
    el.classList.remove('is-ref');
    new_seat = el.nextElementSibling || seats[0];
    new_seat.classList.add('is-ref');
    new_seat.style.order = 1;
    for (i = j = 2, ref = seats.length;
      (2 <= ref ? j <= ref : j >= ref); i = 2 <= ref ? ++j : --j) {
      new_seat = new_seat.nextElementSibling || seats[0];
      new_seat.style.order = i;
    }
    carousel.classList.remove('toPrev');
    carousel.classList.add('toNext');
    carousel.classList.remove('is-set');
    document.getElementById('carousel').addEventListener("transitionend", () => {
      this.nextDisable = false;
    }, {
        once: true,
      });
    return setTimeout((function () {
      return carousel.classList.add('is-set');
    }), 50);
  }
  goToPrev() {
    this.prevDisable = true;
    var el, i, j, new_seat, ref;
    el = document.querySelector("ul > li.is-ref");
    el.classList.remove('is-ref');
    new_seat = el.previousElementSibling || seats[seats.length - 1];
    new_seat.classList.add('is-ref');
    new_seat.style.order = 1;
    for (i = j = 2, ref = seats.length;
      (2 <= ref ? j <= ref : j >= ref); i = 2 <= ref ? ++j : --j) {
      new_seat = new_seat.nextElementSibling || seats[0];
      new_seat.style.order = i;
    }
    carousel.classList.remove('toNext');
    carousel.classList.add('toPrev');
    carousel.classList.remove('is-set');
    document.getElementById('carousel').addEventListener("transitionend", () => {
      this.prevDisable = false;
    }, {
        once: true
      });
    return setTimeout((function () {
      return carousel.classList.add('is-set');
    }), 50);
  }
}
if (document.getElementById("album").getAttribute('autoCall') === "true") {
  let s = new SLID();
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 37)
      if (s.prevDisable === false)
        if (seats.length >= 2)
          s.goToPrev();
    if (e.keyCode === 39)
      if (s.nextDisable === false)
        if (seats.length >= 2)
          s.goToNext();
  })

  carousel.addEventListener("touchstart", (e) => {
    s.startX = e.touches[0].clientX;
  })
  carousel.addEventListener("touchmove", (e) => {
    let currentX = e.touches[0].clientX;
    s.finalX = s.startX - currentX;
    s.didTheTouchMove = true;
  })
  carousel.addEventListener("touchend", (e) => {
    if (s.didTheTouchMove === true)
      if (s.finalX > 0) {
        if (s.nextDisable === false)
          s.goToNext();
      }
      else
        if (s.prevDisable === false)
          s.goToPrev();
    s.didTheTouchMove = false;
  })

  leftArrow.addEventListener("click", () => {
    if (seats.length > 1 && s.prevDisable === false)
      s.goToPrev();
  })
  rightArrow.addEventListener("click", () => {
    if (seats.length > 1 && s.nextDisable === false)
      s.goToNext();
  })

  function next(type, uid) {
    if (type === "nextSlide") {
      if (s.nextDisable === false) {
        s.goToNext();
      }
    }
    if (type === "previousSlide") {
      if (s.prevDisable === false)
        s.goToPrev();
    }
    firebase.database().ref(`/${album.getAttribute("link")}/controls/${uid}`).remove()
  }
  firebase.database().ref(`/${album.getAttribute("link")}/controls`)
    .on("value", snapshot => {
      if (snapshot.val()) {
        next(snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].type, Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1])
      }
    })
  if (1 == 2)
    fetch(`https://slidserver.herokuapp.com/getonlineresources`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer Tlu3cIv70YAAAAAAAAAACBTX9s7_CeW03Bpp0PatWDvgqp2cmXrWA6gJ3h3hTDIP"
      },
      body: JSON.stringify({
        uid: album.getAttribute("link")
      })
    })
      .then(res => res.json())
      .then((res) => {
        if (res.resources) {
          res.resources.forEach(resource => {
            let newLiCont = document.createElement("li");
            newLiCont.classList = "container carousel-element";
            let el = document.createElement("video");
            el.src = resource.link;
            newLiCont.appendChild(el)
            carousel.appendChild(newLiCont);
            seats = document.querySelectorAll("ul > li")
            seats[seats.length - 1].classList.add("is-ref");
          })
        }
      })
}