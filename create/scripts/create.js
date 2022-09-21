function initalizeCreate() {
    loadPalletes();
    $(".btn").on("click", nextSection);
    $(".show-password").on("click", togglePassword);
    $("#startAgain").on("click", resetForm);
    $(".random-username").on("click", randomUsername);

    $(".username").keyup(function() {
        let username = this.value;
        updateDollName(username);
    });
}
async function randomUsername() {
    let url = "https://randomuser.me/api/";
    let obj = await (await fetch(url)).json();
    obj = obj.results[0];
    let randuser = obj.login.username
    $(".username").val(randuser);
    updateDollName(randuser);
}
function updateDollName(username) {
    username === "" ? $(".penguinName").text("Penguin Name") : $(".penguinName").text(username);
}
function togglePassword() {
    $(this).toggleClass("fa-eye fa-eye-slash");

    let input = $(this).prev('.info-section input');

    input.attr('type', input.attr('type') === 'password' ? 'text' : 'password');
}

function resetForm() {
    location.reload()
}

function nextSection() {
    if(typeof sections[current] !== "undefined") {
        if(sectionValidation()) {
            current_section = $(this).parent();
            next_section = $(this).parent().next();
            next_section.fadeIn();
            current_section.remove();
            current++;
            updateProgressbar();
            if (current === 3) {
                let name = $(".done");
                name.text(name.text().replace(/%.+?%/, userData.username));
            }
        }
    } 
}

function oldsectionValidation() {
    let valid = true;
    let section = $(sections[current]);
    let input = section.find("input");
    input.each(function() {
        let inputType = $(this).attr('type') === "checkbox" ? $(this).is(':checked') : $(this).val();
        if (!inputType) {
            showError(message);
            return valid = false;
        }
    });
    return valid;
}
function sectionValidation() {

    if (current === 0) {
        let rules = $('input[name="agree"]').is(':checked');
        let terms = $('input[name="terms"]').is(':checked');

        if (rules && terms) {
            return true;
        } else {
            showError("You must agree to the Club Penguin Rules and Terms of Use to create a penguin account.");
            return false;
        }
    } else if (current === 1) {
        let usernameInput = $(".username").val();
        if (usernameInput == "") {
            showError("Please provide a username");
            return false;
        }
        createPenguinObj(usernameInput);
        return true;
    } else if (current === 2) {
        let passwordInput = $(".password").val();
        let cpasswordInput = $(".cpassword").val();
        let emailInput = $(".email").val();
    
        if(!passwordInput || !emailInput || !cpasswordInput) {
            showError("Please fill out the required fields");
             return false;
        }
        if(passwordInput !== cpasswordInput) {
            showError("Your password doesn't match");
            return false;
        }
        if(!emailInput.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
            showError("Invalid Email");
            return false;
        }
        updatePenguinObj("password", passwordInput);
        updatePenguinObj("email", emailInput);
        return true;
    } 
}
function showError(text) {
    $("#c_container").append(`<div class="error-block-container"><div class="error-container"><div id="error-content"><div id="error-msg-txt"> %text% </div><div id="error-btn"><div id="error-txt">Ok</div></div></div></div></div>`);
    $("#error-btn").on("click", () => {
            closeError();
    });
    let message = $("#error-msg-txt").html(text);
    message.text(message.text().replace(/%.+?%/, message));
    $(".error-block-container").fadeIn();
}
function closeError() {
    $(".error-block-container").remove();
}
function updateProgressbar() {
    let progressSteps = document.querySelectorAll(".progress-step");
    progressSteps.forEach((progressStep, id) => {
        if (id < current + 1) {
            progressStep.classList.add("progress-step-active");
            progressStep.classList.add("step");
        } else {
            progressStep.classList.remove("progress-step-active");
            progressStep.classList.remove("step");

        }
    });
    progressSteps.forEach((progressStep, id) => {
        if (id < current) {
            progressStep.classList.add("progress-step-check");
            progressStep.classList.remove("progress-step-active");
        } else {
            progressStep.classList.remove("progress-step-check");
        }
    });

    let progressActive = document.querySelectorAll(".step");

    $(".progress").css("width", ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%");

}

function loadPalletes() {
    let colorIndexNum = 0;
    for (let palletes in penguinColors) {
        let colorHex = penguinColors[palletes],
            colorIndex = palletes,
            colorIndexCurrNum = ++colorIndexNum;
        $("#palletes").append(`<div data-id="${colorIndexCurrNum}" class="tinyPallete" style="background: #${colorHex}"></div> `);
    }
    $("#palletes").on("click", function(e) {
        currPalleteId = $(e.target).attr("data-id");
        e.currentTarget.querySelector(".active")?.classList.remove("active");
        if (e.target.classList.contains("tinyPallete")) {
            e.target.classList.add("active");
        }
        $(".doll").css("background-color", "#" + penguinColorByIndex(currPalleteId, false));
    });
}

function penguinColorByIndex(index, keys) {
    if (keys) {
        return Object.keys(penguinColors)[--index];
    }
    return Object.values(penguinColors)[--index];
}

function updatePenguinObj(key, value) {

    userData[key] = value;

    return userData;
}

function createPenguinObj(username) {

    userData = new Object();
    userData.username = username;
    userData.colorId = Number(currPalleteId);
    userData.password = "";
    userData.email = "";

    return userData;
}
let sections = {0: ".rules-section", 1: ".color-section", 2: ".info-section", 3: ".done-section"};
let userData;
let current = 0,
    current_section, next_section;
let currPalleteId = 0;
let penguinColors = {
    "Blue": "003366",
    "Green": "009900",
    "Pink": "FF3399",
    "Black": "333333",
    "Red": "CC0000",
    "Orange": "FF6600",
    "Yellow": "FFCC00",
    "Purple": "660099",
    "Brown": "996600",
    "Peach": "FF6666",
    "Dark Green": "006600",
    "Light Blue": "0099CC",
    "Lime Green": "8AE302",
    "Sensei Gray": "93A0A4",
    "Aqua": "02A797",
    "Arctic White": "F0F0D8",
};
window.onload = function() {
    initalizeCreate();
};