function updateLocalStorage() {
    let snf8hrStart,
        snf19hrStart,
        snf8hrTotal,
        snf19hrTotal;
    let snCounter = {
        snfLeads: null,
        snfNonLeads: null
    };
    let prevLeads = localStorage.getItem("snfLeads");
    let prevNonLeads = localStorage.getItem("snfNonLeads");
    snf8hrTotal = localStorage.getItem("snf8hrTotal");
    snf19hrTotal = localStorage.getItem("snf19hrTotal");
    console.log(`prevLeads: ${prevLeads}`);
    console.log(`prevNonLeads: ${prevNonLeads}`);

    function initializeCounters() {
        if (prevLeads && prevNonLeads) {
            snCounter.snfLeads = prevLeads;
            snCounter.snfNonLeads = prevNonLeads;

        } else {
            localStorage.setItem("snfLeads", "0");
            localStorage.setItem("snfNonLeads", "0");
            snf8hrStart = new Date().getTime();
            snf8hrStart = snf8hrStart.toString();
            localStorage.setItem("snf8hrStart", snf8hrStart);
            snf19hrStart = new Date().getTime();
            snf19hrStart = snf19hrStart.toString();
            localStorage.setItem("snf19hrStart", snf19hrStart);

            localStorage.setItem("snf8hrTotal", "0");
            localStorage.setItem("snf19hrTotal", "0");
        }
        console.log(`previous snCounter:`);
        console.log(snCounter);
        return snCounter;
    }
    initializeCounters();

    let currentLeads,
        currentNonLeads;
    let ratio = 0;
    function updateTotals() {
        snf8hrTotal = parseInt(localStorage.getItem("snf8hrTotal"));
        snf19hrTotal = parseInt(localStorage.getItem("snf19hrTotal"));

        if (snf8hrTotal) {
            ratio = Math.round((currentLeads / snf8hrTotal * 100));
            if (snf8hrTotal > 365) {
                document.querySelectorAll("#SNF-counter .total, #SNF-counter-search-page .total").forEach(function(el) { el.classList.add("warning"); });
            }
            if (snf8hrTotal < 366) {
                document.querySelectorAll("#SNF-counter .total, #SNF-counter-search-page .total").forEach(function(el) { el.classList.remove("warning"); });
            }
        }
        if (snf19hrTotal) {
            if (snf19hrTotal > 785) {
                document.querySelectorAll("#SNF-counter .day-total, #SNF-counter-search-page .day-total").forEach(function(el) { el.classList.add("warning"); });
            }
            if (snf19hrTotal < 786) {
                document.querySelectorAll("#SNF-counter .day-total, #SNF-counter-search-page .day-total").forEach(function(el) { el.classList.remove("warning"); });
            }
        }
    }

    function getTrackedTime(/*Number*/ hrs) {
        let snfStartTime = "";
        let snfTrackedKey = "";
        let snfTrackedTime = "";
        let nowTime = new Date().getTime();

        if (!hrs || hrs === 8) {
            snfStartTime = `snf8hrStart`;
            snfTrackedKey = `snf8hrTracker`;
            calculateAndSetTime();
        } else if (typeof hrs === "number") {
            snfStartTime = `snf${hrs}hrStart`;
            snfTrackedKey = `snf${hrs}hrTracker`;
            calculateAndSetTime();
        }

        function calculateAndSetTime() {
            snfStartTime = parseInt(localStorage.getItem(snfStartTime));
            if (snfStartTime) {
                let timeDiff = nowTime - snfStartTime;
                let mins = Math.floor(timeDiff / 1000 / 60);
                mins = mins % 60; // throw away hours
                mins = (mins < 10) ? "0" + mins : mins;
                let hrs = Math.floor(timeDiff / 1000 / 60 / 60);
                snfTrackedTime = `${hrs}:${mins}`;
            }

            localStorage.setItem(snfTrackedKey, snfTrackedTime);
        }
        return snfTrackedTime;
    }

    function appendStats() {
        currentLeads = parseInt(localStorage.getItem("snfLeads"));
        currentNonLeads = parseInt(localStorage.getItem("snfNonLeads"));

        getTrackedTime();

        if (salesLeadPageMatch) {
            body.insertAdjacentHTML("beforeend", `
            <div id="SNF-counter">
            <span class="lead">
                L: ${currentLeads}<br>${ratio}%
            </span>
            <span class="non-lead" title="click this to mark this profile as non-lead and close tab">
                N: ${currentNonLeads}
            </span>
            <span class="total">
                Total:<br>${snf8hrTotal}
            </span>
            <span class="timer" title="time in this 8-hr cycle">
                ⏱️<br>${getTrackedTime()}
            </span>
            <span class="day-total">
                DayT:<br><span class="current-19hr-total">${snf19hrTotal}</span>
            </span>
            <span class="day-timer" title="time in this 19-hr cycle">
                ⏰<br>${getTrackedTime(19)}
            </span>
            </div>
            `);
        }

        if (searchPageMatch) {
            body.insertAdjacentHTML("beforeend", `
            <div id="SNF-counter-search-page">
            <span class="lead">
                L: <span class="current-leads">${currentLeads}</span><br><span class="current-ratio">${ratio}</span>%
            </span>
            <span class="non-lead">
                N: <span class="current-non-leads">${currentNonLeads}</span>
            </span>
            <span class="total">
                T: <span class="current-8hr-total">${snf8hrTotal}</span><br>
                <button id="SNF-refresh-data" title="refresh data">↻</button>
            </span>
            <span class="timer">
                ⏱️<span class="current-8hr-cycle">${getTrackedTime(8)}</span><br>
                <button id="reset-8hr-cycle" title="reset this 8-hr cycle">X</button>
            </span>
            <span class="day-total">
                DT: <span class="current-19hr-total">${snf19hrTotal}</span>
            </span>
            <span class="day-timer">
                ⏰<span class="current-19hr-cycle">${getTrackedTime(19)}</span><br>
                <button id="reset-19hr-cycle" title="reset this 19-hr cycle">X</button>
            </span>
            </div>
            `);
        }

        updateTotals();
    }
    appendStats();


    function addNonLeadToCounterAndCloseTabOnClick() {
        const nonLeadEl = document.querySelector("#SNF-counter span.non-lead");
        if (nonLeadEl) {
            nonLeadEl.addEventListener("click", function () {
                let prevNonLeads = parseInt(localStorage.getItem("snfNonLeads"));
                let nonLeadCounter = prevNonLeads + 1;
                nonLeadCounter = nonLeadCounter.toString();
                localStorage.setItem("snfNonLeads", nonLeadCounter);

                addToTotals();

                window.close();
            });
        }
    }
    addNonLeadToCounterAndCloseTabOnClick();

    const refreshDataBtn = document.querySelector("#SNF-refresh-data");
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener("click", function () {
            currentLeads = localStorage.getItem("snfLeads");
            currentNonLeads = localStorage.getItem("snfNonLeads");
            document.querySelector("#SNF-counter-search-page .current-leads").textContent = currentLeads;
            document.querySelector("#SNF-counter-search-page .current-non-leads").textContent = currentNonLeads;

            updateTotals();

            document.querySelector("#SNF-counter-search-page .current-ratio").textContent = ratio;
            document.querySelector("#SNF-counter-search-page .current-8hr-total").textContent = snf8hrTotal;
            document.querySelector("#SNF-counter-search-page .current-19hr-total").textContent = snf19hrTotal;

            document.querySelector("#SNF-counter-search-page .current-8hr-cycle").textContent = getTrackedTime(8);
            document.querySelector("#SNF-counter-search-page .current-19hr-cycle").textContent = getTrackedTime(19);
        });
    }

    const reset8hrBtn = document.querySelector("#reset-8hr-cycle");
    if (reset8hrBtn) {
        reset8hrBtn.addEventListener("click", function () {
            let msg = `WARNING!!!\n\nDo you really want to reset the 8-hr cycle stats?\n\nPress OK to confirm.`
            if (confirm(msg)) {
                localStorage.setItem("snfLeads", "0");
                localStorage.setItem("snfNonLeads", "0");
                snf8hrStart = new Date().getTime();
                snf8hrStart = snf8hrStart.toString();
                localStorage.setItem("snf8hrStart", snf8hrStart);
                localStorage.setItem("snf8hrTotal", "0");
                localStorage.setItem("snf8hrTracker", "0:00");
            } else {
                console.log(`#reset-8hr-cycle was denied. Do nothing.`);
            }
        });
    }

    const reset19hrBtn = document.querySelector("#reset-19hr-cycle");
    if (reset19hrBtn) {
        reset19hrBtn.addEventListener("click", function () {
            let msg = `WARNING!!!\n\nDo you really want to reset the 19-hr cycle stats?\n\nPress OK to confirm.`
            if (confirm(msg)) {
                localStorage.setItem("snfLeads", "0");
                localStorage.setItem("snfNonLeads", "0");
                snf8hrStart = new Date().getTime();
                snf8hrStart = snf8hrStart.toString();
                localStorage.setItem("snf8hrStart", snf8hrStart);
                localStorage.setItem("snf8hrTotal", "0");
                localStorage.setItem("snf8hrTracker", "0:00");

                localStorage.setItem("snf19hrStart", snf8hrStart);
                localStorage.setItem("snf19hrTotal", "0");
                localStorage.setItem("snf19hrTracker", "0:00");
            } else {
                console.log(`#reset-19hr-cycle was denied. Do nothing.`);
            }
        });
    }
}

