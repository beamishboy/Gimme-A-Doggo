const mainDiv = document.querySelector("#main-row");
const breedGroupsContainer = document.querySelector("#breed-group");
const searchForm = document.querySelector("#search-form");

const placeholderImage = "/img/paw.png";
//searchForm.addEventListener("submit", () => populateDogDiv({ name: "Doggos Loading", url: placeholderImage }));
var searchString = "bull";
document.querySelector("#breed-search-box").value = searchString;
const referenceArray = [];
const searchedArray = [];

const propertiesArray = [];

const coverInfoHTML = `
<div class="cover-info">
    <div class="cover-name cover-item">
        <span class="cover-label"></span>
        <span class="cover-value">Dummy </span>
    </div>
    <div class="cover-breed-group cover-item">
        <span class="cover-label">Breed Group: </span>
        <span class="cover-value">Dummy </span>
    </div>
    <div class="cover-temperament cover-item">
        <span class="cover-label">Temperament: </span>
        <span class="cover-value">Dummy </span>
    </div>
    <div class="cover-bred-for cover-item">
        <span class="cover-label">Bred for: </span>
        <span class="cover-value">Dummy </span>
    </div>    
    <div class="cover-life-span cover-item">
    <span class="cover-label">Life Span: </span>
    <span class="cover-value">Dummy </span>
</div>

</div> `

const substitutionArray = [
    { term: "Bold", synonyms: ["Courageous", "Brave"] },
    { term: "Reliable", synonyms: ["Faithful", "Devoted", "Trustworthy", "Loyal"] },
    { term: "Happy", synonyms: ["Cheerful", "Gay", "Merry", "Joyful"] },
    { term: "Confident", synonyms: ["Self-confidence", "Self-assured"] },
    { term: "Intelligent", synonyms: ["Bright", "Clever", "Cunning", "Rational"] },
    { term: "Proud", synonyms: ["Self-important"] },
    { term: "Strong Willed", synonyms: ["Willful", "Determined", "Tenacious"] },
    { term: "Calm", synonyms: ["Quiet", "Thoughtful"] },
    { term: "Lively", synonyms: ["Spirited", "Spunky", "Bubbly", "Boisterous", "Feisty", "Adventurous", "Wild", "Fun-loving"] },
    { term: "Kind", synonyms: ["Benevolent", "Generous", "Great-hearted"] },
    { term: "Keen", synonyms: ["Eager"] },
    { term: "Composed", synonyms: ["Unflappable", "Stable", "Steady"] },
    { term: "Stubborn", synonyms: ["Opinionated"] },
    { term: "Dominant", synonyms: ["Assertive", "Aggressive", "Bossy", "Fierce"] },
    { term: "Diligent", synonyms: ["Hard-working", "Hardworking", "Dutiful", "Responsible"] },
    { term: "Sociable", synonyms: ["Companionable", "Extroverted", "Amiable", "People-Oriented", "Easygoing"] },
    { term: "Strong", synonyms: ["Sturdy", "Hardy", "Powerful", "Rugged"] },
    { term: "Alert", synonyms: ["Vigilant"] },
    { term: "Friendly", synonyms: ["Easygoing", "Good-natured", "Good-tempered", "Cooperative", "Responsive", "Receptive", "Respectful", "Cooperative", "Gentle", "Tolerant"] },
    { term: "Quick", synonyms: "Fast" },
    { term: "Lovable", synonyms: ["Charming", "Sweet-natured", "Sweet-Tempered"] },
    { term: "Watchful", synonyms: "Cautious" }
];

function substitute(word) {
    const findItem = substitutionArray.find(item => item.synonyms.includes(word));
    return findItem ? findItem.term : word;
}

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
            cleanArray.push(...referenceArray.map(item => { return { name: item.name, url: item.image.url, breedGroup: item.breed_group ? item.breed_group : "Unspecified", temperament: item.temperament.split(",").map(item => item.trim()).map(item => substitute(item)), bredFor: item.bred_for, lifeSpan: item.life_span } }));
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
            cleanArray.push(...data.map(item => referenceArray.find(element => element.id === item.id)).filter(item => item != undefined).map(item => { return { name: item.name, url: item.image.url, breedGroup: item.breed_group ? item.breed_group : "Unspecified", temperament: item.temperament == undefined ? ["Unspecified"] : [...new Set(item.temperament.split(",").map(item => item.trim()).map(item => substitute(item)))], bredFor: item.bred_for ? item.bred_for : "Unspecified", lifeSpan: item.life_span ? item.life_span : "Unspecified" } }));
        }

        const numOfBreeds = cleanArray.length;
        console.log(`Clean search results: ${numOfBreeds}`);

        /********** Dislaying the dogs  and adding properties **********/
        document.querySelectorAll(".main-col").forEach(item => item.remove());
        document.querySelectorAll(".property-value").forEach(item => item.remove());
        if (numOfBreeds === 0) {
            addNewDogDiv("No breeds found", placeholderImage);
        } else cleanArray.forEach((item) => {
            populateDogDiv(item);
            addProperty("breed-group", item.breedGroup);
            item.temperament.forEach(element => addProperty("temperament", element));
        });
        /****************************************************************/

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
        newDiv.firstElementChild.innerHTML = coverInfoHTML;
        newDiv.firstElementChild.children[0].children[0].children[1].innerText = dogBreed.name;
        newDiv.firstElementChild.children[0].children[1].children[1].innerText = dogBreed.breedGroup;
        newDiv.firstElementChild.children[0].children[2].children[1].innerText = dogBreed.temperament.join(", ")
        newDiv.firstElementChild.children[0].children[3].children[1].innerText = dogBreed.bredFor;
        newDiv.firstElementChild.children[0].children[4].children[1].innerText = dogBreed.lifeSpan;
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
        panelDiv.innerHTML = breedName;
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
    const activeTemperaments = findActiveProperties("temperament")
    const dogsToDisplay = searchedArray.filter(item => activeBreedGroups.includes(item.breedGroup)).filter(item => item.temperament.find(element => activeTemperaments.includes(element)));
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
