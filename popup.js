const leadURLsTextarea = document.getElementById("leadURLs");
const urlCountDiv = document.getElementById("urlCount");
const countrySelect = document.getElementById("country");
const professionSelect = document.getElementById("profession");
const saveBtn = document.getElementById("saveBtn");
const savedConfirmation = document.getElementById("savedConfirmation");

function parseURLs(text) {
    return text.split("\n").map(line => line.trim()).filter(line => line.length > 0);
}

function updateURLCount() {
    const urls = parseURLs(leadURLsTextarea.value);
    urlCountDiv.textContent = `URLs: ${urls.length}`;
}

// Load saved values on popup open
chrome.storage.local.get(["liLeadURLs", "liCountry", "liProfession"], (result) => {
    if (result.liLeadURLs && result.liLeadURLs.length) {
        leadURLsTextarea.value = result.liLeadURLs.join("\n");
    }
    if (result.liCountry) {
        countrySelect.value = result.liCountry;
    }
    if (result.liProfession) {
        professionSelect.value = result.liProfession;
    }
    updateURLCount();
});

leadURLsTextarea.addEventListener("input", updateURLCount);

function saveSettings() {
    const urls = parseURLs(leadURLsTextarea.value);
    chrome.storage.local.set({
        liLeadURLs: urls,
        liCountry: countrySelect.value,
        liProfession: professionSelect.value
    }, () => {
        savedConfirmation.style.display = "block";
        setTimeout(() => { savedConfirmation.style.display = "none"; }, 1500);
    });
}

saveBtn.addEventListener("click", saveSettings);

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target !== leadURLsTextarea) saveSettings();
});
