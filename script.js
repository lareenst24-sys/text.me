console.log("Eanova script loaded v3");

const SUPABASE_URL = "https://qxopmudoddudacpvauhi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZIC5UvRVvV2kL72an5ngOA_J9QhKnmU";

// MANUALLY EDIT THESE TWO VALUES ONLY.
const RAISED_DISPLAY_TEXT = "$25,000 / $100,000 · 25%";
const RAISED_PROGRESS_WIDTH = "25%";

// Popunder ad code URL.
// It loads only after the user clicks Send & Support.
const POPUNDER_AD_URL =
  "https://pl29109905.profitablecpmratenetwork.com/7a/de/3d/7ade3dd6e1b4fe13cc5ca0a8d7700827.js";

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
const savedName = localStorage.getItem("eanova_saved_name") || "";

nameInput.value = savedName;

updateTextCounter();
updateManualRaisedDisplay();

nameInput.addEventListener("input", () => {
  localStorage.setItem("eanova_saved_name", nameInput.value.trim());
});

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
    showError("Write a message, joke, story, or idea first.");
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

  localStorage.setItem("eanova_saved_name", name);

  loadPopunderAd();

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
    console.error("Supabase insert error:", error);
    showError("Message failed. Check Supabase setup.");
    sendBtn.disabled = false;
    return;
  }

  sentCount += 1;
  localStorage.setItem("eanova_sent_count", String(sentCount));
  updateTextCounter();

  messageInput.value = "";
  showSuccess("Message sent. Thanks for supporting the fund ✅");

  sendBtn.disabled = false;
});

function loadPopunderAd() {
  const adScript = document.createElement("script");
  adScript.src = POPUNDER_AD_URL;
  adScript.async = true;
  document.body.appendChild(adScript);
}

function updateTextCounter() {
  textCount.textContent = sentCount;
}

function updateManualRaisedDisplay() {
  progressMoney.textContent = RAISED_DISPLAY_TEXT;
  progressFill.style.width = RAISED_PROGRESS_WIDTH;
  progressGlow.style.left = RAISED_PROGRESS_WIDTH;
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
