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

async function getCurrentActivity() {
    const discord_id = "836178992817504346";
    const textStatus = document.getElementById('activity-text');
    const imageStatus = document.getElementById('activity-image');

    if (!textStatus || !imageStatus) return;

    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discord_id}`);
        const { data } = await res.json();

        // Filtra as atividades ignorando o Spotify (type 2) e Custom Status (type 4)
        const currentActivity = data.activities.find(act => act.type !== 2 && act.type !== 4);

        if (currentActivity) {
            const activityName = currentActivity.name; // ex: "Visual Studio Code"
            const details = currentActivity.details ? ` (${currentActivity.details})` : ''; // ex: "Editing index.js"
            
            textStatus.textContent = `Using ${activityName}${details}`;

            // Pega a imagem se existir no Rich Presence
            if (currentActivity.assets && currentActivity.assets.large_image) {
                let imageId = currentActivity.assets.large_image;
                let imageUrl = "";

                if (imageId.startsWith("mp:external/")) {
                    imageUrl = `https://media.discordapp.net/${imageId.replace("mp:", "")}`;
                } else {
                    imageUrl = `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${imageId}.png`;
                }

                imageStatus.style.backgroundImage = `url(${imageUrl})`;
            } else {
                imageStatus.style.backgroundImage = "none";
            }

            console.log(`Current Activity: ${activityName}`);
        } else {
            textStatus.textContent = "Not doing anything on Discord.";
            imageStatus.style.backgroundImage = "none";
            console.log("No non-Spotify activity running.");
        }
    } catch (error) {
        console.error("Error fetching Lanyard activity data:", error);
    }
}

setInterval(getCurrentActivity, 30000);
getCurrentActivity();

setInterval(getCurrentMusic, 30000);
getCurrentMusic();


setInterval(time, 600);
time();