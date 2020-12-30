document.addEventListener("DOMContentLoaded", function () {
  let resizerPos = localStorage.getItem("resizerPosition");
  let projName = localStorage.getItem("projectName");
  if (resizerPos !== null) {
    document.documentElement.style.setProperty(
      "--editor-width",
      `${resizerPos}%`
    );
  }

  if (projName !== null) {
    document.title = `${projName} - Fluid WebEditor`;
  } else {
    document.title = `Untitled - Fluid WebEditor`;
  }
});

if (localStorage.getItem("htmlCode") !== null) {
  var defaultHTML = localStorage.getItem("htmlCode");
} else {
  var defaultHTML = `<h1>Hello World!</h1>
  `;
}

if (localStorage.getItem("cssCode") !== null) {
  var defaultCSS = localStorage.getItem("cssCode");
} else {
  var defaultCSS = `*{
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
 
 a{
   text-decoration: none;
   color: darkcyan;
 }
 
 ul{
   list-style: none;
 }
  `;
}

if (localStorage.getItem("jsCode") !== null) {
  var defaultJS = localStorage.getItem("jsCode");
} else {
  var defaultJS = `function DoNothin() {
    //Do nothing
  }
  `;
}

const hotkeys = (e) => {
  let windowEvent = window.event ? event : e;

  if (
    (windowEvent.keyCode === 83 && windowEvent.ctrlKey) ||
    (windowEvent.keyCode === 13 && windowEvent.ctrlKey)
  ) {
    e.preventDefault();
    run();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  run();
});

document.onkeydown = hotkeys;

const htmlEditor = CodeMirror(document.querySelector(".html-editor"), {
  mode: "htmlmixed",
  autoCloseTags: true,
  theme: "vscode-dark",
  value: defaultHTML,
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: false,
  matchBrackets: true,
  autoCloseBrackets: true,
  matchTags: true,
  profile: "xhtml" /* define Emmet output profile */,
  autoCloseBrackets: true,
  extraKeys: {
    "Ctrl-Space": "autocomplete",
    // Tab: "emmetExpandAbbreviation",
    // Esc: "emmetResetAbbreviation",
    // Enter: "emmetInsertLineBreak",
  },
});

emmetCodeMirror(htmlEditor, {
  'Tab': 'emmet.expand_abbreviation_with_tab',
  'Alt-E': 'emmet.expand_abbreviation_with_tab',
});

const cssEditor = CodeMirror(document.querySelector(".css-editor"), {
  extraKeys: { "Ctrl-Space": "autocomplete" },
  mode: "css",
  autoCloseTags: true,
  theme: "vscode-dark",
  value: defaultCSS,
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: false,
  matchBrackets: true,
  autoCloseBrackets: true,
  matchTags: true,
  profile: "css" /* define Emmet output profile */,
  autoCloseBrackets: true,
});

emmetCodeMirror(cssEditor, {
  'Tab': 'emmet.expand_abbreviation_with_tab',
  'Alt-E': 'emmet.expand_abbreviation_with_tab',
});

const jsEditor = CodeMirror(document.querySelector(".js-editor"), {
  extraKeys: { "Ctrl-Space": "autocomplete" },
  mode: { name: "javascript", globalVars: true },
  autoCloseTags: true,
  theme: "vscode-dark",
  value: defaultJS,
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: false,
  matchBrackets: true,
  autoCloseBrackets: true,
  matchTags: true,
  profile: "javascript" /* define Emmet output profile */,
  autoCloseBrackets: true,
});

emmetCodeMirror(jsEditor, {
  'Tab': 'emmet.expand_abbreviation_with_tab',
  'Alt-E': 'emmet.expand_abbreviation_with_tab',
});

function appendStyles() {
  let styles = output.document.createElement("style");
  output.document.head.appendChild(styles);
}
appendStyles();

const predefinedScripts = `
  let links = document.querySelectorAll('a');
  links.forEach(link => {
    if(link.href = '#'){
      link.href = 'javascript:void(0)'
      console.log(link.href)
    }
  });
`;

function run() {
  let runBtn = document.getElementById("run-btn");
  let runIcon = document.getElementById("run-icon");
  let htmlCode = htmlEditor.getValue();
  let cssCode = cssEditor.getValue();
  let jsCode = jsEditor.getValue();

  runIcon.classList.remove("run-icon");
  runIcon.classList.add("run-spinner");

  setTimeout(() => {
    runIcon.classList.remove("run-spinner");
    runIcon.classList.add("run-icon");
  }, 1000);

  output.document.body.innerHTML = htmlCode;
  output.document.head.querySelector("style").innerHTML = cssCode;
  output.window.eval(predefinedScripts + jsCode);

  localStorage.setItem("htmlCode", htmlCode);
  localStorage.setItem("cssCode", cssCode);
  localStorage.setItem("jsCode", jsCode);
}

