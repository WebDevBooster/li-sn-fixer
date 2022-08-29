$( document ).ready(function() {

    let aboutBtn = document.querySelector("#about-section [id$=-clamped-content] > span:nth-child(2)");
    let experienceBtns = document.querySelectorAll("#experience-section [id$=-clamped-content] > span:nth-child(2)");

    const aboutOpener = setInterval(expandAboutSection, 500);
    const ExperienceOpener = setInterval(expandExperienceSections, 500);

    function expandExperienceBtn(item) {
        item.click();
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
            }, 450);
        }
    }


});
