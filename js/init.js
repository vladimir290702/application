function startRouth() {
    localStorage.removeItem('auth');
    localStorage.removeItem('grades');
    localStorage.removeItem('names');
    navigate('start');
}

startRouth()

function loginStudentSubmit(e) {
    e.preventDefault();

    let inputs = document.querySelectorAll('.input');
    const email = inputs.item(0).value;
    const password = inputs.item(1).value;

    authService.loginStudent(email, password).then(res => navigate('studentHome'))
    
}

function registerStudentSubmit(e) {
    e.preventDefault();

    let inputs = document.querySelectorAll('input');
    const email = inputs.item(0).value;
    const password = inputs.item(1).value;
    const rePassword = inputs.item(2).value;
    const grade = document.getElementById('options').value;
    const name = inputs.item(3).value;

    authService.registerStudent(email, password, rePassword, grade, name).then(res => navigate('loginStudent'))
}

function loginTeacherSubmit(e) {
    e.preventDefault();

    let inputs = document.querySelectorAll('.input');
    const email = inputs.item(0).value;
    const password = inputs.item(1).value;

    authService.loginTeacher(email, password).then(res => navigate('teacherHome'))

}

function registerTeacherSubmit(e) {
    e.preventDefault();

    let inputs = document.querySelectorAll('input');
    const email = inputs.item(0).value;
    const password = inputs.item(1).value;
    const rePassword = inputs.item(2).value;
    const subject = document.getElementById('options').value;
    const name = inputs.item(3).value;

    authService.registerTeacher(email, password, rePassword, subject, name).then(res => navigate('teacherHome'))
}

function searchClass(e) {
    e.preventDefault();

    let searchedClass = document.getElementById('filterClass').value;
    noteService.filterClasses(searchedClass).then(x => navigate('selectStudent'))
}

function submitNote(e) {
    e.preventDefault();

    let student = document.getElementById('selectedStudent');
    let id = student.options[student.selectedIndex].id;
    let note = document.getElementById('selectedNote').value;

    let teacherSubject = JSON.parse(localStorage.getItem('auth')).subject;

    noteService.addNote(id, note, teacherSubject).then(res => {
        localStorage.removeItem('auth');
        localStorage.removeItem('names');
        navigate('logout');
    })
}