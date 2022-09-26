$( document ).ready(function() {

    function hideSection(element) {
        element.style.display = "none";
    }

    let profileURL = document.location.href.match(/linkedin\.com\/sales\/lead/);

    if (profileURL) {
        let aboutSection;
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
        // const ExperienceOpener = setInterval(expandExperienceSections, 700);
        const positionsOpener = setInterval(expandAllPositions, 700);

        const introSectionRemover = setInterval(hideIntroSection, 650);
        const relationshipSectionRemover = setInterval(hideRelationshipSection, 700);

        function hideIntroSection() {
            introSection = document.querySelector("section[class^=_introductions-section]");

            if (!!introSection) {
                console.log(`We've got intro section! Hiding...`);
                hideSection(introSection);
                clearInterval(introSectionRemover);
            } else {
                console.log(`We don't have intro section yet!`);
            }
        }

        function hideRelationshipSection() {
            relationshipSection = document.querySelector("#relationship-section");

            if (!!relationshipSection) {
                console.log(`We've got relationship section! Hiding...`);
                hideSection(relationshipSection);
                clearInterval(relationshipSectionRemover);
            } else {
                console.log(`We don't have relationship section yet!`);
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
            const keyword3Regex = /\bseed\b|\bpreseed\b/gi;
            const keyword4Regex = /\bearly stage\b|\bearly-stage\b/gi;
            const keyword5Regex = /\bangel\b/gi;

            let keyword1Array = currentHTML.match(keyword1Regex);
            let keyword2Array = currentHTML.match(keyword2Regex);
            let keyword3Array = currentHTML.match(keyword3Regex);
            let keyword4Array = currentHTML.match(keyword4Regex);
            let keyword5Array = currentHTML.match(keyword5Regex);
            let emailsArray = currentHTML.match(/@/g);
            aboutSection = document.querySelector("#about-section");

            if (keyword1Array && keyword2Array && emailsArray) {
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
            } else if ((keyword1Array || keyword2Array) && emailsArray) {
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
                    }, 500);
                });
            }
            if (keyword4Array) {
                body.append('<audio id="LNSNF-kw4" autoplay><source src="https://alexbooster.com/media/early.mp3"></audio>');
                // User interaction/click required to play audio after page load:
                // https://developer.chrome.com/blog/autoplay/
                $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                    setTimeout(function () {
                        const playKW4Promise = document.querySelector('#LNSNF-kw4').play();
                    }, 1500);
                });
            }
            if (keyword5Array) {
                body.append('<audio id="LNSNF-kw5" autoplay><source src="https://alexbooster.com/media/angel.mp3"></audio>');
                // User interaction/click required to play audio after page load:
                // https://developer.chrome.com/blog/autoplay/
                $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                    setTimeout(function () {
                        const playKW5Promise = document.querySelector('#LNSNF-kw5').play();
                    }, 2000);
                });
            }

/*
            document.querySelector("#profile-card-section > section[class^=_header_] span[data-anonymize=headline]").innerHTML = document.querySelector("#profile-card-section > section[class^=_header_] span[data-anonymize=headline]").innerHTML.replace(keyword1Regex,`<mark style="font-weight: normal;">${keyword1Replacement}</mark>`);

            if (aboutSection) {
                document.querySelector("#about-section").innerHTML = document.querySelector("#about-section").innerHTML.replace(keyword1Regex,`<mark style="font-weight: normal;">${keyword1Replacement}</mark>`);
            }
*/

            // remove irrelevant crap
            $("#experience-section img").each(function (key, value) {
                console.log("title: ", $(value).attr('title'));
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
                console.log("aboutBtn.click()...");
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
                console.log("triggering experienceBtns.forEach...");
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
                console.log("allPositionsBtn found");
                allPositionsBtn.click();
            } else {
                setTimeout(function () {
                    allPositionsBtn = $("section#experience-section > button");
                }, 650);
            }
        }


    }

    let listURL = document.location.href.match(/linkedin\.com\/sales\/search\/people/);

    if (listURL) {
        function manipulateListElement(element, index) {
            // most "out-of-network" profiles are useless for me
            if ($(element).has("div[class^=_out-of-network]").length) {
                element.style.backgroundColor = "pink";
            }

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
