const BASE_URL =
  "https://script.google.com/macros/s/AKfycbzxPJBOPvFXfr9FmoDcghR8HJmmtAxMWW7WX49u34nVqy8p-ltaJ9FT2SDZpcY132Yc/exec"; // Replace this with your web app URL

let currentSubject = "";
let allFiles = [];

document.addEventListener("DOMContentLoaded", () => {
  loadSubjects();
});

function loadSubjects() {
  fetch(`${BASE_URL}?action=subjects`)
    .then((res) => res.json())
    .then((subjects) => {
      const tabs = document.getElementById("tabs");
      tabs.innerHTML = "";
      subjects.forEach((subject) => {
        const tab = document.createElement("div");
        tab.textContent = subject;
        tab.onclick = () => {
          document
            .querySelectorAll(".tabs div")
            .forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          currentSubject = subject;
          loadFiles(subject);
        };
        tabs.appendChild(tab);
      });
    });
}

function loadFiles(subject) {
  fetch(`${BASE_URL}?action=files&subject=${encodeURIComponent(subject)}`)
    .then((res) => res.json())
    .then((files) => {
      allFiles = files;
      renderFiles(files);
    });
}

function renderFiles(files) {
  const list = document.getElementById("files");
  list.innerHTML = "";
  files.forEach((file) => {
    const li = document.createElement("li");
    li.textContent = file;
    li.onclick = () => {
      document
        .querySelectorAll("#files li")
        .forEach((f) => f.classList.remove("active"));
      li.classList.add("active");
      loadCode(currentSubject, file);
    };
    list.appendChild(li);
  });
}

function filterFiles() {
  const keyword = document.getElementById("fileSearch").value.toLowerCase();
  const filtered = allFiles.filter((file) =>
    file.toLowerCase().includes(keyword)
  );
  renderFiles(filtered);
}

function loadCode(subject, filename) {
  fetch(
    `${BASE_URL}?action=code&subject=${encodeURIComponent(
      subject
    )}&filename=${encodeURIComponent(filename)}`
  )
    .then((res) => res.text())
    .then((code) => {
      // Set the filename
      document.getElementById("fileNameTitle").textContent = filename;

      // Get the file extension and determine the appropriate Prism language class
      const fileExtension = filename.split(".").pop().toLowerCase();
      let languageClass = "";

      // Match file extensions to Prism language classes
      switch (fileExtension) {
        case "js":
          languageClass = "language-javascript";
          break;
        case "html":
          languageClass = "language-markup";
          break;
        case "css":
          languageClass = "language-css";
          break;
        case "python":
          languageClass = "language-python";
          break;
        case "java":
          languageClass = "language-java";
          break;
        case "c":
          languageClass = "language-c";
          break;
        case "cpp":
          languageClass = "language-cpp";
          break;
        case "json":
          languageClass = "language-json";
          break;
        case "xml":
          languageClass = "language-xml";
          break;
        case "md":
          languageClass = "language-markdown";
          break;
        case "rb":
          languageClass = "language-ruby";
          break;
        case "go":
          languageClass = "language-go";
          break;
        default:
          languageClass = "language-text"; // Default language class if unknown
          break;
      }

      // Get the code element and set its content
      const codeEl = document.getElementById("codeContent");
      codeEl.textContent = code;

      // Clear any previous classes and add the new language class
      codeEl.className = languageClass;

      // Manually trigger Prism.js to highlight the new code
      Prism.highlightElement(codeEl);
    });
}

function copyCode() {
  const code = document.getElementById("codeContent").textContent;
  navigator.clipboard
    .writeText(code)
    .then(() => alert("✅ Code copied to clipboard!"))
    .catch(() => alert("❌ Failed to copy code."));
}

function downloadCode() {
  const filename =
    document.getElementById("fileNameTitle").textContent || "code.txt";
  const code = document.getElementById("codeContent").textContent;
  const blob = new Blob([code], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
