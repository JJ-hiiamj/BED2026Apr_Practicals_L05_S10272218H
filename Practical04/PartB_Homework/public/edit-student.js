const editStudentForm = document.getElementById("editStudentForm");
const loadingMessageDiv = document.getElementById("loadingMessage");
const messageDiv = document.getElementById("message");
const studentIdInput = document.getElementById("studentId");
const editNameInput = document.getElementById("editName");
const editAddressInput = document.getElementById("editAddress");
const apiBaseUrl = "http://localhost:3000";

function getStudentIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchStudent(id) {
  const response = await fetch(`${apiBaseUrl}/students/${id}`);
  if (!response.ok) {
    const errorBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { error: response.statusText };
    throw new Error(errorBody.error || `HTTP ${response.status}`);
  }
  return response.json();
}

function populateForm(student) {
  studentIdInput.value = student.id;
  editNameInput.value = student.name;
  editAddressInput.value = student.address || "";
  loadingMessageDiv.style.display = "none";
  editStudentForm.style.display = "block";
}

async function initEditPage() {
  const id = getStudentIdFromUrl();
  if (!id) {
    loadingMessageDiv.textContent = "No student ID provided in URL.";
    messageDiv.textContent = "Use edit-student.html?id=<studentId>";
    messageDiv.style.color = "orange";
    return;
  }

  try {
    const student = await fetchStudent(id);
    populateForm(student);
  } catch (error) {
    loadingMessageDiv.textContent = "Failed to load student data.";
    messageDiv.textContent = error.message;
    messageDiv.style.color = "red";
  }
}

editStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = studentIdInput.value;
  const payload = {
    name: editNameInput.value.trim(),
    address: editAddressInput.value.trim(),
  };

  try {
    const response = await fetch(`${apiBaseUrl}/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : {};

    if (response.status === 200) {
      messageDiv.textContent = "Student updated successfully.";
      messageDiv.style.color = "green";
      setTimeout(() => {
        window.location.href = "students.html";
      }, 700);
      return;
    }

    if (response.status === 400) {
      messageDiv.textContent =
        responseBody.error || "Validation failed. Please check your input.";
      messageDiv.style.color = "orange";
      return;
    }

    if (response.status === 404) {
      messageDiv.textContent = responseBody.error || "Student not found.";
      messageDiv.style.color = "red";
      return;
    }

    messageDiv.textContent =
      responseBody.error || `Unexpected error (${response.status}).`;
    messageDiv.style.color = "red";
  } catch (error) {
    messageDiv.textContent = `Network error: ${error.message}`;
    messageDiv.style.color = "red";
  }
});

window.addEventListener("load", initEditPage);
