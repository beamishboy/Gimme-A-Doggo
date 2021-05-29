const mainDiv = document.querySelector("#main-row");
const searchForm = document.querySelector("#search-form");
const placeholderImage = "/img/paw.png";
searchForm.addEventListener("submit", () => populateDogDiv({ name: "Doggos Loading", url: placeholderImage }));
var searchString = "shep";
document.querySelector("#breed-search-box").value = searchString;
var referenceArray = [];

getAllDoggos().then(data => {
    referenceArray = data;
    getMyDoggos((searchString));
    searchForm.addEventListener("submit", breedSearch);
});

function breedSearch(event) {
    try {
        event.preventDefault();
        searchString = document.querySelector("#breed-search-box").value;
        getMyDoggos(searchString);
    }
    catch (err) {
        console.log(`An error occured in breedSearch: ${err}`);
    }
}

async function populateDogDiv(dogBreed) {
    try {
        const newDiv = addNewDogDiv("New", placeholderImage);
        newDiv.firstElementChild.style.backgroundImage = `url(${dogBreed.url})`;
        newDiv.firstElementChild.innerHTML = dogBreed.name;
    }
    catch (err) {
        console.log(`An error occured in populateDogDiv: ${err}`)
    }
}

async function getAllDoggos() {
    try {
        console.log(`*** Downloading info of all breeds ***`);
        const breedRequestURL = `https://api.thedogapi.com/v1/breeds/`
        const res = await fetch(breedRequestURL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'x-api-key': '82eed4b3-06a9-4889-81c9-31d0e354c8fa'
            }
        })

        const data = await res.json();
        console.log(`Original number of breeds: ${data.length}`);
        console.log(data);
        const cleanArray = data.filter(item => !(item.image == undefined || item.image.url == undefined || item.image.url == "" || item.image.url.trim() == ""));
        const numOfBreeds = cleanArray.length;
        console.log(`Cleaned number of breeds (with valid image data): ${numOfBreeds}`);
        return cleanArray;
    }
    catch (err) {
        console.log(`An error occured in getMyDoggos: ${err}`)
    }
}

async function getMyDoggos(term) {
    try {
        console.log(`*** Searching for: ${term} ***`);
        const cleanArray = [];

        if (term.trim() == "") {
            cleanArray.push(...referenceArray.map(item => { return { name: item.name, url: item.image.url } }));
        } else {
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
            console.log(`Number of search results: ${data.length}`);
            cleanArray.push(...data.map(item => referenceArray.find(element => element.id === item.id)).filter(item => item != undefined).map(item => { return { name: item.name, url: item.image.url } }));
        }

        const numOfBreeds = cleanArray.length;
        console.log(`Clean search results: ${numOfBreeds}`);
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

function BreedProperty(name) {
    this.name = name;

}