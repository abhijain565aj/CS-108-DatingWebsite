const http = require('http');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
//Multer, a middleware for handling multipart/form-data, which is primarily used for uploading files. Reqquired for the photo upload to the folder portion of the code.


const port = 3000; // Choose any port number you prefer

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/authenticate') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            authenticateUser(username, password, res);
        });
    }
    else if (req.method === 'POST' && req.url === '/authenticateUsername') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username } = JSON.parse(body);
            usernameAuthenticator(username, res);
        });
    }
    else if (req.method === 'POST' && req.url === '/checkAnswer') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username, answer } = JSON.parse(body);
            checkAnswer(username, answer, res);
        });
    }
    else if (req.method === 'POST' && req.url === '/userExists') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username } = JSON.parse(body);
            usernameAuthenticator(username, res);
        });
    }
    else if (req.method === 'POST' && req.url === '/register') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const user = JSON.parse(body);
            fs.readFile('login.json', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    const users = JSON.parse(data);
                    users.push(user);
                    fs.writeFile('login.json', JSON.stringify(users), (err) => {
                        if (err) {
                            res.end(JSON.stringify({ registration: false }));
                            console.log(err);
                        } else {
                            res.end(JSON.stringify({ registration: true }));
                        }
                    });
                }
            });
        });
    }
    // Upload image to destination folder
    else if (req.method === 'POST' && req.url === '/upload') {
        upload(req, res, (err) => {
            if (err) {
                console.error(err);
                return res.end(JSON.stringify({ message: 'Error uploading file.' }));
            }
            if (!req.file) {
                return res.end(JSON.stringify({ message: 'No file uploaded.' }));
            }
            // console.log(req.newFileName);
            res.end(JSON.stringify({ message: 'File uploaded and saved successfully.', fileName: req.newFileName }));
        });
    }
    else if (req.method === 'POST' && req.url === '/submitDating') { //submit things in JSON file
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            // console.log(body);
            const student = JSON.parse(body);
            console.log(student);
            fs.readFile('students.json', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    const students = JSON.parse(data);
                    already = false;
                    for (let i = 0; i < students.length; i++) {
                        if (students[i].username === student.username) {
                            students[i] = student;
                            already = true;
                            break;
                        }
                    }
                    if (!already) {
                        students.push(student);
                    }
                    fs.writeFile('students.json', JSON.stringify(students), (err) => {
                        if (err) {
                            res.end(JSON.stringify({ registration: false }));
                            console.log(err);
                        } else {
                            fs.readFile('login.json', (err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    users = JSON.parse(data);
                                    for (let i = 0; i < users.length; i++) {
                                        if (users[i].username === student.username) {
                                            users[i].registration = true;
                                            break;
                                        }
                                    }
                                    fs.writeFile('login.json', JSON.stringify(users), (err) => {
                                        if (err) {
                                            res.end(JSON.stringify({ registration: false }));
                                            console.log(err);
                                        }
                                    });
                                }
                            });
                            res.end(JSON.stringify({ registration: true }));
                        }
                    });
                }
            });
        });
    }
    else if (req.method === 'POST' && req.url === '/recheckJson') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Refining Old JSON Files');
            fileChecker(res);
        });
    }
    else if (req.method === 'POST' && req.url === '/changeUsername') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { oldUsername, newUsername } = JSON.parse(body);
            //creating a promise for username check
            // console.log('usernames', oldUsername, newUsername);
            let usernameCheck = new Promise((resolve, reject) => {
                fs.readFile('login.json', (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        const users = JSON.parse(data);
                        for (let user of users) {
                            if (user.username === newUsername) {
                                user.username = newUsername;
                                res.end(JSON.stringify({ change: 'exists' }));
                                reject('exists');
                                break;
                            }
                        }
                        resolve();
                    }
                });
            });
            //if username is not found, then change the username
            usernameCheck.then(() => {
                fs.readFile('login.json', (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        const users = JSON.parse(data);
                        for (let user of users) {
                            if (user.username === oldUsername) {
                                user.username = newUsername;
                                res.end(JSON.stringify({ change: 'done' }));
                                break;
                            }
                        }
                        fs.writeFile('login.json', JSON.stringify(users), (err) => {
                            if (err) {
                                res.end(JSON.stringify({ registration: false }));
                                console.log(err);
                            }
                        });
                    }
                });
                fs.readFile('students.json', (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        const students = JSON.parse(data);
                        for (let student of students) {
                            if (student.username === oldUsername) {
                                student.username = newUsername;
                                break;
                            }
                        }
                        fs.writeFile('students.json', JSON.stringify(students), (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    else if (req.method === 'POST' && req.url === '/changePassword') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username, newPassword, oldPassword } = JSON.parse(body);
            fs.readFile('login.json', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    const users = JSON.parse(data);
                    for (let user of users) {
                        if (user.username === username) {
                            if (user.password === oldPassword) {
                                user.password = newPassword;
                                fs.writeFile('login.json', JSON.stringify(users), (err) => {
                                    if (err) {
                                        res.end(JSON.stringify({ registration: false }));
                                        console.log(err);
                                    } else {
                                        res.end(JSON.stringify({ change: 'done' }));
                                    }
                                });
                                break;
                            }
                            else {
                                res.end(JSON.stringify({ change: 'wrong' }));
                                break;
                            }
                        }
                    }
                }
            });
        });
    }
    else if (req.method === 'POST' && req.url === '/like') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { adder, Name, username, current_user } = JSON.parse(body);
            // console.log('u', Name, username, current_user);
            fs.readFile('students.json', (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    students = JSON.parse(data);
                    for (let i = 0; i < students.length; i++) {
                        if (students[i].username === username && students[i].Name === Name) {
                            students[i].likes += adder;
                            // console.log('l', students[i].likes);
                            break;
                        }
                    }
                    fs.writeFile('students.json', JSON.stringify(students), (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        });
    }
    else {
        // Serve static files
        let filePath = '.' + req.url;
        if (filePath === './') {
            filePath = './login.html';
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
        }[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('404 Not Found');
                } else {
                    res.writeHead(500);
                    res.end('500 Internal Server Error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data, 'utf-8');
            }
        });
    }
});

