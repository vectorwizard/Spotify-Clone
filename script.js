console.log("Lets write JavaScript")
let currentSong = new Audio();

function formatTime(seconds) {
    seconds = Math.floor(seconds);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return String(mins).padStart(2, '0') + ":" + String(secs).padStart(2, '0');
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("songs")[1])
        }
    }
    return songs
}

const playMusic = (track, pause = false)=>{
    let audio = new Audio("/Songs/"+track+".mp3")
    currentSong.src = "/Songs/"+track+".mp3"
    currentSong.play();
    play.src = "pause.svg";  
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    //get list of all the songs
    let songs = await getSongs()
    
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replace("%5C", " ").replace(".mp3", "")}</div>
                                <div>Arijit</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
                        </li>`
    }
    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });

    //Attach an eventlistener to play next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg"
        }
        else{
            currentSong.pause();
            play.src = "play.svg"
        }
    })
    //Listen for time update event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
    })
}
main()
