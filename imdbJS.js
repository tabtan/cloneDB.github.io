let dropDownItems = document.querySelector("#datalistOptions");
var enteredWord = document.querySelector("#searchMovieName");

var favMovieGrid = document.querySelector("#favouriteMovieList");

// the keyup event is used so that as soon as the word is typed , we invoke the function thus giving the user the current and
// realtime result of the word  typed
enteredWord.addEventListener("keyup", fetchApiDataToLocalStorage);

function fetchApiDataToLocalStorage() {
  // the api search result is fetched according to the word typed in the input box
  //&s is used as its a required parameter in omdb Api
  fetch(`https://www.omdbapi.com/?apikey=5f3eb064&s=${enteredWord.value}`)
    //the api data which was currently in the form of an array of objects is converted into json as to store in localStorage
    .then((apiData) => apiData.json())

    //the renderDropDownList function is invoked on the converted local storage data and it is stored in the localstorage
    //with key name"searchList"
    .then((apiData) => {
      renderDropDownList(apiData.Search);
      localStorage.setItem("searchList", JSON.stringify(apiData.Search));
    });
}
function renderDropDownList(searchList) {
  //initializing element with blank value
  let displayedDropDownList = "";

  //since multiple results are present in api ,the for loop is applied to traverse all the results
  for (let i = 0; i < searchList.length; i++) {
    // a dropdown list is created which only shows the titles of the movies
    displayedDropDownList += `<option value="${searchList[i].Title}">`;
  }

  dropDownItems.innerHTML = displayedDropDownList;
}

//when the state is changed , a specific function is called
enteredWord.addEventListener("change", showSelectedMoviedetails);

function showSelectedMoviedetails() {
  //api is fetched with title as a parameter
  fetch(`https://www.omdbapi.com/?apikey=5f3eb064&t=${enteredWord.value}`)
    //the fetched api is converted to json so as to be stored in localStorage
    .then((movieTitleData) => movieTitleData.json())
    //array with key 'movieData' is created in localstorage  on which entire selected movie details are stored
    .then((movieTitleData) => {
      renderMovieDataCard(movieTitleData);
      localStorage.setItem("movieData", JSON.stringify(movieTitleData));
    });
}

function renderMovieDataCard(selectedMovieData) {
  let appendMovie_Details = document.querySelector("#movieDetailDisplay");
  //if appendMovieDetails is present/called , its display style is changed to flex
  if (appendMovie_Details) appendMovie_Details.style.display = "flex";
  //only appenMovieDetails is required when the func renderMovieDataCard is called, so the favMovieGrid display should be hidden as to
  //avoid overlapping so display is set to none
  if (favMovieGrid) favMovieGrid.style.display = "none";
  //  ?? is also called as nullish coescalating operator which returns the right side value if left one is null or undefined
  let favouritelist = JSON.parse(
    localStorage.getItem("favouriteMovie") ?? "[]"
  );
  //
  let isFavourite = favouritelist.some(
    (renderLike) => renderLike.imdbID === selectedMovieData.imdbID
  );
  //html for card
  let movieCard = `<div class="card" ">
    <img class="card-img-top" src="${
      selectedMovieData.Poster
    }" alt="No image Found">
    <div class="card-body">
      <h3 class="card-title">${
        selectedMovieData.Title
      } <input id="card-checkbox" type="checkbox" onchange="handleChange(this)" ${
    isFavourite && "checked"
  }></h3>
      <h4 class="card-year">${selectedMovieData.Year}</h4>
      
      <p class="card-text">${selectedMovieData.Plot}</p>
     
    </div>
  </div>`;
  appendMovie_Details.innerHTML = movieCard;

  let appendMovieRating = document.querySelector("#movieRatingDisplay");
  //flex is applied to movie ratings
  if (appendMovieRating) appendMovieRating.style.display = "flex";

  // to extract movie rating array from api data
  const rating = selectedMovieData.Ratings;
  let ratingPush = "";
  for (let i = 0; i < rating.length; i++) {
    ratingPush += `<div>${rating[i].Source}:<span>${rating[i].Value}</span></div>`;
  }
  appendMovieRating.innerHTML = ratingPush;
}
//function to add/remove movies whose checkbox state is changed into favouritemovie array
function handleChange(checkbox) {
  let favouritelist = JSON.parse(
    localStorage.getItem("favouriteMovie") ?? "[]"
  );

  let likedmovie = JSON.parse(localStorage.getItem("movieData"));
  //if checkbox is checked , the movie details are pushed into localstorage
  if (checkbox.checked === true) {
    favouritelist.push(likedmovie);
    localStorage.setItem("favouriteMovie", JSON.stringify(favouritelist));
  }
  //if checkbox is unchecked , the movie is removed from the favouritelist array created in localstorage
  else {
    favouritelist = [
      ...favouritelist.filter((del) => del.imdbID !== likedmovie.imdbID),
    ];
    localStorage.setItem("favouriteMovie", JSON.stringify(favouritelist));
  }
}

var favouriteMovieList = document.querySelector("#favouriteMovieCards");
// function to render favouite movies after the favourite movies button is clicked
favouriteMovieList.addEventListener("click", () => {
  let favMovieList = JSON.parse(localStorage.getItem("favouriteMovie"));
  renderFavouriteMovies(favMovieList);
});

//function to filter unchecked movies then re-render the favourite movies
function favListFilter(imdbID) {
  let favouritelist = JSON.parse(
    localStorage.getItem("favouriteMovie") ?? "[]"
  );
  // if the checkbox is unchecked , the movie is filtered from the exesting list
  favouritelist = [...favouritelist.filter((del) => del.imdbID !== imdbID)];
  //the new filtered list is then stored in localstorage
  localStorage.setItem("favouriteMovie", JSON.stringify(favouritelist));
  //renderFavouriteMovies is called again so as to display the rendered list
  renderFavouriteMovies(favouritelist);
}

//function to render the movie details on the favourite movie page
function renderFavouriteMovies(favouriteMovieArr) {
  let appendMovie_Details = document.querySelector("#movieDetailDisplay");
  if (appendMovie_Details) appendMovie_Details.style.display = "none";
  let appendMovieRating = document.querySelector("#movieRatingDisplay");
  if (appendMovieRating) appendMovieRating.style.display = "none";
  let movieGrid = "";
  if (favMovieGrid) favMovieGrid.style.display = "grid";
  for (let i = 0; i < favouriteMovieArr.length; i++) {
    movieGrid += ` <div class="favCard" ">
    <img class="card-img-top" src="${favouriteMovieArr[i].Poster}" alt="Card image cap">
    <div class="card-body">
      <h3 class="card-title">${favouriteMovieArr[i].Title} <input id="cardCheckbox" type="checkbox" onchange="favListFilter('${favouriteMovieArr[i].imdbID}')"checked></h3>
       
      
      
     
    </div>
  </div>
`;
    favMovieGrid.innerHTML = movieGrid;
  }
}
