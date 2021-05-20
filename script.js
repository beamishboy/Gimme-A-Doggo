
const dogDivs = document.querySelectorAll(".panel-doggo");
const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", breedSearch);
var searchString = "dog";
document.querySelector("#breed-search-box").value = searchString;

console.log(searchString);

getMyDoggos(searchString);

function breedSearch(event) {
    event.preventDefault();
    searchString = document.querySelector("#breed-search-box").value;
    console.log(`Searched for: ${searchString}`);
    getMyDoggos(searchString);
}

async function populateDogDiv(divIndex, dogBreed) {
    const imageRef = dogBreed.reference_image_id;
    const imageRequestURL = `https://api.thedogapi.com/v1/images/${imageRef}`;
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
    dogDivs[divIndex].style.backgroundImage = `url("${imageURL}")`;
    const breedName = dogBreed.name;
    dogDivs[divIndex].innerHTML = breedName;
}

async function getMyDoggos(term) {
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
    const cleanArray = data.filter(item => item.reference_image_id !== undefined);
    const numOfBreeds = cleanArray.length;
    console.log(`Cleaned number of breeds: ${numOfBreeds}`);
    cleanArray.slice(0, dogDivs.length).forEach((item, idx) => populateDogDiv(idx, item));

}