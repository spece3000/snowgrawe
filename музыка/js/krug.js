(function() {
    const main = document.getElementById('genreMain');
    const items = Array.from(document.querySelectorAll('.ganr'));
    const areaClasses = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ringOrder = ['a', 'b', 'd', 'f', 'h', 'g', 'e', 'c'];
    const len = ringOrder.length;
    let isAnimating = false;

    function getItemByArea(area) {
        return items.find(el => el.classList.contains(area));
    }

    function getRingIndex(el) {
        const area = areaClasses.find(cls => el.classList.contains(cls));
        return ringOrder.indexOf(area);
    }

    async function animateToTop(clickedItem) {
        if (isAnimating) return;
        const topItem = getItemByArea('a');
        if (clickedItem === topItem) {
            if (typeof onGenreAnimationComplete === 'function') {
                onGenreAnimationComplete(clickedItem);
            }
            return;
        }
        isAnimating = true;
        main.classList.add('dimmed');
        clickedItem.classList.add('moving');
        const currentIdx = getRingIndex(clickedItem);
        let steps = (currentIdx - 0 + len) % len;
        for (let s = steps; s > 0; s--) {
            await new Promise((resolve) => {
                const currentIdxNow = getRingIndex(clickedItem);
                const prevIdx = (currentIdxNow - 1 + len) % len;
                const prevArea = ringOrder[prevIdx];
                const prevItem = getItemByArea(prevArea);
                const firstRects = items.map(el => el.getBoundingClientRect());
                const currentArea = areaClasses.find(cls => clickedItem.classList.contains(cls));
                clickedItem.classList.remove(currentArea);
                clickedItem.classList.add(prevArea);
                prevItem.classList.remove(prevArea);
                prevItem.classList.add(currentArea);
                items.forEach(el => el.offsetTop);
                const lastRects = items.map(el => el.getBoundingClientRect());
                items.forEach((el, i) => {
                    const dx = firstRects[i].left - lastRects[i].left;
                    const dy = firstRects[i].top - lastRects[i].top;
                    if (dx !== 0 || dy !== 0) {
                        el.style.transform = `translate(${dx}px, ${dy}px)`;
                        el.style.transition = 'none';
                    } else {
                        el.style.transform = '';
                    }
                });
                requestAnimationFrame(() => {
                    items.forEach(el => {
                        el.style.transition = 'transform 0.25s ease-in-out';
                        el.style.transform = '';
                    });
                    let ended = 0;
                    const onEnd = (e) => {
                        if (e.propertyName === 'transform') {
                            ended++;
                            if (ended >= items.length) {
                                items.forEach(el => {
                                    el.style.transition = '';
                                    el.style.transform = '';
                                    el.removeEventListener('transitionend', onEnd);
                                });
                                resolve();
                            }
                        }
                    };
                    items.forEach(el => el.addEventListener('transitionend', onEnd));
                    setTimeout(() => resolve(), 200);
                });
            });
        }
        clickedItem.classList.remove('moving');
        main.classList.remove('dimmed');
        isAnimating = false;
        if (typeof onGenreAnimationComplete === 'function') {
            onGenreAnimationComplete(clickedItem);
        }
    }

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            animateToTop(e.currentTarget);
        });
    });
})();