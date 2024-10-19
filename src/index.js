import "@/index.scss"
import { debounce } from "./utils/debounce"

const listRepo = document.querySelector(".list-repo")
const listRepoItemTemplate = document.getElementById("list-item-template")

const resultEl = document.querySelector(".search-list")

const debounceHandle = debounce(async (e) => {
  // сбрасываем прошлые результаты
  resultEl.innerHTML = ""

  let value = e.target.value

  // скрываем autocomplete если поле ввода пустое
  console.log("debounce call")

  if (value) {
    resultEl.style.display = "flex"
  } else {
    resultEl.style.removeProperty("display")
  }

  // готовим строку
  value = value.trim().replace(/\s/g, "+")

  // отправляем запрос
  const repos = await fetch(
    `https://api.github.com/search/repositories?q=${value}&per_page=5&page=1`,
    {
      headers: {
        Authorization: "Bearer <YOUR_ACCESS_TOKEN>",
        Accept: "application/vnd.github.v3+json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items)

  // выводим результат
  for (const repo of repos) {
    const listItemResult = document.createElement("li")
    listItemResult.classList.add("search-list__item")
    listItemResult.textContent = repo.full_name
    resultEl.append(listItemResult)
    listItemResult.addEventListener(
      "click",
      () => {
        // создаем элемент результирующего списка
        const listRepoItem = listRepoItemTemplate.content.cloneNode(true)
        listRepoItem.getElementById("name").textContent = `Name: ${repo.name}`
        listRepoItem.getElementById(
          "owner"
        ).textContent = `Owner: ${repo.owner.login}`
        listRepoItem.getElementById(
          "stars"
        ).textContent = `Stars: ${repo.stargazers_count}`
        listRepoItem.firstElementChild.dataset.id = repo.node_id

        // добавляем удаление элемента из результирующего списка
        listRepoItem.querySelector(".list-item__remove").addEventListener(
          "click",
          () => {
            listRepo.querySelector(`[data-id="${repo.node_id}"]`).remove()
          },
          { once: true }
        )

        // добавляем элемент в результирующий список
        listRepo.append(listRepoItem)

        // скрываем autocomplete
        resultEl.style.removeProperty("display")

        // обнуляем значение поля ввода
        e.target.value = ""
      },
      { once: true }
    )
  }
}, 500)

document
  .getElementById("search-form-input")
  .addEventListener("input", debounceHandle)
