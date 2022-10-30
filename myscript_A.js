$( document ).ready(function() {
const body = $("body");
const readyTime = performance.now();

var checkTime0,
    checkTimeOpenBadgeDetected,
    checkTimeFirstEmailDetected,
    checkTime1,
    checkTime2,
    checkTime3,
    checkTime4,
    checkTime5;
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


function hideSection(element) {
    element.style.display = "none";
}

const currentURL = document.location.href;
const salesLeadPageMatch = currentURL.match(/linkedin\.com\/sales\/lead/);

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

    /////////////////////////////
    const openBadge = $(`${badgesList} li > span[class^=_open-badge]`);
    const headerSection = $("#profile-card-section > section[class^=_header]");
    const detailsSection = $("#profile-card-section > section[class^=_details-section]");
    const aboutSection = $("#about-section");
    const experienceSection = $("#experience-section");

    // This is a normal email regex that I used to collect the first 20K~ investor leads (until 25/10/2022):
    // const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gi;
    // This is an improved email regex that also catches cases like:
    // handle(at)domain.com or handle [at] domain.com or even "handle @ gmail .com" etc.
    // const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))(((@|\s?(\(|\[|\{|\<)\s?(at|@)\s?(\)|\]|\}|\>)\s?)(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))|((\s?@\s?)(((gmail|hotmail|yahoo|outlook|protonmail|icloud|googlemail)\s?\.\s?com)|((me|mac|aol|live|sap|msn)\.com)|((berkeley|alum\.mit|cornell|georgetown|alumni\.harvard|alumni\.stanford)\.edu))))/gi;

    // emailRegex version 3:
    const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))(((@|\s?(\(|\[|\{|\<)\s?(at|@)\s?(\)|\]|\}|\>)\s?)(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))|((\s?@\s?)(((gmail|hotmail|yahoo|outlook|protonmail|icloud|googlemail)\s?\.\s?com)|(([a-zA-Z\-0-9]+)\.)?([a-zA-Z\-0-9]+)\.(com|edu|io|net|uk|consulting|co|vc|au|br|de|fr|dk|capital|ca|ch|org|info|in|it|be|me|ai|nl|se|tech|us|biz|eu|es|at|cz|fi|fund|group|lu|no|pro|sg|agency|app|il|nz|partners|pt|tv|ar|mx|pl|ventures|club|name|nyc))))/gi;

    // Quick check to see if there are any emails
    function hasEmail() {
        // Header and Details HTML will have loaded at this point.
        const emailMatchesInHeader = headerSection.html().match(emailRegex);
        const emailMatchesInDetails = detailsSection.html().match(emailRegex);
        const emailMatchesInExperience = experienceSection.html().match(emailRegex);
        // aboutSection is optional
        if (aboutSection) {
            const emailMatchesInAbout = aboutSection.html().match(emailRegex);
            return !!(emailMatchesInHeader || emailMatchesInDetails || emailMatchesInAbout || emailMatchesInExperience);
        } else {
            return !!(emailMatchesInHeader || emailMatchesInDetails || emailMatchesInExperience);
        }
    }

    function autoCloseTabIfNoOpenBadgeOrEmail () {
        if (openBadge.length) {
            checkTimeOpenBadgeDetected = performance.now();
            console.log(`OpenBadgeDetected (${(checkTimeOpenBadgeDetected - readyTime).toFixed(2)} ms after readyTime)`);
            // console.log(`open badge is there!`);
        } else {
            // console.log(`no open badge there!`);
            if (hasEmail()) {
                checkTimeFirstEmailDetected = performance.now();
                console.log(`FirstEmailDetected (${(checkTimeFirstEmailDetected - readyTime).toFixed(2)} ms after readyTime)`);
                // console.log(`We have EMAIL!!!`);
            } else {
                window.close();
            }
        }
    }
    autoCloseTabIfNoOpenBadgeOrEmail ();


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


    function clickShowMoreButtons() {
        const showMoreInAboutBtn = $("#about-section div > span:nth-child(2) > button[class^=_ellipsis-button]");
        if (showMoreInAboutBtn.length) {
            showMoreInAboutBtn.click();
        }

        const experienceButtons = document.querySelectorAll("#experience-section [id$=clamped-content] > span:nth-child(2) > button[class^=_ellipsis-button]");
        if (experienceButtons.length) {
            experienceButtons.forEach(function (item) {
                $(item).click();
            });
        }

        const showAllBtn = $("#experience-section > button[aria-expanded=false]");
        if (showAllBtn.length) {
            showAllBtn.click();
        }
    }
    setTimeout(clickShowMoreButtons, 11);

    function removeDuplicatesInArray(array) {
        return [... new Set(array.map(e => e.toLowerCase()))];
    }

    function collectEmails() {
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
        profileEmails.inAbout = aboutSection.html().match(emailRegex);
        if (profileEmails.inAbout) {
            profileEmails.inAbout = removeDuplicatesInArray(profileEmails.inAbout);
            profileEmails.inAbout = profileEmails.inAbout.filter( (el) => !emailList.includes(el) );
            emailList = emailList.concat(profileEmails.inAbout);
            emailList = removeDuplicatesInArray(emailList);
        }

        const experienceSectionEmpty = $("#experience-section > div[class^=_empty-state-container]").length;
        if (!experienceSectionEmpty) {
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

    function collectProfileData() {
        setTimeout(collectEmails, 222);
        setTimeout(appendCollectedEmails, 333);
        setTimeout(copyDataToClipboard, 444);
    }
    collectProfileData();

    function copyDataToClipboard() {
        const copyBtn = $("#SNF-copy");
        const copyFemaleBtn = $("#SNF-femcopy");
        const menuTrigger = $( "#profile-card-section section[class^=_header] div[class^=_actions-container] section[class^=_actions-bar] button[id^=hue-menu-trigger]" );

        function copyToClipboard() {
            menuTrigger.click();
            setTimeout(function () {
                profileURL = $( "#hue-web-menu-outlet ul li a" ).attr("href");
                modifyClipboard();
            }, 33);
        }

        if (copyBtn && copyFemaleBtn && menuTrigger.length) {
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
                    newJobList.push(`${multiTitles} 🔹 ${currentValue["company"]}`);

                } else {
                    newJobList.push(`${currentValue["titles"][0]} 🔹 ${currentValue["company"]}`);
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
        const headline = $( "#profile-card-section section[class^=_header_] > div:nth-child(1) > div[class^=_bodyText] > span" ).text().cleanUpString();

        const location = $( "#profile-card-section > section[class^=_header_] > div:nth-child(1) > div[class^=_lockup-links-container] > div:nth-child(1)" ).text().cleanUpString();

        getEmailsToExport();
        await getJobsToExport();

        await navigator.clipboard.writeText(`${isFemale}\t${leadURL}\t${name}\t${headline}\t${location}\t${profileURL}\t${firstEmail}\t${allEmails}\t${jobs}`);
    }







    let introSection;
    let relationshipSection;

/*
    setTimeout(function () { // TODO: Refactor this
        if (!aboutSection) {
            highlight();
        }
    }, 1600);

*/




    const introSectionRemover = setInterval(hideIntroSection, 650);
    const relationshipSectionRemover = setInterval(hideRelationshipSection, 700);

    function hideIntroSection() {
        introSection = document.querySelector("section[class^=_introductions-section]");

        if (!!introSection) {
            // console.log(`We've got intro section! Hiding...`);
            hideSection(introSection);
            clearInterval(introSectionRemover);
        } else {
            // console.log(`We don't have intro section yet!`);
        }
    }

    function hideRelationshipSection() {
        relationshipSection = document.querySelector("#relationship-section");

        if (!!relationshipSection) {
            // console.log(`We've got relationship section! Hiding...`);
            hideSection(relationshipSection);
            clearInterval(relationshipSectionRemover);
        } else {
            // console.log(`We don't have relationship section yet!`);
        }
    }

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

        if (keyword1Array && keyword2Array && hasEmail()) {
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
        } else if (keyword1Array && keyword2Array) {
            body.append('<audio id="LNSNF-kw1and2" autoplay><source src="https://alexbooster.com/media/adara.mp3"></audio>');
            // User interaction/click required to play audio after page load:
            // https://developer.chrome.com/blog/autoplay/
            $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                const playKW1and2Promise = document.querySelector('#LNSNF-kw1and2').play();
            });
        } else if ((keyword1Array || keyword2Array) && hasEmail()) {
            body.append('<audio id="LNSNF-kw2" autoplay><source src="https://alexbooster.com/media/Tones.ogg"></audio>');
            body.append('<audio id="LNSNF-email" autoplay><source src="https://alexbooster.com/media/Cha-Ching.ogg"></audio>');
            $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                const playKW2Promise = document.querySelector('#LNSNF-kw2').play();
                setTimeout(function () {
                    const playEmailPromise = document.querySelector('#LNSNF-email').play();
                }, 400);
            });
        } else if (keyword1Array || keyword2Array) {
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


        if (keyword3Array) {
            body.append('<audio id="LNSNF-kw3" autoplay><source src="https://alexbooster.com/media/seed.mp3"></audio>');
            // User interaction/click required to play audio after page load:
            // https://developer.chrome.com/blog/autoplay/
            $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                setTimeout(function () {
                    const playKW3Promise = document.querySelector('#LNSNF-kw3').play();
                }, 100);
            });
        }


        if (keyword4Array) {
            body.append('<audio id="LNSNF-kw4" autoplay><source src="https://alexbooster.com/media/early.mp3"></audio>');
            // User interaction/click required to play audio after page load:
            // https://developer.chrome.com/blog/autoplay/
            $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                setTimeout(function () {
                    const playKW4Promise = document.querySelector('#LNSNF-kw4').play();
                }, 500);
            });
        }


        if (keyword5Array) {
            body.append('<audio id="LNSNF-kw5" autoplay><source src="https://alexbooster.com/media/angel.mp3"></audio>');
            // User interaction/click required to play audio after page load:
            // https://developer.chrome.com/blog/autoplay/
            $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                setTimeout(function () {
                    const playKW5Promise = document.querySelector('#LNSNF-kw5').play();
                }, 1000);
            });
        }


        /*
                if (keyword6Array) {
                    body.append('<audio id="LNSNF-kw6" autoplay><source src="https://alexbooster.com/media/entrepreneur.mp3"></audio>');
                    // User interaction/click required to play audio after page load:
                    // https://developer.chrome.com/blog/autoplay/
                    $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                        setTimeout(function () {
                            const playKW6Promise = document.querySelector('#LNSNF-kw6').play();
                        }, 1000);
                    });
                }
        */

        /*
                document.querySelector("#profile-card-section > section[class^=_header_] span[data-anonymize=headline]").innerHTML = document.querySelector("#profile-card-section > section[class^=_header_] span[data-anonymize=headline]").innerHTML.replace(keyword1Regex,`<mark style="font-weight: normal;">${keyword1Replacement}</mark>`);

                if (aboutSection) {
                    document.querySelector("#about-section").innerHTML = document.querySelector("#about-section").innerHTML.replace(keyword1Regex,`<mark style="font-weight: normal;">${keyword1Replacement}</mark>`);
                }
        */

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

    var timeBeforeAboutBtnClick,
        timeAfterAboutBtnClick;


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
    /////////////////////////////

});
// End of the waitFor(badgesList) wrapper.

}
// End of the salesLeadPage functions


