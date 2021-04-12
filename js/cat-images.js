const imageLimit = 5; // Number of images loaded in single request
let categoryId = 4; // Default category for cat images i.e Sunglasses on page load
const categoryAPI = 'https://api.thecatapi.com/v1/categories';
let catApiPrefix = 'https://api.thecatapi.com/v1/images/search?category_ids=';
let catImagesApi = `${catApiPrefix}${categoryId}&limit=${imageLimit}`;

/****************************************************************************************************************
To dynamically add row in table for loading cat images with selected category
*****************************************************************************************************************/

let appendCatImages = (data) => {
	const tableContent = document.querySelector('#catImages > tbody');
	let row = document.createElement('tr');
	tableContent.appendChild(row);
	data.forEach(image => {
		let cell = document.createElement('td');
		let catFileName = image['url'].split('/');
		cell.innerHTML = `<a href="${image["url"]}"> <img src="${image["url"]}"> </a></br> <p class='fileName'>${catFileName[catFileName.length - 1]}</p>`;
		row.appendChild(cell);	
	});
}


/****************************************************************************************************************
To dynamically add values in dropdown for category selection
*****************************************************************************************************************/

let appendCategory = (data) => {
	let dropdown = document.getElementById('categoryList');
	data.forEach(image => {
		option = document.createElement('option');
		option.text = image.name;
		option.value = image.id;
		dropdown.add(option);
		/* Default selected category for cat images i.e Sunglasses on page load */
		document.getElementById('categoryList').options.selectedIndex = 5;
	});
}

/****************************************************************************************************************
Called on change of category selection and according to category selected, cat images are fetched from API
*****************************************************************************************************************/
function selectCategory(selectedCategory) {
	let categoryId = selectedCategory.value;
	let catImagesApi = `${catApiPrefix}${categoryId}&limit=${imageLimit}`;
	var tableContent = document.querySelector('#catImages > tbody');
	/* To clear existing cat images on category change */
	for (var i = 0; i < tableContent.rows.length;) {
		tableContent.deleteRow(i);
	}
	ajax_get(catImagesApi, appendCatImages);
}

/****************************************************************************************************************
To load more cat Images for selected category on button click
*****************************************************************************************************************/
function loadMoreCatImages() {
	let categoryId = document.getElementById('categoryList').value;
	let catImagesApi = `${catApiPrefix}${categoryId}&limit=${imageLimit}`;
	ajax_get(catImagesApi, appendCatImages);
}

/****************************************************************************************************************
For fetching response from cat API
*****************************************************************************************************************/
function ajax_get(url, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			try {
				var data = JSON.parse(xmlhttp.responseText);
			} catch (err) {
				console.log(err.message + 'in' + xmlhttp.responseText);
				return;
			}
			callback(data);
		}
	};
	xmlhttp.open('GET', url, true);
	xmlhttp.send();
}

/* To fetch category dropdown values from CAT API on page load */
ajax_get(categoryAPI, appendCategory);

/* To fetch list of cats with Sunglasses from CAT API on load */
ajax_get(catImagesApi, appendCatImages);