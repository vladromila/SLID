let album = document.getElementById("album");
let carousel = document.getElementById("carousel");
let seats = document.querySelectorAll("ul > li");

firebase.initializeApp(
  //api key here
)

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
    for (i = j = 2, ref = seats.length; (2 <= ref ? j <= ref : j >= ref); i = 2 <= ref ? ++j : --j) {
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
    for (i = j = 2, ref = seats.length; (2 <= ref ? j <= ref : j >= ref); i = 2 <= ref ? ++j : --j) {
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
        s.goToPrev();
    if (e.keyCode === 39)
      if (s.nextDisable === false)
        s.goToNext();
  })

  carousel.addEventListener("touchstart", (e) => {
    s.startX = e.touches[0].clientX;
    s.lastX = e.touches[0].clientX;
  })
  carousel.addEventListener("touchmove", (e) => {
    album.scrollBy(s.lastX - e.touches[0].clientX, 0);
    s.lastX = e.touches[0].clientX;
  })
  carousel.addEventListener("touchend", (e) => {
    s.goToNext();
  })
  /* carousel.addEventListener("touchstart", (e) => {
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
  }) */

  firebase.database().ref(`/${album.getAttribute("link")}/controls`)
    .on("value", snapshot => {
      if (snapshot.val()) {
        switch (snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]].type) {
          case "nextSlide":
            firebase.database().ref(`/${album.getAttribute("link")}/controls/${Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]}`).remove()
            return s.goToNext()
          case "previousSlide":
            firebase.database().ref(`/${album.getAttribute("link")}/controls/${Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]}`).remove()
            return s.goToPrev()
        }
      }
    })
}
