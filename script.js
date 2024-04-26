let currentStudentData = {} //object to store current_user data
currentStudentData = { //sample data
    "IITB Roll Number": "23b0903",
    "Name": "Abhi Jain",
    "Year of Study": "1st",
    "Gender": "Male",
    "Age": "18",
    "Interests": [
        "Traveling",
        "Sports",
        "Movies",
        "Technology"
    ],
    "Hobbies": [
        "Cooking",
        "Coding",
        "Watching YouTube/Instagram"
    ],
    "Email": "abhijain565aj@gmail.com",
    "Photo": "photos/23b0903_abhi_jain.jpg"
}

document.addEventListener('DOMContentLoaded', function () {
    //check the local storage for if files are correct
    if (!localStorage.getItem('filesCorrect') || localStorage.getItem('filesCorrect') == 'false') {
        fetch('/recheckJson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.addition) {
                    localStorage.setItem('filesCorrect', 'true');
                    console.log("JSON file is correct");
                } else {
                    console.log("JSON file is incorrect");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}
)
function forgotPswdPageReset() {
    document.getElementById('forgotPasswordSubmit').style.display = 'block';
    document.getElementById('secretQuestionFP').style.display = 'none';
    document.getElementById('secretAnswerFP').style.display = 'none';
    document.getElementById('getPasswordSubmit').style.display = 'none';
    document.getElementById('usernameFPPage').disabled = false;
}
// adding functions to extra buttons in login.html
// Define a function with a delay using async and await
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const chng = document.getElementById('in_between_page');
const registerNowLoginPage = document.getElementById('registerNowLoginPage');
if (registerNowLoginPage) {
    registerNowLoginPage.addEventListener('click', async () => {
        chng.style.transform = 'translate(0)';
        await delay(200);
        document.getElementById('login_page').style.visibility = 'hidden';
        await delay(500);
        document.getElementById('register_now_page').style.visibility = 'visible';
        await delay(800);
        chng.style.transform = 'translate(-100%)';
    });
}
const forgotPasswordLoginPage = document.getElementById('forgotPasswordLoginPage');
if (forgotPasswordLoginPage) {
    forgotPasswordLoginPage.addEventListener('click', async () => {
        chng.style.transform = 'translate(0)';
        await delay(200);
        document.getElementById('login_page').style.visibility = 'hidden';
        await delay(500);
        document.getElementById('forgot_password_page').style.visibility = 'visible';
        forgotPswdPageReset();
        await delay(800);
        chng.style.transform = 'translate(-100%)';
    });
}
const loginNowRegPage = document.getElementById('loginNowRegPage');
if (loginNowRegPage) {
    loginNowRegPage.addEventListener('click', async () => {
        chng.style.transform = 'translate(0)';
        await delay(200);
        document.getElementById('register_now_page').style.visibility = 'hidden';
        await delay(500);
        document.getElementById('login_page').style.visibility = 'visible';
        await delay(800);
        chng.style.transform = 'translate(-100%)';
    });
}
const loginNowFPPage = document.getElementById('loginNowFPPage');
if (loginNowFPPage) {
    loginNowFPPage.addEventListener('click', async () => {
        chng.style.transform = 'translate(0)';
        await delay(200);
        document.getElementById('forgot_password_page').style.visibility = 'hidden';
        await delay(500);
        document.getElementById('login_page').style.visibility = 'visible';
        await delay(800);
        chng.style.transform = 'translate(-100%)';

    });
}
const registerNowFPPage = document.getElementById('registerNowFPPage');
if (registerNowFPPage) {
    registerNowFPPage.addEventListener('click', async () => {
        chng.style.transform = 'translate(0)';
        await delay(200);
        document.getElementById('forgot_password_page').style.visibility = 'hidden';
        await delay(500);
        document.getElementById('register_now_page').style.visibility = 'visible';
        await delay(800);
        chng.style.transform = 'translate(-100%)';
    });
}

//Authenticate User
function authenticateUser(username, password) {
    // Send a POST request to the server with the username and password
    fetch('/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) { //data.authenticated is the response from the server
                localStorage.setItem('current_user', username);
                localStorage.setItem('registration', data.registration);
                console.log(data)
                if (data.registration) {
                    window.location.href = 'scroll_or_swipe.html';
                }
                //opening dating.html if registration is not done
                else {
                    window.location.href = 'dating.html';
                }
            } else {
                alert('User not found');
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const loginSubmit = document.getElementById('loginSubmit');
if (loginSubmit) {
    loginSubmit.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        authenticateUser(username, password);
    });
}

function usernameAuthenticator(username) {
    // Send a POST request to the server with the username
    fetch('/authenticateUsername', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) { //data.authenticated is the response from the server
                //hiding and unhiding the required elements
                document.getElementById('forgotPasswordSubmit').style.display = 'none';
                document.getElementById('secretQuestionFP').style.display = 'block';
                document.getElementById('secretAnswerFP').style.display = 'block';
                document.getElementById('getPasswordSubmit').style.display = 'block';
                // console.log(data)
                document.getElementById('secretQuestionFP').innerText = data.secretQuestion;
                document.getElementById('usernameFPPage').disabled = true;
            } else {
                alert('User not found');
                document.getElementById('usernameFPPage').value = '';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const forgotPasswordSubmit = document.getElementById('forgotPasswordSubmit');
if (forgotPasswordSubmit) {
    forgotPasswordSubmit.addEventListener('click', () => {
        const username = document.getElementById('usernameFPPage').value;
        usernameAuthenticator(username);
    });
}

function checkAnswer(username, answer) {
    // Send a POST request to the server with the username and answer
    fetch('/checkAnswer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, answer }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) { //data.authenticated is the response from the server
                alert('Your Password is: ' + data.password);
                loginNowFPPage.click();
            } else {
                alert('Wrong answer');
                document.getElementById('secretAnswerFP').value = '';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
const getPasswordSubmit = document.getElementById('getPasswordSubmit');
if (getPasswordSubmit) {
    getPasswordSubmit.addEventListener('click', () => {
        const username = document.getElementById('usernameFPPage').value;
        const answer = document.getElementById('secretAnswerFP').value;
        checkAnswer(username, answer);
    }
    );
}

//Register User
function registerUser() {
    username = document.getElementById('usernameRegPage').value;
    password = document.getElementById('passwordRegPage').value;
    confirmPassword = document.getElementById('confirmPasswordRegPage').value;
    secret_question = document.getElementById('secretQuestionRegPage').value;
    secret_answer = document.getElementById('secretAnswerRegPage').value;
    if (username.length < 5) {
        alert('Username should be atleast 5 characters long');
    }
    //username should not contain spaces
    else if (username.includes(' ')) {
        alert('Username should not contain spaces');
    }
    else if (password.length < 8) {
        alert('Password should be atleast 8 characters long');
    }
    //check if passwords match
    else if (password !== confirmPassword) {
        alert('Passwords do not match');
        document.getElementById('passwordRegPage').value = '';
        document.getElementById('confirmPasswordRegPage').value = '';
        return;
    }
    //check if any field is empty
    else if (username.length == 0 || password.length == 0 || confirmPassword.length == 0 || secret_question.length == 0 || secret_answer.length == 0) {
        alert('Please fill all the fields');
        return;
    }
    else {
        //check if username already exists
        fetch('/userExists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) { //data.authenticated is the response from the server
                    alert('Username is already taken.');
                    return;
                }
                else {

                    //register the user
                    fetch('/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password, secret_question, secret_answer, registration: false }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.registration) { //data.authenticated is the response from the server
                                alert('Registration successful');
                                loginNowRegPage.click();
                            } else {
                                alert('Registeration failed');
                                document.querySelectorAll('input').forEach(input => {
                                    input.value = '';
                                });
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

const registerNowSubmit = document.getElementById('registerNowSubmit');
if (registerNowSubmit) {
    registerNowSubmit.addEventListener('click', () => {
        registerUser();
    });
}

function dating() {
    const IITB_roll_no_dt = document.getElementById('IITB_roll_no_dt').value;
    const student_name_dt = document.getElementById('student_name_dt').value; set
    const email = document.getElementById('email').value;
    const year_of_study_dt = document.getElementById('year_of_study_dt').value;
    const age_dt = document.getElementById('age_dt').value;
    const radios = document.getElementsByName('gender');
    let gender = ''
    for (let radio of radios) {
        if (radio.checked) {
            gender = radio.value;
            break;
        }
    }
    if (!localStorage.getItem('match_type')) {
        if (gender === 'Male') {
            document.querySelectorAll('.options_gender')[2].click();
        }
        else if (gender === 'Female') {
            document.querySelectorAll('.options_gender')[1].click();
        }
        else {
            document.querySelectorAll('.options_gender')[0].click();
        }
    }
    const hobbies = document.getElementsByName('hobby')
    let selected_hobbies = []
    for (let hobby of hobbies) {
        if (hobby.checked) {
            selected_hobbies.push(hobby.value);
        }
    }
    const interests = document.getElementsByName('interest')
    let selected_interests = []
    for (let interest of interests) {
        if (interest.checked) {
            selected_interests.push(interest.value);
        }
    }
    // console.log(IITB_roll_no_dt, student_name_dt, email, year_of_study_dt, age_dt, gender, selected_hobbies, selected_interests)
    msg_error = ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (IITB_roll_no_dt.length == 0 || student_name_dt.length == 0 || email.length == 0 || year_of_study_dt.length == 0 || age_dt <= 0 || gender.length == 0) {
        alert('Please fill all the fields');
    }
    else if (IITB_roll_no_dt.includes(' ')) {
        alert('Please enter a valid IITB Roll Number');
    }
    else if (emailRegex.test(email) == false) {
        alert('Please enter a valid email');
    }
    else if (selected_hobbies.length == 0 || selected_interests.length == 0) {
        alert('Please select atleast one hobby and one interest');
    }
    else if (document.getElementById('photo_dt').files.length == 0 && localStorage.getItem('registration') == 'true') {
        currentStudentData = {
            "IITB Roll Number": IITB_roll_no_dt,
            "Name": student_name_dt,
            "Year of Study": year_of_study_dt,
            "Age": age_dt,
            "Gender": gender,
            "Interests": selected_interests,
            "Hobbies": selected_hobbies,
            "Email": email,
            "Photo": currentStudentData.Photo,
            "username": localStorage.getItem('current_user'),
            "likes": currentStudentData.likes
        }
        fetch('/submitDating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentStudentData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.registration) {
                    alert('Data submitted successfully');
                    localStorage.setItem('registration', 'true');
                    window.location.href = 'scroll_or_swipe.html';
                } else {
                    alert('Registeration failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Registeration failed');
            });
    }
    else if (document.getElementById('photo_dt').files.length == 0) {
        alert('Please upload a photo');
    }
    else {
        const photoInput = document.getElementById('photo_dt').files[0];
        const formData = new FormData();
        formData.append('file', photoInput);
        newFileName = IITB_roll_no_dt + '_' + student_name_dt.replace(' ', '_').toLowerCase();
        // console.log(newFileName)
        fetch('/upload', {
            method: 'POST',
            headers: {
                'new-filename': newFileName
            },
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Error uploading file.');
            })
            .then(msg => {
                console.log(msg);
                currentStudentData = {
                    "IITB Roll Number": IITB_roll_no_dt,
                    "Name": student_name_dt,
                    "Year of Study": year_of_study_dt,
                    "Age": age_dt,
                    "Gender": gender,
                    "Interests": selected_interests,
                    "Hobbies": selected_hobbies,
                    "Email": email,
                    "Photo": 'photos/' + msg.fileName,
                    "username": localStorage.getItem('current_user'),
                    "likes": 0
                }
                fetch('/submitDating', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(currentStudentData),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.registration) {
                            alert('Data submitted successfully');
                            localStorage.setItem('registration', 'true');
                            window.location.href = 'scroll_or_swipe.html';
                        } else {
                            alert('Registeration failed');
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Registeration failed');
                    });
            })
            .catch(error => {
                console.error(error);
                alert('Error uploading file.');
            });
    }
}
//check if docmuent url contains dating
if (document.URL.includes('dating.html')) {
    const next_dt = document.getElementById('nextDating');
    const prev_dt = document.getElementById('prevDating');
    const step1_dt = document.getElementById('step_1')
    const step2_dt = document.getElementById('step_2')
    const step3_dt = document.getElementById('step_3')
    const step4_dt = document.getElementById('step_4')
    window.addEventListener('load', function () {
        // Entire document has finished loading
        step1_dt.style.visibility = "visible";
        step2_dt.style.visibility = "hidden";
        step3_dt.style.visibility = "hidden";
        step4_dt.style.visibility = "hidden";
        prev_dt.style.visibility = "hidden";
        if (localStorage.getItem('registration') == 'true') {
            fetch('students.json')
                .then(response => response.json())
                .then(json => {
                    for (let student of json) {
                        if (student.username == localStorage.getItem('current_user')) {
                            currentStudentData = student;
                            break;
                        }
                    }
                })
                .then(() => {
                    document.getElementById('IITB_roll_no_dt').value = currentStudentData['IITB Roll Number'];
                    document.getElementById('IITB_roll_no_dt').disabled = true;
                    document.getElementById('student_name_dt').value = currentStudentData.Name;
                    document.getElementById('student_name_dt').disabled = true;
                    document.getElementById('email').value = currentStudentData.Email;
                    document.getElementById('year_of_study_dt').value = currentStudentData['Year of Study'];
                    document.getElementById('age_dt').value = currentStudentData.Age;
                    const radios = document.getElementsByName('gender')
                    for (let radio of radios) {
                        if (radio.value == currentStudentData.Gender) {
                            radio.checked = true;
                        }
                    }
                    const hobbies = document.getElementsByName('hobby')
                    for (let hobby of hobbies) {
                        if (currentStudentData.Hobbies.includes(hobby.value)) {
                            hobby.checked = true;
                        }
                    }
                    const interests = document.getElementsByName('interest')
                    for (let interest of interests) {
                        if (currentStudentData.Interests.includes(interest.value)) {
                            interest.checked = true;
                        }
                    }
                    //set the choosen file to be file at location photos
                    // document.getElementById('photo_dt').value = currentStudentData.Photo;
                    photo_dt = document.getElementById('photo_dt')

                    const imagePreview = document.getElementById('uploadedImgDisplay');
                    imagePreview.innerHTML = ''; // Clear previous image
                    const img = document.createElement('img');
                    img.src = currentStudentData.Photo;
                    img.alt = 'Uploaded Image';
                    img.style = "object-fit: cover; width: 100%; height: 100%;"
                    imagePreview.appendChild(img);
                })
        }
        else {
            fields = document.querySelectorAll('dating_input')
            for (field of fields) {
                field.value = ''
            }
            hobbies = document.getElementsByName('hobby')
            for (let hobby of hobbies) {
                hobby.checked = false;
            }
            interests = document.getElementsByName('interest')
            for (let interest of interests) {
                interest.checked = false;
            }
            photo_dt = document.getElementById('photo_dt')
            //photo_dt is type="file"
            photo_dt.value = ''
        }

    });
    next_dt.addEventListener('click', () => {
        if (step1_dt.style.visibility == 'visible') {
            step1_dt.style.visibility = 'hidden';
            step2_dt.style.visibility = 'visible';
            prev_dt.style.visibility = 'visible';
        }
        else if (step2_dt.style.visibility == 'visible') {
            step2_dt.style.visibility = "hidden";
            step3_dt.style.visibility = "visible";
        }
        else if (step3_dt.style.visibility == 'visible') {
            step3_dt.style.visibility = "hidden";
            step4_dt.style.visibility = "visible";
            next_dt.style.visibility = "hidden";
        }
    }
    )
    prev_dt.addEventListener('click', () => {
        if (step2_dt.style.visibility == 'visible') {
            step2_dt.style.visibility = 'hidden';
            step1_dt.style.visibility = 'visible';
            prev_dt.style.visibility = 'hidden';
        }
        else if (step3_dt.style.visibility == 'visible') {
            step3_dt.style.visibility = 'hidden';
            step2_dt.style.visibility = 'visible';
        }
        else if (step4_dt.style.visibility == 'visible') {
            step4_dt.style.visibility = 'hidden';
            step3_dt.style.visibility = 'visible';
            next_dt.style.visibility = 'visible';
        }
    }
    )
    //clicking on the photo means click on checkbox
    document.querySelectorAll('.s2lv2').forEach((element) => {
        element.addEventListener('click', () => {
            c = element.childNodes[1].childNodes[1];
            c.checked = !c.checked;
        });
    });
    document.getElementById('photo_dt').addEventListener('change', function (event) {
        const file = event.target.files[0];
        // When the "change" event occurs (i.e., a file is selected), this line retrieves the selected file from the event object. event.target.files contains an array of files selected by the user. Since we're allowing only one file (accept="image/*"), we access the first file in the array using [0].
        if (file) {
            const reader = new FileReader();
            // FileReader is a built-in JavaScript object that allows reading the contents of files asynchronously.
            reader.onload = function (e) {
                const imagePreview = document.getElementById('uploadedImgDisplay');
                imagePreview.innerHTML = ''; // Clear previous image
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded Image';
                img.style = "object-fit: cover; width: 100%; height: 100%;"
                imagePreview.appendChild(img);
            }
            reader.readAsDataURL(file);
            //This line initiates the reading of the file as a data URL. The readAsDataURL() method reads the contents of the specified file and returns a data URL representing the file's data.
        }
    });
    document.getElementById('submitDating').addEventListener('click', () => {
        dating();
    });
}
let card_A_handler = null;
let card_C_handler = null;
let event_scroll = 'click'
function card_A_adder(current_index, container) {
    return function () {
        container.children[current_index + 2].removeEventListener(event_scroll, card_C_handler);
        container.children[current_index + 2].id = "";
        current_index -= 1;
        assignIDs(current_index, container);
    }
}

function card_C_adder(current_index, container) {
    return function () {
        container.children[current_index].removeEventListener(event_scroll, card_A_handler);
        container.children[current_index].id = "";
        current_index += 1;
        assignIDs(current_index, container);
    }
}
async function assignIDs(current_index, container) {
    if (document.getElementById('A_card')) {
        document.getElementById('A_card').removeEventListener(event_scroll, card_A_handler)
    }
    if (document.getElementById('B_card')) {
        document.getElementById('B_card').removeEventListener(event_scroll, card_A_handler)
        document.getElementById('B_card').removeEventListener(event_scroll, card_C_handler)
    }
    if (document.getElementById('C_card')) {
        document.getElementById('C_card').removeEventListener(event_scroll, card_C_handler)
    }
    // console.log(current_index);
    // await (delay(1000));
    container.children[current_index].id = "A_card";
    container.children[current_index + 1].id = "B_card";
    container.children[current_index + 2].id = "C_card";
    // await (delay(1000));
    if (current_index > 0) {
        card_A_handler = card_A_adder(current_index, container);
        document.getElementById('A_card').addEventListener(event_scroll, card_A_handler)
    }
    if (card_A_handler) {
        document.getElementById('B_card').removeEventListener(event_scroll, card_A_handler)
    }
    if (card_C_handler) {
        document.getElementById('B_card').removeEventListener(event_scroll, card_C_handler)
    }
    if (current_index < container.children.length - 3) {
        card_C_handler = card_C_adder(current_index, container);
        document.getElementById('C_card').addEventListener(event_scroll, card_C_handler)
    }
}
function applyFilter(filter, student) {
    if (!filter.gender.includes(student.Gender)) {
        return false;
    }
    if (!filter.year_of_study.includes(student['Year of Study'])) {
        return false;
    }
    for (let interest of filter.interest) {
        if (!student.Interests.includes(interest)) {
            return false;
        }
    }
    for (let hobby of filter.hobby) {
        if (!student.Hobbies.includes(hobby)) {
            return false;
        }
    }
    // console.log(student.Age);
    if (filter.nAge.includes("AnyAge")) {
    }
    else if (filter.nAge.includes("lt15") && parseInt(student.Age) <= 15) {
    }
    else if (filter.nAge.includes("gt26") && parseInt(student.Age) >= 26) {
    }
    else if (filter.nAge.includes(student.Age.toString())) {
    }
    else {
        return false;
    }
    console.log(student.Name)
    return true;
}
function updateFilter() {
    if (localStorage.getItem('filter')) {
        filter = JSON.parse(localStorage.getItem('filter'));
        console.log(filter);
        for (let interest of filter.interest) {
            document.getElementById(interest.toLowerCase().replace(/ /g, '_')).checked = true;
        }
        for (let hobby of filter.hobby) {
            document.getElementById(hobby.toLowerCase().replace(/ /g, '_')).checked = true;
        }
        for (let age of filter.age) {
            document.getElementById('age_' + age).checked = true;
        }
        for (let year of filter.year_of_study) {
            document.getElementById('yos_' + year).checked = true;
        }
        for (let gender of filter.gender) {
            document.getElementById('gender' + gender).checked = true;
        }
    }
    else {
        document.getElementById('age_AnyAge').checked = true;
        document.getElementById('genderOther').checked = true;
        document.getElementById('genderMale').checked = true;
        document.getElementById('genderFemale').checked = true;
        document.getElementById('yos_1st').checked = true;
        document.getElementById('yos_2nd').checked = true;
        document.getElementById('yos_3rd').checked = true;
        document.getElementById('yos_4th').checked = true;
    }
}
//code for scroll and swipe website
if (document.URL.includes('scroll_or_swipe.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        updateFilter(); // updates the filterCheckboxes
        document.getElementById('find_a_match_button').addEventListener('click', function (event) {
            window.location.href = 'match.html';
        });
        //fetching the data from students.json
        fetch('students.json')
            .then(response => response.json())
            .then(json => { //getting the cards
                //randomly sort the json
                json.sort(() => Math.random() - 0.5);
                const container = document.getElementById('scroll_or_swipe_container')
                for (let student of json) {
                    if (localStorage.getItem('filter')) {
                        if (!applyFilter(JSON.parse(localStorage.getItem('filter')), student)) { //Applying the filter
                            continue;
                        }
                    }
                    let newDiv = document.createElement('div');
                    newDiv.classList.add('card');
                    newDiv.classList.add('date_card');
                    newDiv.innerHTML =
                        //     `
                        // <div class="photo_container">
                        //     <img src = "${student.Photo}">
                        //     <div class="square"></div>
                        // </div >
                        // <div class="details">
                        // <p>I am ${student.Name}, a ${student['Year of Study']} year student at IIT Bombay. My interests include ${student.Interests.join(', ')} and my hobbies are ${student.Hobbies.join(', ')}.</p>
                        // <p>You can reach me at ${student.Email}.</p>
                        // </div>
                        //     `
                        `
                        <div class="photo_container">
                            <img src = "${student.Photo}">
                            <div class="square"></div>
                            <div class="like_button heart">
                                &hearts;
                            </div>
                            <div class="like_button like_count">
                                ${student.likes}
                            </div>
                        </div >
                        <div class="details">
                            <h1>${student.Name}</h1>
                            <h2>${student.Age} yrs old & in ${student['Year of Study']} Year</h2>
                        </div>
                        <div class="view_more_button">
                            view more
                        </div>
                        <div class="more_details">
                            <p>Name: ${student.Name}</p>
                            <p>Age: ${student.Age}</p>
                            <p>Gender: ${student.Gender}</p>
                            <p>Year of Study: ${student['Year of Study']}</p>
                            <p>Interests: ${student.Interests.join(', ')}</p>
                            <p>Hobbies: ${student.Hobbies.join(', ')}</p>
                            <p>Email: <a href="mailto:${student.Email}">${student.Email}<a></p>
                        </div>
                        <div class = "username_for_like" style="display:none;">
                            ${student.username}
                        </div>
                        `
                    container.appendChild(newDiv);
                }
                let newDiv = document.createElement('div');
                newDiv.classList.add('card');
                newDiv.classList.add('empty_card');
                container.appendChild(newDiv);

                // console.log(json);

                let current_index = 0;
                assignIDs(current_index, container);

                container.addEventListener('wheel', async function (event) {
                    const scrollAmount = event.deltaY; // Get the value of mouse scroll
                    console.log('Scroll amount:', scrollAmount);
                    if (scrollAmount > 20) {
                        document.getElementById('C_card').click();
                        await delay(500);
                    }
                    else if (scrollAmount < 20) {
                        document.getElementById('A_card').click();
                        await delay(500);
                    }
                });

                //Also use dragging for moving
                let isDragging = false; // Flag to track if mouse is being dragged
                let initialX, dragDistanceX; // Distance dragged in X and Y directions

                // Event listener for mouse down
                document.addEventListener('mousedown', function (event) {
                    isDragging = true;
                    initialX = event.clientX;
                });

                // Event listener for mouse move
                document.addEventListener('mousemove', function (event) {
                    if (isDragging) {
                        dragDistanceX = event.clientX - initialX;
                        if (dragDistanceX > 20) {
                            document.getElementById('A_card').click();
                            isDragging = false;
                        }
                        else if (dragDistanceX < -20) {
                            document.getElementById('C_card').click();
                            isDragging = false;
                        }
                    }
                });
                // Event listener for mouse up
                document.addEventListener('mouseup', function () {
                    isDragging = false;
                    initialX = 0;
                    dragDistanceX = 0;
                });
                //on press of arrow keys immitate clicks;
                document.addEventListener('keydown', function (event) {
                    if (event.key == 'ArrowRight') {
                        document.getElementById('C_card').click();
                    }
                    else if (event.key == 'ArrowLeft') {
                        document.getElementById('A_card').click();
                    }
                });
                //
            })
            .then(() => {//for likes
                document.querySelectorAll('.heart').forEach(heart => {
                    heart.addEventListener('click', function (event) {
                        let adder = 0;
                        if (heart.classList.contains('liked')) {
                            heart.classList.remove('liked');
                            adder = -1;
                        }
                        else {
                            heart.classList.add('liked');
                            adder = 1;
                        } //adding the class liked to the heart
                        let like_count = event.target.nextElementSibling;
                        //getting the next sibling of the heart
                        like_count.innerText = parseInt(like_count.innerText) + adder;
                        username = document.getElementById('B_card').querySelector('.username_for_like').innerText.trim();
                        Name = document.getElementById('B_card').querySelector('.details').querySelector('h1').innerText;
                        // console.log(Name);
                        fetch('/like', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ adder, Name, username, current_user: localStorage.getItem('current_user') }),
                        })
                            .then(response => response.json())
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                    })
                })
                //like on pressing space_bar
                document.addEventListener('keydown', function (event) {
                    if (event.key == ' ') {
                        document.getElementById('B_card').querySelector('.heart').click();
                    }
                })

                var C_card = document.getElementById('C_card');
                var isMouseOverC = false;

                var hoverTimeoutC;
                C_card.addEventListener('mouseover', function () {
                    isMouseOverC = true;
                    hoverTimeoutC = setTimeout(function () {
                        // Check if the mouse is still over the div
                        if (isMouseOverC) {
                            C_card.click();
                            isMouseOverC = false;
                        }
                    }, 2000);
                });
                C_card.addEventListener('mouseout', function () {
                    isMouseOverC = false;
                    clearTimeout(hoverTimeoutC);
                });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });
    document.querySelector('.filter_icon').addEventListener('click', function () {
        container = document.getElementById('filter_container')
        if (container.classList.contains('filter_menu')) {
            container.classList.remove('filter_menu');
        }
        else {
            container.classList.add('filter_menu');
        }
    })
    document.getElementById('apply_filter').addEventListener('click', function () {
        filter = {
            gender: [],
            year_of_study: [],
            age: [],
            nAge: [],
            interest: [],
            hobby: [],
        }
        document.querySelectorAll('.filter_check').forEach(checkbox => {
            // console.log(checkbox.childNodes)
            c = checkbox.childNodes[1]
            if (c.checked) {
                filter[c.name].push(c.value);
            }
        })
        for (let age of filter.age) {
            if (age.includes('-')) {
                a = age.split('-');
                filter.nAge.push(a[0]);
                filter.nAge.push(a[1]);
            }
        }
        if (filter.age.includes('lt15')) {
            filter.nAge.push('lt15');
        }
        if (filter.age.includes('gt26')) {
            filter.nAge.push('gt26');
        }
        if (filter.age.includes('AnyAge')) {
            filter.nAge.push('AnyAge');
        }
        console.log(filter);
        localStorage.setItem('filter', JSON.stringify(filter));
        //reload the document
        document.querySelector('.filter_icon').click();
        location.reload();
    })
    document.getElementById('clear_filter').addEventListener('click', function () {
        localStorage.removeItem('filter');
        location.reload();
    })
}

function matching_score_and_update() {
    let bestMatch = null;
    gender = currentStudentData.Gender;
    if (!localStorage.getItem('match_type')) {
        if (gender === 'Male') {
            document.querySelectorAll('.options_gender')[2].click();
        }
        else if (gender === 'Female') {
            document.querySelectorAll('.options_gender')[1].click();
        }
        else {
            document.querySelectorAll('.options_gender')[0].click();
        }
    }
    console.log(localStorage)
    fetch('students.json')
        .then(response => response.json())
        .then(json => {
            let maxScore = 0;
            for (let student of json) {
                if (localStorage.getItem('match_type') === 'All') {
                } else if (localStorage.getItem('match_type') != student.Gender) {
                    continue;
                }
                let score = 0;
                let score_list = [];
                // yos_max_score = 10
                score += Math.max(10 - Math.abs(student['Year of Study'][0] - currentStudentData['Year of Study'][0]) * 2, 0);
                score_list.push(score);
                //Age_max_score = 10
                score += Math.max(10 - (student.Age - currentStudentData.Age) * 2, 0);
                score_list.push(score);

                //Interests_Score
                let n1 = currentStudentData.Interests.length;
                let n2 = student.Interests.length;
                let f1 = n2 / (n1 + n2);
                let f2 = n1 / (n2 + n1);
                increase = (20 * f1) / n1 + (20 * f2) / n2;
                for (let interest of student.Interests) {
                    if (currentStudentData.Interests.includes(interest)) {
                        score += increase;
                    }
                }
                score_list.push(score);

                n1 = currentStudentData.Hobbies.length;
                n2 = student.Hobbies.length;
                f1 = n2 / (n1 + n2);
                f2 = n1 / (n2 + n1);
                increase = (20 * f1) / n1 + (20 * f2) / n2;
                for (let hobby of student.Hobbies) {
                    if (currentStudentData.Hobbies.includes(hobby)) {
                        score += increase;
                    }
                }
                score_list.push(score);

                if (student['IITB Roll Number'] == currentStudentData['IITB Roll Number'] || student.username == currentStudentData.username) {
                    score = 0;
                }
                console.log(student.Name, score);
                // console.log(score_list);
                maxScore = Math.max(maxScore, score);
                if (score == maxScore) {
                    bestMatch = student;
                }
            }
            return bestMatch;
        })
        .then(bestMatch => {
            console.log(bestMatch)
            console.log(currentStudentData)
            normal_details = document.getElementsByClassName('normal_details')[0]
            normal_details.innerHTML = `
                    <div class="info_match">
                        <u>Personal-Information:</u>
                    </div>
                    <div class="info_match">
                        &bull; In ${bestMatch['Year of Study']} year of college
                    </div>
                    <div class="info_match">
                        &bull; ${bestMatch.Age} years old
                    </div>
                    <div class="info_match">
                        &bull; <u>Interests:</u>
                    </div>
                    <div class="info_match">
                        ${bestMatch.Interests.join(', ')}
                    </div>
                    <div class="info_match">
                        &bull; <u>Hobbies:</u> 
                    </div>
                    <div class="info_match">
                        ${bestMatch.Hobbies.join(', ')}
                    </div>
            `
            document.getElementById('Name_match').innerText = bestMatch.Name;
            document.getElementById('img_match').src = bestMatch.Photo;
        })
}
//returning best match
if (document.URL.includes('match.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        let pcm = document.getElementsByClassName('photo_container_match')[0]
        pcm.style.width = pcm.offsetHeight + 'px';
        let right_match_container = document.getElementsByClassName('right_match_container')[0];
        let details_match = document.getElementsByClassName('details_match')[0];
        details_match.style.width = (right_match_container.offsetWidth - pcm.offsetWidth) + 'px';
    });
    if (localStorage.getItem('registration') == 'false') {
        alert('Please fill your Personal Details first to find a match.');
        window.location.href = 'dating.html';
    }
    else {
        fetch('students.json')
            .then(response => response.json())
            .then(json => {
                for (let student of json) {
                    if (student.username == localStorage.getItem('current_user')) {
                        currentStudentData = student;
                        break;
                    }
                }
            })
            .then(() => {
                matching_score_and_update();
            })
    }
}
function matchTypeCheck() {
    document.querySelectorAll('.options_gender').forEach(option => {
        option.addEventListener('click', () => {
            localStorage.setItem('match_type', option.id);
            document.querySelectorAll('.options_gender').forEach(o => {
                o.classList.remove('bordered_gender');
            });
            option.classList.add('bordered_gender');
        });
    })
    if (localStorage.getItem('match_type')) {
        document.querySelectorAll('.options_gender').forEach(option => {
            if (option.id == localStorage.getItem('match_type')) {
                option.click();
            }
        });
    }
}

const usernameDiv = document.getElementById('usernameDiv');
if (usernameDiv) {
    if (!localStorage.getItem('current_user')) {
        window.location.href = 'login.html';
    }
    usernameDiv.innerHTML =
        `
        ${localStorage.getItem('current_user')} `;
    document.getElementById('find_a_match_menu').addEventListener('click', () => {
        if (localStorage.registration == 'true') {
            window.location.href = 'match.html';
        }
        else {
            alert('Please fill your Personal Details first to find a match.');
        }
    });
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('current_user');
        localStorage.removeItem('registration');
        localStorage.removeItem('change');
        localStorage.removeItem('filter');
        localStorage.removeItem('match_type');
        localStorage.setItem('filesCorrect', false);
        window.location.href = 'login.html';
    });
    document.addEventListener('DOMContentLoaded', function () {
        if (localStorage.getItem('registration') == 'false') {
            document.getElementById('change_details').innerText = 'Enter Personal Details';
        }
    });
    document.getElementById('change_details').addEventListener('click', () => {
        window.location.href = 'dating.html';
    });
    document.getElementById('scroll_or_swipe_menu').addEventListener('click', () => {
        window.location.href = 'scroll_or_swipe.html';
    });
    document.getElementById('change_username').addEventListener('click', () => {
        localStorage.setItem('change', 'username');
        window.location.href = 'change.html';
    })
    document.getElementById('change_password').addEventListener('click', () => {
        localStorage.setItem('change', 'password');
        window.location.href = 'change.html';
    });
    matchTypeCheck();
}

if (document.URL.includes('change.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        if (localStorage.getItem('change') == 'username') {
            document.getElementById('change_username_ch').style.visibility = 'visible';
            document.getElementById('change_password_ch').style.visibility = 'hidden';
        }
        else if (localStorage.getItem('change') == 'password') {
            document.getElementById('change_username_ch').style.visibility = 'hidden';
            document.getElementById('change_password_ch').style.visibility = 'visible';
        }
    });
    document.getElementById('submitUsernameCh').addEventListener('click', () => {
        new_username = document.getElementById('new_username').value;
        if (new_username.length < 5) {
            alert('Username should be atleast 5 characters long');
            return;
        }
        fetch('/changeUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldUsername: localStorage.getItem('current_user'), newUsername: new_username }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.change == 'done') {
                    alert('Username changed successfully');
                    localStorage.setItem('current_user', new_username);
                    window.location.href = 'scroll_or_swipe.html';
                } else if (data.change == 'exists') {
                    alert('Username already exists');
                }
                else {
                    alert('Username change failed');
                }
            })
    });
    document.getElementById('submitPasswordCh').addEventListener('click', () => {
        new_password = document.getElementById('new_password_change').value;
        old_password = document.getElementById('old_password_change').value;
        confirm_password = document.getElementById('confirm_new_password_change').value;
        if (new_password.length < 8) {
            alert('Password should be atleast 8 characters long');
            return;
        }
        else if (new_password !== confirm_password) {
            alert('Passwords do not match');
            return;
        }
        else {
            fetch('/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: localStorage.getItem('current_user'), newPassword: new_password, oldPassword: old_password }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.change == 'done') {
                        alert('Password changed successfully. Please login again.');
                        localStorage.removeItem('current_user');
                        localStorage.removeItem('registration');
                        localStorage.removeItem('change');
                        localStorage.removeItem('match_type');
                        localStorage.removeItem('filter');
                        window.location.href = 'login.html';
                    }
                    else if (data.change == 'wrong') {
                        alert('Old password is wrong');
                    }
                    else {
                        alert('Password change failed');
                    }
                })
        }
    });
}