function fitTextToContainer(spanElement) {
    const container = spanElement.parentElement;
    if (!container) return;
    
    let fontSize = 40;
    const minFontSize = 10;
    
    spanElement.style.fontSize = fontSize + 'px';
    
    while (spanElement.scrollWidth > container.clientWidth && fontSize > minFontSize) {
        fontSize--;
        spanElement.style.fontSize = fontSize + 'px';
    }
}

document.querySelectorAll('.songer_text-wrapper span').forEach(fitTextToContainer);