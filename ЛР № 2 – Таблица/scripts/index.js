const container = document.querySelector(".container");
const studentsTable__tbody = document.querySelector(".studentsTable__tbody");
const addStudent__form = document.querySelector(".addStudent__form"); 
const addStudent__form__button = document.querySelector(".addStudent__form__button");
const pageSizeInput = document.querySelector("#pageSize");  
const paginationContainer = document.querySelector("#pagination");

let students = JSON.parse(localStorage.getItem('students')) || [];
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
let pageSize = parseInt(localStorage.getItem('pageSize')) || 5; 

function renderStudents(studentsPage) {
    studentsTable__tbody.innerHTML = '';

    studentsPage.forEach((student, index) => {
        let tr = document.createElement("tr");
        tr.className = "studentsTable__tr";

        let tdLastName = document.createElement("td");
        tdLastName.className = "studentsTable__td";
        tdLastName.innerHTML = student.lastName;
        tr.appendChild(tdLastName);

        let tdFirstName = document.createElement("td");
        tdFirstName.className = "studentsTable__td";
        tdFirstName.innerHTML = student.firstName;
        tr.appendChild(tdFirstName);

        let tdMiddleName = document.createElement("td");
        tdMiddleName.className = "studentsTable__td";
        tdMiddleName.innerHTML = student.middleName;
        tr.appendChild(tdMiddleName);

        let tdDateOfBirth = document.createElement("td");
        tdDateOfBirth.className = "studentsTable__td";
        const date = new Date(student.dateOfBirth);
        const formattedDate = date.getDate().toString().padStart(2, '0') + '.' +
                              (date.getMonth() + 1).toString().padStart(2, '0') + '.' +
                              date.getFullYear();
        tdDateOfBirth.innerHTML = formattedDate;
        tr.appendChild(tdDateOfBirth);

        let tdGroup = document.createElement("td");
        tdGroup.className = "studentsTable__td";
        tdGroup.innerHTML = student.group;
        tr.appendChild(tdGroup);

        let tdAverageScore = document.createElement("td");
        tdAverageScore.className = "studentsTable__td";
        tdAverageScore.innerHTML = student.averageScore.toFixed(2);
        tr.appendChild(tdAverageScore);

        let delTd = document.createElement("td");
        delTd.className = "studentsTable__td";
        let delBtn = document.createElement("button");
        delBtn.className = "btn btn-danger delBtn";
        delBtn.innerHTML = "Удалить";

        delBtn.addEventListener("click", () => {
            students.splice(index + (currentPage - 1) * pageSize, 1);
            updatePagination(); // Обновляем отображение после удаления
        });

        delTd.appendChild(delBtn);
        tr.appendChild(delTd);

        studentsTable__tbody.appendChild(tr);
    });
}

function paginateStudents() {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, students.length);
    return students.slice(startIndex, endIndex);
}

function renderPaginationControls() {
    const totalPages = Math.ceil(students.length / pageSize);
    paginationContainer.innerHTML = '';

    const paginationList = document.createElement("ul");
    paginationList.className = "pagination justify-content-center";

    const prevButton = document.createElement("li");
    prevButton.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    const prevLink = document.createElement("a");
    prevLink.className = "page-link";
    prevLink.href = "#";
    prevLink.innerText = "Предыдущая";
    prevButton.appendChild(prevLink);
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });
    paginationList.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
        const pageLink = document.createElement("a");
        pageLink.className = "page-link";
        pageLink.href = "#";
        pageLink.innerText = i;
        pageLink.addEventListener("click", () => {
            currentPage = i;
            updatePagination();
        });
        pageItem.appendChild(pageLink);
        paginationList.appendChild(pageItem);
    }

    const nextButton = document.createElement("li");
    nextButton.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    const nextLink = document.createElement("a");
    nextLink.className = "page-link";
    nextLink.href = "#";
    nextLink.innerText = "Следующая";
    nextButton.appendChild(nextLink);
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });
    paginationList.appendChild(nextButton);

    paginationContainer.appendChild(paginationList);
}

function updatePagination() {
    const studentsPage = paginateStudents();
    renderStudents(studentsPage);
    renderPaginationControls();
    checkStudents();
    saveToLocalStorage(); // Сохраняем состояние в localStorage
}

function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('currentPage', currentPage);
    localStorage.setItem('pageSize', pageSize);
}

function checkStudents() {
    const noStudentsElement = document.querySelector('.alert__noStudents');

    if (students.length > 0) {
        if (noStudentsElement) {
            noStudentsElement.remove();
        }
    } else {
        if (!noStudentsElement) {
            let noStudents = document.createElement("h1");
            noStudents.className = "alert__noStudents";
            noStudents.innerHTML = "Ни одного студента не найдено"; 
            container.insertBefore(noStudents, paginationContainer);
        }
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

addStudent__form__button.addEventListener('click', async function (event) {
    event.preventDefault();

    let formData = new FormData(addStudent__form);
    let firstName = formData.get('FirstName').trim();
    console.log(firstName);
    let lastName = formData.get('LastName').trim();
    console.log(lastName);
    let middleName = formData.get('MiddleName').trim();
    console.log(middleName);
    let dateOfBirthInput = formData.get('DateOfBirth');
    let group = formData.get('Group').trim();
    let averageScore = parseFloat(formData.get('AverageScore'));

    // Проверка всех полей
    if (!firstName || !lastName || !middleName || !dateOfBirthInput || !group || isNaN(averageScore)) {
        alert('Заполните все поля');
        return;
    }

    // Проверка на буквы в фамилии, имени и отчестве
    if (!/^[A-Za-zА-Яа-яЁё]+$/.test(firstName) || 
        !/^[A-Za-zА-Яа-яЁё]+$/.test(lastName) || 
        !/^[A-Za-zА-Яа-яЁё]+$/.test(middleName)) {
        alert('Имя, фамилия и отчество должны содержать только буквы');
        return;
    }

    // Проверка даты рождения
    let dateOfBirth = new Date(dateOfBirthInput);
    let minDate = new Date('1900-01-01');
    let maxDate = new Date('2010-01-01');

    if (dateOfBirth < minDate || dateOfBirth > maxDate) {
        alert('Дата рождения должна быть между 01.01.1900 и 01.01.2010');
        return;
    }

    // Проверка среднего балла
    if (averageScore < 2.00 || averageScore > 5.00) {
        alert('Средний балл должен быть в диапазоне от 2.00 до 5.00');
        return;
    }

    // Форматирование имен
    firstName = capitalize(firstName);
    lastName = capitalize(lastName);
    middleName = capitalize(middleName);

    // Создание объекта студента
    let student = {
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        dateOfBirth: dateOfBirth.toISOString(),
        group: group,
        averageScore: averageScore
    };

    // Добавление студента в массив
    students.push(student); 
    updatePagination(); // Обновляем отображение после добавления студента
    addStudent__form.reset(); // Сбрасываем форму
});

// Обработчик для изменения размера страницы
pageSizeInput.addEventListener('change', (event) => {
    pageSize = parseInt(event.target.value) || 5; // Считываем новое значение pageSize
    currentPage = 1; // Сбрасываем на первую страницу при изменении размера
    updatePagination(); // Обновляем отображение
});

// Инициализация пагинации при загрузке страницы
updatePagination();
