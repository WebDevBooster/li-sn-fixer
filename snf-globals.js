// Content scripts run at document_idle by default, so DOM is already ready.
var currentURL = document.location.href;
var salesLeadPageMatch = currentURL.match(/linkedin\.com\/sales\/lead/);
var searchPageMatch = currentURL.match(/linkedin\.com\/sales\/search\/people/);
var linkedinProfilePageMatch = currentURL.match(/linkedin\.com\/in\//);
var body = document.body;
var readyTime = performance.now();

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
