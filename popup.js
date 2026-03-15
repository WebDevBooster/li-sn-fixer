const importNumberInput = document.getElementById("importNumber");
const countrySelect = document.getElementById("country");
const professionSelect = document.getElementById("profession");
const saveBtn = document.getElementById("saveBtn");
const savedConfirmation = document.getElementById("savedConfirmation");

// Load saved values on popup open
chrome.storage.local.get(["liImportNumber", "liCountry", "liProfession"], (result) => {
    if (result.liImportNumber !== undefined) {
        importNumberInput.value = result.liImportNumber;
    }
    if (result.liCountry) {
        countrySelect.value = result.liCountry;
    }
    if (result.liProfession) {
        professionSelect.value = result.liProfession;
    }
});

function saveSettings() {
    chrome.storage.local.set({
        liImportNumber: importNumberInput.value,
        liCountry: countrySelect.value,
        liProfession: professionSelect.value
    }, () => {
        savedConfirmation.style.display = "block";
        setTimeout(() => { savedConfirmation.style.display = "none"; }, 1500);
    });
}

saveBtn.addEventListener("click", saveSettings);

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveSettings();
});
