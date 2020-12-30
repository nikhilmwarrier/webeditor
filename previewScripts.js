let styles = document.createElement("style");
document.head.appendChild(styles);

setInterval(() => {
  let projName = localStorage.getItem("projectName");
  let htmlCode = localStorage.getItem("htmlCode");
  let cssCode = localStorage.getItem("cssCode");
  let jsCode = localStorage.getItem("jsCode");

  if (projName !== null) {
    document.title = `${projName} - Fluid WebEditor Preview`;
  } else {
    document.title = `Untitled - Fluid WebEditor Preview`;
  }

  if (document.body.innerHTML != htmlCode || styles.innerHTML != cssCode) {
    document.body.innerHTML = htmlCode;
    styles.innerHTML = cssCode;
  }
  window.eval(jsCode);
}, 2000);
