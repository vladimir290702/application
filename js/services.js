const apiKey = `AIzaSyDYVhAy3LY_3JP2KpQdbl8mPHnn4pfNgvE`;
const databaseURL = `https://shkolo-1ef2c-default-rtdb.firebaseio.com/`;

const authService = {
    async loginStudent(email, password) {
        let response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        let data = await response.json();

        let dbResponse = await fetch(`${databaseURL}-students.json`)

        let dbData = await dbResponse.json();

        for (const key in dbData) {
            let students = dbData[key]
            for (const student in students) {
                let searchedStudentEmail = students[student].email;
                let name = students[student].name;
                let searchedStudent = student;
                let studentId = data.localId;

                if (searchedStudentEmail === email && searchedStudent === studentId) {
                    let gradeData = students[student].grades;
                    localStorage.setItem('grades', JSON.stringify(gradeData));

                    dbData.name = name;
                    localStorage.setItem('auth', JSON.stringify({ name, localId: data.localId }));
                    return
                }
            }
        }
    },
    async registerStudent(email, password, rePassword, grade, name) {
        if (password !== rePassword) {
            return;
        }

        let response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email, password, grade, name }),
        })

        let data = await response.json();

        let { localId } = data;

        localStorage.setItem('auth', JSON.stringify({ localId, name }));

        const grades = {
            Bulgarian: '',
            Math: '',
            German: '',
            IT: '',
            Biology: '',
            Physic: '',
            English: '',
            Geography: '',
            History: '',
            Russian: '',
        }
        
        let responseDB = await fetch(`${databaseURL}-students.json`, {
            method: 'POST',
            body: JSON.stringify({
                [localId]: {
                    grade,
                    email,
                    name,
                    grades
                }
            }),
        });

        let dataDB = await responseDB.json();
        return dataDB;
    },
    userData() {
        try {
            const data = JSON.parse(localStorage.getItem('auth'));

            return {
                name: data.name,
                localId: data.localId,
            }
        } catch (error) {
            return {
                name: '',
            }
        }
    },
    async loginTeacher(email, password) {
        let response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        let data = await response.json();

        let dbResponse = await fetch(`${databaseURL}-teachers.json`)

        let dbData = await dbResponse.json();

        for (const key in dbData) {
            let teachers = dbData[key]
            for (const teacher in teachers) {
                let searchedTeacher = teachers[teacher].email;
                let name = teachers[teacher].name;
                let subject = teachers[teacher].subject;
                if (searchedTeacher === email) {
                    dbData.name = name;
                    localStorage.setItem('auth', JSON.stringify({ name, localId: data.localId, subject }));
                    return;
                }
            }
        }
    },
    async registerTeacher(email, password, rePassword, subject, name) {
        if (password !== rePassword) {
            return;
        }

        let response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email, password, subject, name }),
        })

        let data = await response.json();

        let { localId } = data;

        localStorage.setItem('auth', JSON.stringify({ localId, name, subject }));

        let responseDB = await fetch(`${databaseURL}-teachers.json`, {
            method: 'POST',
            body: JSON.stringify({
                [localId]: {
                    subject,
                    email,
                    name
                }
            }),
        });

        let dataDB = await responseDB.json();
        return dataDB;
    },
}

const noteService = {
    async filterClasses(grade) {
        let response = await fetch(`${databaseURL}-students.json`);
        let data = await response.json();

        let studentNames = [];

        for (const key in data) {
            let student = data[key];

            for (const x in student) {
                if (student[x].grade === grade) {
                    let studentName = student[x].name;
                    let studentId = x;
                    studentNames.push({ name: studentName, id: studentId })
                }
            }
        }

        localStorage.setItem('names', JSON.stringify(studentNames));

    },
    studentNames() {
        const names = JSON.parse(localStorage.getItem('names'));

        if (names) {
            names.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }

        return names;
    },
    async addNote(id, note, subject) {
        let response = await fetch(`${databaseURL}-students.json`);
        let data = await response.json();

        let studentGrades = [];

        for (const key in data) {
            let students = data[key]
            for (const student in students) {
                if (id === student) {
                    let studentData = students[student];

                    if (studentData.grades[subject] === '') {
                        studentGrades.push(note);
                        studentData.grades[subject] = studentGrades;
                    } else {
                        studentData.grades[subject].push(note);
                    }

                    fetch(`https://shkolo-1ef2c-default-rtdb.firebaseio.com/-students/${key}/${id}.json`, {
                        method: "PATCH",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(studentData)
                    })
                }
            }
        }
    },
}
