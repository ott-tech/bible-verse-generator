document.addEventListener('DOMContentLoaded', () => {
    const favouritesList = document.getElementById('favouritesList');
    const clearFavouritesBtn = document.getElementById('clearFavourites');


    const LS_FAVOURITES_KEY = "bibleVerseFavourites";

    const savedVerses = JSON.parse(localStorage.getItem(LS_FAVOURITES_KEY)) || [];

//Load favourites
function getFavourites() {
    const favourites = localStorage.getItem(LS_FAVOURITES_KEY);
    if (favourites) {
        return JSON.parse(favourites);
    } else {
        return [];
    };
};

function renderFavourites () {
    favouritesList.innerText = "";
    const saved = getFavourites();

    if(saved.length === 0) {
        favouritesList.innerHTML = "<li>No favourites verses yet. </li>"
        return;
    }

    saved.forEach((verse, index) => {
        const li = document.createElement("li");

        //Left side: verse Text
        const span = document.createElement("span")
        span.textContent = verse;
        span.classList.add("favourites-text");

        //Right side: delete icon (SVG)
        const delBtn = document.createElement("button");
        delBtn.classList.add("remove-fav");
        delBtn.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`;
        delBtn.addEventListener("click", () => {
        deleteFavourite(index);
        });

        li.appendChild(span) //verse text
        li.appendChild(delBtn); // delete icon, put button on the right side
        favouritesList.appendChild(li);

    });
};
     
//Delete single favourite
function deleteFavourite(index) {
    const saved = getFavourites();
    saved.splice(index, 1);// remove that one
    localStorage.setItem(LS_FAVOURITES_KEY, JSON.stringify(saved));
    renderFavourites(); //refresh list
}

// clear all favourites
clearFavouritesBtn.addEventListener("click", () => {
    localStorage.removeItem(LS_FAVOURITES_KEY);
    favouritesList.innerHTML = '';
});

renderFavourites();
});