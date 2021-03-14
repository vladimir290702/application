const routes = {
    'loginStudent': 'login-form-student',
    'loginTeacher': 'login-form-teacher',
    'registerStudent': 'register-form-student',
    'registerTeacher': 'register-form-teacher',
    'start': 'option-form',
    'studentHome': 'student-home-form',
    'teacherHome': 'teacher-home-form',
    'selectStudent': 'search-student-home',
}

const router = (path) => {
    const app = document.getElementById('app');

    let templateData = authService.userData();
    let studentNames = noteService.studentNames();
    let gradeData = JSON.parse(localStorage.getItem('grades'));

    templateData.data = gradeData;
    templateData.names = studentNames;

    if (path === 'logout') {
        localStorage.removeItem('auth');
        localStorage.removeItem('names');
        return navigate('start');
    }

    const template = Handlebars.compile(document.getElementById(routes[path]).innerHTML);
    app.innerHTML = template(templateData);
}

const navigate = (path) => {
    history.pushState({}, "", path);
    router(path);
}

function navigateHandler(e) {
    e.preventDefault();

    if (e.target.tagName != 'A') {
        return;
    }

    let url = new URL(e.target.href);
    navigate(url.pathname.slice(1));
}