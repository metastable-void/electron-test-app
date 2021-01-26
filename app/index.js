const element = document.querySelector('#results');
element.append(JSON.stringify({
    debug: window.menheraNative,
    location: location.href,
    origin: window.origin,
}, null, 4));
