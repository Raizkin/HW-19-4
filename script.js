const API_URL = "http://localhost:3000/students";


async function getStudents() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const students = await response.json();
    renderStudents(students);
  } catch (error) {
    console.error("Помилка при отриманні студентів:", error);
  }
}


async function addStudent(e) {
  e.preventDefault();

  const student = {
    name: document.getElementById("name").value,
    age: Number(document.getElementById("age").value),
    course: document.getElementById("course").value,
    skills: document.getElementById("skills").value
      .split(",")
      .map(s => s.trim()),
    email: document.getElementById("email").value,
    isEnrolled: document.getElementById("isEnrolled").checked
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    getStudents(); 
    document.getElementById("add-student-form").reset();
  } catch (error) {
    console.error("Помилка при додаванні студента:", error);
  }
}


async function updateStudent(id) {
  try {
    const newName = prompt("Введіть нове ім'я студента:");
    if (!newName) return;

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    getStudents();
  } catch (error) {
    console.error("Помилка при оновленні студента:", error);
  }
}


async function deleteStudent(id) {
  try {
    if (!confirm("Ви впевнені, що хочете видалити студента?")) return;

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    getStudents();
  } catch (error) {
    console.error("Помилка при видаленні студента:", error);
  }
}


function renderStudents(students) {
  const tbody = document.querySelector("#students-table tbody");
  tbody.innerHTML = "";

  students.forEach(student => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.course}</td>
      <td>${student.skills.join(", ")}</td>
      <td>${student.email}</td>
      <td>${student.isEnrolled ? "Так" : "Ні"}</td>
      <td>
        <button onclick="updateStudent(${student.id})">Оновити</button>
        <button onclick="deleteStudent(${student.id})">Видалити</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}


document.getElementById("get-students-btn").addEventListener("click", getStudents);
document.getElementById("add-student-form").addEventListener("submit", addStudent);