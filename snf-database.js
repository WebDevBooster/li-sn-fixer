var idsSet; // Global but filled asynchronously

var urlsPromise = fetch(chrome.runtime.getURL('database_urls.json'))
    .then(response => response.json())
    .then(urls => {
        idsSet = new Set(
            urls.map(url => url.split('/sales/lead/')[1].split(',')[0])
        );
    })
    .catch(error => {
        console.error("Failed to load database_urls.json:", error);
    });

function highlightMatchingListItems(idsSet) {
    document.querySelectorAll("div[data-scroll-into-view]").forEach(function(el) {
        const dataValue = el.getAttribute("data-scroll-into-view");
        const idMatch = dataValue.match(/\(([^,]+)/);
        if (idMatch) {
            const id = idMatch[1];
            if (idsSet.has(id)) {
                el.closest("li").style.background = "repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)";
            }
        }
    });
}
