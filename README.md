![Static Badge](https://img.shields.io/badge/Status-🚧_In_Progress-orange)

# TribeLink - Cell Enigma 

TribeLink is a social network where you can upload or delete images and notes, keep track of the actions 
that you made with the logs tab and update tour personal information on your profile


## 🛠 Tech
Javascript, HTML, CSS, Bulma...


## How to use

1. To clone:

---
```bash
    git clone https://github.com/Susilvav03/TribeLink.git
```
2. To execute:
---
```
    double click on index.html
```

3. To try it:
---
```
    susilvav03.github.io/TribeLink/
```


## Features

1. Images
   - Upload Images
   - Delete Images
2. Notes
   - Create notes
   - Edit notes
   - Delete notes
3. Profile
   - Register
   - login
   - log out
   - edit profile
4. Logs
   - Login
   - Log out
   - profile updated
   - Every log with User, action and date time info
5. Data persistence


## Logic 


`localStorage` is used to keep track of the number of visits by saving the key "visitas" and incrementing it each time the site is loaded, allowing a persistent visit counter across browser sessions. `sessionStorage` is utilized to store a session-based visit counter under the key "visitasSesion", which resets when the browser tab is closed. The project defines `JavaScript functions` for counting visits, updating HTML elements with these counts, and adding messages to the on-page log.` Logging` works by dynamically inserting new `<div>` elements into the element with ID logs, displaying time-stamped messages that document user actions and system events directly in the page interface.


## Authors

- [@Pegasso-admon](https://github.com/Pegasso-admon) - Samuel Rosero Alvarez (Leader)
```
    - Frontend and style
    - Profile
```
- [@Oomass7](https://github.com/Oomass7) - Jose Tomas Loaiza Rodriguez
```
    - Middleware
    - Logs
```
- [@RodriguezLopez](https://github.com/RodriguezLopez) - Luis Fernando Rodriguez Lopez 
```
    - Login
    - Images
```
- [@Susilvav03](https://github.com/Susilvav03) - Susana Silva Vallejo 
```
    - Notes
    - Board in Azure DevOps
    - README.md
```
## What we learned

```
We put into practice key JavaScript concepts such as manipulation of the DOM, the use of conditionals, and various control
structures to manage the user's data and user interaction. Additionally, this project allowed us to reinforce and deepen our
understanding of the concepts introduced in the previous module, including the structure and styling of web pages using HTML
and CSS, and now implementing the framework Bulma. This integration of front-end technologies was essential to develop an
interactive and visually coherent user experience.

```

## Planning

![image](https://github.com/user-attachments/assets/682e2c79-22e6-496c-8284-090dd33fe389)


