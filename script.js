const invertButton = document.getElementById('btn-invert')

invertButton?.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
})

function time(){
    const now = new Date()

    const timeZone = now.toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute:'2-digit'
    })

    document.getElementById('clock').innerText = timeZone;
}

async function getCurrentMusic() {
    const discord_id = "836178992817504346";
    const textStatus = document.getElementById('spotify-text');
    const imageStatus = document.getElementById('spotify-image');

    if (!textStatus || !imageStatus) return;

    try{
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discord_id}`);
        const {data} = await res.json();

        if(data.listening_to_spotify){
            const spotifyData = data.spotify;
            //spotifyData.song
            //spotifyData.artist
            //spotifyData.album_art_url
            //spotifyData.album
            textStatus.textContent = `listening to ${spotifyData.song} by ${spotifyData.artist}`;
            imageStatus.style.backgroundImage = `url(${spotifyData.album_art_url})`;

            console.log(`Currently listening to: ${spotifyData.song} by ${spotifyData.artist}`);
        } 
        else {
            textStatus.textContent = "Not listening to Spotify.";
            imageStatus.style.backgroundImage = "none";
            console.log("Not listening to Spotify.");
        }
    } catch (error) {
        console.error("Error fetching Lanyard data:", error);
    }
    
}

setInterval(getCurrentMusic, 30000);
getCurrentMusic();


setInterval(time, 600);
time();