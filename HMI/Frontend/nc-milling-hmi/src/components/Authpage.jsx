import React, { useState } from "react";

const AuthPage = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isLoginView && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLoginView ? "/auth/login" : "/auth/register";
      const payload = isLoginView
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(payload)

      const data = await response.json();

      // ==========================================
      // CASE 1: BACKEND ERROR (!response.ok)
      // ==========================================
      if (!response.ok) {
        const errorMsg = data.message || data.error || "";

        // Check for invalid credentials (password or email format)
        const invalidCredErrors = [
          "wrong_credentials",
          "wrong_password",
          "invalid_email",
          "invalid_password",
        ];
        if (invalidCredErrors.includes(errorMsg) || response.status === 401) {
          throw new Error("Wrong password or email/username");
        }

        // Check for missing account (user, email, or username not found) -> Auto-switch to Register
        const notFoundErrors = [
          "user_not_found",
          "email_not_found",
          "username_not_found",
          "account_not_found",
        ];
        if (notFoundErrors.includes(errorMsg) || response.status === 404) {
          setErrorMessage("Account not found. Please register first.");
          setTimeout(() => {
            setIsLoginView(false); // Switch view
            setErrorMessage(""); // Clear error
            setIsLoading(false); // Stop loading
          }, 1500);
          return;
        }

        // Fallback for any other backend errors
        throw new Error(errorMsg || "An error occurred. Please try again.");
      }

      // ==========================================
      // CASE 2: BACKEND SUCCESS (200 OK)
      // ==========================================
      setIsLoading(false);

      if (isLoginView) {
        // LOGIN: Save token and proceed
        if (data.token) {
          localStorage.setItem("token", data.token);
          if (onLoginSuccess) onLoginSuccess();
        } else {
          setErrorMessage("Error: Missing token in response!");
        }
      } else {
        // REGISTER: Show success and switch to Login
        setSuccessMessage("Registration successful! Please login.");
        setIsLoginView(true);
        // Clear passwords for security
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isLoginView ? "CNC SYSTEM LOGIN" : "REGISTER NEW ACCOUNT"}
        </h2>

        {errorMessage && <div style={styles.error}>{errorMessage}</div>}
        {successMessage && <div style={styles.success}>{successMessage}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLoginView && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          {!isLoginView && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
          )}

          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? "PROCESSING..." : isLoginView ? "LOGIN" : "REGISTER"}
          </button>
        </form>

        <div style={styles.footer}>
          <span
            style={styles.toggleText}
            onClick={() => {
              setIsLoginView(!isLoginView);
              setErrorMessage("");
              setSuccessMessage("");
            }}
          >
            {isLoginView
              ? "No account? Click here to register"
              : "Already have an account? Login here"}
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#1e2128",
    fontFamily: "sans-serif",
  },
  card: {
    backgroundColor: "#2a2d35",
    padding: "40px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
  },
  title: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    color: "#a0aabf",
    fontSize: "12px",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  input: {
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #4a4d55",
    backgroundColor: "#1e2128",
    color: "#00ff88",
    outline: "none",
  },
  button: {
    padding: "14px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2962ff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  footer: { marginTop: "20px", textAlign: "center" },
  toggleText: {
    color: "#a0aabf",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  },
  error: {
    color: "#ff4d4f",
    backgroundColor: "#2a1e1e",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "16px",
    fontSize: "14px",
    textAlign: "center",
  },
  success: {
    color: "#00ff88",
    backgroundColor: "#1e2a22",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "16px",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default AuthPage;
