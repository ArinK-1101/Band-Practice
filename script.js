const screens = [
    ...document.querySelectorAll(".screen")
];

const songList = document.getElementById("songList");
const choices = document.getElementById("choices");

// Create the file upload input
const upload = document.createElement("input");

upload.type = "file";
upload.accept = ".pdf,application/pdf";
upload.multiple = true;
upload.style.display = "none";

document.body.append(upload);

// Main songs
let songs = [
];

let pdfUrl = null;


// Switch between dialogue screens
function show(id) {
    screens.forEach(screen => {
        screen.classList.toggle(
            "active",
            screen.id === id
        );
    });
}


// Create the song selection buttons
function render() {

    choices.innerHTML = "";

    songs.forEach((song, index) => {

        const button = document.createElement("button");

        button.className = "choice";
        button.textContent = song.name;

        button.onclick = () => {
            if (song.file) {
                openSong(song);
            } else {
                attach(index);
            }
        };

        choices.append(button);
    });


    // Upload button
    const uploadButton = document.createElement("label");

    uploadButton.className = "upload";
    uploadButton.textContent = "＋ Add your own PDF";

    uploadButton.onclick = () => {
        upload.dataset.slot = "new";
        upload.click();
    };

    choices.append(uploadButton);


    // Setlist panel
    songList.innerHTML = "";

    songs.forEach((song, index) => {

        const row = document.createElement("div");
        row.className = "songrow";

        const name = document.createElement("span");
        name.textContent = song.name;

        const button = document.createElement("button");

        button.textContent = song.file ? "Open" : "Add PDF";

        button.onclick = () => {
            if (song.file) {
                openSong(song);
            } else {
                attach(index);
            }
        };

        row.append(name, button);
        songList.append(row);
    });
}


// Attach a PDF to one of the main song slots
function attach(index) {
    upload.dataset.slot = String(index);
    upload.click();
}


// Open the selected PDF
function openSong(song) {

    if (!song.file) return;

    if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
    }

    pdfUrl = URL.createObjectURL(song.file);

    document.getElementById("pdfFrame").src = pdfUrl;

    document.getElementById("pdfTitle").textContent =
        song.name;

    document.getElementById("pdfWrap").classList.add("show");

    document.getElementById("chosenLine").textContent =
        "Oh, this one! Let's practice it together.";

    show("chosen");
}


// Handle uploaded PDFs
upload.addEventListener("change", () => {

    const files = [...upload.files];

    if (!files.length) return;

    const slot = upload.dataset.slot;

    // Upload additional songs
    if (slot === "new") {

        files.forEach(file => {

            songs.push({
                name: file.name.replace(/\.pdf$/i, ""),
                file: file
            });

        });

    }

    // Replace a main song slot
    else {

        const file = files[0];

        songs[Number(slot)] = {
            name: file.name.replace(/\.pdf$/i, ""),
            file: file
        };

    }

    upload.value = "";

    render();

    songList.classList.add("show");
});


// Next dialogue button
document.getElementById("next").onclick = () => {

    show("select");

    render();
};


// Open or close the song list
document.getElementById("nextSongs").onclick = () => {

    songList.classList.toggle("show");

};


// Return to song selection
document.getElementById("returnSongs").onclick = () => {

    document.getElementById("pdfWrap").classList.remove("show");

    songList.classList.add("show");

    show("select");

};


// Close the PDF viewer
document.getElementById("closePdf").onclick = () => {

    document.getElementById("pdfWrap").classList.remove("show");

};


// Setlist button in the top-right corner
document.getElementById("setlistToggle").onclick = () => {

    songList.classList.toggle("show");

};


// Initialize the website
render();

const fullscreenButton = document.getElementById("fullscreenPdf");
const pdfWrap = document.getElementById("pdfWrap");

fullscreenButton.addEventListener("click", async () => {
    if (!document.fullscreenElement) {
        await pdfWrap.requestFullscreen();
    } else {
        await document.exitFullscreen();
    }
});

document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement
        ? "×"
        : "⛶";
});