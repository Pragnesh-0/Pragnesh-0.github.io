const buttons = document.getElementsByClassName("expand-button")
const contentElements = document.getElementsByClassName("content")

const videoElements = document.getElementsByTagName("video")

const contentViewer = document.getElementsByClassName("content-viewer")[0]
const contentCloseButton = document.getElementsByClassName("content-close")[0]
const contentNewTab = document.getElementsByClassName("content-new-tab")[0]
const imageViewObject = document.getElementsByClassName("image-object")[0]
const videoViewObject = document.getElementsByClassName("video-object")[0]

const isVideo = false;

const darkmodeToggle = document.getElementsByClassName("darkmode-toggle")[0]
const headerComponent = document.getElementsByClassName("top-header")[0]
const contactButton = document.getElementsByClassName("to-footer")[0]

const footer = document.getElementsByTagName("footer")[0]

const yearSpan = document.getElementsByClassName("year")[0]

function disableMoreElements(){
    for (const button of buttons) {
        const moreElementLocal = button.parentElement.getElementsByClassName("more")[0]
        if(moreElementLocal.classList.contains("is-toggled")){
            moreElementLocal.classList.remove("is-toggled")
        }
        if(button.classList.contains("expanded")){
            button.classList.remove("expanded")
            button.getElementsByClassName("button-text-content")[0].textContent = "Expand"
        }        
    }
}

function setStatus(check){
    const dot = document.getElementsByClassName("status-dot")[0]
    const availabilityText = document.getElementsByClassName("status-text")[0]
    if(check){
        dot.classList.add("available");
        availabilityText.textContent = "Available"
    }else{
        dot.classList.add("not-available");
        availabilityText.textContent = "Not Available"
    }
}

function pauseVideos(){
    for (const video of videoElements) {
        video.pause();
    }
}

async function applyStatus(){
    const default_data = {"status": true}
    try{
        if(window.location.protocol != "file:"){
            const response = await fetch("./public/datas.json")
            const data = await response.json()
            setStatus(data.status)
            if(!response.ok){
                setStatus(default_data.status)
                return
            }
        }else{
            throw new Error("Fetch Request in Development Environment")
        }
    }catch(err){
        console.log(err + " so using default data...")
        setStatus(default_data.status)
    }
}

function toggleDarkmode(darkMode){
    if(darkMode){
        darkmodeToggle.classList.add("dark-mode")
        document.documentElement.classList.add("dark-mode")
        localStorage.setItem("dark-mode","on")
        return
    }
    darkmodeToggle.classList.remove("dark-mode")
    document.documentElement.classList.remove("dark-mode")
    localStorage.setItem("dark-mode","off")
}

const check = localStorage.getItem("dark-mode")
toggleDarkmode(check === null ? window.matchMedia("(prefers-color-scheme: dark)").matches : check === "on" )

applyStatus()

lucide.createIcons();

for (const button of buttons) {
    button.addEventListener("click", () => {
        const moreElementLocal = button.parentElement.getElementsByClassName("more")[0]
        const wasToggled = moreElementLocal.classList.contains("is-toggled")
        disableMoreElements()
        pauseVideos()
        if(wasToggled){
            return
        }
        setTimeout(()=>{
            moreElementLocal.classList.add("is-toggled")
            button.parentElement.scrollIntoView({behavior: "smooth", block: "start", inline:"start"}
        )}, 100)
        button.classList.add("expanded")
        button.getElementsByClassName("button-text-content")[0].textContent = "Collapse"
    })
}



for (const content of contentElements){
    const image = content.getElementsByClassName("content-data")[0].getElementsByTagName("img")[0]
    const video = content.getElementsByClassName("content-data")[0].getElementsByTagName("video")[0]
    if(image){
        image.addEventListener("click", ()=>{
            if(imageViewObject.classList.contains("inactive")){
                imageViewObject.classList.remove("inactive")
            }
            videoViewObject.classList.add("inactive")
            const img_url = image.getAttribute("src")
            imageViewObject.setAttribute("src", img_url)
            contentViewer.classList.add("is-visible")
            headerComponent.classList.add("is-hidden")
        })
    }
    if(video){
        video.addEventListener("click", ()=>{
            if(videoViewObject.classList.contains("inactive")){
                videoViewObject.classList.remove("inactive")
            }
            imageViewObject.classList.add("inactive")
            const vid_url = video.getAttribute("src")
            videoViewObject.setAttribute("src", vid_url)
            pauseVideos()
            videoViewObject.play()
            contentViewer.classList.add("is-visible")
            const videoParentElement = videoViewObject.parentElement
            headerComponent.classList.add("is-hidden")
        })
        video.addEventListener("mouseenter", ()=>{
            video.play();
        })
        video.addEventListener("mouseleave", ()=>{
            video.pause();
        })
    }
}


contentCloseButton.addEventListener("click", () => {
    if(contentViewer.classList.contains("is-visible")){
        contentViewer.classList.remove("is-visible")
        headerComponent.classList.remove("is-hidden")
        videoViewObject.pause()
    }
})
contentNewTab.addEventListener("click", () => {
    if(imageViewObject.classList.contains("inactive")){

        return
    }
    const img_url = imageViewObject.getAttribute("src")
    open(img_url)
})

darkmodeToggle.addEventListener("click", () => {toggleDarkmode(!darkmodeToggle.classList.contains("dark-mode"))})
contactButton.addEventListener("click", () => {footer.scrollIntoView({behavior: "smooth"})})
yearSpan.textContent = (new Date()).getFullYear().toString()


