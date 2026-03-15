// Detects when an element with a given selector appears.
// From this post: https://stackoverflow.com/a/61511955/8270343
function waitFor(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hideSection(element) {
    element.style.display = "none";
}

function autoScrollDownAndUp() {
    let timeout = getRandInteger(999, 1555);
    setTimeout(function () {
        const minScroll = window.innerHeight * 1;
        const maxScroll = window.innerHeight * 1.5;
        const scrollDistance = getRandInteger(minScroll, maxScroll);
        const scrollDownSpeed = getRandInteger(444, 888);
        const scrollUpSpeed = getRandInteger(555, 999);
        const scrollUpDelay = getRandInteger(999, 2222);
        console.log(`scroll...`);
        console.log(`Distance: ${scrollDistance}`);
        console.log(`DownSpeed: ${scrollDownSpeed}`);
        console.log(`UpSpeed: ${scrollUpSpeed}`);
        console.log(`Delay: ${scrollUpDelay}`);
        console.log(`ScrollTimeTotal: ${scrollDownSpeed + scrollUpSpeed + scrollUpDelay}`);

        window.scrollTo({ top: scrollDistance, behavior: 'smooth' });
    }, timeout);
}

var docHeight = "0";

waitFor("#SNF-doc-height").then((el) => {
    const docHeightSection = document.querySelector("#SNF-doc-height");
    setInterval(function () {
        if (docHeightSection) {
            docHeight = `doc height: ${document.documentElement.scrollHeight.toLocaleString()}px`;
            docHeightSection.textContent = docHeight;
        }
    }, 250);
});

String.prototype.cleanUpString = function () {
    return this
        .normalize("NFKC")
        .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$£€+]/gu, "")
        .replace(/^[+'"=]/, "/$&")
        .replace(/\s\s+/g, " ")
        .trim();
}
