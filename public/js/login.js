/*eslint-disable */

const login = async function (email, password) {
  try {
    const res = await axios({
      method: "POST",
      url: "127.0.0.1:3000/api/v1/users/login",
      data: {
        email,
        password,
      },
      withCredentials: true,
    });

    console.log(res);
  } catch (err) {
    console.log(err.message);
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  console.log("hi");
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});
