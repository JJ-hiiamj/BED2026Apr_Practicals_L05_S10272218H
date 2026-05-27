const createStudentForm = document.getElementById("createStudentForm");
const messageDiv = document.getElementById("message");
const apiBaseUrl = "http://localhost:3000";

createStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    address: document.getElementById("address").value.trim(),
  };

  try {
    const response = await fetch(`${apiBaseUrl}/students`, {
      method: "POST",
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

    if (response.status === 201) {
      messageDiv.textContent = "Student created successfully.";
      messageDiv.style.color = "green";
      createStudentForm.reset();
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

    messageDiv.textContent =
      responseBody.error || `Unexpected error (${response.status}).`;
    messageDiv.style.color = "red";
  } catch (error) {
    messageDiv.textContent = `Network error: ${error.message}`;
    messageDiv.style.color = "red";
  }
});
