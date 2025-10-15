/*eslint-disable*/
const login = async function (email, password) {
  try {
    const res = await axios.post("/api/v1/users/login", { email, password });
    console.log("Login success:", res.data);
  } catch (err) {
    console.log("Login error:", err.response ? err.response.data : err.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Submitting:", email, password);
    login(email, password);
  });
});
