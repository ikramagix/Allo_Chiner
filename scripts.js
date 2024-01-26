document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      let searchText = document.getElementById("searchText").value;
      fetchMovies(searchText);
    });

  animateMovies();

  function fetchMovies(searchText) {
    fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(
        searchText
      )}&apikey=834bdcbd`
    )
      .then((response) => response.json())
      .then(onMoviesReceived)
      .catch((error) => {
        alert("Erreur lors de la récupération des données: " + error);
      });
  }

  function onMoviesReceived(response) {
    if (response.Response === "True") {
      displayMovies(response.Search);
    } else {
      document.getElementById("movies").innerHTML =
        '<div class="col">Film non trouvé.</div>';
    }
  }

  function displayMovies(movies) {
    let moviesContainer = document.getElementById("movies");
    moviesContainer.innerHTML = ""; // Clear existing movies
    movies.forEach((movie) => {
      let movieElement = document.createElement("div");
      movieElement.classList.add("col-md-4", "mb-3");
      movieElement.innerHTML = `
        <div class="card movie-card">
          <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" />
          <div class="card-body">
            <h5 class="card-title">${movie.Title}</h5>
            <p class="card-text">${movie.Year}</p>
            <button class="btn btn-primary read-more" data-id="${movie.imdbID}">
              En savoir plus
            </button>
          </div>
        </div>`;
      moviesContainer.appendChild(movieElement);
    });
    animateMovies();
  }

  function animateMovies() {
    let movies = document.querySelectorAll(".movie-card");
    let windowHeight = window.innerHeight;

    window.addEventListener("scroll", function () {
      let windowTop = window.scrollY;

      movies.forEach((movie) => {
        let movieTop = movie.getBoundingClientRect().top + windowTop;

        if (windowTop + windowHeight > movieTop) {
          movie.classList.add("visible");
        }
      });
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("read-more")) {
      let movieId = e.target.getAttribute("data-id");
      fetchMovieDetails(movieId);
    }
  });

  function fetchMovieDetails(movieId) {
    fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=834bdcbd`)
      .then((response) => response.json())
      .then(displayMovieDetails)
      .catch((error) => {
        alert("Erreur lors de la récupération des détails du film: " + error);
      });
  }

  function displayMovieDetails(details) {
    let modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = `
      <strong>Date de sortie:</strong> ${details.Released}<br>
      <strong>Genre:</strong> ${details.Genre}<br>
      <strong>Scénario:</strong> ${details.Plot}`;
    let movieModal = new bootstrap.Modal(
      document.getElementById("movieModal"),
      {}
    );
    movieModal.show();
  }
});
