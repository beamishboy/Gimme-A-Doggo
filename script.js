const mainDiv = document.querySelector("#main-row");
const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", breedSearch);
const placeholderImage = "/img/paw.png";
var searchString = "shep";
document.querySelector("#breed-search-box").value = searchString;

getMyDoggos(searchString);

function breedSearch(event) {
    try {
        event.preventDefault();
        searchString = document.querySelector("#breed-search-box").value;
        getMyDoggos(searchString);
    }
    catch (err) {
        console.log(`An error occured in populateDogDiv: ${err}`)
    }
}

async function populateDogDiv(dogBreed) {
    try {
        const newDiv = addNewDogDiv("New", placeholderImage);
        const imageRef = dogBreed.reference_image_id;
        const imageRequestURL = `https://api.thedogapi.com/v1/images/${dogBreed.reference_image_id}`;
        const resImage = await fetch(imageRequestURL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'x-api-key': '82eed4b3-06a9-4889-81c9-31d0e354c8fa'
            }
        })
        const dataImage = await resImage.json();
        const imageURL = dataImage.url;
        newDiv.firstElementChild.style.backgroundImage = `url("${imageURL}")`;
        console.log(`${dogBreed.name} loaded: ${imageRef}: ${imageURL}`);

        newDiv.firstElementChild.innerHTML = dogBreed.name;
    }
    catch (err) {
        console.log(`An error occured in populateDogDiv: ${err}`)
    }
}

async function getMyDoggos(term) {
    try {
        console.log(`*** Searching for: ${term} ***`);
        const breedRequestURL = `https://api.thedogapi.com/v1/breeds/search?q=${term}`
        const res = await fetch(breedRequestURL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'x-api-key': '82eed4b3-06a9-4889-81c9-31d0e354c8fa'
            }
        })

        const data = await res.json();
        console.log(`Number of breeds: ${data.length}`);
        const cleanArray = data.filter(item => (item.reference_image_id !== undefined && item.reference_image_id != "" && item.reference_image_id.trim() != ""));
        const numOfBreeds = cleanArray.length;
        console.log(`Cleaned number of breeds: ${numOfBreeds}`);
        document.querySelectorAll(".main-col").forEach(item => item.remove());
        if (numOfBreeds === 0) {
            const blankDiv = addNewDogDiv("No breeds found", placeholderImage)
        }

        else cleanArray.forEach((item) => populateDogDiv(item));
    }
    catch (err) {
        console.log(`An error occured in getMyDoggos: ${err}`)
    }
}

function addNewDogDiv(breedName, imageURL) {
    try {
        const markup = `<div class="panel-doggo">${breedName}</div>`;
        const newDiv = document.createElement("div");
        newDiv.className = "col-md-4 col-sm-6 main-col";

        const panelDiv = document.createElement("div");
        panelDiv.className = "panel-doggo";
        panelDiv.innerText = breedName;
        panelDiv.style.backgroundImage = `url(${imageURL})`;

        newDiv.appendChild(panelDiv);
        mainDiv.appendChild(newDiv);

        return newDiv;
    }
    catch (err) {
        console.log(`An error occured in addNewDogDiv: ${err}`)
    }


}