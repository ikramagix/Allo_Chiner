$(document).ready(function () {
    $("#searchForm").on("submit", function (e) {
      e.preventDefault();
      let searchText = $("#searchText").val();
      fetchMovies(searchText);
    });
  
    $(document).ready(function () {
      animateMovies();
    });
  
    function fetchMovies(searchText) {
      $.ajax({
        method: "GET",
        url: `http://www.omdbapi.com/?s=${searchText}&apikey=834bdcbd`,
        dataType: "json",
        success: onMoviesReceived,
        error: function () {
          alert("Erreur lors de la récupération des données.");
        },
      });
    }
  
    function onMoviesReceived(response) {
      if (response.Response === "True") {
        displayMovies(response.Search);
      } else {
        $("#movies").html('<div class="col">Film non trouvé.</div>');
      }
    }
  
    function displayMovies(movies) {
      const template = $("#movie-template").html();
      movies.forEach((movie) => {
        let movieHtml = template
          .replace("{{id}}", movie.imdbID)
          .replace("{{poster}}", movie.Poster)
          .replace("{{title}}", movie.Title)
          .replace("{{release_date}}", movie.Year);
        $("#movies").append(movieHtml);
      });
      animateMovies();
    }
  
    function animateMovies() {
      const movies = $(".movie-card");
      const windowHeight = $(window).height();
  
      $(window).scroll(function () {
        const windowTop = $(window).scrollTop();
  
        movies.each(function () {
          const movieTop = $(this).offset().top;
  
          if (windowTop + windowHeight > movieTop) {
            $(this).addClass("visible");
          }
        });
      });
    }
  
    $(document).on("click", ".read-more", function () {
      let movieId = $(this).data("id");
      fetchMovieDetails(movieId);
    });
  
    function fetchMovieDetails(movieId) {
      $.ajax({
        method: "GET",
        url: `http://www.omdbapi.com/?i=${movieId}&apikey=834bdcbd`,
        dataType: "json",
        success: function (response) {
          displayMovieDetails(response);
        },
        error: function () {
          alert("Erreur lors de la récupération des détails du film.");
        },
      });
    }
  
    function displayMovieDetails(details) {
      let detailsHtml = `<strong>Date de sortie:</strong> ${details.Released}<br>
                             <strong>Genre:</strong> ${details.Genre}<br>
                             <strong>Scénario:</strong> ${details.Plot}`;
      $(".modal-body").html(detailsHtml);
      $("#movieModal").modal("show");
    }
  });