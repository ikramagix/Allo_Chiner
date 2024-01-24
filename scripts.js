$.get("config.php", function(data) {
  const la_kley = data.API_KEY;
  
  $(document).ready(function () {
  $('#searchForm').on('submit', (e) => {
    e.preventDefault();
    const searchText = $('#searchText').val();
    fetchMovies(searchText);
  });

  function fetchMovies(searchText) {
    $.ajax({
      method: 'GET',
      url: `http://www.omdbapi.com/?s=${searchText}&apikey=${la_kley}`,
      dataType: 'json',
      success: (data) => {
        if (data.Response === 'True') {
          updateGallery(data.Search);
        } else {
          $('#movieGallery').html('<div class="col">Film non trouvé.</div>');
        }
      },
      error: () => {
        alert('Erreur lors de la récupération des données.');
      },
    });
  }

  function updateGallery(movies) {
    let galleryHtml = '';
    movies.forEach((movie) => {
      galleryHtml += `
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="gallery-item h-100">
            <img src="${movie.Poster}" class="img-fluid" alt="${movie.Title}">
            <div class="gallery-links d-flex align-items-center justify-content-center">
              <a href="${movie.Poster}" title="${movie.Title}" class="glightbox preview-link"><i class="bi bi-arrows-angle-expand"></i></a>
              <a href="#" class="details-link read-more" data-id="${movie.imdbID}"><i class="bi bi-link-45deg"></i> En savoir plus</a>
            </div>
          </div>
        </div>`;
    });
    $('#movieGallery').html(galleryHtml);
  }

  function onMoviesReceived(response) {
    if (response.Response === 'True') {
      displayMovies(response.Search);
    } else {
      $('#movies').html('<div class="col">Film non trouvé.</div>');
    }
  }

  function displayMovies(movies) {
    $('#movies').empty();
    movies.forEach((movie) => {
      const movieHtml = `
        <div class="col-md-4 mb-3">
          <div class="card movie-card">
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" />
            <div class="card-body">
              <h5 class="card-title">${movie.Title}</h5>
              <p class="card-text">${movie.Year}</p>
              <a href="#" class="btn btn-primary read-more" data-id="${movie.imdbID}">En savoir plus</a>
            </div>
          </div>
        </div>`;
      $('#movies').append(movieHtml);
    });
    animateMovies();
  }

  function animateMovies() {
    const windowHeight = $(window).height();
    $(window).scroll(() => {
      $('.movie-card').each(function () {
        const movieTop = $(this).offset().top;
        const windowTop = $(window).scrollTop();

        if (windowTop + windowHeight > movieTop) {
          $(this).css({ 'opacity': 1, 'transform': 'translateX(0)' });
        }
      });
    }).scroll(); // Trigger scroll handler on page load
  }

  $(document).on('click', '.read-more', function () {
    const movieId = $(this).data('id');
    fetchMovieDetails(movieId);
  });

  function fetchMovieDetails(movieId) {
    $.ajax({
      method: 'GET',
      url: `http://www.omdbapi.com/?i=${movieId}&apikey=${la_kley}`,
      dataType: 'json',
      success: (response) => {
        displayMovieDetails(response);
      },
      error: () => {
        alert('Erreur lors de la récupération des détails du film.');
      },
    });
  }

  function displayMovieDetails(details) {
    const detailsHtml = `
      <strong>Date de sortie:</strong> ${details.Released}<br>
      <strong>Genre:</strong> ${details.Genre}<br>
      <strong>Scénario:</strong> ${details.Plot}`;
    $('.modal-body').html(detailsHtml);
    $('#movieModal').modal('show');
  }

  // Fermeture de la modale avec le bouton
  $(document).on('click', '.close[data-dismiss="modal"]', function () {
    $('#movieModal').modal('hide');
  });
});

$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/randomword',
    headers: { 'X-Api-Key': 'YOUR_API_KEY'},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});