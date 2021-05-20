
const dogDiv = document.querySelectorAll(".panel-doggo");
const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", breedSearch);
var searchString = "hound"

getMyDoggos(searchString);

function breedSearch(event) {
    event.preventDefault();
    searchString = document.querySelector("#breed-search-box").value;
    console.log(`Searched for: ${searchString}`);
    getMyDoggos(searchString);
}

async function populateDogDiv(divIndex, dogIndex, data) {
    const imageRef = data[dogIndex].reference_image_id;
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
    dogDiv[divIndex].style.backgroundImage = `url("${imageURL}")`;
    const breedName = data[dogIndex].name;
    dogDiv[divIndex].innerHTML = breedName
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
    const numOfBreeds = data.length;
    console.log(`Number of breeds: ${numOfBreeds}`);
    // const breedsWithPics = data.filter(item => item.)

    populateDogDiv(0, 0, data)
    populateDogDiv(1, 1, data)
    populateDogDiv(2, 2, data)
    populateDogDiv(3, 3, data)
    populateDogDiv(4, 4, data)
    populateDogDiv(5, 5, data)
}