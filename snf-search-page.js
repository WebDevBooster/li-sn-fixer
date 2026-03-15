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
    function initSearchPage() {
    waitFor("#search-results-container ol li:nth-of-type(1)").then((el) => {
        updateLocalStorage();

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

        // Highlight list items whose lead URLs have been collected via the popup
        let collectedIds = null;
        chrome.storage.local.get(["liLeadURLs"], (result) => {
            const leadURLs = result.liLeadURLs || [];
            if (leadURLs.length) {
                collectedIds = new Set(
                    leadURLs.map(url => url.split('/sales/lead/')[1]?.split(',')[0]).filter(Boolean)
                );
                highlightCollectedLeads();
            }
        });

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

        handleListItems();
        const listObserver = new MutationObserver(() => {
            listObserver.disconnect();
            handleListItems();
            highlightCollectedLeads();
            listObserver.observe(resultsContainer, { childList: true, subtree: true });
        });
        const resultsContainer = document.querySelector("#search-results-container");
        if (resultsContainer) {
            listObserver.observe(resultsContainer, { childList: true, subtree: true });
        }
    });
    }

    initSearchPage();

    // Re-run on SPA navigation (pagination, filters, etc.)
    let lastSearchURL = document.location.href;
    setInterval(() => {
        const newURL = document.location.href;
        if (newURL !== lastSearchURL && /linkedin\.com\/sales\/search\/people/.test(newURL)) {
            lastSearchURL = newURL;
            refreshSearchPageCounter();
            // Wait for the old results to be replaced with new ones
            const oldFirstItem = document.querySelector("#search-results-container ol li:nth-of-type(1)");
            const navObserver = new MutationObserver(() => {
                const newFirstItem = document.querySelector("#search-results-container ol li:nth-of-type(1)");
                if (newFirstItem && newFirstItem !== oldFirstItem) {
                    navObserver.disconnect();
                    initSearchPage();
                }
            });
            navObserver.observe(document.body, { childList: true, subtree: true });
        }
    }, 500);
}
