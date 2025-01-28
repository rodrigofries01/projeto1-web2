import { apiCall, setAuthToken, showNotification } from "./utils.js";

class Auth {
  static async login(email, password) {
    try {
      const response = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.token) {
        setAuthToken(response.token);
        const userType = response.userType;

        // Redirect based on user type
        if (userType === "ADMIN") {
          window.location.href = "/public/admin-dashboard.html";
        } else if (userType === "STUDENT") {
          window.location.href = "/public/student-dashboard.html";
        }
      }
    } catch (error) {
      showNotification("Login falhou. Verifique suas credenciais.", "error");
      throw error;
    }
  }

  static logout() {
    localStorage.removeItem("user");
    window.location.href = "/public/login.html";
  }

  static checkAuth() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/public/login.html";
      return false;
    }
    return true;
  }
}

// Initialize login form handler
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      try {
        await Auth.login(email, password);
      } catch (error) {
        console.error("Login error:", error);
      }
    });
  }

  // Initialize logout buttons
  const logoutButtons = document.querySelectorAll(".logout-btn");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      Auth.logout();
    });
  });
});

export default Auth;
