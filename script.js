const mainDiv = document.querySelector("#main-row");
const breedGroupsContainer = document.querySelector("#breed-group");
const searchForm = document.querySelector("#search-form");

const placeholderImage = "/img/paw.png";
//searchForm.addEventListener("submit", () => populateDogDiv({ name: "Doggos Loading", url: placeholderImage }));
var searchString = "mal";
document.querySelector("#breed-search-box").value = searchString;
const referenceArray = [];
const searchedArray = [];

const propertiesArray = [];


getAllDoggos().then(result => {
    referenceArray.push(...result);
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
        const cleanArray = data.filter(item => !(item.image == undefined || item.image.url == undefined || item.image.url == "" || item.image.url.trim() == ""));
        const numOfBreeds = cleanArray.length;
        console.log(`Cleaned number of breeds (with valid image data): ${numOfBreeds}`);
        return cleanArray;
    }
    catch (err) {
        console.log(`An error occured in getMyDoggos: ${err}`);
    }
}

async function getMyDoggos(term) {
    try {
        console.log(`*** Searching for: ${term} ***`);
        const cleanArray = [];
        propertiesArray.splice(0, propertiesArray.length);  //Empty the array

        if (term.trim() == "") {
            cleanArray.push(...referenceArray.map(item => { return { name: item.name, url: item.image.url, breedGroup: item.breed_group ? item.breed_group : "Unspecified" } }));
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
            cleanArray.push(...data.map(item => referenceArray.find(element => element.id === item.id)).filter(item => item != undefined).map(item => { return { name: item.name, url: item.image.url, breedGroup: item.breed_group ? item.breed_group : "Unspecified" } }));
        }

        const numOfBreeds = cleanArray.length;
        console.log(`Clean search results: ${numOfBreeds}`);

        /********** Dislaying the dogs **********/
        document.querySelectorAll(".main-col").forEach(item => item.remove());
        document.querySelectorAll(".property-value").forEach(item => item.remove());
        if (numOfBreeds === 0) {
            addNewDogDiv("No breeds found", placeholderImage);
        } else cleanArray.forEach((item) => {
            populateDogDiv(item);
            addProperty("breed-group", item.breedGroup);
        });
        /****************************************/

        searchedArray.splice(0, searchedArray.length);
        searchedArray.push(...cleanArray);
    }
    catch (err) {
        console.log(`An error occured in getMyDoggos: ${err}`);
    }
}


function populateDogDiv(dogBreed) {
    try {
        const newDiv = addNewDogDiv("New", placeholderImage);
        newDiv.firstElementChild.style.backgroundImage = `url(${dogBreed.url})`;
        newDiv.firstElementChild.innerHTML = dogBreed.name;
    }
    catch (err) {
        console.log(`An error occured in populateDogDiv: ${err}`);
    }
}

function addNewDogDiv(breedName, imageURL) {
    try {
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

function addProperty(propertyNameArg, propertyValueArg) {
    const nameIndex = propertiesArray.findIndex(item => item.propertyName === propertyNameArg);

    if (nameIndex < 0) {
        propertiesArray.push({ propertyName: propertyNameArg, propertyValuesArray: [{ propertyValue: propertyValueArg, count: 1 }] });
        addNewPropertyValueDiv(propertyNameArg, propertyValueArg);
        console.log(`Property not found in propertiesArray, added {${propertyNameArg}: [{${propertyValueArg}:1}]}`);
    }
    else {
        const valueIndex = propertiesArray[nameIndex].propertyValuesArray.findIndex(item => item.propertyValue === propertyValueArg)
        if (valueIndex >= 0) {
            propertiesArray[nameIndex].propertyValuesArray[valueIndex].count++;
            console.log(`Property ${propertyNameArg} found in propertiesArray, incremented count of value ${propertyValueArg}`);
        }
        else {
            propertiesArray[nameIndex].propertyValuesArray.push({ propertyValue: propertyValueArg, count: 1 });
            addNewPropertyValueDiv(propertyNameArg, propertyValueArg);
            console.log(`Property ${propertyNameArg} found in propertiesArray, added value {${propertyValueArg}:1}`);
        }
    }
    console.log(propertiesArray);
}



function addNewPropertyValueDiv(property, propertyValue) {
    try {
        const container = document.querySelector(`#${property}`);
        console.log(container);
        const propertyDiv = document.createElement("div");
        propertyDiv.className = "property-value";
        propertyDiv.innerText = propertyValue;
        container.appendChild(propertyDiv);
        propertyDiv.addEventListener("click", filterAndDisplayData);
    }
    catch (err) {
        console.log(`An error occured in addNewPropertyValueDiv: ${err}`)
    }
}

function filterAndDisplayData(event) {
    event.target.classList.toggle("active");
    const activeBreedGroups = findActiveProperties("breed-group");
    const dogsToDisplay = searchedArray.filter(item => activeBreedGroups.includes(item.breedGroup));
    console.log(dogsToDisplay);

    /********** Dislaying the dogs **********/
    document.querySelectorAll(".main-col").forEach(item => item.remove());
    if (dogsToDisplay.length === 0) addNewDogDiv("No breeds found", placeholderImage);
    else dogsToDisplay.forEach((item) => { populateDogDiv(item); });
    /****************************************/
}

function findActiveProperties(propertyName) {
    const container = document.querySelector(`#${propertyName}`);
    const propertyDivs = Array.from(container.children).splice(1, container.children.length - 1);
    const selectedProperties = [];
    const unselectedProperties = [];
    propertyDivs.forEach(item => {
        if (item.classList.contains("active")) selectedProperties.push(item.innerHTML);
        else unselectedProperties.push(item.innerText);
    });

    if (selectedProperties.length === 0) return unselectedProperties;
    else return selectedProperties;
}
