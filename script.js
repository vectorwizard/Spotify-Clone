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
    track = track.replace("%5C", "").replace(".mp3", "").trim();
    currentSong.src = "/Songs/"+track+".mp3"
    if(!pause){
        currentSong.play();
        play.src = "pause.svg";  
    }
    else{
        play.src = "play.svg"
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    //get list of all the songs
    let songs = await getSongs()
    playMusic(songs[0],true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replace("%5C", "").replace(".mp3", "").trim()}</div>
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
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })
    // Add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width);
        document.querySelector(".circle").style.left = (percent * 100) + "%";
        currentSong.currentTime = (currentSong.duration * percent);
    })
}
main()
