//region {variables and functions}
var consoleGreeting = "Hello World! - from event_script.js (page action)";
var queryInfoForAllTabs = {
    //"active":false,"currentWindow":true
};

function logTabs(tabs) {
    console.group("Tabs");
    console.log(tabs);
    console.groupEnd("Tabs");
}

function queryTabsAndShowPageActions() {
    chrome.tabs.query(
        queryInfoForAllTabs,
        function (tabs) {
            console.log("All tabs length: %s", tabs.length);
            //Output tabs object to the console as a separate visual group
            logTabs(tabs);
            if (tabs.length > 0) {
                for (var i = 0; i < tabs.length; i++) {
                    chrome.pageAction.show(tabs[i].id);
                }
            }
        }
    );
}
//end- region

//region {calls}
console.log(consoleGreeting);

//Show Page-Actions using the chrome.tabs.query method
//queryTabsAndShowPageActions();

//Show Page-Actions using the onUpdated event
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log(tabId);
//    console.log(tab);
//    console.log(changeInfo);
    if (changeInfo.status == "complete") {
        //console.log('yay!');
        chrome.pageAction.show(tabId);
    }
//    if (changeInfo.url) {
//        chrome.pageAction.show(tabId);
//    }
});

//chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//    if (changeInfo.url) {
//        chrome.pageAction.show(tabId);
//    }
//});
//end-region
