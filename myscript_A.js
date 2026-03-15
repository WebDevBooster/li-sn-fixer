let idsSet; // Global but filled asynchronously

// Start loading the JSON file as soon as the script loads
const urlsPromise = fetch(chrome.runtime.getURL('database_urls.json'))
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

// Content scripts run at document_idle by default, so DOM is already ready.
{
const currentURL = document.location.href;
const salesLeadPageMatch = currentURL.match(/linkedin\.com\/sales\/lead/);
const searchPageMatch = currentURL.match(/linkedin\.com\/sales\/search\/people/);
const linkedinProfilePageMatch = currentURL.match(/linkedin\.com\/in\//);
const body = document.body;
const readyTime = performance.now();

var checkTime0,
    runScriptsOnceTime,
    checkTimeOpenBadgeDetected,
    checkTimeFirstEmailDetected,
    collectEmailsTime,
    appendCollectedEmailsTime,
    checkTime1,
    checkTime2,
    checkTime3,
    checkTime4,
    checkTime5,
    findMatchingKeywordsTime,
    copyDataToClipboardTime;
// This Mutation Observer detects when an element with a given selector appears.
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

function updateLocalStorage() {
    let snf8hrStart,
        snf19hrStart,
        snf8hrTotal,
        snf19hrTotal;
    let snCounter = {
        snfLeads: null,
        snfNonLeads: null
    };
    let prevLeads = localStorage.getItem("snfLeads");
    let prevNonLeads = localStorage.getItem("snfNonLeads");
    snf8hrTotal = localStorage.getItem("snf8hrTotal");
    snf19hrTotal = localStorage.getItem("snf19hrTotal");
    console.log(`prevLeads: ${prevLeads}`);
    console.log(`prevNonLeads: ${prevNonLeads}`);

    function initializeCounters() {
        if (prevLeads && prevNonLeads) {
            snCounter.snfLeads = prevLeads;
            snCounter.snfNonLeads = prevNonLeads;

        } else {
            localStorage.setItem("snfLeads", "0");
            localStorage.setItem("snfNonLeads", "0");
            snf8hrStart = new Date().getTime();
            snf8hrStart = snf8hrStart.toString();
            localStorage.setItem("snf8hrStart", snf8hrStart);
            snf19hrStart = new Date().getTime();
            snf19hrStart = snf19hrStart.toString();
            localStorage.setItem("snf19hrStart", snf19hrStart);

            localStorage.setItem("snf8hrTotal", "0");
            localStorage.setItem("snf19hrTotal", "0");
        }
        console.log(`previous snCounter:`);
        console.log(snCounter);
        return snCounter;
    }
    initializeCounters();

    let currentLeads,
        currentNonLeads;
    let ratio = 0;
    function updateTotals() {
        snf8hrTotal = parseInt(localStorage.getItem("snf8hrTotal"));
        snf19hrTotal = parseInt(localStorage.getItem("snf19hrTotal"));

        if (snf8hrTotal) {
            ratio = Math.round((currentLeads / snf8hrTotal * 100));
            if (snf8hrTotal > 365) {
                document.querySelectorAll("#SNF-counter .total, #SNF-counter-search-page .total").forEach(function(el) { el.classList.add("warning"); });
            }
            if (snf8hrTotal < 366) {
                document.querySelectorAll("#SNF-counter .total, #SNF-counter-search-page .total").forEach(function(el) { el.classList.remove("warning"); });
            }
        }
        if (snf19hrTotal) {
            if (snf19hrTotal > 785) {
                document.querySelectorAll("#SNF-counter .day-total, #SNF-counter-search-page .day-total").forEach(function(el) { el.classList.add("warning"); });
            }
            if (snf19hrTotal < 786) {
                document.querySelectorAll("#SNF-counter .day-total, #SNF-counter-search-page .day-total").forEach(function(el) { el.classList.remove("warning"); });
            }
        }
    }

    function getTrackedTime(/*Number*/ hrs) {
        let snfStartTime = "";
        let snfTrackedKey = "";
        let snfTrackedTime = "";
        let nowTime = new Date().getTime();

        if (!hrs || hrs === 8) {
            snfStartTime = `snf8hrStart`;
            snfTrackedKey = `snf8hrTracker`;
            calculateAndSetTime();
        } else if (typeof hrs === "number") {
            snfStartTime = `snf${hrs}hrStart`;
            snfTrackedKey = `snf${hrs}hrTracker`;
            calculateAndSetTime();
        }

        function calculateAndSetTime() {
            snfStartTime = parseInt(localStorage.getItem(snfStartTime));
            if (snfStartTime) {
                let timeDiff = nowTime - snfStartTime;
                let mins = Math.floor(timeDiff / 1000 / 60);
                mins = mins % 60; // throw away hours
                mins = (mins < 10) ? "0" + mins : mins;
                let hrs = Math.floor(timeDiff / 1000 / 60 / 60);
                snfTrackedTime = `${hrs}:${mins}`;
            }

            localStorage.setItem(snfTrackedKey, snfTrackedTime);
        }
        return snfTrackedTime;
    }

    function appendStats() {
        currentLeads = parseInt(localStorage.getItem("snfLeads"));
        currentNonLeads = parseInt(localStorage.getItem("snfNonLeads"));
        updateTotals();

        getTrackedTime();

        if (salesLeadPageMatch) {
            body.insertAdjacentHTML("beforeend", `
            <div id="SNF-counter">
            <span class="lead">
                L: ${currentLeads}<br>${ratio}%
            </span>
            <span class="non-lead" title="click this to mark this profile as non-lead and close tab">
                N: ${currentNonLeads}
            </span>
            <span class="total">
                Total:<br>${snf8hrTotal}
            </span>
            <span class="timer" title="time in this 8-hr cycle">
                ⏱️<br>${getTrackedTime()}
            </span>
            <span class="day-total">
                DayT:<br><span class="current-19hr-total">${snf19hrTotal}</span>
            </span>
            <span class="day-timer" title="time in this 19-hr cycle">
                ⏰<br>${getTrackedTime(19)}
            </span>
            </div>
            `);
        }

        if (searchPageMatch) {
            body.insertAdjacentHTML("beforeend", `
            <div id="SNF-counter-search-page">
            <span class="lead">
                L: <span class="current-leads">${currentLeads}</span><br><span class="current-ratio">${ratio}</span>%
            </span>
            <span class="non-lead">
                N: <span class="current-non-leads">${currentNonLeads}</span>
            </span>
            <span class="total">
                T: <span class="current-8hr-total">${snf8hrTotal}</span><br>
                <button id="SNF-refresh-data" title="refresh data">↻</button>
            </span>
            <span class="timer">
                ⏱️<span class="current-8hr-cycle">${getTrackedTime(8)}</span><br>
                <button id="reset-8hr-cycle" title="reset this 8-hr cycle">X</button>
            </span>
            <span class="day-total">
                DT: <span class="current-19hr-total">${snf19hrTotal}</span>
            </span>
            <span class="day-timer">
                ⏰<span class="current-19hr-cycle">${getTrackedTime(19)}</span><br>
                <button id="reset-19hr-cycle" title="reset this 19-hr cycle">X</button>
            </span>
            </div>
            `);
        }

        // This repeated function call is a quick fix for a bug (the .warning class not being added on profile pages)
        // The class is not being added because (of course) the HTML for the selector
        // doesn't exist at the time of the previous function call
        // TODO: fix this later when time permits
        updateTotals();
    }
    appendStats();


    function addNonLeadToCounterAndCloseTabOnClick() {
        const nonLeadEl = document.querySelector("#SNF-counter span.non-lead");
        if (nonLeadEl) {
            nonLeadEl.addEventListener("click", function () {
                let prevNonLeads = parseInt(localStorage.getItem("snfNonLeads"));
                let nonLeadCounter = prevNonLeads + 1;
                nonLeadCounter = nonLeadCounter.toString();
                localStorage.setItem("snfNonLeads", nonLeadCounter);

                addToTotals();

                window.close();
            });
        }
    }
    addNonLeadToCounterAndCloseTabOnClick();

    const refreshDataBtn = document.querySelector("#SNF-refresh-data");
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener("click", function () {
            currentLeads = localStorage.getItem("snfLeads");
            currentNonLeads = localStorage.getItem("snfNonLeads");
            document.querySelector("#SNF-counter-search-page .current-leads").textContent = currentLeads;
            document.querySelector("#SNF-counter-search-page .current-non-leads").textContent = currentNonLeads;

            updateTotals();

            document.querySelector("#SNF-counter-search-page .current-ratio").textContent = ratio;
            document.querySelector("#SNF-counter-search-page .current-8hr-total").textContent = snf8hrTotal;
            document.querySelector("#SNF-counter-search-page .current-19hr-total").textContent = snf19hrTotal;

            document.querySelector("#SNF-counter-search-page .current-8hr-cycle").textContent = getTrackedTime(8);
            document.querySelector("#SNF-counter-search-page .current-19hr-cycle").textContent = getTrackedTime(19);
        });
    }

    const reset8hrBtn = document.querySelector("#reset-8hr-cycle");
    if (reset8hrBtn) {
        reset8hrBtn.addEventListener("click", function () {
            let msg = `WARNING!!!\n\nDo you really want to reset the 8-hr cycle stats?\n\nPress OK to confirm.`
            if (confirm(msg)) {
                localStorage.setItem("snfLeads", "0");
                localStorage.setItem("snfNonLeads", "0");
                snf8hrStart = new Date().getTime();
                snf8hrStart = snf8hrStart.toString();
                localStorage.setItem("snf8hrStart", snf8hrStart);
                localStorage.setItem("snf8hrTotal", "0");
                localStorage.setItem("snf8hrTracker", "0:00");
            } else {
                console.log(`#reset-8hr-cycle was denied. Do nothing.`);
            }
        });
    }

    const reset19hrBtn = document.querySelector("#reset-19hr-cycle");
    if (reset19hrBtn) {
        reset19hrBtn.addEventListener("click", function () {
            let msg = `WARNING!!!\n\nDo you really want to reset the 19-hr cycle stats?\n\nPress OK to confirm.`
            if (confirm(msg)) {
                localStorage.setItem("snfLeads", "0");
                localStorage.setItem("snfNonLeads", "0");
                snf8hrStart = new Date().getTime();
                snf8hrStart = snf8hrStart.toString();
                localStorage.setItem("snf8hrStart", snf8hrStart);
                localStorage.setItem("snf8hrTotal", "0");
                localStorage.setItem("snf8hrTracker", "0:00");

                localStorage.setItem("snf19hrStart", snf8hrStart);
                localStorage.setItem("snf19hrTotal", "0");
                localStorage.setItem("snf19hrTracker", "0:00");
            } else {
                console.log(`#reset-19hr-cycle was denied. Do nothing.`);
            }
        });
    }
}

function addToTotals() {
    let snf8hrTotals = parseInt(localStorage.getItem("snf8hrTotal"));
    snf8hrTotals = snf8hrTotals + 1;
    snf8hrTotals = snf8hrTotals.toString();
    localStorage.setItem("snf8hrTotal", snf8hrTotals);

    let snf19hrTotals = parseInt(localStorage.getItem("snf19hrTotal"));
    snf19hrTotals = snf19hrTotals + 1;
    snf19hrTotals = snf19hrTotals.toString();
    localStorage.setItem("snf19hrTotal", snf19hrTotals);
}

function addLeadToCounter() {
    let prevLeads = parseInt(localStorage.getItem("snfLeads"));
    let leadCounter = prevLeads + 1;
    leadCounter = leadCounter.toString();
    localStorage.setItem("snfLeads", leadCounter);

    addToTotals();
}

function addNonLeadToCounterAndCloseTab() {
    let prevNonLeads = localStorage.getItem("snfNonLeads");
    if (prevNonLeads) {
        prevNonLeads = parseInt(prevNonLeads);
        let nonLeadCounter = prevNonLeads + 1;
        nonLeadCounter = nonLeadCounter.toString();
        localStorage.setItem("snfNonLeads", nonLeadCounter);

        addToTotals();
    }

    setTimeout(function () {
        window.close();
    }, 1);
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

function hideSection(element) {
    element.style.display = "none";
}

let docHeight = "0";

waitFor("#SNF-doc-height").then((el) => {
    const docHeightSection = document.querySelector("#SNF-doc-height");
    setInterval(function () {
        if (docHeightSection) {
            docHeight = `doc height: ${document.documentElement.scrollHeight.toLocaleString()}px`;
            docHeightSection.textContent = docHeight;
        }
    }, 250);
});

if (linkedinProfilePageMatch) {
	console.log("Linkedin profile page detected");
    waitFor("#artdeco-modal-outlet .artdeco-modal.send-invite textarea#custom-message").then((el) => {
		console.log("customMessageBox detected!");
	    const customMessageBox = document.querySelector("#artdeco-modal-outlet .artdeco-modal.send-invite textarea#custom-message");
	    setInterval(function () {
	        if (customMessageBox) {
	            customMessageBox.style.height = "180px";
	        }
	    }, 250);
    });

}

if (salesLeadPageMatch) {
// The badges ul element always exists even if the user has no badges.
// And when this element appears on the page, we can be sure that all other HTML has finally loaded as well.
// The #about-section and #experience-section are optional
// but if either of them exists, they will appear by the time the badgesList has loaded.
const badgesList = "#profile-card-section > section[class^=_header] ul[class^=_badges]";
// The experience section headline always exists, even if the experience section is empty.
// So, it's even better to wait for this HTML because then we definitely have everything.
const experienceSectionHeadline = "#experience-section > section:nth-child(1) > div > h2 > span";
waitFor(experienceSectionHeadline).then((el) => {
    checkTime0 = performance.now();
    console.log(`checkTime0 (${(checkTime0 - readyTime).toFixed(2)} ms after readyTime)`);

    const premiumBadge = document.querySelector(`${badgesList} li > span svg[class^=_premium-badge]`);
    const openBadge = document.querySelector(`${badgesList} li > span[class^=_open-badge]`);

    const latestTouchPoint = document.querySelector("#profile-card-section div[class^=_latest-touch-point]");
    if (latestTouchPoint) {
        const tooltipContent = latestTouchPoint.textContent;
        if (tooltipContent.includes("First time view")) {
            console.log("tooltipContent: " + tooltipContent);
            latestTouchPoint.style.backgroundColor = "limegreen";
        } else if (tooltipContent.includes("Viewed:")) {
            console.log("tooltipContent: " + tooltipContent);
            latestTouchPoint.style.backgroundColor = "yellow";
        } else {
            console.log("tooltipContent: " + tooltipContent);
            latestTouchPoint.style.backgroundColor = "red";
        }
    }

    const headerSection = document.querySelector("#profile-card-section > section[class^=_header]");
    const detailsSection = document.querySelector("#profile-card-section > section section[data-sn-view-name=lead-contact-info]");
    const aboutSection = document.querySelector("#about-section");
    const experienceSection = document.querySelector("#experience-section");
    const isExperienceSectionNotEmpty = document.querySelectorAll("#experience-section > section:nth-child(1) > div > ul > li").length;
    const headline = (document.querySelector( "#profile-card-section section[class^=_header_] > div:nth-child(1) > div[class^=_bodyText] > span" )?.textContent) || "";

    const emailRegex = /(([^<>()[\]\\.,;:\s@"\/]+(\.[^<>()[\]\\.,;:\s@"\/]+)*)|(".+"))(((@|\s?(\(|\[|\{|\<)\s?(at|@)\s?(\)|\]|\}|\>)\s?)(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+(\.|\s?(\(|\[|\{|\<)\s?(dot)\s?(\)|\]|\}|\>)\s?))+[a-zA-Z]{2,})))|((\s?@\s?)(((gmail|hotmail|yahoo|outlook|protonmail|icloud|googlemail)\s?\.\s?com)|(([a-zA-Z\-0-9]+)\.)?([a-zA-Z\-0-9]+)\s?\.\s?(com|edu|io|net|uk|consulting|co|vc|au|br|de|fr|dk|capital|ca|ch|org|info|in|it|be|me|ai|nl|se|tech|us|biz|eu|es|at|cz|fi|fund|group|lu|no|pro|sg|agency|app|il|nz|partners|pt|tv|ar|mx|pl|ventures|club|name|nyc)(?=\s|<|$))))/gi;

    const nonsenseExclusionRegex = /(www\.|#)/i;
    const genericEmailExclusionRegex = /^(info|jobs|careers|inquiries|projects|recruiting)/i;
    const headerGenericsExclusionRegex = /^(Co-Founder|Founder|President|co-CEO|CEO|COO|Mentor|Marketing|Product)/i;

    // Removes images such as image@3x.jpg etc.
    const imageRemoverRegex = /.+(\.jpg|\.png|\.jpeg|\.jpe|\.jif|\.jfif|\.jfi|\.gif|\.webp|\.tiff|\.tif|\.bmp|\.dib|\.jp2|\.j2k|\.jpf|\.jpx|\.jpm|\.mj2)$/i;

    const twitterRegex = /https:\/\/twitter\.com\/[a-z0-9_]{1,15}/gi;

    let profileEmails = {
        inHeader: null,
        inContact: null,
        inCurrentRoles: null,
        inAbout: null,
        inExperience: null,
        uniqueEmails: []
    }
    let profilePhoneAndWebsite = {
        profilePhone: "",
        profileWebsite: ""
    }
    let firstEmail = "";
    let allEmails = "";
    let jobList = [];
    let jobs = "";
    let profileURL = "/////////////////////////////////////////////////////////////////////";
    let isPremium = "FALSE";
    let isOpen = "FALSE";
    let isFemale = "FALSE";

    const kwArray = ["entrepreneur", "investor", "angel", "seed", "early", "web3"];
    let kwsIn = {
        headline: {
            entrepreneur: [],
            investor: [],
            angel: [],
            seed: [],
            early: [],
            web3: []
        },
        about: {
            entrepreneur: [],
            investor: [],
            angel: [],
            seed: [],
            early: [],
            web3: []
        },
        jobTitles: {
            entrepreneur: [],
            investor: [],
            angel: [],
            seed: [],
            early: [],
            web3: []
        },
        companies: {
            entrepreneur: [],
            investor: [],
            angel: [],
            seed: [],
            early: [],
            web3: []
        },
        jobDescriptions: {
            entrepreneur: [],
            investor: [],
            angel: [],
            seed: [],
            early: [],
            web3: []
        }
    };
    let score = {
        entrepreneur: ["FALSE", ""],
        investor: ["FALSE", ""],
        angel: ["FALSE", ""],
        seed: ["FALSE", ""],
        early: ["FALSE", ""],
        web3: ["FALSE", ""]
    }

    String.prototype.cleanUpString = function () {
        // My dot functions modeled on this:
        // https://stackoverflow.com/a/19872982/8270343

        return this
            .normalize("NFKC") // Remove weird (and unsearchable) fonts like in the headline of this profile: https://www.linkedin.com/in/bobfarkas1
            .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$£€+]/gu, "") // Remove emojis & symbols etc.
            .replace(/^[+'"=]/, "/$&") // Prepend a slash to plus signs and quotes
            // at the *beginning* of a string because + or " at the beginning causes issues when pasting into Google Sheets
            .replace(/\s\s+/g, " ") // Replace instances of multiple spaces with one
            // This one supersedes the following as it also removes line breaks, tabs etc.
            //.replace(/\r?\n|\r/gm, ""); // Inside a headline there could even be a line break like in this profile: https://www.linkedin.com/in/andrew-dude-92523335
            .trim();
    }

    function handleThisProfile() {
        hideRelationshipSection();

        // Quick check to see if there are any emails
        function hasEmail() {
            // Header and Details HTML will have loaded at this point.
            const emailMatchesInHeader = headerSection.innerHTML.match(emailRegex);
            const emailMatchesInDetails = detailsSection.innerHTML.match(emailRegex);
            const emailMatchesInExperience = experienceSection.innerHTML.match(emailRegex);
            // aboutSection is optional
            if (aboutSection) {
                const emailMatchesInAbout = aboutSection.innerHTML.match(emailRegex);
                return !!(emailMatchesInHeader || emailMatchesInDetails || emailMatchesInAbout || emailMatchesInExperience);
            } else {
                return !!(emailMatchesInHeader || emailMatchesInDetails || emailMatchesInExperience);
            }
        }

        function autoCloseTabOrCollectProfileData () {
            if (premiumBadge) {
                isPremium = "TRUE";
            }

            if (openBadge) {
                checkTimeOpenBadgeDetected = performance.now();
                console.log(`OpenBadgeDetected (${(checkTimeOpenBadgeDetected - readyTime).toFixed(2)} ms after readyTime)`);

                isOpen = "TRUE";
                collectProfileData();
            } else {
                if (hasEmail()) {
                    checkTimeFirstEmailDetected = performance.now();
                    console.log(`FirstEmailDetected (${(checkTimeFirstEmailDetected - readyTime).toFixed(2)} ms after readyTime)`);
                    collectProfileData();
                } else {
                    collectProfileData();
                }
            }
        }
        autoCloseTabOrCollectProfileData ();

        function clickShowMoreButtons() {
            const currentRoleMoreButton = document.querySelector("#profile-card-section div[class^=current-role-container] [id$=clamped-content] > span:nth-child(2) > button[class^=_ellipsis-button]");
            if (currentRoleMoreButton) {
                currentRoleMoreButton.click();
            }

            function clickExperienceButtons() {
                const experienceButtons = document.querySelectorAll("#experience-section [id$=clamped-content] > span:nth-child(2)");
                if (experienceButtons.length) {
                    checkTime2 = performance.now();
                    console.log(`checkTime2: ${(checkTime2 - readyTime).toFixed(2)} ms`);
                    experienceButtons.forEach(function (item) {
                        item.click();
                    });
                    checkTime3 = performance.now();
                    console.log(`checkTime3: ${(checkTime3 - readyTime).toFixed(2)} ms`);
                }
            }

            const showAllBtn = document.querySelector("#experience-section > button[aria-expanded=false]");
            if (showAllBtn) {
                showAllBtn.click();
                waitFor("#experience-section > button[aria-expanded=true]").then((el) => {
                    checkTime1 = performance.now();
                    console.log(`checkTime1: ${(checkTime1 - readyTime).toFixed(2)} ms`);
                    setTimeout(clickExperienceButtons, 1);
                });
            } else {
                clickExperienceButtons();
            }

            const showMoreInAboutBtn = document.querySelector("#about-section div > span:nth-child(2)");
            if (showMoreInAboutBtn) {
                showMoreInAboutBtn.click();
            }
            checkTime4 = performance.now();
            console.log(`checkTime4: ${(checkTime4 - readyTime).toFixed(2)} ms`);
        }

        function removeDuplicatesInArray(array) {
            return [... new Set(array.map(e => e.toLowerCase()))];
        }

        function collectTwitter() {
            let twitterLink = "";
            const contactSection = document.querySelector("#profile-card-section section[data-sn-view-name=lead-contact-info] > div > address");

            if (contactSection) {
                let twitterURLs = contactSection.innerHTML.match(twitterRegex); // null if none, array if some
                if (twitterURLs) {
                    twitterLink = twitterURLs[0];
                }
            }

            return twitterLink;
        }

        function collectPhoneAndWebsite() {
            console.log("collectPhoneAndWebsite");
            let phoneNumber;
            let websiteURL;

            const contactSection = document.querySelector("#profile-card-section > section section[data-sn-view-name=lead-contact-info]");
            if (contactSection) {
                phoneNumber = contactSection.querySelector("span[data-anonymize=phone]")?.textContent?.trim() || "";
                if (phoneNumber) {
                    console.log("phone number: " + phoneNumber);
                    // prepend apostrophe to fix Google Sheets formatting issues
                    phoneNumber = `'${phoneNumber}`;
                    profilePhoneAndWebsite.profilePhone = phoneNumber;
                }

                const websiteLi = Array.from(document.querySelectorAll("#profile-card-section > section section[data-sn-view-name=lead-contact-info] address li")).find(function(li) { return li.querySelector("li-icon[type='link-icon']") !== null; });
                if (websiteLi) {
                    const websiteAnchor = websiteLi.querySelector("a[rel='noopener noreferrer']");
                    websiteURL = websiteAnchor ? websiteAnchor.getAttribute("href") : undefined;
                }
                if (websiteURL) {
                    console.log("websiteURL: " + websiteURL);
                    profilePhoneAndWebsite.profileWebsite = websiteURL;
                }
            }

            waitFor("#artdeco-modal-outlet div[aria-labelledby=lead-contact-info-modal__header] section.contact-info-form__website div.contact-info-form__website-readonly-group a").then((el) => {
                console.log("Found contact info modal!");
                websiteURL = document.querySelector( "#artdeco-modal-outlet div[aria-labelledby=lead-contact-info-modal__header] section.contact-info-form__website div.contact-info-form__website-readonly-group a" )?.getAttribute("href");
                if (websiteURL) {
                    console.log("websiteURL: " + websiteURL);
                    profilePhoneAndWebsite.profileWebsite = websiteURL;
                }
            });

            return profilePhoneAndWebsite;
        }

        function collectEmails() {
            collectEmailsTime = performance.now();
            console.log(`collectEmailsTime: ${(collectEmailsTime - readyTime).toFixed(2)} ms`);

            setTimeout(function() {
                window.scrollTo({ top: 0, behavior: "instant" });
            }, 33);

            let emailList = [];

            profileEmails.inHeader = headerSection.innerHTML.match(emailRegex); // null if none, array if some
            if (profileEmails.inHeader) {
                emailList = emailList.concat(profileEmails.inHeader);
            }

            const contactSection = document.querySelector("#profile-card-section > section section[data-sn-view-name=lead-contact-info]");
            if (contactSection) {
                profileEmails.inContact = contactSection.innerHTML.match(emailRegex);
                if (profileEmails.inContact) {
                    profileEmails.inContact = removeDuplicatesInArray(profileEmails.inContact);
                    profileEmails.inContact = profileEmails.inContact.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inContact);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            const currentRolesSection = document.querySelector("#profile-card-section > section div[data-sn-view-name=lead-current-role]");
            if (currentRolesSection) {
                profileEmails.inCurrentRoles = currentRolesSection.innerHTML.match(emailRegex);
                if (profileEmails.inCurrentRoles) {
                    profileEmails.inCurrentRoles = removeDuplicatesInArray(profileEmails.inCurrentRoles);
                    profileEmails.inCurrentRoles = profileEmails.inCurrentRoles.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inCurrentRoles);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            const aboutSectionLocal = document.querySelector("#about-section");
            if (aboutSectionLocal) { // Some profiles don't have the about section
                profileEmails.inAbout = aboutSectionLocal.innerHTML.match(emailRegex);
                if (profileEmails.inAbout) {
                    profileEmails.inAbout = removeDuplicatesInArray(profileEmails.inAbout);
                    profileEmails.inAbout = profileEmails.inAbout.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inAbout);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            if (isExperienceSectionNotEmpty) {
                console.log("Experience Section is not empty.");
                const experienceEntries = document.querySelectorAll("#experience-section ul li[class^=_experience-entry]");
                const presentEntries = Array.from(experienceEntries).filter(function(entry) {
                    const span = entry.querySelector("div:nth-child(1) > div:nth-child(2) > p > span");
                    return span && span.textContent.includes("Present");
                });

                if (presentEntries.length > 0) {
                    console.log(presentEntries.length + " experienceEntries containing 'Present' found.");
                    const htmlContentOfPresentEntries = Array.from(presentEntries).map(function(el) { return el.innerHTML; }).join("");
                    profileEmails.inExperience = htmlContentOfPresentEntries.match(emailRegex);
                } else {
                    console.log("No elements containing 'Present' found.");
                }

                if (profileEmails.inExperience) {
                    profileEmails.inExperience = removeDuplicatesInArray(profileEmails.inExperience);
                    profileEmails.inExperience = profileEmails.inExperience.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inExperience);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            profileEmails.uniqueEmails = emailList;

            return profileEmails;
        }

        function cleanUpEmail(element) {
            const original = element;
            let cleaned = element.replace(/\s/g, "");
            cleaned = cleaned.replace(/(\(|\[|\{|\<)(at|@)(\)|\]|\}|\>)/, "@");
            cleaned = cleaned.replace(/(\(|\[|\{|\<)(dot)(\)|\]|\}|\>)/, ".");
            cleaned = cleaned.cleanUpString();
            if (cleaned === original) {
                return [cleaned, ``, ``];
            } else {
                return [cleaned, `⭐`, `<br>♦ ${original}`];
            }
        }

        function addHTMLElements(array, sectionName) {
            if (array) {
                let filteredArray = array.filter(email => !nonsenseExclusionRegex.test(email));
                // don't filter emails from the contact section
                // because those are guaranteed to be user's real, personal emails
                if (sectionName !== "contact") {
                    filteredArray = filteredArray.filter(email => !genericEmailExclusionRegex.test(email));
                    filteredArray = filteredArray.filter(email => !imageRemoverRegex.test(email));

                    if (sectionName === "header") {
                        filteredArray = filteredArray.filter(email => !headerGenericsExclusionRegex.test(email));
                    }
                }

                let newElements = [];
                newElements[0] = `<span>${sectionName}:</span>`;
                filteredArray.forEach(function (currentValue, index) {
                    currentValue = cleanUpEmail(currentValue);
                    const checkmark = "checked";
                    newElements.push(`
                <label for="SNF-${sectionName}-checkbox${index}">
                <input id="SNF-${sectionName}-checkbox${index}" value="${currentValue[0]}" type="checkbox" ${checkmark}>
                <span id="SNF-${sectionName}-email${index}">${currentValue[0]}${currentValue[1]}${currentValue[2]}</span>
                </label>`);
                });
                return newElements.join("");
            } else {
                return "";
            }
        }

        function appendCollectedEmails() {
            appendCollectedEmailsTime = performance.now();
            console.log(`appendCollectedEmailsTime: ${(appendCollectedEmailsTime - readyTime).toFixed(2)} ms`);

            console.log(`data from within appendCollectedEmails():`);
            console.log(`profileEmails.inAbout`);
            console.log(profileEmails.inAbout);
            console.log(`profileEmails.inExperience`);
            console.log(profileEmails.inExperience);
            const headerElements = addHTMLElements(profileEmails.inHeader, "header");
            const contactElements = addHTMLElements(profileEmails.inContact, "contact");
            const rolesElements = addHTMLElements(profileEmails.inCurrentRoles, "roles");
            const aboutElements = addHTMLElements(profileEmails.inAbout, "about");
            const experienceElements = addHTMLElements(profileEmails.inExperience, "experience");

            headerSection.insertAdjacentHTML("beforeend", `
        <section id="SNF-doc-height">
        </section>
        <section id="SNF-data">
            <div>
                <button id="SNF-copy" class="copy-btn" type="button">Copy</button>
                <button id="SNF-femcopy" class="copy-btn" type="button">FemC</button>
            </div>
            <div>
            ${headerElements}
            </div>
            <div>
            ${contactElements}
            </div>
            <div>
            ${rolesElements}
            </div>
            <div>
            ${aboutElements}
            </div>
            <div>
            ${experienceElements}
            </div>
            </div>
        </section>
        `);
        }

        function kwRegex(keyword) {
            let regex;
            switch (keyword) {
                case "entrepreneur":
                    regex = /\bentrepreneur\b|\bunternehmer\b/gi;
                    break;
                case "investor":
                    regex = /\binvestor\b/gi;
                    break;
                case "angel":
                    regex = /\bangel investor\b|\bangel-investor\b|\bBusiness Angel\b|\bBusinessangel\b|\bBusiness-Angel\b|\bangel investing\b/gi;
                    break;
                case "seed":
                    regex = /\bseed\b|\bpreseed\b/gi;
                    break;
                case "early":
                    regex = /\bearly stage\b|\bearly-stage\b/gi;
                    break;
                case "web3":
                    regex = /\bblockchain\b|\bblock chain\b|\bweb3\b|\bweb 3\b|crypto|\bnft\b|\bnfts\b|\bdefi\b/gi;
            }

            return regex;
        }

        function getKeywordScores( /*Array*/ keywordArray) {
            keywordArray.forEach(function (keyword) {
                let scoreArray = [];

                if (keyword === "entrepreneur") {
                    // Level points:
                    // headline match: 5
                    // about matches: 2 for one match; 3 for more than one match
                    // job titles match: 4
                    // companies match: none
                    // job descriptions match: 1 for at least two matches

                    console.log(`kwsIn.headline[keyword] output for ${keyword}`);
                    console.log(kwsIn.headline[keyword]);
                    if (kwsIn.headline[keyword].length) {
                        scoreArray.push(5);
                    }
                    if (kwsIn.about[keyword].length && kwsIn.about[keyword].length > 1) {
                        scoreArray.push(3);
                    } else if (kwsIn.about[keyword].length) {
                        scoreArray.push(2);
                    }
                    if (kwsIn.jobTitles[keyword].length) {
                        scoreArray.push(4);
                    }
                    if (kwsIn.jobDescriptions[keyword].length && kwsIn.jobDescriptions[keyword].length > 1) {
                        scoreArray.push(1);
                    }

                    if (scoreArray.length) {
                        console.log(`scoreArray for ${keyword}`);
                        console.log(scoreArray);
                        score[keyword] = ["TRUE", Math.max(...scoreArray)];
                        console.log(`keyword:`);
                        console.log(keyword);
                        console.log(`score[keyword]`);
                        console.log(score[keyword]);
                    }
                }

                if (keyword === "investor") {
                    // Level points:
                    // headline match: 5
                    // about matches: 2 for one match; 4 for more than one match
                    // job titles match: 5
                    // companies match: none
                    // job descriptions match: 1 for at least two matches

                    if (kwsIn.headline[keyword].length) {
                        scoreArray.push(5);
                    }
                    if (kwsIn.about[keyword].length && kwsIn.about[keyword].length > 1) {
                        scoreArray.push(4);
                    } else if (kwsIn.about[keyword].length) {
                        scoreArray.push(2);
                    }
                    if (kwsIn.jobTitles[keyword].length) {
                        scoreArray.push(5);
                    }
                    if (kwsIn.jobDescriptions[keyword].length && kwsIn.jobDescriptions[keyword].length > 1) {
                        scoreArray.push(1);
                    }

                    if (scoreArray.length) {
                        score[keyword] = ["TRUE", Math.max(...scoreArray)];
                    }
                }

                if (keyword === "angel") {
                    // Level points for angelRegex1:
                    // headline match: 5
                    // about matches: 2 for one match; 4 for more than one match
                    // job titles match: 5
                    // companies match: none
                    // job descriptions match: 1 for at least two matches

                    if (kwsIn.headline[keyword].length) {
                        scoreArray.push(5);
                    }
                    if (kwsIn.about[keyword].length && kwsIn.about[keyword].length > 1) {
                        scoreArray.push(4);
                    } else if (kwsIn.about[keyword].length) {
                        scoreArray.push(2);
                    }
                    if (kwsIn.jobTitles[keyword].length) {
                        scoreArray.push(5);
                    }
                    if (kwsIn.jobDescriptions[keyword].length && kwsIn.jobDescriptions[keyword].length > 1) {
                        scoreArray.push(1);
                    }

                    if (scoreArray.length) {
                        score[keyword] = ["TRUE", Math.max(...scoreArray)];
                    }
                }

                if (keyword === "seed") {
                    // Level points:
                    // headline match: 5
                    // about matches: 3 for one match; 4 for more than one match
                    // job titles match: 4 for one match; 5 for more than one match
                    // companies match: 3 for one match; 4 for more than one match
                    // job descriptions match: 2 for one match; 3 for more than one match

                    if (kwsIn.headline[keyword].length) {
                        scoreArray.push(5);
                    }
                    if (kwsIn.about[keyword].length && kwsIn.about[keyword].length > 1) {
                        scoreArray.push(4);
                    } else if (kwsIn.about[keyword].length) {
                        scoreArray.push(3);
                    }
                    if (kwsIn.jobTitles[keyword].length && kwsIn.jobTitles[keyword].length > 1) {
                        scoreArray.push(5);
                    } else if (kwsIn.jobTitles[keyword].length) {
                        scoreArray.push(4);
                    }
                    if (kwsIn.companies[keyword].length && kwsIn.companies[keyword].length > 1) {
                        scoreArray.push(4);
                    } else if (kwsIn.companies[keyword].length) {
                        scoreArray.push(3);
                    }
                    if (kwsIn.jobDescriptions[keyword].length && kwsIn.jobDescriptions[keyword].length > 1) {
                        scoreArray.push(3);
                    } else if (kwsIn.jobDescriptions[keyword].length) {
                        scoreArray.push(2);
                    }

                    if (scoreArray.length) {
                        score[keyword] = ["TRUE", Math.max(...scoreArray)];
                    }
                }

                if (keyword === "early") {
                    // Level points:
                    // headline match: 5
                    // about matches: 3 for one match; 4 for more than one match
                    // job titles match: 4 for one match; 5 for more than one match
                    // companies match: 2 for one match; 3 for more than one match
                    // job descriptions match: 2 for one match; 3 for more than one match

                    if (kwsIn.headline[keyword].length) {
                        scoreArray.push(5);
                    }
                    if (kwsIn.about[keyword].length && kwsIn.about[keyword].length > 1) {
                        scoreArray.push(4);
                    } else if (kwsIn.about[keyword].length) {
                        scoreArray.push(3);
                    }
                    if (kwsIn.jobTitles[keyword].length && kwsIn.jobTitles[keyword].length > 1) {
                        scoreArray.push(5);
                    } else if (kwsIn.jobTitles[keyword].length) {
                        scoreArray.push(4);
                    }
                    if (kwsIn.companies[keyword].length && kwsIn.companies[keyword].length > 1) {
                        scoreArray.push(3);
                    } else if (kwsIn.companies[keyword].length) {
                        scoreArray.push(2);
                    }
                    if (kwsIn.jobDescriptions[keyword].length && kwsIn.jobDescriptions[keyword].length > 1) {
                        scoreArray.push(3);
                    } else if (kwsIn.jobDescriptions[keyword].length) {
                        scoreArray.push(2);
                    }

                    if (scoreArray.length) {
                        score[keyword] = ["TRUE", Math.max(...scoreArray)];
                    }
                }

                if (keyword === "web3") {
                    // Level points:
                    // headline match: 5
                    // about matches: 2 for one match; 3 for two matches; 4 for more than two matches
                    // job titles match: 4
                    // companies match: 3
                    // job descriptions match: 1 for one match; 2 for two etc.

                    if (kwsIn.headline[keyword].length) {
                        scoreArray.push(5);
                    }
                    if (kwsIn.about[keyword].length && kwsIn.about[keyword].length > 2) {
                        scoreArray.push(4);
                    } else if (kwsIn.about[keyword].length && kwsIn.about[keyword].length === 2) {
                        scoreArray.push(3);
                    } else if (kwsIn.about[keyword].length) {
                        scoreArray.push(2);
                    }
                    if (kwsIn.jobTitles[keyword].length) {
                        scoreArray.push(4);
                    }
                    if (kwsIn.companies[keyword].length) {
                        scoreArray.push(3);
                    }
                    if (kwsIn.jobDescriptions[keyword].length && kwsIn.jobDescriptions[keyword].length > 5) {
                        scoreArray.push(5);
                    } else if (kwsIn.jobDescriptions[keyword].length) {
                        scoreArray.push(kwsIn.jobDescriptions[keyword].length);
                    }

                    if (scoreArray.length) {
                        score[keyword] = ["TRUE", Math.max(...scoreArray)];
                    }
                }
            });
        }

        function findMatchingKeywords( /*Array*/ keywordArray) {
            keywordArray.forEach(function (keyword) {
                // in headline (use the already defined headline const)
                const headlineNormalized = headline.normalize("NFKC");
                console.log(`regex used for ${keyword}`);
                console.log(kwRegex(keyword));
                let headlineMatches = headlineNormalized.match(kwRegex(keyword));
                if (headlineMatches) {
                    console.log(`headlineMatches`);
                    console.log(headlineMatches);
                    kwsIn.headline[keyword] = headlineMatches;
                }

                // in about (if section exists):
                if (aboutSection) {
                    let aboutMatches = aboutSection.innerHTML.match(kwRegex(keyword));
                    if (aboutMatches) {
                        kwsIn.about[keyword] = aboutMatches;
                    }
                }

                // in experience section:
                if (isExperienceSectionNotEmpty) {
                    const jobTitleElements = document.querySelectorAll("h2[data-anonymize=job-title], h3[data-anonymize=job-title]");
                    // This matches all job titles in single-title and multi-title job lists
                    if (jobTitleElements.length) {
                        let jobTitles = [];
                        jobTitleElements.forEach(function (el) {
                            jobTitles.push(el.textContent);
                        });
                        jobTitles = jobTitles.join(" | ");
                        let jobTitleMatches = jobTitles.match(kwRegex(keyword));
                        if (jobTitleMatches) {
                            kwsIn.jobTitles[keyword] = jobTitleMatches;
                        }
                    }

                    const companyNameElements = document.querySelectorAll("p[data-anonymize=company-name], h2[data-anonymize=company-name]");
                    // This matches all company names in single-title and multi-title job lists
                    if (companyNameElements.length) {
                        let companyNames = [];
                        companyNameElements.forEach(function (el) {
                            companyNames.push(el.textContent);
                        });
                        companyNames = companyNames.join(" | ");
                        let companyNameMatches = companyNames.match(kwRegex(keyword));
                        if (companyNameMatches) {
                            kwsIn.companies[keyword] = companyNameMatches;
                        }
                    }

                    // in job descriptions:
                    // description of single position that has been expanded after clicking the "see more" button:
                    // p[class^=_single-position-description]
                    // description of single position that hasn't been expanded or doesn't have the "see more" button:
                    // div[class^=_single-position-description]
                    // this selector matches both the p and the div elements with that class:
                    // [class^=_single-position-description]
                    // and for _multi-position-descriptions:
                    // [class^=_multi-position-description]
                    const jobDescriptionElements = document.querySelectorAll("[class^=_single-position-description], [class^=_multi-position-description]");
                    if (jobDescriptionElements.length) {
                        let jobDescriptions = [];
                        jobDescriptionElements.forEach(function (el) {
                            jobDescriptions.push(el.innerHTML);
                        });
                        jobDescriptions = jobDescriptions.join(" | ");

                        let jobDescriptionMatches = jobDescriptions.match(kwRegex(keyword));
                        if (jobDescriptionMatches) {
                            kwsIn.jobDescriptions[keyword] = jobDescriptionMatches;
                        }
                    }

                    findMatchingKeywordsTime = performance.now();
                    console.log(`findMatchingKeywordsTime: ${(findMatchingKeywordsTime - readyTime).toFixed(2)} ms`);

                }
            });
        }

        function collectProfileData() {
            setTimeout(clickShowMoreButtons, 1);
            setTimeout(collectPhoneAndWebsite, 111);
            setTimeout(collectEmails, 888);
            setTimeout(appendCollectedEmails, 1122);
            setTimeout(findMatchingKeywords, 1222, kwArray);
            setTimeout(copyDataToClipboard, 1444);
        }

        function copyDataToClipboard() {
            copyDataToClipboardTime = performance.now();
            console.log(`copyDataToClipboardTime: ${(copyDataToClipboardTime - readyTime).toFixed(2)} ms`);
            // green light
            document.querySelector("#content-main").style.backgroundColor = "#aadec3";

            const copyBtn = document.querySelector("#SNF-copy");
            const copyFemaleBtn = document.querySelector("#SNF-femcopy");

            waitFor("#hue-web-menu-outlet div[data-artdeco-is-focused=\"true\"] ul li a").then((el) => {
                profileURL = Array.from(document.querySelectorAll("#hue-web-menu-outlet ul li a")).find(a => a.textContent.includes("View LinkedIn profile"))?.getAttribute("href");
                profileURL = profileURL + "/";
                return profileURL;
            });

            if (copyBtn && copyFemaleBtn) {
                copyBtn.addEventListener("click", function () {
                    if (profileURL !== "/////////////////////////////////////////////////////////////////////") {
                        modifyClipboard(profileURL);
                        copyBtn.insertAdjacentHTML("beforebegin", "<div id='SNFc-success' style='text-align: center; background-color: limegreen;'><b style='margin-left: -10px;'>✔</b></div>");
                    } else {
                        copyBtn.insertAdjacentHTML("beforebegin", "<div id='SNFc-fail' style='text-align: center; background-color: orangered'><b>✖</b></div>");
                    }
                });

                copyFemaleBtn.addEventListener("click", function () {
                    if (profileURL !== "/////////////////////////////////////////////////////////////////////") {
                        isFemale = "TRUE";
                        modifyClipboard(profileURL);
                        copyBtn.insertAdjacentHTML("beforebegin", "<div style='text-align: center; background-color: limegreen;'><b style='margin-left: -10px;'>✔</b></div>");
                    } else {
                        copyBtn.insertAdjacentHTML("beforebegin", "<div style='text-align: center; background-color: orangered'><b>✖</b></div>");
                    }
                });
            }
        }

        function getEmailsToExport() {
            if (!profileEmails.uniqueEmails.length) {
                firstEmail = "";
                allEmails = "";
            } else {
                const checkedEmailElements = document.querySelectorAll("#SNF-data input[id^=SNF]:checked");
                if (checkedEmailElements.length === 0) { // I might uncheck all emails
                    firstEmail = "";
                    allEmails = "";
                } else {
                    let checkedEmailsArray = Array.from(checkedEmailElements).map(el => el.value);
                    checkedEmailsArray = removeDuplicatesInArray(checkedEmailsArray);
                    firstEmail = checkedEmailElements[0].value;
                    let allEmailsArray = [];
                    profileEmails.uniqueEmails.forEach(function (currentValue) {
                        currentValue = cleanUpEmail(currentValue);
                        allEmailsArray.push(currentValue[0]);
                    });

                    if (checkedEmailsArray.length > 1 && checkedEmailsArray.length < allEmailsArray.length) {
                        allEmails = checkedEmailsArray.join("; ");
                    } else if (checkedEmailsArray.length === allEmailsArray.length && checkedEmailsArray.length !== 1) {
                        allEmails = allEmailsArray.join("; ");
                    } else {
                        allEmails = "";
                    }
                }
            }
        }

        async function getJobsToExport() {
            await fillJobList();

            let newJobList = [];
            jobList.forEach(function (currentValue) {
                if (currentValue["titles"].length && currentValue["company"]) {
                    if (currentValue["titles"].length > 1) {
                        let multiTitles = currentValue["titles"].join(" ➤ ");
                        newJobList.push(`${multiTitles} 🔷 ${currentValue["company"]}`);

                    } else {
                        newJobList.push(`${currentValue["titles"][0]} 🔷 ${currentValue["company"]}`);
                    }
                }
            });
            return jobs = newJobList.join(" ✚✚ ");
        }

        async function modifyClipboard(/*string*/ url) {
            // Sales Navigator lead URLs have a lot of crap appended to them.
            // So, we need to grab the first 75 characters and append ",name" to get rid of useless parameters.
            const leadURL = `${currentURL.substring(0, 75)},name`;
            profileURL = url;
            const name = (document.querySelector( "#profile-card-section section[class^=_header_] h1" )?.textContent || "").cleanUpString();
            function getCapitalizedFirstName(name) {
                // Remove any leading periods and spaces
                name = name.replace(/^\.*\s*/, "");

                // Define titles to skip
                const titlesToSkip = ["Dr", "Dr.", "Professor", "Prof", "Prof.", "Dame", "Lady"];

                // Split the name into words
                let nameParts = name.split(" ");

                // Check if the first word is a title or a single initial with a dot, if so skip it
                if (titlesToSkip.includes(nameParts[0]) || /^[A-Z]\.$/.test(nameParts[0])) {
                    nameParts.shift(); // Remove the title or initial
                }

                // Get the first name (the first remaining part)
                let firstName = nameParts[0];

                // Handle hyphenated names (capitalize both parts)
                if (firstName.includes("-")) {
                    firstName = firstName.split("-").map(part =>
                        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                    ).join("-");
                }
                // Handle two-letter names where both letters are capitalized (like "AJ")
                else if (firstName.length === 2 && firstName === firstName.toUpperCase()) {
                    // Leave it as it is (already capitalized correctly)
                }
                // Handle regular capitalization for other names
                else {
                    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
                }

                return firstName;
            }

            const capitalizedFirstName = getCapitalizedFirstName(name);

            const headlineClean = headline.cleanUpString();

            const location = (document.querySelector( "#profile-card-section > section[class^=_header_] > div:nth-child(1) > div:nth-child(4) > div:nth-child(1)" )?.textContent || "").cleanUpString();

            let connections = "";
            const connectionsOfNon1stDegreeProfile = document.querySelector( "#profile-card-section > section[class^=_header_] > div:nth-child(1) > div:nth-child(4) > div:nth-child(2)" );
            const connectionsOf1stDegreeProfile = document.querySelector( "#profile-card-section > section[class^=_header_] > div:nth-child(1) > div:nth-child(4) > a:nth-child(2)" );
            if (connectionsOfNon1stDegreeProfile) {
                connections = connectionsOfNon1stDegreeProfile.textContent
                    .cleanUpString().replace(/(\+ connections| (connections|connection))/, "");
            } else if (connectionsOf1stDegreeProfile) {
                connections = connectionsOf1stDegreeProfile.textContent
                    .cleanUpString().replace(/(\+ connections| (connections|connection))/, "");
            }

            const twitter = collectTwitter();

            getEmailsToExport();
            await getJobsToExport();
            const firstCompany = jobList[0].company;
            const cleanCompanyName = firstCompany.replace(/\s*(Limited|LTD\.?|LTD)\s*$/i, "").trim();
            getKeywordScores(kwArray);
            addLeadToCounter();

            await navigator.clipboard.writeText(`${capitalizedFirstName}\t${isFemale}\t${leadURL}\t${name}\t${headlineClean}\t${location}\t${profileURL}\t${firstEmail}\t${allEmails}\t${jobs}\t${score.entrepreneur[0]}\t${score.entrepreneur[1]}\t${score.investor[0]}\t${score.investor[1]}\t${score.seed[0]}\t${score.seed[1]}\t${score.early[0]}\t${score.early[1]}\t${score.angel[0]}\t${score.angel[1]}\t${score.web3[0]}\t${score.web3[1]}\t${isPremium}\t${isOpen}\t${connections}\t${twitter}\t${profilePhoneAndWebsite.profilePhone}\t${profilePhoneAndWebsite.profileWebsite}\t${cleanCompanyName}`);
        }

        function hideRelationshipSection() {
            const relationshipSection = document.querySelector("#relationship-section");

            if (!!relationshipSection) {
                console.log(`We've got relationship section! Hiding...`);
                hideSection(relationshipSection);
            }
        }

        async function fillJobList() {
            jobList = []; // Need to empty it in case I clicked the copy button before but then decided to choose a different set of emails.
            let jobElements = document.querySelectorAll("#experience-section ul li[class^=_experience-entry]");
            let multiPositionsList = document.querySelectorAll("#experience-section ul[class^=experience-list] li[class^=_experience-entry] ul[class^=_positions-list]");

            if (jobElements.length) {
                jobElements.forEach(function (jobEl) {
                    let job = {};
                    job["titles"] = [];
                    let listsInExperienceEntry = jobEl.querySelectorAll(":scope > li[class^=_experience-entry] ul");
                    console.log(`listsInExperienceEntry.length`);
                    console.log(listsInExperienceEntry.length);
                    if (listsInExperienceEntry.length &&
                        jobEl.querySelector("li[class^=_experience-entry] ul h3[data-anonymize=job-title]")) {
                        // we have to do this check because sometimes those lists inside experience entry
                        // are media elements lists like in the case of this guy: https://www.linkedin.com/in/matcy/
                        console.log("found multiPositionElements/h3 job titles: ");
                        console.log(jobEl.querySelectorAll("li[class^=_experience-entry] ul h3[data-anonymize=job-title]"));
                        // Example user with multiPositionsList:
                        // https://www.linkedin.com/sales/lead/ACwAAAC42vgBYm0a8xWAXNdflo0MUtpcvAwDE5U,name
                        // https://www.linkedin.com/in/gilbertson
                        // And this one has mixed: https://www.linkedin.com/in/cyaged
                        let multiTitleJobList = [];
                        let job = {};
                        job["titles"] = [];
                        let multiPositionElements = jobEl.querySelectorAll("ul li");
                        console.log(`multiPositionElements:`);
                        console.log(multiPositionElements);
                        multiPositionElements.forEach(function (posEl, index) {
                            job["titles"][index] = (posEl.querySelector("h3[data-anonymize=job-title]")?.textContent || "")
                                .cleanUpString();
                            console.log("current multiPosition job title: ");
                            console.log(job["titles"][index]);
                        });

                        job["company"] = (jobEl.querySelector("h2[data-anonymize=company-name]")?.textContent || "").cleanUpString();
                        console.log(`multi job title array:`);
                        console.log(job["titles"]);
                        multiTitleJobList.push(job);

                        jobList = jobList.concat(multiTitleJobList);

                    } else {
                        job["titles"][0] = (jobEl.querySelector("h2[data-anonymize=job-title]")?.textContent || "").cleanUpString();
                        job["company"] = (jobEl.querySelector("p[data-anonymize=company-name]")?.textContent || "").cleanUpString();
                        console.log(`simple job title:`);
                        console.log(job["titles"][0]);
                        jobList.push(job);
                    }

                    console.log(`"mixed" titles array:`);
                    console.log(job["titles"]);
                });
            }

            console.log(`jobList at the end:`);
            console.log(jobList);
        }
    }

    document.addEventListener("visibilitychange", () => {
        console.log(`page visible now?...`);
        console.log(!document.hidden);
        // Modify behavior…
        runScriptsOnce();
    });

    let scriptsRan = false;
    function runScriptsOnce() {
        const reloadButton = document.querySelector("#artdeco-modal-outlet div[class^=artdeco-modal] > button.artdeco-modal__confirm-dialog-btn.artdeco-button > span.artdeco-button__text");
        // There are actually 2 buttons that will match the above selector
        // if LinkedIn displays that popup.
        // The one we're interested in has
        // inner text "Reload page"

        // run scripts if not ran before
        if (!reloadButton && !scriptsRan && !document.hidden) {
            console.log(`This tab is now active and the scrips haven't run yet.`);
            runScriptsOnceTime = performance.now();
            console.log(`runScriptsOnceTime (${(runScriptsOnceTime - readyTime).toFixed(2)} ms after readyTime)`);

            // Make sure the tab remains active for at least 100 ms
            // because when a tab is closed, Chrome switches back to the previously active tab
            // BUT... for some reason, the next/following tab becomes active for a split second.
            // Even though that's not visible, that must be what's happening in my work browsers.
            // (maybe due to FLST — Focus Last Selected Tab — add-on)
            setTimeout(function () {
                if (!scriptsRan && !document.hidden) {
                    console.log(`This tab is still active after 111 ms. Run the scripts now!`);
                    runScriptsOnceTime = performance.now();
                    console.log(`runScriptsOnceTime (${(runScriptsOnceTime - readyTime).toFixed(2)} ms after readyTime)`);
                    updateLocalStorage();
                    handleThisProfile();

                    scriptsRan = true;
                }
            }, 111);
        }
    }
    runScriptsOnce();

});

}

if (searchPageMatch) {
    waitFor("#search-results-container ol li:nth-of-type(1)").then((el) => {
        updateLocalStorage();

        function manipulateListElement(element, index) {
            // Coach highlighter
            if (element.querySelector("span[data-anonymize=title]") !== null) {
                // Find the span with data-anonymize="title"
                const spanElement = element.querySelector("span[data-anonymize=title]");

                // Get the content of the span element
                const spanText = spanElement.textContent;

                // Check if "Coach" (case-insensitive) is in the text
                if (/project/i.test(spanText)) {
                    // Replace all variations of "Coach" (case-insensitive) with the correctly formatted span
                    const highlightedText = spanText.replace(/project/gi, '<span style="background-color: peachpuff;">Project</span>');

                    // Set the new HTML back into the span element
                    spanElement.innerHTML = highlightedText;
                }
            }

            // Hide non-premium profiles (for now I'm only targeting premium profiles)
            if (element.querySelector("span[data-anonymize=person-name]") !== null
                && element.querySelector("li-icon[type=linkedin-premium-gold-icon]") === null
                && element.querySelector("li-icon[aria-label^=Viewed]") !== null
                && element.querySelector(".SNF-viewed-non-premium") === null) {
                // add class ".viewed-non-premium"
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

        setInterval(handleListItems, 300);
    });
}

}