function authenticateUser(username, password, res) {
    fs.readFile('login.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const users = JSON.parse(data);
            let reg = false;
            let userFound = false;
            for (let user of users) {
                if (user.username === username && user.password === password) {
                    userFound = true;
                    reg = user.registration;
                    break;
                }
            }
            res.end(JSON.stringify({ authenticated: userFound, registration: reg }));
        }
    });
}
function usernameAuthenticator(username, res) {
    fs.readFile('login.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const users = JSON.parse(data);
            let userFound = false;
            let question = '';
            for (let user of users) {
                if (user.username === username) {
                    userFound = true;
                    question = user.secret_question;
                    break;
                }
            }
            res.end(JSON.stringify({ secretQuestion: question, authenticated: userFound }));
        }
    });
}
function checkAnswer(username, answer, res) {
    fs.readFile('login.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const users = JSON.parse(data);
            let userFound = false;
            pwd = '';
            for (let user of users) {
                if (user.username === username && user.secret_answer.toLowerCase() === answer.toLowerCase()) {
                    userFound = true;
                    pwd = user.password;
                    break;
                }
            }
            res.end(JSON.stringify({ password: pwd, authenticated: userFound }));
        }
    });
}
// Define Multer storage
const storage = multer.diskStorage({
    //multer.diskStorage is a function that determines how the uploaded files are stored. It takes an object with two properties: destination and filename.
    //cb = callback function
    destination: function (req, file, cb) {
        const destinationDir = path.join(__dirname, 'photos');
        cb(null, destinationDir);
    },
    filename: function (req, file, cb) {
        const originalFileName = file.originalname;
        const fileExtension = path.extname(originalFileName);
        const newFileName = req.headers['new-filename'] + fileExtension;
        req.newFileName = newFileName; // Add new file name to req object
        cb(null, newFileName);
    }
});
const upload = multer({ storage: storage }).single('file');
// .single('file'): This is a middleware function that processes a single file from the incoming request. The file should be available under the 'file' field in the form data.

function fileChecker(res) {
    let loginJsonUpdated = new Promise((resolve, reject) => {
        fs.readFile('login.json', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const users = JSON.parse(data);
                for (let user of users) {
                    if (!user.hasOwnProperty('registration')) {
                        user.registration = false;
                    }
                }
                //edit the file
                fs.writeFile('login.json', JSON.stringify(users), (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }
        }
        );
    }
    );
    let studentsJsonUpdated = new Promise((resolve, reject) => {
        fs.readFile('students.json', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const students = JSON.parse(data);
                for (let student of students) {
                    if (!student.hasOwnProperty('username')) {
                        student.username = 'N/A';
                    }
                    if (!student.hasOwnProperty('likes')) {
                        student.likes = 0;
                    }
                }
                //edit the file
                fs.writeFile('students.json', JSON.stringify(students), (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
    Promise.all([loginJsonUpdated, studentsJsonUpdated]).then(() => {
        res.end(JSON.stringify({ addition: true }));
    }).catch((err) => {
        res.end(JSON.stringify({ addition: false }));
    });
}
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
