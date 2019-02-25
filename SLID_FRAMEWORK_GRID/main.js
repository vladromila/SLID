// variables

const show = document.querySelector(".show");
const mask = document.querySelector(".mask");
const close = document.querySelector(".close");
const imgs = document.querySelectorAll(".imgs .imagecont");

// functions

closeModal = () => {
    mask.classList.remove("active");
};

imgClick = (event) => {
    const current = document.querySelector("#current");
    const source = event.target.src;
    current.src = source;
    mask.classList.add("active");
    console.log(source);
};

imgs.forEach(img => img.addEventListener("click", imgClick));

close.addEventListener("click", () => {
    closeModal();
});
mask.addEventListener("click", () => {
    closeModal();
});
  
document.addEventListener("keyup", (event) => {
    if(event.keyCode == 27) {
        closeModal();
    }
});