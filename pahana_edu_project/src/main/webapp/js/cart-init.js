document.addEventListener("DOMContentLoaded", function () {
    console.log('Dispatching cartContentLoaded event');
    const event = new Event('cartContentLoaded');
    document.dispatchEvent(event);
});