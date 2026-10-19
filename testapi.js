// test-api.js
// A simple Node.js script to test your POST /api/v1/users/register endpoint directly in VS Code!

/**
 * Sends a test POST request to the local Express server and logs the result.
 */
const testRegisterEndpoint = async () => {
    // 1. Define the target URL (you can adjust the port or path here if needed)
    const API_URL = "http://localhost:8000/api/v1/users/register";

    // 2. Define dummy user data to send in the request body
    const testUserData = {
        username: "sohel_test",
        email: "sohel@example.com",
        password: "password123"
    };

    console.log(`🚀 Sending POST request to: ${API_URL}...`);

    // 3. Set up a 5-second timeout in case the server is still hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        // 4. Send the POST request using Node's built-in fetch API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(testUserData),
            signal: controller.signal
        });

        clearTimeout(timeout);

        // 5. Read the response from your user.crontoller.js
        const responseText = await response.text();

        console.log(`\n✅ Status Code: ${response.status} (${response.statusText})`);
        console.log("📦 Response from your Server:");
        console.log(responseText);

    } catch (error) {
        clearTimeout(timeout);

        // 6. Explain clearly if an error or timeout happens
        if (error.name === "AbortError") {
            console.error("\n❌ TIMEOUT: The server took more than 5 seconds to respond!");
            console.error("👉 Fix: Make sure you updated 'asynchandler.js' to call reqHandler(req, res, next) and restarted your server.");
        } else {
            console.error("\n❌ CONNECTION ERROR:", error.message);
            console.error("👉 Fix: Make sure your server is running on port 8000 in your first terminal!");
        }
    }
};

// Execute the test function
testRegisterEndpoint();