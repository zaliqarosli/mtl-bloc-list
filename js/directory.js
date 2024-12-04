const json = "json/directory.json";

fetch(json)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const list = document.querySelector(".directory-list-items");
    const html = data.items
      .map((item) => `<li><a href="${item.href}">${item.name}</a></li>`)
      .join("");
    list.innerHTML = html;
  })
  .catch((error) => console.error(error.message));