const searchPageMatch = currentURL.match(/linkedin\.com\/sales\/search\/people/);

    if (searchPageMatch) {
        function manipulateListElement(element, index) {
            // most "out-of-network" profiles are useless for me
            // if ($(element).has("div[class^=_out-of-network]").length) {
            //     element.style.backgroundColor = "pink";
            // }

            if ($(element).has("li-icon[aria-label^=Viewed]").length) {
                element.style.backgroundColor = "cornsilk";
            }

            // Hide non-premium profiles (for now I'm only targeting premium profiles)
            if ($(element).has("a[data-anonymize=person-name]").length && !$(element).has("li-icon[type=linkedin-premium-gold-icon]").length) {
                element.style.backgroundColor = "#0073b1";
            }
        }

        function handleListItems() {
            const listArray = document.querySelectorAll("li.artdeco-list__item");
            const aboutSectionsArray = document.querySelectorAll("li.artdeco-list__item > div > div > div:nth-of-type(2) > div > div:nth-of-type(2)");
            const yearsArray = document.querySelectorAll("li.artdeco-list__item > div > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div:nth-of-type(4)");

            if (listArray.length) {
                listArray.forEach(manipulateListElement);
            }

            if (aboutSectionsArray.length) {
                aboutSectionsArray.forEach(hideSection);
            }

            if (yearsArray.length) {
                yearsArray.forEach(hideSection);
            }
        }

        setInterval(handleListItems, 1000);
    }

});
