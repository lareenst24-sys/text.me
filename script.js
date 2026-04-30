const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

const FUND_GOAL = 100000;

// EDIT THIS NUMBER ONLY WHEN YOU WANT TO CHANGE THE FUNDRAISER AMOUNT.
const RAISED_AMOUNT = 25000;

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = document.getElementById("app");
const form = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const statusBox = document.getElementById("status");
const textCount = document.getElementById("textCount");
const progressFill = document.getElementById("progressFill");
const progressGlow = document.getElementById("progressGlow");
const progressMoney = document.getElementById("progressMoney");

let sentCount = Number(localStorage.getItem("eanova_sent_count") || "0");

updateTextCounter();
updateFundraiserProgress();

document.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;

  document.body.style.setProperty("--mouse-x", x + "%");
  document.body.style.setProperty("--mouse-y", y + "%");

  if (window.innerWidth > 850) {
    const rotateX = (event.clientY / window.innerHeight - 0.5) * -5;
    const rotateY = (event.clientX / window.innerWidth - 0.5) * 5;

    app.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
});

document.addEventListener("mouseleave", () => {
  app.style.transform = "rotateX(0deg) rotateY(0deg)";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  clearStatus();

  if (!name) {
    showError("Enter your name first.");
    return;
  }

  if (!message) {
    showError("Write a message first.");
    return;
  }

  if (name.length > 50) {
    showError("Name is too long.");
    return;
  }

  if (message.length > 1000) {
    showError("Message is too long.");
    return;
  }

  sendBtn.disabled = true;

  const { error } = await supabaseClient
    .from("messages")
    .insert([
      {
        name: name,
        message: message
      }
    ]);

  if (error) {
    console.error(error);
    showError("Message failed. Check Supabase keys or table policy.");
    sendBtn.disabled = false;
    return;
  }

  sentCount += 1;
  localStorage.setItem("eanova_sent_count", String(sentCount));
  updateTextCounter();

  messageInput.value = "";
  showSuccess("Message sent ✅");

  sendBtn.disabled = false;
});

function updateTextCounter() {
  textCount.textContent = sentCount;
}

function updateFundraiserProgress() {
  const safeRaisedAmount = Math.max(0, Math.min(RAISED_AMOUNT, FUND_GOAL));
  const percentage = Math.round((safeRaisedAmount / FUND_GOAL) * 100);

  progressFill.style.width = percentage + "%";
  progressGlow.style.left = percentage + "%";

  progressMoney.textContent =
    "$" +
    safeRaisedAmount.toLocaleString() +
    " / $" +
    FUND_GOAL.toLocaleString() +
    " · " +
    percentage +
    "%";
}

function showSuccess(text) {
  statusBox.textContent = text;
  statusBox.className = "status success";
}

function showError(text) {
  statusBox.textContent = text;
  statusBox.className = "status error";
}

function clearStatus() {
  statusBox.textContent = "";
  statusBox.className = "status";
}
