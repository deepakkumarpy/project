const wrapper=document.querySelector(".wrapper"),
musicImg=wrapper.querySelector(".img-area img"),
musicName=wrapper.querySelector(".song-details .name"),
musicArtist=wrapper.querySelector(".song-details .artist");
mainAudio=wrapper.querySelector("#main-audio");
playPauseBtn=wrapper.querySelector(".play-pause");
prevBtn=wrapper.querySelector("#prev");
nextBtn=wrapper.querySelector("#next");
progressArea=wrapper.querySelector(".progress-area"),
progressBar=wrapper.querySelector(".progress-bar"),
musicList=wrapper.querySelector(".music-list"),
showMoreBtn=wrapper.querySelector("#more-music"),
hideMusicBtn=musicList.querySelector("#close");


let musicIndex=4;
window.addEventListener("load", ()=>{
    loadmusic(musicIndex);
    playingNow();
});
//load music function
function loadmusic(indexNumb)
{
    musicName.innerText=allmusic[indexNumb -1].name;
    musicArtist.innerText=allmusic[indexNumb -1].artist;
    musicImg.src= `images/${allmusic[indexNumb -1].img}.png`;
    mainAudio.src= `songs/${allmusic[indexNumb -1].src}.mp3`;
}
// play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
}
// pause music function
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// next music function
function nextMusic(){
    musicIndex++;
    musicIndex > allmusic.length ? musicIndex=1 : musicIndex=musicIndex;
    loadmusic(musicIndex);
    playMusic();
    playingNow();
  }

  // prev music function
function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allmusic.length : musicIndex=musicIndex;
    loadmusic(musicIndex);
    playMusic();
    playingNow();
  }


//play or music button event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPasued = wrapper.classList.contains("paused");
    isMusicPasued ? pauseMusic(): playMusic();
    playingNow();
});
//next music button event
nextBtn.addEventListener("click" , ()=>{
    nextMusic();
});

//prev music button event
prevBtn.addEventListener("click" , ()=>{
    prevMusic();
});

//progress width

mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime=e.target.currentTime;
    const duration=e.target.duration;
    let progressWidth=(currentTime/duration)*100;
    progressBar.style.width=`${progressWidth}%`;

    let musicCurrentTime=wrapper.querySelector(".current"),
    musicDuration=wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata",()=>{
        // upadate song total duration
        let audioDuration=mainAudio.duration;
        let totalMin=Math.floor(audioDuration/60);
        let totalSec=Math.floor(audioDuration%60);
        if(totalSec < 10)
        {
            totalSec=`0${totalSec}`;
        }
        musicDuration.innerText=`${totalMin}:${totalSec}`;
    });

    // upadate song current time
    let currentMin=Math.floor(currentTime / 60);
    let currentSec=Math.floor(currentTime % 60);
    if(currentSec < 10)
    {
        currentSec=`0${currentSec}`;
    }
    musicCurrentTime.innerText=`${currentMin}:${currentSec}`;
});

// update progress bar current width 
progressArea.addEventListener("click",(e)=>{
    let progressWidthval=progressArea.clientWidth;
    let clickedoffSetX= e.offsetX;
    let songDuration= mainAudio.duration;

    mainAudio.currentTime=(clickedoffSetX / progressWidthval) * songDuration;
    playMusic();
});

const repeatbtn=wrapper.querySelector("#repeat-plist");
repeatbtn.addEventListener("click", ()=>{
    let getText=repeatbtn.innerHTML;
    switch(getText)
    {
        case "repeat":
            repeatbtn.innerText="repeat_one";
            repeatbtn.setAttribute("title", "song looped");
            break;

         case "repeat_one":
                repeatbtn.innerText="shuffle";
                repeatbtn.setAttribute("title", "playback shuffle");
                break;

         case "shuffle":
                    repeatbtn.innerText="repeat";
                    repeatbtn.setAttribute("title", "playlist looped");
                    break;
    }
});

mainAudio.addEventListener("ended",()=>{
    let getText=repeatbtn.innerHTML;
    switch(getText)
    {
        case "repeat":
            nextMusic();
            break;

         case "repeat_one":
                mainAudio.currentTime=0;
                loadmusic(musicIndex);
                playMusic();
                break;

         case "shuffle":
                    let randIndex=Math.floor((Math.random() * allmusic.length) +1);
                    do{
                        randIndex=Math.floor((Math.random() * allmusic.length) +1);
                    }
                    while(musicIndex== randIndex);
                        musicIndex=randIndex;
                        loadmusic(musicIndex);
                        playMusic();
                        playingNow();
                    break;
    }
});

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();
});

const ulTag=wrapper.querySelector("ul");
for (let i=0;i < allmusic.length;i++)
{
    let liTag=`<li li-index="${i + 1}">
    <div class="row">
        <span>${allmusic[i].name}</span>
        <p>${allmusic[i].artist}</p>
      </div>
      <audio class="${allmusic[i].src}" src="songs/${allmusic[i].src}.mp3"></audio>
     <span id="${allmusic[i].src}"class="audio-duration">4:20</span>
    </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag);

    let liAudioDuration=ulTag.querySelector(`#${allmusic[i].src}`);
    let liAudioTag=ulTag.querySelector(`.${allmusic[i].src}`);

    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration=liAudioTag.duration;
        let totalMin=Math.floor(audioDuration/60);
        let totalSec=Math.floor(audioDuration%60);
        if(totalSec < 10)
        {
            totalSec=`0${totalSec}`;
        }
        liAudioDuration.innerText=`${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);

    });
}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
for(let j=0; j < allLiTags.length; j++){
    let audioTag=allLiTags[j].querySelector(".audio-duration");
    if(allLiTags[j].classList.contains("playing"))
    {
        allLiTags[j].classList.remove("playing");
        let aDuration=audioTag.getAttribute("t-duration");
        audioTag.innerText=aDuration;
    }
    if(allLiTags[j].getAttritube("li-index") == musicIndex){
        allLiTags[j].classList.add("playing");
        audioTag.innerText="playing";
    }
    allLiTags[j].setAttribute("onclick", "clicked(this)");
}
}

function  clicked(element)
{
    let getLiIndex = element.getAttritube("li-index");
    musicIndex = getLiIndex;
    loadmusic(musicIndex);
    playMusic();
    playingNow();
}