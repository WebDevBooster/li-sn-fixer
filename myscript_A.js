$( document ).ready(function() {
const body = $("body");
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
var highlightFunctionTime;

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
/////////////////////////////

function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateLocalStorage() {
    let snfStartTime;
    let snCounter = {
        snfLeads: null,
        snfNonLeads: null
    };
    let prevLeads = localStorage.getItem("snfLeads");
    let prevNonLeads = localStorage.getItem("snfNonLeads");
    console.log(`prevLeads: ${prevLeads}`);
    console.log(`prevNonLeads: ${prevNonLeads}`);

    function initializeCounters() {
        if (prevLeads && prevNonLeads) {
            snCounter.snfLeads = prevLeads;
            snCounter.snfNonLeads = prevNonLeads;

        } else {
            localStorage.setItem("snfLeads", "0");
            localStorage.setItem("snfNonLeads", "0");
            snfStartTime = new Date().getTime();
            snfStartTime = snfStartTime.toString();
            localStorage.setItem("snfStartTime", snfStartTime);
        }
        console.log(`previous snCounter:`);
        console.log(snCounter);
        return snCounter;
    }
    initializeCounters();

    /*
        function updateLocalStorage() {
            let prevLeads = parseInt(localStorage.getItem("snfLeads"));
            let leadCounter = prevLeads + 1;
            leadCounter = leadCounter.toString();
            let prevNonLeads = parseInt(localStorage.getItem("snfNonLeads"));
            let nonLeadCounter = prevNonLeads + 1;
            nonLeadCounter = nonLeadCounter.toString();

            if (nothing) {
                localStorage.setItem("snfNonLeads", nonLeadCounter);
            }
            if (something) {
                localStorage.setItem("snfLeads", leadCounter);
            }

            console.log(`current snCounter after update`);
            console.log(`snfLeads:`);
            console.log(localStorage.getItem("snfLeads"));
            console.log(`snfNonLeads:`);
            console.log(localStorage.getItem("snfNonLeads"));
        }
        updateLocalStorage();
    */

    function appendStats() {
        let totalClass = "total";
        let ratio = 0;
        let currentLeads = parseInt(localStorage.getItem("snfLeads"));
        let currentNonLeads = parseInt(localStorage.getItem("snfNonLeads"));
        let total = currentLeads + currentNonLeads;
        if (total) {
            ratio = Math.round((currentLeads / total * 100));
            if (total > 465) {
                totalClass = "total warning"
            }
        }

        function getTrackedTime() {
            let snfTrackedTime = "";
            let nowTime = new Date().getTime();
            snfStartTime = parseInt(localStorage.getItem("snfStartTime"));
            if (snfStartTime) {
                let timeDiff = nowTime - snfStartTime;
                let mins = Math.floor(timeDiff / 1000 / 60);
                mins = mins % 60; // throw away hours
                mins = (mins < 10) ? "0" + mins : mins;
                let hrs = Math.floor(timeDiff / 1000 / 60 / 60);
                snfTrackedTime = `${hrs}:${mins}`;
            }

            localStorage.setItem("snfTrackedTime", snfTrackedTime);
            return snfTrackedTime;
        }
        getTrackedTime();

        body.append(`
        <div id="SNF-counter">
        <span class="lead">
            L: ${currentLeads}<br>${ratio}%
        </span>
        <span class="non-lead">
            N: ${currentNonLeads}
        </span>
        <span class="${totalClass}">
            T: ${total}
        </span>
        <span class="timer">
            ⏱️${getTrackedTime()}
        </span>
        <button>X</button>
        </div>
    `);
    }
    appendStats();


    function addNonLeadToCounterAndCloseTabOnClick() {
        $("#SNF-counter span.non-lead").click(function () {
            let prevNonLeads = parseInt(localStorage.getItem("snfNonLeads"));
            let nonLeadCounter = prevNonLeads + 1;
            nonLeadCounter = nonLeadCounter.toString();
            localStorage.setItem("snfNonLeads", nonLeadCounter);

            window.close();
        });
    }
    addNonLeadToCounterAndCloseTabOnClick();

    $("#SNF-counter button").click(function () {
        localStorage.clear();
    });
}

function addLeadToCounter() {
    let prevLeads = parseInt(localStorage.getItem("snfLeads"));
    let leadCounter = prevLeads + 1;
    leadCounter = leadCounter.toString();
    localStorage.setItem("snfLeads", leadCounter);
}

function addNonLeadToCounterAndCloseTab() {
    let prevNonLeads = localStorage.getItem("snfNonLeads");
    // console.log(`localStorage.getItem("snfNonLeads") before:`);
    // console.log(localStorage.getItem("snfNonLeads"));
    // console.log(`prevNonLeads type:`);
    // console.log(typeof prevNonLeads);
    // console.log(`prevNonLeads true or false?`);
    // console.log(!!prevNonLeads);
    if (prevNonLeads) {
        prevNonLeads = parseInt(prevNonLeads);
        let nonLeadCounter = prevNonLeads + 1;
        nonLeadCounter = nonLeadCounter.toString();
        localStorage.setItem("snfNonLeads", nonLeadCounter);
        // console.log(`localStorage.getItem("snfNonLeads") after:`);
        // console.log(localStorage.getItem("snfNonLeads"));
    }

    setTimeout(function () {
        // console.log(`localStorage.getItem("snfNonLeads") before window.close():`);
        // console.log(localStorage.getItem("snfNonLeads"));
        // console.log(`window.close() would trigger now...`);
        window.close();
    }, 1);
}

function autoScrollDownAndUp() {
    let timeout = getRandInteger(444, 999);
    setTimeout(function () {
        const minScroll = $(window).height() * 2;
        const maxScroll = $(document).height() - $(window).height();
        const scrollDistance = getRandInteger(minScroll, maxScroll);
        const scrollDownSpeed = getRandInteger(555, 1999);
        const scrollUpSpeed = getRandInteger(555, 999);
        const scrollUpDelay = getRandInteger(999, 2222);
        console.log(`scroll...`);
        console.log(`Distance: ${scrollDistance}`);
        console.log(`DownSpeed: ${scrollDownSpeed}`);
        console.log(`UpSpeed: ${scrollUpSpeed}`);
        console.log(`Delay: ${scrollUpDelay}`);
        console.log(`ScrollTimeTotal: ${scrollDownSpeed + scrollUpSpeed + scrollUpDelay}`);

        $("html").animate({scrollTop: scrollDistance}, scrollDownSpeed);
        setTimeout(function () {
            $("html").animate({ scrollTop: 0 }, scrollUpSpeed);
        }, scrollUpDelay);
    }, timeout);
}

function hideSection(element) {
    element.style.display = "none";
}

const currentURL = document.location.href;
const salesLeadPageMatch = currentURL.match(/linkedin\.com\/sales\/lead/);
const mozillaPageMatch = currentURL.match(/developer\.mozilla\.org/);

if (mozillaPageMatch) {
    // console.log(`we're on the Mozilla page!`);
    // console.log(`document initially visible???`);
    // console.log(!document.hidden);

    //updateLocalStorage();

    // autoScrollDownAndUp();


}

if (salesLeadPageMatch) {
// The badges ul element always exists even if the user has no badges.
// And when this element appears on the page, we can be sure that all other HTML has finally loaded as well.
// The #about-section and #experience-section are optional
// but if either of them exists, they will appear by the time the badgesList has loaded.
const badgesList = "#profile-card-section > section[class^=_header] ul[class^=_badges]";
// The experience section headline always exists, even if the experience section is empty.
// So, it's even better to wait for this HTML because then we definitely have everything.
const experienceSectionHeadline = "#experience-section > div[class^=_experience-content] > h2";
waitFor(experienceSectionHeadline).then((el) => {
    checkTime0 = performance.now();
    console.log(`checkTime0 (${(checkTime0 - readyTime).toFixed(2)} ms after readyTime)`);

    // hideIntroSection();
    // hideRelationshipSection();

    const openBadge = $(`${badgesList} li > span[class^=_open-badge]`);
    const headerSection = $("#profile-card-section > section[class^=_header]");
    const detailsSection = $("#profile-card-section > section[class^=_details-section]");
    const aboutSection = $("#about-section");
    const experienceSection = $("#experience-section");
    const isExperienceSectionEmpty = $("#experience-section > div[class^=_empty-state-container]").length;
    const headline = $( "#profile-card-section section[class^=_header_] > div:nth-child(1) > div[class^=_bodyText] > span" ).text();

    // This is a normal email regex that I used to collect the first 20K~ investor leads (until 25/10/2022):
    // const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gi;
    // This is an improved email regex that also catches cases like:
    // handle(at)domain.com or handle [at] domain.com or even "handle @ gmail .com" etc.
    // const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))(((@|\s?(\(|\[|\{|\<)\s?(at|@)\s?(\)|\]|\}|\>)\s?)(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))|((\s?@\s?)(((gmail|hotmail|yahoo|outlook|protonmail|icloud|googlemail)\s?\.\s?com)|((me|mac|aol|live|sap|msn)\.com)|((berkeley|alum\.mit|cornell|georgetown|alumni\.harvard|alumni\.stanford)\.edu))))/gi;

    // emailRegex version 3:
    // const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))(((@|\s?(\(|\[|\{|\<)\s?(at|@)\s?(\)|\]|\}|\>)\s?)(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))|((\s?@\s?)(((gmail|hotmail|yahoo|outlook|protonmail|icloud|googlemail)\s?\.\s?com)|(([a-zA-Z\-0-9]+)\.)?([a-zA-Z\-0-9]+)\.(com|edu|io|net|uk|consulting|co|vc|au|br|de|fr|dk|capital|ca|ch|org|info|in|it|be|me|ai|nl|se|tech|us|biz|eu|es|at|cz|fi|fund|group|lu|no|pro|sg|agency|app|il|nz|partners|pt|tv|ar|mx|pl|ventures|club|name|nyc))))/gi;

    // emailRegex version 4:
    // const atRegex = /(@|\s?(\(|\[|\{|\<)\s?(at|@)\s?(\)|\]|\}|\>)\s?)/gi;
    // const subdomainDomainDotRegex = /(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})/gi;
    // const newSubdomainDomainDotRegex = /(([a-zA-Z\-0-9]+(\.|\s?(\(|\[|\{|\<)\s?(dot)\s?(\)|\]|\}|\>)\s?))+[a-zA-Z]{2,})/gi;
    const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))(((@|\s?(\(|\[|\{|\<)\s?(at|@)\s?(\)|\]|\}|\>)\s?)(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+(\.|\s?(\(|\[|\{|\<)\s?(dot)\s?(\)|\]|\}|\>)\s?))+[a-zA-Z]{2,})))|((\s?@\s?)(((gmail|hotmail|yahoo|outlook|protonmail|icloud|googlemail)\s?\.\s?com)|(([a-zA-Z\-0-9]+)\.)?([a-zA-Z\-0-9]+)\s?\.\s?(com|edu|io|net|uk|consulting|co|vc|au|br|de|fr|dk|capital|ca|ch|org|info|in|it|be|me|ai|nl|se|tech|us|biz|eu|es|at|cz|fi|fund|group|lu|no|pro|sg|agency|app|il|nz|partners|pt|tv|ar|mx|pl|ventures|club|name|nyc))))/gi;

    let profileEmails = {
        inHeader: null,
        inContact: null,
        inCurrentRoles: null,
        inAbout: null,
        inExperience: null,
        uniqueEmails: []
    }
    let firstEmail = "";
    let allEmails = "";
    let jobList = [];
    let jobs = "";
    let profileURL = "";
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
            .replace(/\s\s+/g, " ") // Replace instances of multiple spaces with one
            // This one supersedes the following as it also removes line breaks, tabs etc.
            //.replace(/\r?\n|\r/gm, ""); // Inside a headline there could even be a line break like in this profile: https://www.linkedin.com/in/andrew-dude-92523335
            .trim();
    }

    /////////////////////////////
    function handleThisProfile() {
        // Quick check to see if there are any emails
        function hasEmail() {
            // Header and Details HTML will have loaded at this point.
            const emailMatchesInHeader = headerSection.html().match(emailRegex);
            const emailMatchesInDetails = detailsSection.html().match(emailRegex);
            const emailMatchesInExperience = experienceSection.html().match(emailRegex);
            // aboutSection is optional
            if (aboutSection.length) {
                const emailMatchesInAbout = aboutSection.html().match(emailRegex);
                return !!(emailMatchesInHeader || emailMatchesInDetails || emailMatchesInAbout || emailMatchesInExperience);
            } else {
                return !!(emailMatchesInHeader || emailMatchesInDetails || emailMatchesInExperience);
            }
        }

        function autoCloseTabOrCollectProfileData () {
            if (openBadge.length) {
                checkTimeOpenBadgeDetected = performance.now();
                console.log(`OpenBadgeDetected (${(checkTimeOpenBadgeDetected - readyTime).toFixed(2)} ms after readyTime)`);
                // console.log(`open badge is there!`);
                collectProfileData();
            } else {
                // console.log(`no open badge there!`);
                if (hasEmail()) {
                    checkTimeFirstEmailDetected = performance.now();
                    console.log(`FirstEmailDetected (${(checkTimeFirstEmailDetected - readyTime).toFixed(2)} ms after readyTime)`);
                    // console.log(`We have EMAIL!!!`);
                    collectProfileData();
                } else {
                    // window.close();

                    // Don't auto-close, set the background to red instead and close manually.
                    $("#content-main").css("background-color", "#c91b0c");

                    let randomTimeout = getRandInteger(3333, 6666);
                    let countdown = Math.round(randomTimeout / 1000);
                    let downloadTimer = setInterval(function(){
                        countdown--;
                        document.getElementById("countdown").textContent = countdown.toString();
                        if (countdown <= 0) {
                            clearInterval(downloadTimer);
                        }
                    },1000);

                    $("#SNF-counter").append(`
                <span id="countdown"></span>
                `);
                    setTimeout(function () {
                        addNonLeadToCounterAndCloseTab();
                    }, randomTimeout);
                    autoScrollDownAndUp();
                }
            }
        }
        autoCloseTabOrCollectProfileData ();

        function clickShowMoreButtons() {
            function clickExperienceButtons() {
                const experienceButtons = document.querySelectorAll("#experience-section [id$=clamped-content] > span:nth-child(2) > button[class^=_ellipsis-button]");
                if (experienceButtons.length) {
                    checkTime2 = performance.now();
                    console.log(`checkTime2: ${(checkTime2 - readyTime).toFixed(2)} ms`);
                    experienceButtons.forEach(function (item) {
                        $(item).click();
                    });
                    checkTime3 = performance.now();
                    console.log(`checkTime3: ${(checkTime3 - readyTime).toFixed(2)} ms`);
                }
            }

            const showAllBtn = $("#experience-section > button[aria-expanded=false]");
            if (showAllBtn.length) {
                showAllBtn.click();
                waitFor("#experience-section > button[aria-expanded=true]").then((el) => {
                    checkTime1 = performance.now();
                    console.log(`checkTime1: ${(checkTime1 - readyTime).toFixed(2)} ms`);
                    setTimeout(clickExperienceButtons, 1);
                });
            } else {
                clickExperienceButtons();
            }

            const showMoreInAboutBtn = $("#about-section div > span:nth-child(2) > button[class^=_ellipsis-button]");
            if (showMoreInAboutBtn.length) {
                showMoreInAboutBtn.click();
            }
            checkTime4 = performance.now();
            console.log(`checkTime4: ${(checkTime4 - readyTime).toFixed(2)} ms`);
        }

        function removeDuplicatesInArray(array) {
            return [... new Set(array.map(e => e.toLowerCase()))];
        }

        function collectEmails() {
            collectEmailsTime = performance.now();
            console.log(`collectEmailsTime: ${(collectEmailsTime - readyTime).toFixed(2)} ms`);
            let emailList = [];

            profileEmails.inHeader = headerSection.html().match(emailRegex); // null if none, array if some
            if (profileEmails.inHeader) {
                emailList = emailList.concat(profileEmails.inHeader);
            }

            const contactSection = $("#profile-card-section > section[class^=_details-section] > section");
            if (contactSection.length) {
                profileEmails.inContact = contactSection.html().match(emailRegex);
                if (profileEmails.inContact) {
                    profileEmails.inContact = removeDuplicatesInArray(profileEmails.inContact);
                    profileEmails.inContact = profileEmails.inContact.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inContact);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            const currentRolesSectionEmpty = $("#profile-card-section > section[class^=_details-section] > div[class^=_current-role-container] p[class^=_no-current-role]").length;
            if (!currentRolesSectionEmpty) {
                const currentRolesSection = $("#profile-card-section > section[class^=_details-section] > div[class^=_current-role-container]");
                profileEmails.inCurrentRoles = currentRolesSection.html().match(emailRegex);
                if (profileEmails.inCurrentRoles) {
                    profileEmails.inCurrentRoles = removeDuplicatesInArray(profileEmails.inCurrentRoles);
                    profileEmails.inCurrentRoles = profileEmails.inCurrentRoles.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inCurrentRoles);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            const aboutSection = $("#about-section");
            if (aboutSection.length) { // Some profiles don't have the about section
                profileEmails.inAbout = aboutSection.html().match(emailRegex);
                if (profileEmails.inAbout) {
                    profileEmails.inAbout = removeDuplicatesInArray(profileEmails.inAbout);
                    profileEmails.inAbout = profileEmails.inAbout.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inAbout);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            if (!isExperienceSectionEmpty) {
                const experienceSection = $("#experience-section div");
                profileEmails.inExperience = experienceSection.html().match(emailRegex);
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
            if (cleaned === original) {
                return [cleaned, ``, ``];
            } else {
                return [cleaned, `⭐`, `<br>♦ ${original}`];
            }
        }

        function addHTMLElements(array, sectionName) {
            if (array) {
                let newElements = [];
                newElements[0] = `<span>${sectionName}:</span>`;
                array.forEach(function (currentValue, index) {
                    currentValue = cleanUpEmail(currentValue);
                    const checkmark = index === 0 ? "checked" : "";
                    newElements.push(`
                <label for="SNF-${sectionName}-checkbox${index}">
                <input id="SNF-${sectionName}-checkbox${index}" value="${currentValue[0]}" type="checkbox" ${checkmark}>
                <span id="SNF-${sectionName}-email${index}">${currentValue[0]}${currentValue[1]}${currentValue[2]}</span>
                </label>`);
                });
                return newElements.join("");
            } else {
                // return "¯\\_( ツ)_/¯";
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

            headerSection.append(`
        <section id="SNF-data">
            <div>
                <button id="SNF-copy" class="copy-btn" type="button">Copy</button>
                <button id="SNF-femcopy" class="copy-btn" type="button">FemC</button>
            </div>
            <div>
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
            /*
                    const entrepreneurRegex = /\bentrepreneur\b|\bunternehmer\b/gi;
                    const investorRegex = /\binvestor\b/gi;
                    const angelRegex = /\bangel investor\b|\bangel-investor\b|\bBusiness Angel\b|\bBusinessangel\b|\bBusiness-Angel\b|\bangel investing\b/gi;
                    /!*
                        const angelRegex2 = /\bangel investing\b/gi;
                        // I'm moving "angel investing" into the other regex because otherwise it's needlessly complex
                        // Level points:
                        // headline match: 3
                        // about match: 2
                        // job titles match: none
                        // companies match: none
                        // job descriptions match: 1
                    *!/
                    const seedRegex = /\bseed\b|\bpreseed\b/gi;
                    const earlyRegex = /\bearly stage\b|\bearly-stage\b/gi;
                    const web3Regex = /\bblockchain\b|\bblock chain\b|\bweb3\b|\bweb 3\b|crypto|\bnft\b|\bdefi\b/gi;
            */

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
            /*
                        // manual test data input:
                        kwsIn.headline.entrepreneur = 1;
                        kwsIn.about.entrepreneur = 2;
                        kwsIn.jobTitles.entrepreneur = 2;
                        kwsIn.jobDescriptions.entrepreneur = 2;
                        // manual data input END
            */
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
                if (aboutSection.length) {
                    let aboutMatches = aboutSection.html().match(kwRegex(keyword));
                    if (aboutMatches) {
                        kwsIn.about[keyword] = aboutMatches;
                    }
                }

                // in experience section:
                if (!isExperienceSectionEmpty) {
                    const jobTitleElements = $("h2[data-anonymize=job-title], h3[data-anonymize=job-title]");
                    // This matches all job titles in single-title and multi-title job lists
                    if (jobTitleElements.length) {
                        let jobTitles = [];
                        jobTitleElements.each(function () {
                            jobTitles.push($(this).text());
                        });
                        jobTitles = jobTitles.join(" | ");
                        let jobTitleMatches = jobTitles.match(kwRegex(keyword));
                        if (jobTitleMatches) {
                            kwsIn.jobTitles[keyword] = jobTitleMatches;
                        }
                    }

                    const companyNameElements = $("p[data-anonymize=company-name], h2[data-anonymize=company-name]");
                    // This matches all company names in single-title and multi-title job lists
                    if (companyNameElements.length) {
                        let companyNames = [];
                        companyNameElements.each(function () {
                            companyNames.push($(this).text());
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
                    const jobDescriptionElements = $("[class^=_single-position-description], [class^=_multi-position-description]");
                    if (jobDescriptionElements.length) {
                        let jobDescriptions = [];
                        jobDescriptionElements.each(function () {
                            jobDescriptions.push($(this).html()); // html() instead of text() because it preserves line breaks
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
            setTimeout(collectEmails, 999);
            setTimeout(appendCollectedEmails, 1122);
            setTimeout(findMatchingKeywords, 1222, kwArray);
            setTimeout(copyDataToClipboard, 1444);
        }

        function copyDataToClipboard() {
            copyDataToClipboardTime = performance.now();
            console.log(`copyDataToClipboardTime: ${(copyDataToClipboardTime - readyTime).toFixed(2)} ms`);
            // green light
            $("#content-main").css("background-color", "#aadec3");

            const copyBtn = $("#SNF-copy");
            const copyFemaleBtn = $("#SNF-femcopy");
            const menuTrigger = $( "#profile-card-section > section[class^=_header] > div[class^=_actions-container] > section[class^=_actions-bar] > button" );

            function copyToClipboard() {
                menuTrigger.click();
                setTimeout(function () {
                    waitFor("#hue-web-menu-outlet ul li a").then((el) => {
                        // profileURL = $( "#hue-web-menu-outlet ul li a" ).attr("href");
                        profileURL = $( "#hue-web-menu-outlet ul li a:contains('View LinkedIn profile')" ).attr("href");
                        // const copyElement = $( "#hue-web-menu-outlet ul li:contains('Copy LinkedIn.com URL')" );
                        modifyClipboard();
                    });
                }, 33);
            }

            if (copyBtn.length && copyFemaleBtn.length && menuTrigger.length) {
                copyBtn.click(function () {
                    copyToClipboard();
                });

                copyFemaleBtn.click(function () {
                    isFemale = "TRUE";
                    copyToClipboard();
                });
            }
        }

        function getEmailsToExport() {
            if (!profileEmails.uniqueEmails.length) {
                firstEmail = "";
                allEmails = "";
            } else {
                const checkedEmailElements = $("#SNF-data input[id^=SNF]:checked");
                if (checkedEmailElements.length === 0) { // I might uncheck all emails
                    firstEmail = "";
                    allEmails = "";
                } else {
                    const checkedEmailsArray = checkedEmailElements.map(function () {
                        return $(this).val();
                    }).toArray();
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
                        // let multiTitles = currentValue["titles"].join(" ❱❱ ");
                        // newJobList.push(`${multiTitles} ➤ ${currentValue["company"]}`);
                        let multiTitles = currentValue["titles"].join(" ➤ ");
                        newJobList.push(`${multiTitles} 🔷 ${currentValue["company"]}`);

                    } else {
                        newJobList.push(`${currentValue["titles"][0]} 🔷 ${currentValue["company"]}`);
                    }
                }
            });
            return jobs = newJobList.join(" ✚✚ ");
        }

        async function modifyClipboard() {
            // Sales Navigator lead URLs have a lot of crap appended to them.
            // So, we need to grab the first 75 characters and append ",name" to get rid of useless parameters.
            const leadURL = `${currentURL.substring(0, 75)},name`;
            const name = $( "#profile-card-section section[class^=_header_] h1" ).text().cleanUpString();
            const headlineClean = headline.cleanUpString();

            const location = $( "#profile-card-section > section[class^=_header_] > div:nth-child(1) > div[class^=_lockup-links-container] > div:nth-child(1)" ).text().cleanUpString();

            getEmailsToExport();
            await getJobsToExport();
            getKeywordScores(kwArray);
            addLeadToCounter();

            await navigator.clipboard.writeText(`${isFemale}\t${leadURL}\t${name}\t${headlineClean}\t${location}\t${profileURL}\t${firstEmail}\t${allEmails}\t${jobs}\t${score.entrepreneur[0]}\t${score.entrepreneur[1]}\t${score.investor[0]}\t${score.investor[1]}\t${score.seed[0]}\t${score.seed[1]}\t${score.early[0]}\t${score.early[1]}\t${score.angel[0]}\t${score.angel[1]}\t${score.web3[0]}\t${score.web3[1]}`);
        }



        /*
            setTimeout(function () { // TODO: Refactor this
                if (!aboutSection) {
                    highlight();
                }
            }, 1600);

        */


        function hideIntroSection() {
            const introSection = document.querySelector("section[class^=_introductions-section]");

            if (!!introSection) {
                // console.log(`We've got intro section! Hiding...`);
                // we no longer need to hide this
                // hideSection(introSection);
            }
        }

        function hideRelationshipSection() {
            const relationshipSection = document.querySelector("#relationship-section");

            if (!!relationshipSection) {
                // console.log(`We've got relationship section! Hiding...`);
                // we no longer need to hide this
                // hideSection(relationshipSection);
            }
        }


        /*
            function highlight() {
                highlightFunctionTime = performance.now();
                console.log(`highlight function called
        ${highlightFunctionTime - readyTime} ms
        after readyTime`);
                let body = $( "body" );
                let currentHTML = document.querySelector("#content-main div[class^=_main-column]").innerHTML;
                // const keyword1Regex = /Crypto/gi;
                // const keyword1Replacement = "Crypto";
                const keyword1Regex = /blockchain|web3|web 3|crypto|nft|\bdefi\b/gi;
                const keyword1Replacement = "Crypto";

                // const keyword1Regex = /NFT/gi;
                // const keyword1Replacement = "NFT";

                // const keyword1Regex = /Blockchain|web3|web 3/gi;
                // const keyword1Replacement = "Blockchain";
                // const keyword1Regex = /Web3|Web 3\.0|Web 3/gi;
                // const keyword1Replacement = "Web3";

                // const keyword2Regex = /enthusiast/gi;
                // const keyword2Regex = /Strategist|Evangelist|Aficionado/gi;
                // const keyword2Regex = /expert/gi;
                // const keyword2Regex = /consultant|advisor|analyst|specialist/gi;
                // const keyword2Regex = /consultant|advisor|analyst|specialist|expert|investor/gi;
                // const keyword2Regex = /consultant|advisor|evangelist/gi;
                // const keyword2Regex = /consultant|advisor/gi;
                // const keyword2Regex = /collector|investor|owner/gi;
                // const keyword2Regex = /trader|investor|miner/gi;
                // const keyword2Regex = /miner/gi;
                const keyword2Regex = /investor/gi;
                // const keyword2Regex = /entrepreneur/gi;
                const keyword3Regex = /\bseed\b|\bpreseed\b/gi;
                const keyword4Regex = /\bearly stage\b|\bearly-stage\b/gi;
                const keyword5Regex = /\bangel investor\b|\bangel investing\b|\bangel-investor\b|\bBusiness Angel\b|\bBusinessangel\b|\bBusiness-Angel\b/gi;
                const keyword6Regex = /entrepreneur/gi;

                let keyword1Array = currentHTML.match(keyword1Regex);
                let keyword2Array = currentHTML.match(keyword2Regex);
                let keyword3Array = currentHTML.match(keyword3Regex);
                let keyword4Array = currentHTML.match(keyword4Regex);
                let keyword5Array = currentHTML.match(keyword5Regex);
                let keyword6Array = currentHTML.match(keyword6Regex);
                aboutSection = document.querySelector("#about-section");

                if (keyword1Array.length && keyword2Array.length && hasEmail()) {
                    body.append('<audio id="LNSNF-kw1and2" autoplay><source src="https://alexbooster.com/media/adara.mp3"></audio>');
                    body.append('<audio id="LNSNF-email" autoplay><source src="https://alexbooster.com/media/Cha-Ching.ogg"></audio>');
                    // User interaction/click required to play audio after page load:
                    // https://developer.chrome.com/blog/autoplay/
                    $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                        const playKW1and2Promise = document.querySelector('#LNSNF-kw1and2').play();
                        setTimeout(function () {
                            const playEmailPromise = document.querySelector('#LNSNF-email').play();
                        }, 400);
                    });
                } else if (keyword1Array.length && keyword2Array.length) {
                    body.append('<audio id="LNSNF-kw1and2" autoplay><source src="https://alexbooster.com/media/adara.mp3"></audio>');
                    // User interaction/click required to play audio after page load:
                    // https://developer.chrome.com/blog/autoplay/
                    $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                        const playKW1and2Promise = document.querySelector('#LNSNF-kw1and2').play();
                    });
                } else if ((keyword1Array.length || keyword2Array.length) && hasEmail()) {
                    body.append('<audio id="LNSNF-kw2" autoplay><source src="https://alexbooster.com/media/Tones.ogg"></audio>');
                    body.append('<audio id="LNSNF-email" autoplay><source src="https://alexbooster.com/media/Cha-Ching.ogg"></audio>');
                    $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                        const playKW2Promise = document.querySelector('#LNSNF-kw2').play();
                        setTimeout(function () {
                            const playEmailPromise = document.querySelector('#LNSNF-email').play();
                        }, 400);
                    });
                } else if (keyword1Array.length || keyword2Array.length) {
                    body.append('<audio id="LNSNF-kw2" autoplay><source src="https://alexbooster.com/media/Tones.ogg"></audio>');
                    $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                        const playKW2Promise = document.querySelector('#LNSNF-kw2').play();
                    });
                } else if (hasEmail()) {
                    body.append('<audio id="LNSNF-no-kws" autoplay><source src="https://alexbooster.com/media/shrink-ray.ogg"></audio>');
                    body.append('<audio id="LNSNF-email" autoplay><source src="https://alexbooster.com/media/Cha-Ching.ogg"></audio>');
                    $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                        const playKW2Promise = document.querySelector('#LNSNF-no-kws').play();
                        setTimeout(function () {
                            const playEmailPromise = document.querySelector('#LNSNF-email').play();
                        }, 400);
                    });
                } else {
                    body.append('<audio id="LNSNF-no-kws" autoplay><source src="https://alexbooster.com/media/shrink-ray.ogg"></audio>');
                    $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                        const playKW2Promise = document.querySelector('#LNSNF-no-kws').play();
                    });
                }


                if (keyword3Array.length) {
                    body.append('<audio id="LNSNF-kw3" autoplay><source src="https://alexbooster.com/media/seed.mp3"></audio>');
                    // User interaction/click required to play audio after page load:
                    // https://developer.chrome.com/blog/autoplay/
                    $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                        setTimeout(function () {
                            const playKW3Promise = document.querySelector('#LNSNF-kw3').play();
                        }, 100);
                    });
                }


                if (keyword4Array.length) {
                    body.append('<audio id="LNSNF-kw4" autoplay><source src="https://alexbooster.com/media/early.mp3"></audio>');
                    // User interaction/click required to play audio after page load:
                    // https://developer.chrome.com/blog/autoplay/
                    $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                        setTimeout(function () {
                            const playKW4Promise = document.querySelector('#LNSNF-kw4').play();
                        }, 500);
                    });
                }


                if (keyword5Array.length) {
                    body.append('<audio id="LNSNF-kw5" autoplay><source src="https://alexbooster.com/media/angel.mp3"></audio>');
                    // User interaction/click required to play audio after page load:
                    // https://developer.chrome.com/blog/autoplay/
                    $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                        setTimeout(function () {
                            const playKW5Promise = document.querySelector('#LNSNF-kw5').play();
                        }, 1000);
                    });
                }


                /!*
                        if (keyword6Array.length) {
                            body.append('<audio id="LNSNF-kw6" autoplay><source src="https://alexbooster.com/media/entrepreneur.mp3"></audio>');
                            // User interaction/click required to play audio after page load:
                            // https://developer.chrome.com/blog/autoplay/
                            $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                                setTimeout(function () {
                                    const playKW6Promise = document.querySelector('#LNSNF-kw6').play();
                                }, 1000);
                            });
                        }
                *!/

                /!*
                        document.querySelector("#profile-card-section > section[class^=_header_] span[data-anonymize=headline]").innerHTML = document.querySelector("#profile-card-section > section[class^=_header_] span[data-anonymize=headline]").innerHTML.replace(keyword1Regex,`<mark style="font-weight: normal;">${keyword1Replacement}</mark>`);

                        if (aboutSection.length) {
                            document.querySelector("#about-section").innerHTML = document.querySelector("#about-section").innerHTML.replace(keyword1Regex,`<mark style="font-weight: normal;">${keyword1Replacement}</mark>`);
                        }
                *!/

                // Remove irrelevant crap from image attributes
                // because when I apply the highlight effect,
                // if those attributes contain my keywords, it messes up the page HTML.
                $("#experience-section img").each(function (key, value) {
                    // console.log("img title: ", $(value).attr('title'));
                    $(value).attr("title", "--");
                    $(value).attr("alt", "--");
                });

                $("div[id^=similar-leads-account-insights-outlet]").remove();
                $("section[class^=_search-links-section]").remove();

                //document.querySelector("#experience-section").innerHTML = document.querySelector("#experience-section").innerHTML.replace(keyword1Regex,`<mark style="font-weight: normal;">${keyword1Replacement}</mark>`);

            }
        */

        var timeBeforeAboutBtnClick,
            timeAfterAboutBtnClick;

        async function fillJobList() {
            jobList = []; // Need to empty it in case I clicked the copy button before but then decided to choose a different set of emails.
            let jobElements = $("#experience-section ul[class^=_experience-list] li[class^=_experience-entry]");
            let multiPositionsList = $("#experience-section ul[class^=_experience-list] li[class^=_experience-entry] ul[class^=_positions-list]");

            if (jobElements.length) {
                jobElements.each(function () {
                    let job = {};
                    job["titles"] = [];
                    console.log(`$(this).children("ul[class^=_positions-list]").length`);
                    console.log($(this).children("ul[class^=_positions-list]").length);
                    if ($(this).children("ul[class^=_positions-list]").length) {
                        console.log(`$(this).children("ul[class^=_positions-list]")`);
                        console.log($(this).children("ul[class^=_positions-list]"));
                        // Example user with multiPositionsList:
                        // https://www.linkedin.com/sales/lead/ACwAAAC42vgBYm0a8xWAXNdflo0MUtpcvAwDE5U,name
                        // https://www.linkedin.com/in/gilbertson
                        // And this one has mixed: https://www.linkedin.com/in/cyaged
                        let multiTitleJobList = [];
                        let job = {};
                        job["titles"] = [];
                        let multiPositionElements = $(this).find("li[class^=_position-entry]");
                        console.log(`multiPositionElements:`);
                        console.log(multiPositionElements);
                        multiPositionElements.each(function (index) {
                            job["titles"][index] = $(this).find("h3[data-anonymize=job-title]").text()
                                .cleanUpString();

                            /*
                                                    let titleElements = $(this).find("li[class^=_position-entry]");
                                                    titleElements.each(function (index) {
                                                        job["titles"][index] = $(this).find("h3[data-anonymize=job-title]").text()
                                                            .cleanUpString();
                                                    });
                            */


                        });

                        job["company"] = $(this).find("h2[data-anonymize=company-name]").text().cleanUpString();
                        console.log(`multi job title array:`);
                        console.log(job["titles"]);
                        // console.log(job["company"]);
                        multiTitleJobList.push(job);
                        // console.log(jobList);

                        jobList = jobList.concat(multiTitleJobList);

                    } else {
                        job["titles"][0] = $(this).find("h2[data-anonymize=job-title]").text().cleanUpString();
                        job["company"] = $(this).find("p[data-anonymize=company-name]").text().cleanUpString();
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
    /////////////////////////////

    ///// Page visibility wrapper
    document.addEventListener("visibilitychange", () => {
        console.log(`page visible now?...`);
        console.log(!document.hidden);
        // Modify behavior…
        runScriptsOnce();
    });

    let scriptsRan = false;
    function runScriptsOnce() {
        // run scripts if not ran before
        if (!scriptsRan && !document.hidden) {
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
    ///// Page visibility wrapper END

});
// End of the waitFor(experienceSectionHeadline) wrapper.


}
// End of the salesLeadPage functions


const searchPageMatch = currentURL.match(/linkedin\.com\/sales\/search\/people/);

    if (searchPageMatch) {
        waitFor("#search-results-container ol li:nth-of-type(1)").then((el) => {
            function manipulateListElement(element, index) {
                // Hide non-premium profiles (for now I'm only targeting premium profiles)
                if ($(element).has("span[data-anonymize=person-name]").length
                    && !$(element).has("li-icon[type=linkedin-premium-gold-icon]").length
                    && $(element).has("li-icon[aria-label^=Viewed]").length
                    && !$(element).has(".SNF-viewed-non-premium").length) {
                    // add class ".viewed-non-premium"
                    $(element).addClass("SNF-viewed-non-premium");
                }

                if ($(element).has("span[data-anonymize=person-name]").length
                    && !$(element).has("li-icon[type=linkedin-premium-gold-icon]").length
                    && !$(element).has(".SNF-non-premium").length) {
                    // element.style.backgroundColor = "#0073b1";
                    // element.style.backgroundColor = "aqua";
                    $(element).addClass("SNF-non-premium");
                }


                if ($(element).has("li-icon[aria-label^=Viewed]").length && !$(element).has(".SNF-viewed-premium").length) {
                    //element.style.backgroundColor = "cornsilk";
                    $(element).addClass("SNF-viewed-premium");
                }

                // most "out-of-network" profiles are useless for me
                if ($(element).has("div[class^=_out-of-network]").length && !$(element).has(".SNF-out-of-network").length) {
                    // element.style.backgroundColor = "pink";
                    $(element).addClass("SNF-out-of-network");
                }
            }

            function handleListItems() {
                const listArray = document.querySelectorAll("li.artdeco-list__item");
                const aboutSectionsArray = $("li.artdeco-list__item > div > div > div:nth-of-type(2) > div > div:nth-of-type(2)");
                const yearsArray = $("li.artdeco-list__item > div > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div:nth-of-type(4)");

                if (listArray.length) {
                    listArray.forEach(manipulateListElement);
                }

                if (aboutSectionsArray.length) {
                    // aboutSectionsArray.forEach(hideSection);
                    aboutSectionsArray.each(function () {
                        if ($(this).is(":visible")) {
                            $(this).hide();
                        }
                    });
                }

                if (yearsArray.length) {
                    yearsArray.each(function () {
                        if ($(this).is(":visible")) {
                            $(this).hide();
                        }
                    });
                }
            }

            setInterval(handleListItems, 300);
        });
    }

});
