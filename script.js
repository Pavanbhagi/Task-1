function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 15) + 's';
        container.appendChild(particle);
    }
}
createParticles();

const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const modeSelect = document.getElementById('mode');
const promptInput = document.getElementById('prompt');
const contentDiv = document.getElementById('content');
const placeholder = document.getElementById('placeholder');

const modePrompts = {
    story: "Write a creative and engaging short story based on: ",
    poem: "Write a beautiful and evocative poem about: ",
    code: "Create a code solution with explanation for: ",
    business: "Generate an innovative business idea for: ",
    recipe: "Create a unique and delicious recipe for: ",
    quiz: "Create an interactive quiz with 5 multiple choice questions about: "
};

generateBtn.addEventListener('click', async () => {
    const mode = modeSelect.value;
    const prompt = promptInput.value.trim();
    if (!prompt) return alert("Please enter a prompt!");

    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";
    placeholder.innerHTML = '<div class="spinner"></div><div class="loading-text">AI is creating something amazing...</div>';
    placeholder.style.display = "flex";
    placeholder.style.flexDirection = "column";
    placeholder.style.alignItems = "center";
    contentDiv.style.display = "none";

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                messages: [{ role: "user", content: modePrompts[mode] + prompt }]
            })
        });

        const data = await response.json();
        const result = data.content[0].text;

        placeholder.style.display = "none";
        contentDiv.style.display = "block";
        contentDiv.classList.add("zoom-in");

        contentDiv.innerHTML =
            mode === "code"
                ? `<pre><code>${escapeHtml(result)}</code></pre>`
                : result.replace(/\n/g, "<br>");

        setTimeout(() => contentDiv.classList.remove("zoom-in"), 600);

    } catch {
        placeholder.innerHTML = "❌ Error generating content";
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate ✨";
    }
});

clearBtn.addEventListener('click', () => {
    promptInput.value = "";
    contentDiv.style.display = "none";
    placeholder.style.display = "block";
    placeholder.innerHTML = "✨ Your AI-generated content will appear here";
});

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

promptInput.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "Enter") generateBtn.click();
});
