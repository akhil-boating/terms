document.addEventListener('DOMContentLoaded', () => {
  const approvedDisplay = document.getElementById('approvedDisplay');
  const notApprovedDisplay = document.getElementById('notApprovedDisplay');
  const resultDisplay = document.getElementById('resultDisplay');

  const apiDomain = "https://terms-psi.vercel.app/api/chrome"; // Domain that owns the session cookie
  const userLinkApiUrl = `${apiDomain}`; // Endpoint you will POST to
  const sessionCookieName = "sb-jdiuwlodcrzutrrgrjxc-auth-token"; // Name of the cookie stored on your API domain

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url) {
      notApprovedDisplay.style.display = 'block';
      return;
    }

    const currentUrl = tab.url;

    approvedDisplay.style.display = 'block';
    document.getElementById('siteUrl').textContent = currentUrl;

    const button = document.getElementById('sendBtn');
    button.style.display = 'block';
    button.onclick = () => {
      // 1. Read the session cookie from your API domain (NOT the current tab's domain)
      chrome.cookies.get({ url: apiDomain, name: sessionCookieName }, (cookie) => {

        /*if (!cookie || !cookie.value) {
          resultDisplay.style.display = 'block';
          resultDisplay.textContent = " Session cookie not found on API domain.";
          return;
        } 

        // 1. Parse the JSON string
        const sessionArray = JSON.parse(cookie.value);
        // 2. Get the JWT (the first item)
        const jwt = sessionArray[0];
        // 3. Split the JWT and get the payload (the middle part)
        const payloadBase64Url = jwt.split('.')[1];
        // 4. Decode the Base64Url string into a regular string
        const decodedPayloadJson = Buffer.from(payloadBase64Url, 'base64url').toString('utf8');
        // 5. Parse the resulting JSON string to get an object
        const payloadObject = JSON.parse(decodedPayloadJson); */
        

        const sessionId = "4f646de8-d31e-4cac-ab80-1f845dc6928a";

        // 2. Send current tab URL + session ID to your API
        fetch(userLinkApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: sessionId,
            url: currentUrl
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.url) {
            resultDisplay.style.display = 'block';
            resultDisplay.innerHTML = `
              <strong>User Link:</strong><br>
              <a href="${data.url}" target="_blank">${data.url}</a>
            `;
          } else {
            resultDisplay.style.display = 'block';
            resultDisplay.textContent = "No redirect URL returned by API.";
          }
        })
        .catch(err => {
          resultDisplay.style.display = 'block';
          resultDisplay.textContent = "API error: " + err;
        });
      });
    };
  });
});
