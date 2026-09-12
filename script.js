const chatBox = document.getElementById("chat-box");

const userInput = document.getElementById("user-input");

const sendButton = document.getElementById("send-button");


function addMessage(message, sender) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");

    if (sender === "user") {

        messageDiv.classList.add("user-message");

    } else {

        messageDiv.classList.add("bot-message");

    }

    messageDiv.textContent = message;

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

}


async function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") {
        return;
    }


    // Display user's message
    addMessage(message, "user");


    // Clear input
    userInput.value = "";


    // Disable button
    sendButton.disabled = true;


    // Display loading message
    addMessage("Thinking...", "bot");


    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        const data = await response.json();


        // Remove Thinking...
        const botMessages =
            document.querySelectorAll(".bot-message");

        const lastBotMessage =
            botMessages[botMessages.length - 1];


        if (lastBotMessage &&
            lastBotMessage.textContent === "Thinking...") {

            lastBotMessage.remove();

        }


        // Display AI response
        addMessage(data.reply, "bot");

    }

    catch (error) {

        console.error(error);

        addMessage(
            "Unable to connect to the server.",
            "bot"
        );

    }


    sendButton.disabled = false;

    userInput.focus();

}


// Send message when button is clicked
sendButton.addEventListener(
    "click",
    sendMessage
);


// Send message when Enter is pressed
userInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);