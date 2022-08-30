$( document ).ready(function() {

    let aboutSection;
    let aboutBtn = document.querySelector("#about-section [id$=-clamped-content] > span:nth-child(2)");
    let experienceBtns = document.querySelectorAll("#experience-section [id$=-clamped-content] > span:nth-child(2)");

    setTimeout(function () {
        aboutSection = document.querySelector("#about-section");
        if (!aboutSection) {
            highlight();
        }
    }, 1600);
    const aboutOpener = setInterval(expandAboutSection, 500);
    const ExperienceOpener = setInterval(expandExperienceSections, 700);

    function expandExperienceBtn(item) {
        item.click();
    }

    function highlight() {
        let body = $( "body" );
        let currentHTML = document.querySelector("#content-main").innerHTML;
        let keyword1Array = currentHTML.match(/crypto/gi);
        let keyword2Array = currentHTML.match(/enthusiast/gi);
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
                }, 500);
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
                }, 500);
            });
        } else if (keyword1Array || keyword2Array) {
            body.append('<audio id="LNSNF-kw2" autoplay><source src="https://alexbooster.com/media/Tones.ogg"></audio>');
            $( "#profile-card-section section[class^=_header_] h1" ).click(function() {
                const playKW2Promise = document.querySelector('#LNSNF-kw2').play();
            });
        }

        document.querySelector("#profile-card-section > section[class^=_header_] span[data-anonymize=headline]").innerHTML = document.querySelector("#profile-card-section > section[class^=_header_] span[data-anonymize=headline]").innerHTML.replace(/crypto/gi,`<mark style="font-weight: normal;">Crypto</mark>`);

        if (aboutSection) {
            document.querySelector("#about-section").innerHTML = document.querySelector("#about-section").innerHTML.replace(/crypto/gi,`<mark style="font-weight: normal;">Crypto</mark>`);
        }

        // document.querySelector("#experience-section").innerHTML = document.querySelector("#experience-section").innerHTML.replace(/(<\/?(?:img)[^>]*>)|crypto/gi,`<mark style="font-weight: normal;">Crypto</mark>`);
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

});
