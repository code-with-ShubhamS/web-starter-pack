| Action                   | Happening in... | Effect                                  |
| :----------------------- | :-------------- | :-------------------------------------- |
| `window.open()`          | Main window     | Opens popup for Google OAuth            |
| User logs in via OAuth   | Popup window    | Redirects to `/google/callback` page    |
| `postMessage()` runs     | Popup window    | Sends a message to parent window        |
| `message` event listener | Main window     | Receives message and runs your callback |
| `window.close()`         | Popup window    | Closes the popup                        |

How window.opener works:
When you call window.open(URL, ...) from your main window, it opens a new popup window.

Inside that popup window (which loads the Google OAuth flow and finally your /googleCallback page), the global object window.opener automatically references the main window that opened it.

So:
No extra info needed. The popup always has a built-in link to its "parent" window via window.opener.

Your flow in detail:
Main app:

js
Copy
Edit
const popup = window.open(`${API_URL}/auth/google`, "_blank", "width=500,height=600");
This opens the Google OAuth popup and keeps track of the main window as the "opener".

Backend:
After Google login, backend redirects the popup to your frontend /googleCallback URL.

In your /googleCallback page (GoogleCallback.jsx):

js
Copy
Edit
useEffect(() => {
  // `window.opener` points back to your main app window that opened the popup
  window.opener.postMessage("google-auth-success", "*");
  window.close();
}, []);
This sends a message back to that main window (no ambiguity), then closes the popup.

In your main app window, you listen for this message and react accordingly.

Important:
window.opener is automatically set by the browser for any popup opened with window.open() — you don’t need to pass or track it yourself.

If the popup wasn’t opened via window.open(), window.opener will be null.