function addToTotals() {
    let snf8hrTotals = parseInt(localStorage.getItem("snf8hrTotal"));
    snf8hrTotals = snf8hrTotals + 1;
    snf8hrTotals = snf8hrTotals.toString();
    localStorage.setItem("snf8hrTotal", snf8hrTotals);

    let snf19hrTotals = parseInt(localStorage.getItem("snf19hrTotal"));
    snf19hrTotals = snf19hrTotals + 1;
    snf19hrTotals = snf19hrTotals.toString();
    localStorage.setItem("snf19hrTotal", snf19hrTotals);
}

function addLeadToCounter() {
    let prevLeads = parseInt(localStorage.getItem("snfLeads"));
    let leadCounter = prevLeads + 1;
    leadCounter = leadCounter.toString();
    localStorage.setItem("snfLeads", leadCounter);

    addToTotals();
}

function addNonLeadToCounterAndCloseTab() {
    let prevNonLeads = localStorage.getItem("snfNonLeads");
    if (prevNonLeads) {
        prevNonLeads = parseInt(prevNonLeads);
        let nonLeadCounter = prevNonLeads + 1;
        nonLeadCounter = nonLeadCounter.toString();
        localStorage.setItem("snfNonLeads", nonLeadCounter);

        addToTotals();
    }

    setTimeout(function () {
        window.close();
    }, 1);
}
