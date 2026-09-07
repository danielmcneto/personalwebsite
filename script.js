const invertButton = document.getElementById('btn-invert')

invertButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
})

async function getCurrentMusic() {
    const discord_id = "836178992817504346"; // Replace with your Discord user ID
    try{
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discord_id}`);
        const {data} = await res.json();
        const textStatus = document.getElementById('spotify-text');
        const imageStatus = document.getElementById('spotify-image');

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

setInterval(getCurrentMusic, 10000);
getCurrentMusic();