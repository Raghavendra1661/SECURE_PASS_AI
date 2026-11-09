const passwordInput = document.getElementById("passwordInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const togglePassword = document.getElementById("togglePassword");
const strengthRing = document.getElementById("strengthRing");
const scoreValue = document.getElementById("scoreValue");
const strengthLabel = document.getElementById("strengthLabel");
const lengthValue = document.getElementById("lengthValue");
const entropyValue = document.getElementById("entropyValue");
const poolValue = document.getElementById("poolValue");
const lengthStatus = document.getElementById("lengthStatus");
const recommendations = document.getElementById("recommendations");

document.getElementById("year").textContent = new Date().getFullYear();

togglePassword.addEventListener("click", () => {
  const show = passwordInput.type === "password";
  passwordInput.type = show ? "text" : "password";
  togglePassword.setAttribute("aria-label", show ? "Hide password" : "Show password");
  togglePassword.textContent = show ? "◉" : "◉";
});

function analyzePassword() {
  const password = passwordInput.value;
  const checks = {
    length: password.length >= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password)
  };

  document.querySelectorAll("#checklist li").forEach(item => {
    const passed = checks[item.dataset.check];
    item.classList.toggle("pass", passed);
    item.classList.toggle("fail", !passed);
  });

  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^A-Za-z0-9]/.test(password)) pool += 32;

  const entropy = password.length && pool ? password.length * Math.log2(pool) : 0;
  const passedCount = Object.values(checks).filter(Boolean).length;
  const score = password.length ? Math.min(100, Math.round((passedCount / 5) * 70 + Math.min(password.length, 20) / 20 * 30)) : 0;
  let label = "Not checked";
  if (password.length) {
    if (score >= 85) label = "Very Strong";
    else if (score >= 65) label = "Strong";
    else if (score >= 40) label = "Fair";
    else label = "Weak";
  }

  strengthRing.style.setProperty("--score", score);
  scoreValue.textContent = password.length ? `${score}%` : "—";
  strengthLabel.textContent = label;
  lengthValue.textContent = `${password.length} Characters`;
  entropyValue.textContent = password.length ? `${entropy.toFixed(1)} bits` : "— bits";
  poolValue.textContent = `${pool} characters`;
  lengthStatus.textContent = password.length
    ? (checks.length ? "✓ At least 12 characters" : "Try using at least 12 characters")
    : "Enter a password to begin";

  const tips = [];
  if (!password.length) tips.push("Enter a password to receive suggestions.");
  else {
    if (!checks.length) tips.push("Use at least 12 characters.");
    if (!checks.upper) tips.push("Add uppercase letters (A–Z).");
    if (!checks.lower) tips.push("Add lowercase letters (a–z).");
    if (!checks.number) tips.push("Include numbers (0–9).");
    if (!checks.symbol) tips.push("Add special characters (such as !, #, or %).");
    if (password.length && new Set(password).size < password.length * 0.6) tips.push("Avoid repeating the same characters.");
    if (!tips.length) tips.push("Good work — your password meets all checklist rules.");
  }
  recommendations.replaceChildren(...tips.map(tip => {
    const li = document.createElement("li");
    li.textContent = tip;
    return li;
  }));
}

analyzeBtn.addEventListener("click", analyzePassword);
passwordInput.addEventListener("input", analyzePassword);
passwordInput.addEventListener("keydown", event => {
  if (event.key === "Enter") analyzePassword();
});

const lengthSlider = document.getElementById("lengthSlider");
const lengthOutput = document.getElementById("lengthOutput");
const generatedPassword = document.getElementById("generatedPassword");
const copyStatus = document.getElementById("copyStatus");
lengthSlider.addEventListener("input", () => {
  lengthOutput.textContent = lengthSlider.value;
});

function secureRandomIndex(max) {
  const values = new Uint32Array(1);
  const limit = Math.floor(0xFFFFFFFF / max) * max;
  let value;
  do {
    crypto.getRandomValues(values);
    value = values[0];
  } while (value >= limit);
  return value % max;
}

function generatePassword() {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{};:,.?";
  let pool = lower + upper;
  const required = [lower, upper];
  if (document.getElementById("includeNumbers").checked) {
    pool += numbers;
    required.push(numbers);
  }
  if (document.getElementById("includeSymbols").checked) {
    pool += symbols;
    required.push(symbols);
  }
  const length = Number(lengthSlider.value);
  const chars = required.map(set => set[secureRandomIndex(set.length)]);
  while (chars.length < length) chars.push(pool[secureRandomIndex(pool.length)]);
  // Fisher–Yates shuffle using the browser's cryptographic random source.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  generatedPassword.value = chars.join("");
  copyStatus.textContent = "";
}

document.getElementById("generateBtn").addEventListener("click", generatePassword);
document.getElementById("copyBtn").addEventListener("click", async () => {
  if (!generatedPassword.value || generatedPassword.value.startsWith("Click Generate")) {
    copyStatus.textContent = "Generate a password first.";
    return;
  }
  try {
    await navigator.clipboard.writeText(generatedPassword.value);
    copyStatus.textContent = "Password copied to clipboard.";
  } catch {
    generatedPassword.select();
    copyStatus.textContent = "Clipboard access was blocked. Select and copy the password manually.";
  }
});
