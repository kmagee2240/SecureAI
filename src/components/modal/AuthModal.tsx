import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Fieldset,
  Input,
  Label,
} from "@headlessui/react";

import { useCallback, useRef, useState } from "react";
import { useAuth } from "../../hook/useAuth";
import { colorScheme } from "../../types/color";
import { loginSchema, registerSchema } from "../../user/validation";
import { formatTimeLeft, sanitizeInput } from "../../helper";
import { loginUser, registerUser } from "../../user/controller";
import type { Role, User } from "../../user/model";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
}: ModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // Register-only fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<Role>("user");

  const failedAttempts = useRef(0);
  const lockoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const { login } = useAuth();

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setRole("user");
    setError("");
  };

  const startLockout = useCallback(() => {
    setIsLockedOut(true);
    setLockoutTimeLeft(Math.floor(LOCKOUT_DURATION_MS / 1000));

    countdownInterval.current = setInterval(() => {
      setLockoutTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    lockoutTimer.current = setTimeout(() => {
      failedAttempts.current = 0;
      setIsLockedOut(false);
      setError("");
    }, LOCKOUT_DURATION_MS);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedFirstName = sanitizeInput(firstName.trim());
    const sanitizedLastName = sanitizeInput(lastName.trim());

    // --- Zod validation (replaces manual isValidEmail / isValidPassword) ---
    if (mode === "register") {
      const parsed = registerSchema.safeParse({
        email: sanitizedEmail,
        password: sanitizedPassword,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        role,
      });
      if (!parsed.success) {
        setError(parsed.error.message);
        return;
      }
    } else {
      const parsed = loginSchema.safeParse({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });
      if (!parsed.success) {
        setError(parsed.error.message);
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      if (mode === "register") {
        const body: User = {
          email: sanitizedEmail,
          password: sanitizedPassword,
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          role,
        };

        // registerUser handles zod + validateUserShape + CSRF internally
        const res = await registerUser(body);

        if (!res.success) {
          setError(res.message);
          failedAttempts.current += 1;
          if (failedAttempts.current >= MAX_ATTEMPTS) startLockout();
          return;
        }

        // Role must come from server — never trust client-side role
        login(res.role as Role);
      } else {
        // loginUser handles rate-limit + zod + CSRF internally
        const res = await loginUser(sanitizedEmail, sanitizedPassword);

        if (!res.success) {
          // Pass through controller's lockout message if present
          setError(res.message);
          failedAttempts.current += 1;
          if (failedAttempts.current >= MAX_ATTEMPTS) startLockout();
          return;
        }

        login(res.role as Role);
      }

      failedAttempts.current = 0;
      onClose();
    } catch (err: unknown) {
      failedAttempts.current += 1;

      if (failedAttempts.current >= MAX_ATTEMPTS) {
        startLockout();
        setError(
          `Too many failed attempts. Please try again in ${Math.floor(
            LOCKOUT_DURATION_MS / 60000,
          )} minutes.`,
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Invalid email or password.",
        );
      }
    } finally {
      setIsLoading(false);
      setPassword("");
    }
  };

  const labelStyle = {
    fontSize: "0.875rem",
    lineHeight: "1.5rem",
    fontWeight: 500,
  };

  const inputStyle = {
    marginTop: "0.75rem",
    width: "100%",
    borderRadius: "0.5rem",
    padding: "0.375rem 0.75rem",
    fontSize: "0.875rem",
    lineHeight: "1.5rem",
    outline: "none",
    background: colorScheme.surface2,
    border: `1px solid ${colorScheme.border}`,
    color: colorScheme.text,
    opacity: isLockedOut ? 0.5 : 1,
  };

  const tabStyle = (active: boolean) => ({
    flex: 1,
    padding: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    border: "none",
    borderBottom: active
      ? `2px solid ${colorScheme.text}`
      : `2px solid transparent`,
    background: "transparent",
    color: active ? colorScheme.text : `${colorScheme.text}88`,
    transition: "all 0.2s ease",
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        as="div"
        style={{ position: "relative", zIndex: 10 }}
        onClose={onClose}
        __demoMode
      >
        {/* Overlay */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <DialogPanel
              transition
              style={{
                width: "100%",
                maxWidth: "28rem",
                borderRadius: "0.75rem",
                backgroundColor: colorScheme.surface,
                border: `1px solid ${colorScheme.border}`,
                padding: "1.5rem",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              {/* Tab toggle */}
              <div
                style={{
                  display: "flex",
                  marginBottom: "1.5rem",
                  borderBottom: `1px solid ${colorScheme.border}`,
                }}
              >
                <button
                  type="button"
                  style={tabStyle(mode === "login")}
                  onClick={() => switchMode("login")}
                >
                  Login
                </button>
                <button
                  type="button"
                  style={tabStyle(mode === "register")}
                  onClick={() => switchMode("register")}
                >
                  Register
                </button>
              </div>

              <DialogTitle as="h3" style={{ color: colorScheme.text }}>
                {mode === "login" ? "Welcome back" : "Create an account"}
              </DialogTitle>

              <div
                style={{
                  maxWidth: "32rem",
                  padding: "0 1rem",
                  color: colorScheme.text,
                }}
              >
                <p>
                  {mode === "login"
                    ? "Please enter your credentials to log in."
                    : "Fill in your details to get started."}
                </p>

                {/* Error / lockout message */}
                {error && (
                  <p
                    role="alert"
                    aria-live="assertive"
                    style={{ color: "red", fontSize: "0.875rem" }}
                  >
                    {error}
                    {isLockedOut && lockoutTimeLeft > 0 && (
                      <span>
                        {" "}
                        ({formatTimeLeft(lockoutTimeLeft)} remaining)
                      </span>
                    )}
                  </p>
                )}

                <form onSubmit={handleSubmit} noValidate autoComplete="on">
                  <Fieldset
                    disabled={isLockedOut || isLoading}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                      borderRadius: "0.75rem",
                      background: colorScheme.surface2,
                      padding: "2.5rem",
                    }}
                  >
                    {/* Register-only fields */}
                    {mode === "register" && (
                      <>
                        <Field>
                          <Label
                            style={labelStyle}
                            htmlFor="register-firstname"
                          >
                            First Name
                          </Label>
                          <Input
                            id="register-firstname"
                            style={inputStyle}
                            type="text"
                            value={firstName}
                            autoComplete="given-name"
                            required
                            maxLength={50}
                            onChange={(e) =>
                              setFirstName(sanitizeInput(e.target.value))
                            }
                          />
                        </Field>

                        <Field>
                          <Label style={labelStyle} htmlFor="register-lastname">
                            Last Name
                          </Label>
                          <Input
                            id="register-lastname"
                            style={inputStyle}
                            type="text"
                            value={lastName}
                            autoComplete="family-name"
                            required
                            maxLength={50}
                            onChange={(e) =>
                              setLastName(sanitizeInput(e.target.value))
                            }
                          />
                        </Field>

                        <Field>
                          <Label style={labelStyle} htmlFor="register-role">
                            Role
                          </Label>
                          <select
                            id="register-role"
                            value={role}
                            onChange={(e) =>
                              setRole(e.target.value as "user" | "admin")
                            }
                            style={{
                              ...inputStyle,
                              marginTop: "0.75rem",
                              cursor: "pointer",
                            }}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </Field>
                      </>
                    )}

                    {/* Shared fields */}
                    <Field>
                      <Label
                        style={labelStyle}
                        htmlFor={
                          mode === "login" ? "login-email" : "register-email"
                        }
                      >
                        Email
                      </Label>
                      <Input
                        id={mode === "login" ? "login-email" : "register-email"}
                        style={inputStyle}
                        type="email"
                        value={email}
                        autoComplete="email"
                        required
                        maxLength={254}
                        onChange={(e) =>
                          setEmail(sanitizeInput(e.target.value))
                        }
                      />
                    </Field>

                    <Field>
                      <Label
                        style={labelStyle}
                        htmlFor={
                          mode === "login"
                            ? "login-password"
                            : "register-password"
                        }
                      >
                        Password
                      </Label>
                      <Input
                        id={
                          mode === "login"
                            ? "login-password"
                            : "register-password"
                        }
                        style={inputStyle}
                        type="password"
                        value={password}
                        autoComplete={
                          mode === "login" ? "current-password" : "new-password"
                        }
                        required
                        maxLength={128}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {mode === "register" && (
                        <p
                          style={{
                            fontSize: "0.75rem",
                            marginTop: "0.25rem",
                            color: `${colorScheme.text}88`,
                          }}
                        >
                          Min 8 characters, 1 uppercase, 1 number
                        </p>
                      )}
                    </Field>
                  </Fieldset>

                  <Button
                    type="submit"
                    disabled={isLockedOut || isLoading}
                    style={{
                      opacity: isLockedOut || isLoading ? 0.6 : 1,
                      cursor:
                        isLockedOut || isLoading ? "not-allowed" : "pointer",
                      marginTop: "1rem",
                      width: "100%",
                    }}
                  >
                    {isLoading
                      ? mode === "login"
                        ? "Logging in…"
                        : "Creating account…"
                      : mode === "login"
                        ? "Log in"
                        : "Create account"}
                  </Button>
                </form>

                {/* Mode switch link */}
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.875rem",
                    marginTop: "1rem",
                    color: `${colorScheme.text}88`,
                  }}
                >
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("register")}
                        style={{
                          background: "none",
                          border: "none",
                          color: colorScheme.text,
                          cursor: "pointer",
                          fontWeight: 600,
                          textDecoration: "underline",
                        }}
                      >
                        Register
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        style={{
                          background: "none",
                          border: "none",
                          color: colorScheme.text,
                          cursor: "pointer",
                          fontWeight: 600,
                          textDecoration: "underline",
                        }}
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
