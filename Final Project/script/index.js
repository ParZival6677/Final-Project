// Multi Step Form
$(document).ready(function() {
    var current = 1, current_step, next_step, steps;
    steps = $("fieldset").length;

    $(".next").click(function() {
        current_step = $(this).parent();
        next_step = $(this).parent().next();

        if (validateForm(current)) {
            next_step.show();
            current_step.hide();
            setProgressBar(++current);
        }
    });

    $(".previous").click(function() {
        current_step = $(this).parent();
        next_step = $(this).parent().prev();
        next_step.show();
        current_step.hide();
        setProgressBar(--current);
    });

    $(".submit").click(function() {
        if (validateForm(steps)) {
            setProgressBar(steps);
            alert("Thank you for submitting the form!");
            resetForm();
            current = 1;
            $("fieldset").hide();
            $("fieldset:eq(0)").show();
            setProgressBar(current);
        }
    });

    $("#contactNumber").on("input", function() {
        this.value = this.value.replace(/[^\d]/g, "");
    });

    setProgressBar(current);

    function setProgressBar(curStep) {
        var percent = parseFloat(100 / steps) * curStep;
        percent = percent.toFixed();
        $(".progress-bar").css("width", percent + "%");
    }

    function validateForm(step) {
        const currentFieldset = $(`fieldset:eq(${step - 1})`);
        const inputs = currentFieldset.find("input[type='text'], input[type='email'], textarea");
        let isValid = true;

        inputs.each(function() {
            const value = $(this).val().trim();
            if (value === "") {
                if (step !== steps || ($(this).attr("name") !== "contactNumber")) {
                    alert($(this).prev("label").text() + " is required");
                    isValid = false;
                    return false;
                }
            }
        });

        return isValid;
    }

    $("input[type='text'], input[type='email'], textarea").keypress(function(event) {
        if (event.which === 13 && current < steps) {
            event.preventDefault();
            $(this).closest("fieldset").find(".next").click();
        }
    });

    function resetForm() {
        $("form")[0].reset();
    }
});


document.addEventListener("DOMContentLoaded", function () {
    // Initialize Bootstrap dropdown
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.map(function (dropdownToggle) {
        return new bootstrap.Dropdown(dropdownToggle);
    });
});

// To-Do List
window.addTaskModal = function () {
    const taskInputModal = document.getElementById("taskInputModal");
    const taskListModal = document.getElementById("taskListModal");

    const taskText = taskInputModal.value.trim();
    if (taskText !== "") {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        // Create a span for the task text
        const span = document.createElement("span");
        span.textContent = taskText;

        // Create a div container for buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.alignItems = "center";

        // Create a "Completed" button for task completion
        const completeButton = document.createElement("button");
        completeButton.className = "btn btn-success btn-sm";
        completeButton.textContent = "✓";
        completeButton.style.marginRight = "5px"; // Adjust margin between buttons
        completeButton.onclick = function() {
            span.classList.toggle("completed");
        };

        // Create a "Delete" button for task deletion
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.textContent = "✖";
        deleteButton.onclick = function() {
            taskListModal.removeChild(li);
        };

        // Append the buttons to the button container
        buttonContainer.appendChild(completeButton);
        buttonContainer.appendChild(deleteButton);

        // Append the span and button container to the li element
        li.appendChild(span);
        li.appendChild(buttonContainer);

        // Append the li element to the task list
        taskListModal.appendChild(li);

        taskInputModal.value = "";
      }
};

// Add event handlers after document is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the modal elements
    const todoListModal = new bootstrap.Modal(document.getElementById("todoListModal"));
    const countdownTimerModal = new bootstrap.Modal(document.getElementById("countdownTimerModal"));

    // Event handlers for opening modals
    document.getElementById("toDoListDropdownItem").addEventListener("click", function (e) {
        e.preventDefault();
        todoListModal.show();
    });

    document.getElementById("countdownTimerDropdownItem").addEventListener("click", function (e) {
        e.preventDefault();
        countdownTimerModal.show();
    });

    // Start the Countdown Timer
    const durationInputModal = document.getElementById("durationModal");
    const startButtonModal = document.getElementById("startButtonModal");
    const timerModal = document.getElementById("timerModal");
    let countdownIntervalModal;

    startButtonModal.addEventListener("click", function () {
        const duration = parseInt(durationInputModal.value);

        if (duration > 0) {
            if (countdownIntervalModal) {
                clearInterval(countdownIntervalModal);
            }
            timerModal.classList.remove("hidden");
            startCountdown(duration);
        }
    });

    // Start the countdown timer
    function startCountdown(duration) {
        let remainingTime = duration;
        timerModal.innerText = remainingTime;

        countdownIntervalModal = setInterval(function () {
            remainingTime--;

            if (remainingTime < 0) {
                clearInterval(countdownIntervalModal);
                timerModal.innerText = "Time's up!";
            } else {
                timerModal.innerText = remainingTime;
            }
        }, 1000);
    }
});

