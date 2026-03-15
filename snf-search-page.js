if (linkedinProfilePageMatch) {
    console.log("Linkedin profile page detected");
    waitFor("#artdeco-modal-outlet .artdeco-modal.send-invite textarea#custom-message").then((el) => {
        console.log("customMessageBox detected!");
        const customMessageBox = document.querySelector("#artdeco-modal-outlet .artdeco-modal.send-invite textarea#custom-message");
        if (customMessageBox) {
            customMessageBox.style.height = "180px";
            const resizeObserver = new MutationObserver(() => {
                if (!document.contains(customMessageBox)) {
                    resizeObserver.disconnect();
                } else {
                    customMessageBox.style.height = "180px";
                }
            });
            resizeObserver.observe(customMessageBox, { attributes: true, attributeFilter: ["style"] });
        }
    });
}

if (searchPageMatch) {
    let collectedIds = null;

    function loadCollectedIds() {
        chrome.storage.local.get(["liLeadURLs"], (result) => {
            const leadURLs = result.liLeadURLs || [];
            if (leadURLs.length) {
                collectedIds = new Set(
                    leadURLs.map(url => url.split('/sales/lead/')[1]?.split(',')[0]).filter(Boolean)
                );
            }
        });
    }

    function highlightCollectedLeads() {
        if (!collectedIds) return;
        document.querySelectorAll("div[data-scroll-into-view]").forEach(function(el) {
            const dataValue = el.getAttribute("data-scroll-into-view");
            const idMatch = dataValue.match(/\(([^,]+)/);
            if (idMatch) {
                const id = idMatch[1];
                if (collectedIds.has(id)) {
                    el.closest("li").style.background = "repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)";
                }
            }
        });
    }

    function manipulateListElement(element, index) {
        if (element.querySelector("span[data-anonymize=title]") !== null) {
            const spanElement = element.querySelector("span[data-anonymize=title]");
            const spanText = spanElement.textContent;

            if (/project/i.test(spanText)) {
                const highlightedText = spanText.replace(/project/gi, '<span style="background-color: peachpuff;">Project</span>');
                spanElement.innerHTML = highlightedText;
            }
        }

        // Hide non-premium profiles (for now I'm only targeting premium profiles)
        if (element.querySelector("span[data-anonymize=person-name]") !== null
            && element.querySelector("li-icon[type=linkedin-premium-gold-icon]") === null
            && element.querySelector("li-icon[aria-label^=Viewed]") !== null
            && element.querySelector(".SNF-viewed-non-premium") === null) {
            element.classList.add("SNF-viewed-non-premium");
        }

        if (element.querySelector("span[data-anonymize=person-name]") !== null
            && element.querySelector("li-icon[type=linkedin-premium-gold-icon]") === null
            && element.querySelector(".SNF-non-premium") === null) {
            element.classList.add("SNF-non-premium");
        }

        if (element.querySelector("li-icon[aria-label^=Viewed]") !== null && element.querySelector(".SNF-viewed-premium") === null) {
            element.classList.add("SNF-viewed-premium");
        }

        // most "out-of-network" profiles are useless for me
        if (element.querySelector("div[class^=_out-of-network]") !== null && element.querySelector(".SNF-out-of-network") === null) {
            element.classList.add("SNF-out-of-network");
        }

        // Highlight list items that are already in my database
        urlsPromise.then(() => {
            if (idsSet) {
                highlightMatchingListItems(idsSet);
            } else {
                console.warn("idsSet is undefined - JSON might not have loaded.");
            }
        });
    }

    function handleListItems() {
        const listArray = document.querySelectorAll("li.artdeco-list__item");
        const aboutSectionsArray = document.querySelectorAll("li.artdeco-list__item > div > div > div:nth-of-type(2) > div > div:nth-of-type(2)");
        const yearsArray = document.querySelectorAll("li.artdeco-list__item > div > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div:nth-of-type(4)");

        if (listArray.length) {
            listArray.forEach(manipulateListElement);
        }

        if (aboutSectionsArray.length) {
            aboutSectionsArray.forEach(function (el) {
                if (el.offsetParent !== null) {
                    el.style.display = "none";
                }
            });
        }

        if (yearsArray.length) {
            yearsArray.forEach(function (el) {
                if (el.offsetParent !== null) {
                    el.style.display = "none";
                }
            });
        }
    }

    function runSearchPageLogic() {
        loadCollectedIds();
        handleListItems();
        highlightCollectedLeads();
    }

    // Watch for lazily loaded items on scroll
    let scrollObserver = null;
    function startScrollObserver() {
        if (scrollObserver) scrollObserver.disconnect();
        const resultsContainer = document.querySelector("#search-results-container");
        if (resultsContainer) {
            scrollObserver = new MutationObserver(() => {
                scrollObserver.disconnect();
                handleListItems();
                highlightCollectedLeads();
                scrollObserver.observe(resultsContainer, { childList: true, subtree: true });
            });
            scrollObserver.observe(resultsContainer, { childList: true, subtree: true });
        }
    }

    // Initial run: wait for first list item to appear
    let lastFirstItemText = "";
    waitFor("#search-results-container ol li:nth-of-type(1)").then((el) => {
        updateLocalStorage();
        runSearchPageLogic();
        startScrollObserver();
        lastFirstItemText = document.querySelector("#search-results-container ol li:nth-of-type(1) span[data-anonymize=person-name]")?.textContent || "";
    });

    // Detect SPA navigation (pagination, filters, etc.) via URL polling
    let lastSearchURL = document.location.href;

    setInterval(() => {
        const newURL = document.location.href;
        if (newURL !== lastSearchURL) {
            lastSearchURL = newURL;
            if (/linkedin\.com\/sales\/search\/people/.test(newURL)) {
                refreshSearchPageCounter();
                // Poll until the first person's name changes (new page content loaded)
                let fallbackFired = false;
                const pollForNewContent = setInterval(() => {
                    const currentFirstItemText = document.querySelector("#search-results-container ol li:nth-of-type(1) span[data-anonymize=person-name]")?.textContent || "";
                    if (currentFirstItemText && currentFirstItemText !== lastFirstItemText) {
                        lastFirstItemText = currentFirstItemText;
                        clearInterval(pollForNewContent);
                        if (!fallbackFired) {
                            runSearchPageLogic();
                            startScrollObserver();
                        }
                    }
                }, 200);
                // Fallback: run after 2s regardless (e.g. same first name on both pages)
                setTimeout(() => {
                    clearInterval(pollForNewContent);
                    if (!fallbackFired) {
                        fallbackFired = true;
                        lastFirstItemText = document.querySelector("#search-results-container ol li:nth-of-type(1) span[data-anonymize=person-name]")?.textContent || "";
                        runSearchPageLogic();
                        startScrollObserver();
                    }
                }, 2000);
            }
        }
    }, 500);
}
