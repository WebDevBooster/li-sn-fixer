$( document ).ready(function() {

    function hideSection(element) {
        element.style.display = "none";
    }

    const currentURL = document.location.href;
    const salesLeadPageTest = currentURL.match(/linkedin\.com\/sales\/lead/);

    if (salesLeadPageTest) {
        let aboutSection;
        // This is a normal email regex that I used to collect the first 20K~ investor leads (until 25/10/2022):
        // const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gi;
        // This is an improved email regex that also catches cases like:
        // handle(at)domain.com or handle [at] domain.com or even "handle @ gmail .com" etc.
        // const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))(((@|\s?(\(|\[|\{|\<)\s?(at|@)\s?(\)|\]|\}|\>)\s?)(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))|((\s?@\s?)(((gmail|hotmail|yahoo|outlook|protonmail|icloud|googlemail)\s?\.\s?com)|((me|mac|aol|live|sap|msn)\.com)|((berkeley|alum\.mit|cornell|georgetown|alumni\.harvard|alumni\.stanford)\.edu))))/gi;
        // version 3:
        const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))(((@|\s?(\(|\[|\{|\<)\s?(at|@)\s?(\)|\]|\}|\>)\s?)(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))|((\s?@\s?)(((gmail|hotmail|yahoo|outlook|protonmail|icloud|googlemail)\s?\.\s?com)|(([a-zA-Z\-0-9]+)\.)?([a-zA-Z\-0-9]+)\.(com|edu|io|net|uk|consulting|co|vc|au|br|de|fr|dk|capital|ca|ch|org|info|in|it|be|me|ai|nl|se|tech|us|biz|eu|es|at|cz|fi|fund|group|lu|no|pro|sg|agency|app|il|nz|partners|pt|tv|ar|mx|pl|ventures|club|name|nyc))))/gi;


        let badgesList = document.querySelector("section[class^=_header] ul[class^=_badges]");
        let badgeChecker = setInterval(checkBadges, 10);

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

        function removeDuplicatesInArray(array) {
            return [... new Set(array.map(e => e.toLowerCase()))];
        }

        function checkForEmails() {
            let emailList = [];

            let headerSection = $("#profile-card-section > section[class^=_header]");
            if (headerSection) {
                profileEmails.inHeader = headerSection.html().match(emailRegex); // null if none, array if some
                if (profileEmails.inHeader) {
                    profileEmails.inHeader = removeDuplicatesInArray(profileEmails.inHeader);
                    profileEmails.inHeader = profileEmails.inHeader.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inHeader);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            let contactSection = $("#profile-card-section > section[class^=_details-section] > section");
            if (contactSection) {
                profileEmails.inContact = contactSection.html().match(emailRegex);
                if (profileEmails.inContact) {
                    profileEmails.inContact = removeDuplicatesInArray(profileEmails.inContact);
                    profileEmails.inContact = profileEmails.inContact.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inContact);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            let currentRolesSection = $("#profile-card-section > section[class^=_details-section] > div[class^=_current-role-container]");
            if (currentRolesSection) {
                profileEmails.inCurrentRoles = currentRolesSection.html().match(emailRegex);
                if (profileEmails.inCurrentRoles) {
                    profileEmails.inCurrentRoles = removeDuplicatesInArray(profileEmails.inCurrentRoles);
                    profileEmails.inCurrentRoles = profileEmails.inCurrentRoles.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inCurrentRoles);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            let aboutSection = $("#about-section");
            if (aboutSection) {
                profileEmails.inAbout = aboutSection.html().match(emailRegex);
                if (profileEmails.inAbout) {
                    profileEmails.inAbout = removeDuplicatesInArray(profileEmails.inAbout);
                    profileEmails.inAbout = profileEmails.inAbout.filter( (el) => !emailList.includes(el) );
                    emailList = emailList.concat(profileEmails.inAbout);
                    emailList = removeDuplicatesInArray(emailList);
                }
            }

            let experienceSection = $("#experience-section");
            if (experienceSection) {
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

        function hasEmail() {
            let headerSectionHTML = document.querySelector("section[class^=_header]").innerHTML;
            let detailsSectionHTML = document.querySelector("section[class^=_details-section]").innerHTML;
            let emailMatchesInHeader = headerSectionHTML.match(emailRegex);
            let emailMatchesInDetails = detailsSectionHTML.match(emailRegex);
            let aboutSection = document.querySelector("#about-section");
            let experienceSection = document.querySelector("section[class^=_experiences-section]");

            // sometimes there's no about or no experience section
            if (aboutSection && experienceSection) {
                let aboutSectionHTML = aboutSection.innerHTML;
                let emailMatchesInAbout = aboutSectionHTML.match(emailRegex);
                let experienceSectionHTML = experienceSection.innerHTML;
                let emailMatchesInExperience = experienceSectionHTML.match(emailRegex);

                if (headerSectionHTML && detailsSectionHTML && aboutSectionHTML && experienceSectionHTML) {
                    return !!(emailMatchesInHeader || emailMatchesInDetails || emailMatchesInAbout || emailMatchesInExperience);
                }
            } else if (aboutSection) {
                let aboutSectionHTML = aboutSection.innerHTML;
                let emailMatchesInAbout = aboutSectionHTML.match(emailRegex);
                if (headerSectionHTML && detailsSectionHTML && aboutSectionHTML) {
                    return !!(emailMatchesInHeader || emailMatchesInDetails || emailMatchesInAbout);
                }
            } else if (experienceSection) {
                let experienceSectionHTML = experienceSection.innerHTML;
                let emailMatchesInExperience = experienceSectionHTML.match(emailRegex);
                if (headerSectionHTML && detailsSectionHTML && experienceSectionHTML) {
                    return !!(emailMatchesInHeader || emailMatchesInDetails || emailMatchesInExperience);
                }
            } else if (headerSectionHTML && detailsSectionHTML) {
                return !!(emailMatchesInHeader || emailMatchesInDetails);
            }
        }

        function cleanUp(element) {
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
                    currentValue = cleanUp(currentValue);
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
            const profileHeader = $( "#profile-card-section section[class^=_header]" );

            const headerElements = addHTMLElements(profileEmails.inHeader, "header");
            const contactElements = addHTMLElements(profileEmails.inContact, "contact");
            const rolesElements = addHTMLElements(profileEmails.inCurrentRoles, "roles");
            const aboutElements = addHTMLElements(profileEmails.inAbout, "about");
            const experienceElements = addHTMLElements(profileEmails.inExperience, "experience");

            profileHeader.append(`
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
            const profileHeader = $( "#profile-card-section section[class^=_header]" );
            const headlineDiv = $( "#profile-card-section div span[data-anonymize=headline]" );

            if (profileHeader.length && headlineDiv.length) {
                clearInterval(triggerChecker);
                setTimeout(checkForEmails, 50);
                setTimeout(appendCollectedEmails, 111);
                setTimeout(copyDataToClipboard, 333);
            }
        }
        
        const triggerChecker = setInterval(collectProfileData, 250);

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
                const checkedEmailsArray = checkedEmailElements.map(function () {
                    return $(this).val();
                }).toArray();
                firstEmail = checkedEmailElements[0].value;
                let allEmailsArray = [];
                profileEmails.uniqueEmails.forEach(function (currentValue) {
                    currentValue = cleanUp(currentValue);
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

        async function getJobsToExport() {
            await fillJobList();
            let newJobList = [];
            jobList.forEach(function (currentValue) {
                if (currentValue["title"] && currentValue["company"]) {
                    newJobList.push(`${currentValue["title"]} ➤ ${currentValue["company"]}`);
                }
            });
            return jobs = newJobList.join(" ✚✚ ");
        }

        async function modifyClipboard() {
            // Sales Navigator lead URLs have a lot of crap appended to them.
            // So, we need to grab the first 75 characters and append ",name" to get rid of useless parameters.
            const leadURL = `${currentURL.substring(0, 75)},name`;
            const name = $( "#profile-card-section section[class^=_header_] h1" ).text().trim();
            const headline = $( "#profile-card-section section[class^=_header_] > div:nth-child(1) > div[class^=_bodyText] > span" ).text().trim().normalize("NFKC").replace(/\r?\n|\r/gm, "");
            const location = $( "#profile-card-section > section[class^=_header_] > div:nth-child(1) > div[class^=_lockup-links-container] > div:nth-child(1)" ).text().trim();

            getEmailsToExport();
            await getJobsToExport();

            await navigator.clipboard.writeText(`${isFemale}\t${leadURL}\t${name}\t${headline}\t${location}\t${profileURL}\t${firstEmail}\t${allEmails}\t${jobs}`);
        }
        
        function autoCloseTabIfNoOpenBadgeOrEmail () {
            let openBadge = document.querySelector("section[class^=_header] ul[class^=_badges] li > span[class^=_open-badge]");

            if (openBadge) {
                // console.log(`open badge is there!`);
            } else {
                // console.log(`no open badge there!`);
                if (hasEmail()) {
                    // console.log(`We have EMAIL!!!`);
                } else {
                    window.close();
                }
            }
        }

        function checkBadges () {
            if (badgesList) {
                // console.log(`badges list is there!`);
                autoCloseTabIfNoOpenBadgeOrEmail();
                clearInterval(badgeChecker);
            } else {
                // console.log(`no badges list at the moment`);
                badgesList = document.querySelector("section[class^=_header] ul[class^=_badges]");
            }
        }


        let aboutBtn = document.querySelector("#about-section [id$=-clamped-content] > span:nth-child(2)");
        let experienceBtns = document.querySelectorAll("#experience-section [id$=-clamped-content] > span:nth-child(2)");
        let allPositionsBtn = $("section#experience-section > button");
        let introSection;
        let relationshipSection;

        setTimeout(function () {
            aboutSection = document.querySelector("#about-section");
            if (!aboutSection) {
                highlight();
            }
        }, 1600);
        const aboutOpener = setInterval(expandAboutSection, 500);
        // expanding all experience sections might be triggering Linkedin to rate-limit me.
        // So, I'm gonna disable this for now.
        const ExperienceOpener = setInterval(expandExperienceSections, 700);
        const positionsOpener = setInterval(expandAllPositions, 700);

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

        function expandExperienceBtn(item) {
            item.click();
        }

        function highlight() {
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

        function expandAboutSection() {
            if (aboutBtn) {
                clearInterval(aboutOpener);
                // console.log("aboutBtn.click()...");
                aboutBtn.click();
                setTimeout(highlight, 500);
            } else {
                setTimeout(function () {
                    aboutBtn = document.querySelector("#about-section [id$=-clamped-content] > span:nth-child(2)");
                }, 450);
            }
        }

        function expandExperienceSections() {
            if (experienceBtns.length) {
                clearInterval(ExperienceOpener);
                // console.log("triggering experienceBtns.forEach...");
                experienceBtns.forEach(expandExperienceBtn);
            } else {
                setTimeout(function () {
                    experienceBtns = document.querySelectorAll("#experience-section [id$=-clamped-content] > span:nth-child(2)");
                }, 550);
            }
        }

        function expandAllPositions() {
            if (allPositionsBtn.length) {
                clearInterval(positionsOpener);
                // console.log("allPositionsBtn found");
                allPositionsBtn.click();
            } else {
                setTimeout(function () {
                    allPositionsBtn = $("section#experience-section > button");
                }, 650);
            }
        }

        async function fillJobList() {
            let jobElements = $("#experience-section ul[class^=_experience-list] li[class^=_experience-entry]");

            if (jobElements) {
                jobElements.each(function () {
                    let job = {};
                    job["title"] = $(this).find("h2[data-anonymize=job-title]").text().trim();
                    job["company"] = $(this).find("p[data-anonymize=company-name]").text().trim();
                    jobList.push(job);
                });
            }
        }
        
    }

    const searchPageTest = currentURL.match(/linkedin\.com\/sales\/search\/people/);

    if (searchPageTest) {
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
