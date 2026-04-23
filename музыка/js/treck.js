(function() {
    const container = document.getElementById('tracksContainer');
    const popularContainer = document.getElementById('popularContainer');
    const filterTagsDiv = document.getElementById('filterTags');
    let currentAudio = null;
    let currentPlayBtn = null;

    const tracks = [
        { title: "зима", artist: "Антонио Вивальди", audio: "music/01.mp3", download: "music/01.mp3", ganr: "classic" },
        { title: "Back In Black", artist: "AC/DC", audio: "music/02.mp3", download: "music/02.mp3", ganr: "rock" },
        { title: "Thunderstruck", artist: "AC/DC", audio: "music/03.mp3", download: "music/03.mp3", ganr: "rock" },
        { title: "Black Velvet", artist: "Alannah Myles", audio: "music/04.mp3", download: "music/04.mp3", ganr: "blus" },
        { title: "Lofi Hip-Hop", artist: "ChillHop Beats", audio: "music/05.mp3", download: "music/05.mp3", ganr: "hip-hop" },
        { title: "Cumberland Gap", artist: "David Rawlings", audio: "music/06.mp3", download: "music/06.mp3", ganr: "cantry" },
        { title: "Dirty Heads", artist: "Vacation", audio: "music/07.mp3", download: "music/07.mp3", ganr: "reggy" },
        { title: "Sixteen Tons", artist: "Geoff Castellucci", audio: "music/08.mp3", download: "music/08.mp3", ganr: "blus" },
        { title: "Same To You", artist: "Melody Gardo", audio: "music/09.mp3", download: "music/09.mp3", ganr: "jazz" },
        { title: "даже если ты уйдешь", artist: "Сергей Лазарев", audio: "music/10.mp3", download: "music/10.mp3", ganr: "pop" },
        { title: "это всё она", artist: "Сергей Лазарев", audio: "music/11.mp3", download: "music/11.mp3", ganr: "pop" },
        { title: "Сдавайся", artist: "Сергей Лазарев", audio: "music/12.mp3", download: "music/12.mp3", ganr: "pop" },
        { title: "Gleam Of The Headlights", artist: "Steven Mudd", audio: "music/13.mp3", download: "music/13.mp3", ganr: "classic" },
        { title: "Get In", artist: "Toby Keith", audio: "music/14.mp3", download: "music/14.mp3", ganr: "cantry" },
        { title: "YourRapBeatsTV", artist: "Back To The Roots", audio: "music/15.mp3", download: "music/15.mp3", ganr: "hip-hop" },
        { title: "когда твоя девушка больна", artist: "КИНО", audio: "music/16.mp3", download: "music/16.mp3", ganr: "rock" },
        { title: "кончится лето", artist: "КИНО", audio: "music/17.mp3", download: "music/17.mp3", ganr: "rock" }
    ];

    const symbols = ['нет'];

    // --- Функции фильтрации и отрисовки ---
    function renderFilters() {
        const { artists, genres } = getFilters();
        filterTagsDiv.innerHTML = '';
        if (artists.length === 0 && genres.length === 0) return;

        artists.forEach(artist => {
            const tag = document.createElement('span');
            tag.className = 'filter-tag';
            tag.innerHTML = `${artist} <button class="tag-remove" data-type="artist" data-value="${artist}">✕</button>`;
            filterTagsDiv.appendChild(tag);
        });
        genres.forEach(genre => {
            const tag = document.createElement('span');
            tag.className = 'filter-tag';
            tag.innerHTML = `${genre} <button class="tag-remove" data-type="genre" data-value="${genre}">✕</button>`;
            filterTagsDiv.appendChild(tag);
        });

        // Обработчики удаления
        document.querySelectorAll('.tag-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = btn.dataset.type;
                const value = btn.dataset.value;
                if (type === 'artist') removeArtistFilter(value);
                else removeGenreFilter(value);
                renderAll();
            });
        });
    }

    function getFilteredTracks() {
        const { artists, genres } = getFilters();
        if (artists.length === 0 && genres.length === 0) return { filtered: [], rest: tracks };
        const filtered = tracks.filter(track => {
            const artistMatch = artists.length === 0 || artists.includes(track.artist);
            const genreMatch = genres.length === 0 || genres.includes(track.ganr);
            return artistMatch && genreMatch;
        });
        const rest = tracks.filter(track => !filtered.includes(track));
        return { filtered, rest };
    }

    function renderTrackCard(track, i) {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.innerHTML = `
            <div class="track-cover">${symbols[i % symbols.length]}</div>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
            <div class="track-actions">
                <button class="play-btn">▶</button>
                <a class="download-btn" href="${track.download}" download>⬇ Скачать</a>
            </div>
        `;
        const btn = card.querySelector('.play-btn');
        const audio = new Audio(track.audio);
        btn.addEventListener('click', () => {
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                if (currentPlayBtn) currentPlayBtn.textContent = '▶';
            }
            if (audio.paused) {
                audio.play();
                btn.textContent = '⏸';
                currentAudio = audio;
                currentPlayBtn = btn;
            } else {
                audio.pause();
                btn.textContent = '▶';
            }
        });
        audio.addEventListener('ended', () => {
            btn.textContent = '▶';
            if (currentAudio === audio) {
                currentAudio = null;
                currentPlayBtn = null;
            }
        });
        return card;
    }

    function renderAll() {
        renderFilters();
        const { filtered, rest } = getFilteredTracks();

        // Очищаем контейнеры
        container.innerHTML = '';
        popularContainer.innerHTML = '';

        // Блок "Подходящие треки" (если есть фильтры и есть результаты)
        if (filtered.length > 0) {
            const heading = document.createElement('h3');
            heading.className = 'section-title';
            heading.textContent = 'Подходящие треки';
            container.appendChild(heading);
            filtered.forEach((track, i) => container.appendChild(renderTrackCard(track, i)));
        } else if (getFilters().artists.length > 0 || getFilters().genres.length > 0) {
            const heading = document.createElement('h3');
            heading.className = 'section-title';
            heading.textContent = 'Подходящие треки';
            container.appendChild(heading);
            container.innerHTML += '<p class="empty-msg">Нет треков по заданным критериям</p>';
        }

        // Блок "Популярное" (все остальные)
        if (rest.length > 0) {
            const heading = document.createElement('h3');
            heading.className = 'section-title';
            heading.textContent = 'Популярное';
            popularContainer.appendChild(heading);
            rest.forEach((track, i) => popularContainer.appendChild(renderTrackCard(track, i)));
        }
    }

    // Добавим обработчик удаления фильтров на будущие элементы (делегирование)
    filterTagsDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-remove')) {
            const type = e.target.dataset.type;
            const value = e.target.dataset.value;
            if (type === 'artist') removeArtistFilter(value);
            else removeGenreFilter(value);
            renderAll();
        }
    });

    // Первоначальная отрисовка
    renderAll();
})();