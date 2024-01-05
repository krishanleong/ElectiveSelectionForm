BMS Electives Form
This project is a web application that allows users to submit their elective choices through a form. The form data is then sent to a Google Apps Script web app via a POST request.

Project Structure
The project's main file is index.html, which serves as the entry point of the application. The index.html file includes a div with the id "root", where the React application is injected.

The main React application is located in src/main.jsx. This file is responsible for rendering the form and handling form submissions.

Form Submission
Upon form submission, the handleSubmit function is triggered. This function first enables all checkboxes in the form (they might be disabled for some reason before submission). It then collects all the form data and sends it to a Google Apps Script web app using a fetch POST request.

The URL for the Google Apps Script web app is hardcoded in the fetch function. This web app likely processes the form data and possibly stores it in a Google Spreadsheet or performs other operations.

After the form data is sent, the function waits for a response from the Google Apps Script web app. It then logs the response data or any error that might occur during the process.
