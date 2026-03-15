if (salesLeadPageMatch) {
// The experience section headline always exists, even if the experience section is empty.
// So when this element appears on the page, we can be sure that all other HTML has finally loaded as well.
const experienceSectionHeadline = "#experience-section > section:nth-child(1) > div > h2 > span";
waitFor(experienceSectionHeadline).then((el) => {
    checkTime0 = performance.now();
    console.log(`checkTime0 (${(checkTime0 - readyTime).toFixed(2)} ms after readyTime)`);

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
    const headline = (document.querySelector( "#profile-card-section section[class^=_header_] > div:nth-child(1) > div[class^=_bodyText] > span" )?.textContent) || "";

    let jobList = [];
    let jobs = "";
    let profileURL = "";
    let gender = "Male";

    // Check for duplicate lead on page load
    const leadURLCheck = `${currentURL.substring(0, 75)},name`;
    chrome.storage.local.get(["liLeadURLs"], (result) => {
        const leadURLs = result.liLeadURLs || [];
        const existingIndex = leadURLs.indexOf(leadURLCheck);
        if (existingIndex !== -1) {
            const overlay = document.createElement("div");
            overlay.id = "SNF-dupe-modal-overlay";
            overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;";
            const modal = document.createElement("div");
            modal.style.cssText = "background:#fff;padding:24px 32px;border-radius:8px;text-align:center;max-width:400px;box-shadow:0 4px 20px rgba(0,0,0,0.3);";
            modal.innerHTML = `<p style="margin:0 0 16px;font-size:15px;color:#333;"><b>This profile was already saved before</b><br>(Import #${existingIndex + 1})</p>
                <button id="SNF-dupe-dismiss" style="padding:6px 24px;background:#4CAF50;color:#fff;border:none;border-radius:4px;font-size:14px;cursor:pointer;">OK</button>`;
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            document.getElementById("SNF-dupe-dismiss").addEventListener("click", () => {
                overlay.remove();
            });
        }
    });

    function handleThisProfile() {
        hideRelationshipSection();

        collectProfileData();

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

        function appendCopyButtons() {
            if (!headerSection) {
                console.error("headerSection not found, cannot append copy buttons.");
                return;
            }
            headerSection.insertAdjacentHTML("beforeend", `
        <section id="SNF-doc-height">
        </section>
        <section id="SNF-data">
            <div>
                <button id="SNF-copy" class="copy-btn" type="button">Copy</button>
                <button id="SNF-femcopy" class="copy-btn" type="button">FemC</button>
            </div>
        </section>
        `);
        }

        function collectProfileData() {
            setTimeout(clickShowMoreButtons, 1);
            setTimeout(appendCopyButtons, 1122);
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
                async function handleCopy(isFemale) {
                    const settings = await new Promise((resolve) => {
                        chrome.storage.local.get(["liLeadURLs"], resolve);
                    });
                    if (!settings.liLeadURLs || !settings.liLeadURLs.length) {
                        copyBtn.insertAdjacentHTML("beforebegin",
                            "<div style='text-align: center; background-color: orangered; padding: 2px;'><b>Import Lead URLs in extension popup first!</b></div>");
                        return;
                    }
                    if (!profileURL) {
                        copyBtn.insertAdjacentHTML("beforebegin",
                            "<div id='SNFc-fail' style='text-align: center; background-color: orangered; padding: 2px;'><b>First, click the 3 dots and \"Copy LinkedIn.com URL\".</b></div>");
                        return;
                    }
                    if (isFemale) gender = "Female";
                    modifyClipboard(profileURL);
                    copyBtn.insertAdjacentHTML("beforebegin", "<div id='SNFc-success' style='text-align: center; background-color: limegreen;'><b style='margin-left: -10px;'>✔</b></div>");
                }

                copyBtn.addEventListener("click", function () {
                    handleCopy(false);
                });

                copyFemaleBtn.addEventListener("click", function () {
                    handleCopy(true);
                });
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

            await getJobsToExport();
            addLeadToCounter();

            const settings = await new Promise((resolve) => {
                chrome.storage.local.get(["liLeadURLs", "liCountry", "liProfession"], resolve);
            });
            const country = settings.liCountry || "UK";
            const profession = settings.liProfession || "";
            const leadURLs = settings.liLeadURLs || [];

            let importNumber;
            const existingIndex = leadURLs.indexOf(leadURL);
            if (existingIndex !== -1) {
                importNumber = existingIndex + 1;
            } else {
                leadURLs.push(leadURL);
                importNumber = leadURLs.length;
                await new Promise((resolve) => {
                    chrome.storage.local.set({ liLeadURLs: leadURLs }, resolve);
                });
            }

            const liStatus = "new";
            const email = `itct${importNumber}@cboosted.com`;

            const record = {
                importNumber, liStatus, email,
                firstName: capitalizedFirstName, gender, leadURL,
                name, headline: headlineClean, location, country,
                profileURL, jobs, connections, profession,
                exported: false
            };

            // Save record to storage (dedupe by leadURL)
            const stored = await new Promise((resolve) => {
                chrome.storage.local.get(["liExportRecords"], resolve);
            });
            const records = stored.liExportRecords || [];
            const existingRecordIndex = records.findIndex(r => r.leadURL === leadURL);
            if (existingRecordIndex !== -1) {
                const wasExported = records[existingRecordIndex].exported;
                records[existingRecordIndex] = record;
                records[existingRecordIndex].exported = wasExported;
            } else {
                records.push(record);
            }
            await new Promise((resolve) => {
                chrome.storage.local.set({ liExportRecords: records }, resolve);
            });

            try {
                await navigator.clipboard.writeText(`${importNumber}\t${liStatus}\t${email}\t${capitalizedFirstName}\t${capitalizedFirstName}\t${gender}\t${leadURL}\t${name}\t${headlineClean}\t${location}\t${country}\t${country}\t${profileURL}\t${profileURL}\t${jobs}\t${connections}\t${profession}`);
            } catch (err) {
                console.error("Clipboard write failed:", err);
                document.querySelector("#SNF-copy")?.insertAdjacentHTML("beforebegin",
                    "<div style='text-align: center; background-color: orangered; padding: 2px;'><b>Clipboard write failed!</b></div>");
            }
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

            if (jobElements.length) {
                jobElements.forEach(function (jobEl) {
                    let job = { titles: [], company: "" };

                    // Check for nested positions: a direct child <ul> containing h3 job titles
                    const nestedPositions = jobEl.querySelectorAll(":scope > ul > li");
                    const hasNestedJobTitles = nestedPositions.length &&
                        jobEl.querySelector(":scope > ul > li h3[data-anonymize=job-title]");

                    if (hasNestedJobTitles) {
                        // Multi-position entry: multiple titles under one company
                        nestedPositions.forEach(function (posEl) {
                            const title = (posEl.querySelector("h3[data-anonymize=job-title]")?.textContent || "").cleanUpString();
                            if (title) job.titles.push(title);
                        });
                        job.company = (jobEl.querySelector("h2[data-anonymize=company-name]")?.textContent || "").cleanUpString();
                    } else {
                        // Single-position entry
                        job.titles[0] = (jobEl.querySelector("h2[data-anonymize=job-title]")?.textContent || "").cleanUpString();
                        job.company = (jobEl.querySelector("p[data-anonymize=company-name]")?.textContent || "").cleanUpString();
                    }

                    jobList.push(job);
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
