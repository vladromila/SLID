// variables

const show = document.querySelector(".show");
const mask = document.querySelector(".mask");
const close = document.querySelector(".close");
const imgs = document.querySelectorAll(".imgs .imagecont");
const modal = document.querySelector(".modal .modalcont img");

// functions

closeModal = () => {
    mask.classList.remove("active");
};

imgClick = (event) => {
    source = event.target.getAttribute('src');
    if(source === null)
    {
        c = event.target.childNodes;
        source = c[1].getAttribute('src'); 
    }
    mask.classList.add("active");
    console.log(source);
    modal.setAttribute("src", source);
};

//event listeners

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