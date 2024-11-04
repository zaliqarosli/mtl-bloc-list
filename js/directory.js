fetch("json/directory.json")
  .then((response) => response.json())
  .then((data) => {
    const list = document.getElementById("directory-list-items");
    const html = data.items
      .map((item) => `<li><a href="#">${item}</a></li>`)
      .join("");
    list.innerHTML = html;
  });
