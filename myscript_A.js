$( document ).ready(function() {

    let aboutBtn = document.querySelector("#about-section [id$=-clamped-content] > span:nth-child(2)");
    let experienceBtns = document.querySelectorAll("#experience-section [id$=-clamped-content] > span:nth-child(2)");

    const myInterval = setInterval(expandSections, 500);

    function expandExperienceBtn(item) {
        item.click();
    }

    function expandSections() {
        if (aboutBtn && experienceBtns.length) {
            clearInterval(myInterval);
            aboutBtn.click();
            experienceBtns.forEach(expandExperienceBtn);
        } else {
            setTimeout(function () {
                aboutBtn = document.querySelector("#about-section [id$=-clamped-content] > span:nth-child(2)");
                experienceBtns = document.querySelectorAll("#experience-section [id$=-clamped-content] > span:nth-child(2)");
            }, 450);
        }
    }

});
