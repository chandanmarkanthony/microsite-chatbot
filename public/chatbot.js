(function () {
  const state = { step: "start", name: "", phone: "", email: "" };
  const siteName =
  document.querySelector('meta[property="og:site_name"]')?.content ||
  document.title ||
  "Ananya";
  const desc = document.querySelector('meta[name="description"]')?.content || "";
  const image = document.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";

  // ---------------- UI ----------------
  const chatHTML = `
  <div id="cb-container">
    <div id="cb-button">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
    </div>
    <div id="cb-box">
      <div class="cb-header">
        <div class="cb-header-left">
          <div class="cb-avatar">
          <img src="https://cdn-icons-png.flaticon.com/512/4140/4140047.png" />
            <span class="cb-online-dot"></span>
          </div>
          <div><div class="cb-title">${siteName}</div><div class="cb-sub">Assistant • Online</div></div>
        </div>
        <div id="cb-close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>
      </div>
      <div class="cb-body" id="cb-body">
        <div id="cb-typing" class="cb-typing" style="display:none"><span></span><span></span><span></span></div>
      </div>
      <div class="cb-footer">
        <div class="cb-input-wrapper" id="cb-input-wrapper">
         <select id="cb-country-code" style="display:none; max-height:80px; overflow-y:auto;">
              <option value="+91" selected>🇮🇳 +91</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+1">🇨🇦 +1</option>

                <!-- Gulf (Very Important for Real Estate) -->
                <option value="+966">🇸🇦 +966</option>
                <option value="+974">🇶🇦 +974</option>
                <option value="+965">🇰🇼 +965</option>
                <option value="+968">🇴🇲 +968</option>

                <!-- Asia / Investors -->
                <option value="+60">🇲🇾 +60</option>
                <option value="+852">🇭🇰 +852</option>

                <!-- Europe (Optional but useful) -->
                <option value="+49">🇩🇪 +49</option>
                <option value="+33">🇫🇷 +33</option>
            </select>
          <input id="cb-input" type="text" placeholder="Please select an option..." disabled />
          <button id="cb-send" disabled><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
        </div>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", chatHTML);
  const body = document.getElementById("cb-body");
  const input = document.getElementById("cb-input");
  const sendBtn = document.getElementById("cb-send");
  const typing = document.getElementById("cb-typing");
  const box = document.getElementById("cb-box");
  const countryCode = document.getElementById("cb-country-code");

  // ---------------- UI HELPERS ----------------
  function setInputState(enabled, placeholder = "Type your answer...", type = "text") {
    input.disabled = !enabled;
    sendBtn.disabled = !enabled;
    input.placeholder = placeholder;
    input.type = type;

    // Show country code dropdown only for 'tel' type
    countryCode.style.display = (enabled && type === 'tel') ? "block" : "none";

    if (enabled) {
      input.focus();
      document.getElementById("cb-input-wrapper").style.opacity = "1";
    } else {
      document.getElementById("cb-input-wrapper").style.opacity = "0.6";
    }
  }

  // Prevent non-numeric characters for phone number
  input.oninput = (e) => {
    if (state.step === "phone") {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }
  };

  async function addMessage(msg, type = "bot") {
    if (type === "bot") {
      typing.style.display = "flex";
      body.scrollTop = body.scrollHeight;
      await new Promise(res => setTimeout(res, 1200));
      typing.style.display = "none";
    }
    const row = document.createElement('div');
    row.className = `cb-row ${type === "user" ? "cb-user" : "cb-bot"}`;
    row.innerHTML = `<div class="cb-bubble">${msg}</div>`;
    body.insertBefore(row, typing);
    body.scrollTop = body.scrollHeight;
  }

  function addButtons(options) {
    setInputState(false, "Select an option above...");
    const group = document.createElement('div');
    group.className = "cb-btn-group";
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.innerText = opt.label;
      btn.onclick = () => {
        group.remove();
        addMessage(opt.label, "user");
        window[opt.action.replace('()', '')]();
      };
      group.appendChild(btn);
    });
    body.insertBefore(group, typing);
    body.scrollTop = body.scrollHeight;
  }

  // ---------------- TOGGLE ----------------
  document.getElementById("cb-button").onclick = () => {
    const isOpen = box.classList.toggle("open");
    if (isOpen && state.step === "start") {
      state.step = "active";
      setTimeout(startChat, 600);
    }
  };
  document.getElementById("cb-close").onclick = () => box.classList.remove("open");

  // ---------------- FLOW ----------------
  async function startChat() {
        if (siteName === "Ananya") {
  await addMessage(`👋 Hey, I'm <b>Ananya</b>! How can I help you?`);
} else {
  await addMessage(`👋 Welcome to <b>${siteName}</b>. We are here to help you.`);
}
    if (image) await addMessage(`<img src="${image}" class="cb-img">`);
    if (desc) await addMessage(desc);
    await addMessage("Do you prefer to receive the project brochure and price details via email?");
    addButtons([
      { label: "Yes, please", action: "chatYes()" },
      { label: "No, thanks", action: "chatNo()" }
    ]);
  }

  window.chatYes = async function () {
    state.step = "name";
    await addMessage("👤 Please enter your Name:");
    setInputState(true, "Enter your name...", "text");
  };

  window.chatNo = async function () {
    await addMessage("Please select an option:");
    addButtons([
      { label: "Configuration", action: "selectOption()" },
      { label: "Instant Call Back", action: "selectOption()" },
      { label: "Location", action: "selectOption()" }
    ]);
  };

  window.selectOption = function () {
    chatYes();
  };

  // ---------------- INPUT HANDLER ----------------
  async function handleInput() {
    const val = input.value.trim();
    if (!val || input.disabled) return;

    // Additional check for phone number (numbers only)
    if (state.step === "phone" && !/^\d+$/.test(val)) return;

    input.value = "";
    // Show country code + number for phone step
    const displayVal = (state.step === "phone") ? `${countryCode.value} ${val}` : val;

    setInputState(false, "Waiting...");
    addMessage(displayVal, "user");

    if (state.step === "name") {
      state.name = val; state.step = "phone";
      await addMessage("📞 Enter Phone Number:");
      setInputState(true, "Numbers only...", "tel");
    } else if (state.step === "phone") {
      state.phone = displayVal; state.step = "email";
      await addMessage("📧 Enter Email:");
      setInputState(true, "Enter email address...", "email");
    } else if (state.step === "email") {

      // ✅ Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(val)) {
        await addMessage("❌ Please enter a valid email ID.");
        setInputState(true, "Enter valid email...", "email");
        return;
      }

      state.email = val;
      state.step = "done";
      submitLead();
    }
  }

  document.getElementById("cb-send").onclick = handleInput;
  input.onkeypress = (e) => { if (e.key === "Enter") handleInput(); };

  async function submitLead() {
    setInputState(false, "Conversation ended");

    try {
      const res = await fetch(
        "https://leadapi.homebble.in/formdataRoute/getFormdata",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: state.name,
            phone: state.phone,
            email: state.email,
            project: siteName,
            utm_source: "Microsites-Chatbot",
            url: window.location.href,

            // ✅ IMPORTANT: Add this
            allMails: [
              "chandan.markanthony@gmail.com",
            ]
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        await addMessage("✅ Thank you! Our team will contact you shortly.");

        // disable input
        document.getElementById("cb-input").disabled = true;
        document.getElementById("cb-send").disabled = true;
      } else {
        await addMessage("❌ Something went wrong. Please try again.");
      }

    } catch (error) {
      console.error("API Error:", error);
      await addMessage("❌ Failed to submit. Please try again.");
    }
  }

  // ---------------- STYLES ----------------
  const style = document.createElement("style");
  style.innerHTML = `
#cb-container { position: fixed; bottom: 24px; right: 24px; z-index: 2147483647; font-family: 'Inter', sans-serif; }
#cb-button { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; width: 62px; height: 62px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 10px 30px rgba(29, 78, 216, 0.4); transition: 0.3s; }
#cb-box { position: absolute; bottom: 85px; right: 0; display: none; width: 400px; height: 580px; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.15); flex-direction: column; transition: all 0.3s ease; }
#cb-box.open { display: flex; }

/* Responsive Adjustments */
@media (max-width: 480px) {
  #cb-container { bottom: 15px; right: 15px; }
  #cb-box { 
    width: calc(100vw - 30px); 
    height: calc(100vh - 120px); 
    max-height: 600px;
    bottom: 80px; 
    border-radius: 18px;
  }
}

@media (max-width: 360px) {
  #cb-box { height: calc(100vh - 100px); }
  .cb-title { font-size: 14px; }
}


.cb-header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; padding: 20px 20px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.cb-header-left { display: flex; gap: 12px; align-items: center; }
.cb-avatar { position: relative; width: 40px; height: 40px; }
.cb-avatar img { width: 100%; height: 100%; border-radius: 50%; background: #fff; object-fit: cover; }
.cb-online-dot { position: absolute; bottom: 1px; right: 1px; width: 10px; height: 10px; background: #10b981; border: 2px solid #1d4ed8; border-radius: 50%; }
.cb-title { font-weight: 700; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
.cb-sub { font-size: 11px; opacity: 0.8; }
#cb-close { cursor: pointer; padding: 4px; display: flex; align-items: center; }

.cb-body { flex: 1; padding: 15px 20px; overflow-y: auto; background: #f8fafc; scroll-behavior: smooth; display: flex; flex-direction: column; }
.cb-img { width: 100%; border-radius: 12px; margin-bottom: 8px; height: auto; max-height: 200px; object-fit: cover; }

.cb-btn-group { margin: 10px 0; display: flex; flex-wrap: wrap; gap: 8px; }
.cb-btn-group button { border-radius: 10px; padding: 8px 14px; border: 1.5px solid #2563eb; background: #fff; color: #2563eb; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s; }
.cb-btn-group button:hover { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; }

.cb-footer { padding: 12px 16px; background: #fff; border-top: 1px solid #eee; flex-shrink: 0; }
.cb-input-wrapper { display: flex; align-items: center; background: #f1f5f9; border-radius: 12px; padding: 4px 8px; transition: opacity 0.3s ease; }

/* Country Code CSS */
#cb-country-code {
  border: none;
  background: transparent;
  font-family: inherit;
  font-weight: 600;
  font-size: 14px;
  color: #2563eb;
  padding: 0 10px 0 5px;
  border-right: 1.5px solid #cbd5e1;
  margin-right: 8px;
  outline: none;
  cursor: pointer;
}

#cb-input { flex: 1; border: none; outline: none; font-size: 14px; background: transparent; color: #1e293b; padding: 8px; width: 100%; min-width: 0; }
#cb-input:disabled { cursor: not-allowed; }
#cb-send { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border: none; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
#cb-send:disabled { background: #cbd5e1; cursor: not-allowed; }

.cb-row { display: flex; margin-bottom: 12px; width: 100%; }
.cb-bot { justify-content: flex-start; }
.cb-user { justify-content: flex-end; }
.cb-bubble { max-width: 85%; padding: 10px 14px; font-size: 14px; line-height: 1.4; border-radius: 16px; word-wrap: break-word; }
.cb-bot .cb-bubble { background: #fff; color: #1e293b; border-bottom-left-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
.cb-user .cb-bubble { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border-bottom-right-radius: 4px; }

.cb-typing { display: flex; gap: 4px; padding: 10px 14px; background: #fff; width: fit-content; border-radius: 16px; margin-bottom: 12px; }
.cb-typing span { width: 5px; height: 5px; background: #cbd5e1; border-radius: 50%; animation: cb-bounce 1.4s infinite; }
@keyframes cb-bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }
`;
  document.head.appendChild(style);
})();
