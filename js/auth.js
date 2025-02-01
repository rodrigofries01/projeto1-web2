import { apiCall, setAuthToken, showNotification } from "./utils.js";

class Auth {
  static async login(tf_email, tf_password) {
    try {
      const response = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({ tf_email, tf_password }),
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
      const tf_email = document.getElementById("tf_email").value;
      const tf_password = document.getElementById("tf_password").value;
      try {
        await Auth.login(tf_email, tf_password);
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