$(document).ready(function () {
    var startY, currentY;
    var scrollSpeed = 10;
    var dragItem;

    $(".draggable-item").on("dragstart", function (e) {
        startY = e.clientY;
        dragItem = e.target;
        e.originalEvent.dataTransfer.setData("text/plain", e.target.textContent);
    });

    $(".dropzone").on("dragover", function (e) {
        e.preventDefault();
    });

    $(".dropzone").on("drop", function (e) {
        e.preventDefault();
        var data = e.originalEvent.dataTransfer.getData("text/plain");
        var category = $(this).data("category");

        if (dragItem && $(dragItem).closest('.draggable-list').length > 0) {
            if ($(this).find(".dropped-item").text() !== data) {
                $(this).append("<div class='dropped-item'>" + data + "</div>");
                $(dragItem).css("visibility", "hidden");
            }
        } else {
            $(this).find(".dropped-item").remove();
            $(dragItem).css("visibility", "visible");
        }
    });

    // Adding a click handler on .dropped-item to return the element to its initial position
    $(document).on("click", ".dropped-item", function () {
        var textContent = $(this).text();

        // Finding the element with the same text content that was previously moved
        var originalItem = $(".draggable-item").filter(function () {
            return $(this).text() === textContent;
        });

        // Returning the element to its initial position
        if (originalItem.length > 0) {
            $(this).remove();
            originalItem.css("visibility", "visible");
        }
    });


    $(document).on("dragend", function () {
        dragItem = null;
    });

    $(document).on("drag", function (e) {
        currentY = e.clientY;
        var windowScroll = $(window).scrollTop();

        if (startY > currentY) {
            $(window).scrollTop(windowScroll - scrollSpeed);
        } else if (startY < currentY) {
            $(window).scrollTop(windowScroll + scrollSpeed);
        }
    });

    $("#checkAnswersButton").on("click", function () {
        var correctAnswers = {
            "ac": "Alternating Current (AC)",
            "coil": "Tesla Coil",
            "motor": "Induction Motor",
            "wpt": "Wireless Power Transmission",
            "radio": "Radio",
            "mgtr": "Magnifying Transmitter",
            "tesla_turbine": "Tesla Turbine",
            "shadowgraph": "Shadowgraph",
            "neon_lamp": "Neon Lamp",
            "transformer_house": "Niagara Falls Transformer House"
        };

        var allCorrect = true;

        $(".dropzone").each(function () {
            var category = $(this).data("category");
            var droppedItem = $(this).find(".dropped-item");
            var correctAnswer = correctAnswers[category];

            if (droppedItem.length === 0 || droppedItem.text() !== correctAnswer) {
                allCorrect = false;
                $(this).removeClass("bg-success").addClass("bg-danger");
            } else {
                $(this).removeClass("bg-danger").addClass("bg-success");
            }
        });

        if (allCorrect) {
            playAudio();
        } else {
            openFullscreenVideo();
        }
    });
});

function playAudio() {
    let audio = document.getElementById("successAudio");
    audio.play();
}

function openFullscreenVideo() {
    var videoElement = document.getElementById("fullscreenVideo");
    videoElement.style.display = "block";
    videoElement.play();

    // Track the event when fullscreen mode changes
    document.addEventListener("fullscreenchange", function () {
        if (!document.fullscreenElement) {
            // If exiting fullscreen mode, hide the video
            videoElement.pause();
            videoElement.style.display = "none";
        }
    });

    if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) { /* Firefox */
        videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) { /* IE/Edge */
        videoElement.msRequestFullscreen();
    }
}

$(document).ready(function() {
    var videoElement = document.getElementById("fullscrVideo");

    videoElement.addEventListener("click", function() {
        toggleFullScreen();
    });

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            if (videoElement.requestFullscreen) {
                videoElement.requestFullscreen();
            } else if (videoElement.mozRequestFullScreen) { /* Firefox */
                videoElement.mozRequestFullScreen();
            } else if (videoElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                videoElement.webkitRequestFullscreen();
            } else if (videoElement.msRequestFullscreen) { /* IE/Edge */
                videoElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    }
});

// Hover effect
document.addEventListener("DOMContentLoaded", function() {
    const timelineItems = document.querySelectorAll(".list-of-time li");

    timelineItems.forEach(item => {
        item.addEventListener("mouseover", function() {
            this.style.backgroundColor = "#f0f0f0";
            this.style.color = "#333";
            this.style.cursor = "pointer";
        });

        item.addEventListener("mouseout", function() {
            this.style.backgroundColor = "transparent";
            this.style.color = "#000";
        });
    });
});


// Function to show/hide scroll-to-top button based on scroll position
window.addEventListener("scroll", scrollFunction);

function scrollFunction() {
    var scrollBtn = document.getElementById("scrollBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
