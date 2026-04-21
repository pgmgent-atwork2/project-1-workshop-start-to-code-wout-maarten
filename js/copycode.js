function copyCode(id) {
  const code = document.getElementById(id).innerText;
  navigator.clipboard.writeText(code);
}
