const studentsListDiv = document.getElementById("studentsList");
const fetchStudentsBtn = document.getElementById("fetchStudentsBtn");
const messageDiv = document.getElementById("message");
const apiBaseUrl = "http://localhost:3000";

async function fetchStudents() {
  try {
    studentsListDiv.innerHTML = "Loading students...";
    messageDiv.textContent = "";

    const response = await fetch(`${apiBaseUrl}/students`);
    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { error: response.statusText };
      throw new Error(errorBody.error || `HTTP ${response.status}`);
    }

    const students = await response.json();
    studentsListDiv.innerHTML = "";

    if (students.length === 0) {
      studentsListDiv.innerHTML = "<p>No students found.</p>";
      return;
    }

    students.forEach((student) => {
      const studentCard = document.createElement("div");
      studentCard.className = "student-item";
      studentCard.setAttribute("data-student-id", student.id);
      studentCard.innerHTML = `
        <h3>${student.name}</h3>
        <p>ID: ${student.id}</p>
        <p>Address: ${student.address || "-"}</p>
        <div class="student-actions">
          <button class="view-btn" data-id="${student.id}">View</button>
          <button class="edit-btn" data-id="${student.id}">Edit</button>
          <button class="delete-btn" data-id="${student.id}">Delete</button>
        </div>
      `;
      studentsListDiv.appendChild(studentCard);
    });

    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        const id = event.target.getAttribute("data-id");
        await viewStudent(id);
      });
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const id = event.target.getAttribute("data-id");
        window.location.href = `edit-student.html?id=${id}`;
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        const id = event.target.getAttribute("data-id");
        await deleteStudent(id);
      });
    });
  } catch (error) {
    studentsListDiv.innerHTML = "";
    messageDiv.textContent = `Failed to load students: ${error.message}`;
    messageDiv.style.color = "red";
  }
}

async function viewStudent(id) {
  try {
    const response = await fetch(`${apiBaseUrl}/students/${id}`);
    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { error: response.statusText };
      throw new Error(errorBody.error || `HTTP ${response.status}`);
    }

    const student = await response.json();
    alert(
      `Student Details\n\nID: ${student.id}\nName: ${student.name}\nAddress: ${
        student.address || "-"
      }`
    );
  } catch (error) {
    messageDiv.textContent = `Failed to view student: ${error.message}`;
    messageDiv.style.color = "red";
  }
}

async function deleteStudent(id) {
  const ok = confirm(`Delete student with ID ${id}?`);
  if (!ok) return;

  try {
    const response = await fetch(`${apiBaseUrl}/students/${id}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      const card = document.querySelector(`[data-student-id="${id}"]`);
      if (card) card.remove();
      messageDiv.textContent = "Student deleted successfully.";
      messageDiv.style.color = "green";
      return;
    }

    const errorBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { error: response.statusText };

    throw new Error(errorBody.error || `Delete failed with ${response.status}`);
  } catch (error) {
    messageDiv.textContent = `Failed to delete student: ${error.message}`;
    messageDiv.style.color = "red";
  }
}

fetchStudentsBtn.addEventListener("click", fetchStudents);
window.addEventListener("load", fetchStudents);
