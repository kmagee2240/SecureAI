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
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

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

        const res = await registerUser(body);

        if (!res.success) {
          setError(res.message);
          failedAttempts.current += 1;
          if (failedAttempts.current >= MAX_ATTEMPTS) startLockout();
          return;
        }

        login(res.role as Role);
      } else {
        const res = await loginUser(sanitizedEmail, sanitizedPassword);

        if (!res.success) {
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

  return (
    <div>
      <Dialog open={isOpen} as="div" onClose={onClose} __demoMode>
        <div>
          <div>
            <DialogPanel transition>
              <div>
                <button type="button" onClick={() => switchMode("login")}>
                  Login
                </button>
                <button type="button" onClick={() => switchMode("register")}>
                  Register
                </button>
              </div>

              <DialogTitle as="h3">
                {mode === "login" ? "Welcome back" : "Create an account"}
              </DialogTitle>

              <div>
                <p>
                  {mode === "login"
                    ? "Please enter your credentials to log in."
                    : "Fill in your details to get started."}
                </p>

                {error && (
                  <p role="alert" aria-live="assertive">
                    {error}
                    {isLockedOut && lockoutTimeLeft > 0 && (
                      <span> ({formatTimeLeft(lockoutTimeLeft)} remaining)</span>
                    )}
                  </p>
                )}

                <form onSubmit={handleSubmit} noValidate autoComplete="on">
                  <Fieldset disabled={isLockedOut || isLoading}>
                    {mode === "register" && (
                      <>
                        <Field>
                          <Label htmlFor="register-firstname">First Name</Label>
                          <Input
                            id="register-firstname"
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
                          <Label htmlFor="register-lastname">Last Name</Label>
                          <Input
                            id="register-lastname"
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
                          <Label htmlFor="register-role">Role</Label>
                          <select
                            id="register-role"
                            value={role}
                            onChange={(e) =>
                              setRole(e.target.value as "user" | "admin")
                            }
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </Field>
                      </>
                    )}

                    <Field>
                      <Label
                        htmlFor={
                          mode === "login" ? "login-email" : "register-email"
                        }
                      >
                        Email
                      </Label>
                      <Input
                        id={mode === "login" ? "login-email" : "register-email"}
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
                        <p>Min 8 characters, 1 uppercase, 1 number</p>
                      )}
                    </Field>
                  </Fieldset>

                  <Button type="submit" disabled={isLockedOut || isLoading}>
                    {isLoading
                      ? mode === "login"
                        ? "Logging in…"
                        : "Creating account…"
                      : mode === "login"
                        ? "Log in"
                        : "Create account"}
                  </Button>
                </form>

                <p>
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("register")}
                      >
                        Register
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button type="button" onClick={() => switchMode("login")}>
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
