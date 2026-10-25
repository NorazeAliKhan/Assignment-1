
const form = document.getElementById("registration-form");
const savedList = document.getElementById("saved-registrations");
const message = document.getElementById("registration-message");
const clearButton = document.getElementById("clear-registrations");

const storageKey = "nexusRegistrations";

function getRegistrations() {
    try {
        const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function displayRegistrations() {
    const registrations = getRegistrations();

    savedList.replaceChildren();

    if (registrations.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No registrations saved yet.";
        savedList.appendChild(item);
        return;
    }

    registrations.forEach(function (registration) {
        const item = document.createElement("li");

        item.textContent =
            registration.fullName + " — " +
            registration.event + " (" +
            registration.email + ")";

        savedList.appendChild(item);
    });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const selectedSource = form.querySelector(
        'input[name="source"]:checked'
    );

    if (!selectedSource) {
        message.textContent = "Please select how you heard about us.";
        return;
    }

    const registration = {
        fullName: document.getElementById("full-name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        event: document.getElementById("event").value,
        source: selectedSource.value,
        registeredAt: new Date().toISOString()
    };

    const registrations = getRegistrations();
    registrations.push(registration);

    try {
        localStorage.setItem(
            storageKey,
            JSON.stringify(registrations)
        );

        message.textContent = "Registration saved successfully!";
        form.reset();
        displayRegistrations();
    } catch (error) {
        message.textContent =
            "Could not save registration. Please check browser storage.";
    }
});

clearButton.addEventListener("click", function () {
    if (!window.confirm("Are you sure you want to clear all registrations?")) {
        return;
    }

    try {
        localStorage.removeItem(storageKey);
        message.textContent = "All registrations have been cleared.";
        displayRegistrations();
    } catch (error) {
        message.textContent = "Could not clear registrations.";
    }
});

displayRegistrations();
