const STORAGE_ARTISTS = 'musicpad_artists';
const STORAGE_GENRES = 'musicpad_genres';

function getFilters() {
    const artists = JSON.parse(localStorage.getItem(STORAGE_ARTISTS) || '[]');
    const genres = JSON.parse(localStorage.getItem(STORAGE_GENRES) || '[]');
    return { artists, genres };
}

function addArtistFilter(artist) {
    const { artists } = getFilters();
    if (!artists.includes(artist)) {
        artists.push(artist);
        localStorage.setItem(STORAGE_ARTISTS, JSON.stringify(artists));
        return true;
    }
    return false;
}

function addGenreFilter(genre) {
    const { genres } = getFilters();
    if (!genres.includes(genre)) {
        genres.push(genre);
        localStorage.setItem(STORAGE_GENRES, JSON.stringify(genres));
        return true;
    }
    return false;
}

function removeArtistFilter(artist) {
    const { artists } = getFilters();
    const updated = artists.filter(a => a !== artist);
    localStorage.setItem(STORAGE_ARTISTS, JSON.stringify(updated));
}

function removeGenreFilter(genre) {
    const { genres } = getFilters();
    const updated = genres.filter(g => g !== genre);
    localStorage.setItem(STORAGE_GENRES, JSON.stringify(updated));
}