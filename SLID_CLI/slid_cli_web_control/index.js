function onClick(path) {
    console.log("da");
    fetch(`http://localhost:5001/${path}`, {
        method: "GET",
        mode: "no-cors",
        headers: {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
        }
    })
}
document.getElementById("1").addEventListener("click", () => {
    onClick("previousSlide")
})
document.getElementById("2").addEventListener("click", () => {
    onClick("enableVoice")
})
document.getElementById("3").addEventListener("click", () => {
    onClick("nextSlide")
})