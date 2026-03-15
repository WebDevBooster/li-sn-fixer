const importNumberInput = document.getElementById("importNumber");
const countrySelect = document.getElementById("country");
const professionSelect = document.getElementById("profession");

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

function showSaved(id) {
    const msg = document.getElementById(id);
    msg.style.display = "block";
    setTimeout(() => { msg.style.display = "none"; }, 1000);
}

importNumberInput.addEventListener("change", () => {
    chrome.storage.local.set({ liImportNumber: importNumberInput.value }, () => {
        showSaved("importNumberSaved");
    });
});

countrySelect.addEventListener("change", () => {
    chrome.storage.local.set({ liCountry: countrySelect.value }, () => {
        showSaved("countrySaved");
    });
});

professionSelect.addEventListener("change", () => {
    chrome.storage.local.set({ liProfession: professionSelect.value }, () => {
        showSaved("professionSaved");
    });
});