document.addEventListener("DOMContentLoaded", function () {
  // Query the element
  const resizer = document.getElementById("dragme");
  const leftSide = document.querySelector(".cm-s-vscode-dark");
  const rightSide = resizer.nextElementSibling;

  // The current position of mouse
  let x = 0;
  let y = 0;
  let leftWidth = 0;

  console.log(leftSide);

  // Handle the mousedown event
  // that's triggered when user drags the resizer
  const mouseDownHandler = function (e) {
    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;
    leftWidth = leftSide.getBoundingClientRect().width;

    // Attach the listeners to `document`
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    const newLeftWidth =
      ((leftWidth + dx) * 100) /
      resizer.parentNode.getBoundingClientRect().width;

    // if (document.documentElement.style.getProperty("--mobile") == 1) {
    //   const newLeftWidth =
    //     ((leftWidth + dy) * 100) /
    //     resizer.parentNode.getBoundingClientRect().width;
    // } else {
    //   const newLeftWidth =
    //     ((leftWidth + dx) * 100) /
    //     resizer.parentNode.getBoundingClientRect().width;
    // }

    // leftSide.style.width = `${newLeftWidth}%`;
    if (newLeftWidth <= 100 && newLeftWidth >= 0) {
      document.documentElement.style.setProperty(
        "--editor-width",
        `${newLeftWidth}%`
      );
      localStorage.setItem("resizerPosition", newLeftWidth);
    }

    if (newLeftWidth >= 95) {
      document.documentElement.style.setProperty("--editor-width", `100%`);
      localStorage.setItem("resizerPosition", "100");
    } else if (newLeftWidth <= 3) {
      document.documentElement.style.setProperty("--editor-width", `0%`);
      localStorage.setItem("resizerPosition", "0");
    }

    resizer.style.cursor = "col-resize";
    document.body.style.cursor = "col-resize";

    leftSide.style.userSelect = "none";
    leftSide.style.pointerEvents = "none";

    rightSide.style.userSelect = "none";
    rightSide.style.pointerEvents = "none";
  };

  const mouseUpHandler = function () {
    resizer.style.removeProperty("cursor");
    document.body.style.removeProperty("cursor");

    leftSide.style.removeProperty("user-select");
    leftSide.style.removeProperty("pointer-events");

    rightSide.style.removeProperty("user-select");
    rightSide.style.removeProperty("pointer-events");

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  // Attach the handler
  resizer.addEventListener("mousedown", mouseDownHandler);
});

function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabbar = tab.parentElement;
      const container = tabbar.parentElement;
      const tabsNumber = tab.dataset.forTab;
      const tabToActivate = container.querySelector(
        `.content[data-tab='${tabsNumber}']`
      );

      tabbar.querySelectorAll(".tab").forEach((tab) => {
        tab.classList.remove("tab-active");
      });
      container.querySelectorAll(".content").forEach((item) => {
        item.classList.remove("content-active");
      });
      tab.classList.add("tab-active");
      tabToActivate.classList.add("content-active");
    });
  });
}

function prettify() {
  selectElementContents(htmlEditor);
  var range = getSelectedRange();
  htmlEditor.autoFormatRange(range.from, range.to);

  selectElementContents(cssEditor);
  var range = getSelectedRange();
  cssEditor.autoFormatRange(range.from, range.to);

  selectElementContents(jsEditor);
  var range = getSelectedRange();
  jsEditor.autoFormatRange(range.from, range.to);
}

function getSelectedRange() {
  return { from: inputField.getCursor(true), to: inputField.getCursor(false) };
}

setInterval(() => {
  if (htmlEditor.getValue() != localStorage.getItem("htmlCode")) {
    document.getElementById("tab-dot-html").classList.add("unsaved");
  } else {
    document.getElementById("tab-dot-html").classList.remove("unsaved");
  }

  if (cssEditor.getValue() != localStorage.getItem("cssCode")) {
    document.getElementById("tab-dot-css").classList.add("unsaved");
  } else {
    document.getElementById("tab-dot-css").classList.remove("unsaved");
  }

  if (jsEditor.getValue() != localStorage.getItem("jsCode")) {
    document.getElementById("tab-dot-js").classList.add("unsaved");
  } else {
    document.getElementById("tab-dot-js").classList.remove("unsaved");
  }
}, 500);

function showElem(selector) {
  elem = document.querySelector(selector);
  elem.style.visibility = "visible";
  elem.style.opacity = "0.9";
  elem.style.pointerEvents = "auto";
}

function hideElem(selector) {
  elem = document.querySelector(selector);
  elem.style.visibility = "hidden";
  elem.style.opacity = "0";
  elem.style.pointerEvents = "none";
}

function dissmissSettings() {
  document.getElementById("settings-popup").style.display = "none";
}

function showSettings() {
  document.getElementById("settings-popup").style.display = "flex";
}

function saveSettings() {
  let newProjectName = document.getElementById("project-name-input").value;
  localStorage.setItem("projectName", newProjectName);
  document.getElementById("settings-popup").style.display = "none";
}

if (typeof Promise !== "undefined") {
  var comp = [
    ["here", "hither"],
    ["asynchronous", "nonsynchronous"],
    ["completion", "achievement", "conclusion", "culmination", "expirations"],
    ["hinting", "advive", "broach", "imply"],
    ["function", "action"],
    ["provide", "add", "bring", "give"],
    ["synonyms", "equivalents"],
    ["words", "token"],
    ["each", "every"],
  ];

  function synonyms(cm, option) {
    return new Promise(function (accept) {
      setTimeout(function () {
        var cursor = cm.getCursor(),
          line = cm.getLine(cursor.line);
        var start = cursor.ch,
          end = cursor.ch;
        while (start && /\w/.test(line.charAt(start - 1))) --start;
        while (end < line.length && /\w/.test(line.charAt(end))) ++end;
        var word = line.slice(start, end).toLowerCase();
        for (var i = 0; i < comp.length; i++)
          if (comp[i].indexOf(word) != -1)
            return accept({
              list: comp[i],
              from: CodeMirror.Pos(cursor.line, start),
              to: CodeMirror.Pos(cursor.line, end),
            });
        return accept(null);
      }, 100);
    });
  }
}
