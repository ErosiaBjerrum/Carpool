/* ===================================================
   ROLE
   =================================================== */

function choose(role) {
    sessionStorage.setItem("carpool_role", role);
}

const roles = document.querySelectorAll('input[name="role"]');

roles.forEach(role => {
    role.addEventListener("change", () => {
        choose(role.value);
    });
});

/* ===================================================
   NEXT BUTTON
   =================================================== */

const next = document.querySelector("#next");
const fields = document.querySelectorAll("input, select");

function check() {
    if (!next) return;

    const ok = [...fields].every(f => {

        if (f.id === "contribution") return true;

        return f.type === "radio"
            ? document.querySelector(`input[name="${f.name}"]:checked`)
            : f.value;
    });

    next.classList.toggle("disabled", !ok);
}

fields.forEach(f => f.addEventListener("change", check));
check();

/* ===================================================
   DATE PICKER
   =================================================== */

const dateInput = document.querySelector(".date input");

if (dateInput) {
    dateInput.addEventListener("click", () => {
        dateInput.showPicker();
    });

    dateInput.addEventListener("change", () => {
        sessionStorage.setItem("date", dateInput.value);
    });
}

/* ===================================================
   ROUTE SELECT
   =================================================== */

const from = document.querySelector("#from");
const to = document.querySelector("#to");
const swap = document.querySelector("#swap");

/* klik på hele feltet åbner dropdown */

document.querySelectorAll(".route-input").forEach(box => {
    const select = box.querySelector("select");

    box.addEventListener("click", (e) => {

        if (e.target.tagName === "SELECT") return;

        select.showPicker();
        select.focus();
    });
});

/* stop bubbling fra select */

document.querySelectorAll(".route-input select").forEach(select => {
    select.addEventListener("click", e => {
        e.stopPropagation();
    });
});

/* byt fra/til */

if (swap && from && to) {
    swap.addEventListener("click", () => {

        const temp = from.value;
        from.value = to.value;
        to.value = temp;

        from.dispatchEvent(new Event("change"));
        to.dispatchEvent(new Event("change"));
    });
}

/* ===================================================
   NO SAME CITY
   =================================================== */

if (from && to) {

    function updateCities() {

        [...from.options].forEach(opt => {
            if (opt.value !== "") {
                opt.disabled = false;
                opt.hidden = false;
            }
        });

        [...to.options].forEach(opt => {
            if (opt.value !== "") {
                opt.disabled = false;
                opt.hidden = false;
            }
        });

        if (from.value) {
            const option = to.querySelector(`option[value="${from.value}"]`);
            if (option) {
                option.disabled = true;
                option.hidden = true;
            }
        }

        if (to.value) {
            const option = from.querySelector(`option[value="${to.value}"]`);
            if (option) {
                option.disabled = true;
                option.hidden = true;
            }
        }
    }

    from.addEventListener("change", updateCities);
    to.addEventListener("change", updateCities);

    from.addEventListener("change", () => {
        sessionStorage.setItem("from", from.options[from.selectedIndex].text);
    });

    to.addEventListener("change", () => {
        sessionStorage.setItem("to", to.options[to.selectedIndex].text);
    });
}

/* ===================================================
   REDIRECT TO DRIVER OR PASSENGER
   =================================================== */

const savedRole = sessionStorage.getItem("carpool_role");

if (next && savedRole && document.querySelector("#from")) {
    next.href = savedRole === "chauffør" ? "driver.html" : "passenger.html";
}

/* ===================================================
   SAVE NUMBER OF PASSENGERS
   =================================================== */

function passengernumber(number) {
    sessionStorage.setItem("passenger_number", number);
}

const seats = document.querySelector("#seats");

if (seats) {
    seats.addEventListener("change", () => {
        passengernumber(seats.value);
    });
}

/* ===================================================
   SAVE CONTRIBUTION
   =================================================== */

const contribution = document.querySelector("#contribution");

if (contribution) {
    contribution.addEventListener("input", () => {
        sessionStorage.setItem("contribution", contribution.value);
    });
}

/* ===================================================
   RESTORE SAVED VALUES
   =================================================== */

const savedDate = sessionStorage.getItem("date");
if (dateInput && savedDate) {
    dateInput.value = savedDate;
}

if (from) {
    const savedFrom = sessionStorage.getItem("from");
    if (savedFrom) {
        [...from.options].forEach(option => {
            if (option.text === savedFrom) {
                from.value = option.value;
            }
        });
    }
}

if (to) {
    const savedTo = sessionStorage.getItem("to");
    if (savedTo) {
        [...to.options].forEach(option => {
            if (option.text === savedTo) {
                to.value = option.value;
            }
        });
    }
}

if (seats) {
    const savedSeats = sessionStorage.getItem("passenger_number");
    if (savedSeats) {
        seats.value = savedSeats;
    }
}

if (contribution) {
    const savedContribution = sessionStorage.getItem("contribution");
    if (savedContribution) {
        contribution.value = savedContribution;
    }
}

if (roles.length) {
    const savedRole = sessionStorage.getItem("carpool_role");
    if (savedRole) {
        const selectedRole = document.querySelector(`input[name="role"][value="${savedRole}"]`);
        if (selectedRole) {
            selectedRole.checked = true;
        }
    }
}

if (from && to) {
    updateCities();
}

check();

/* ===================================================
   RESULT SUMMARY
   =================================================== */

const summary = document.querySelector("#summary");

if (summary) {

    const role = sessionStorage.getItem("carpool_role");
    const date = sessionStorage.getItem("date");
    const from = sessionStorage.getItem("from");
    const to = sessionStorage.getItem("to");
    const passengerNumber = sessionStorage.getItem("passenger_number");
    const contribution = sessionStorage.getItem("contribution");

    if (role === "chauffør") {

        summary.innerHTML = `
    <span class="label">Dato:</span><span class="route-highlight">${date}</span>
    <span class="label">Rute:</span><span class="route-highlight">${from} → ${to}</span>
    <span class="label">Antal passagerer:</span><span class="route-highlight">${passengerNumber}</span>
`;

    } else if (role === "passager") {

        summary.innerHTML = `
    <span class="label">Dato:</span><span class="route-highlight">${date}</span>
    <span class="label">Rute:</span><span class="route-highlight">${from} → ${to}</span>
    <span class="label">Modydelse:</span><span class="route-highlight">${contribution}</span>
`;
    }
}