const input = document.querySelector('.search__input');
const searchList = document.querySelector('.search__list');
const selected = document.querySelector('.selected__list');

const debounce = (fn, debounceTime) => {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
};

async function getRepos(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const repos = data.items;
    console.log(repos);

    clearSearchList();

    return repos;
  } catch (error) {
    console.error(error);
  }
}

async function autocomplete() {
  const inputText = input.value.trim();
  const url = `https://api.github.com/search/repositories?q=${inputText}in:name&per_page=5&sort=stars&order=desc`;

  try {
    if (inputText !== '') {
      const repos = await getRepos(url);

      for (let repo of repos) {
        let searchItem = document.createElement('li');

        searchItem.classList.add('search__item');
        searchItem.textContent = repo.name;
        searchList.append(searchItem);

        searchItem.addEventListener('click', () => {
          clearSearchList();
          addRepo(repo);
        });
      }
    } else {
      clearSearchList();
    }
  } catch (error) {
    console.log(error);
  }
}

function addRepo(repo) {
  input.value = '';

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');

  const selectedRepo = document.createElement('li');
  selectedRepo.classList.add('selected__item');
  selected.append(selectedRepo);

  const text = document.createElement('div');
  text.classList.add('selected__item-text');
  selectedRepo.append(text, closeBtn);

  const name = document.createElement('p');
  name.classList.add('item__name');
  name.textContent = `Name: ${repo.name}`;
  text.append(name);

  const owner = document.createElement('p');
  owner.classList.add('item__owner');
  owner.textContent = `Owner: ${repo.owner.login}`;
  text.append(owner);

  const stars = document.createElement('p');
  stars.classList.add('item__stars');
  stars.textContent = `Stars: ${repo.stargazers_count}`;
  text.append(stars);

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    selectedRepo.remove();
  });
}

function clearSearchList() {
  const searchItems = document.querySelectorAll('.search__item');
  for (let item of searchItems) {
    item.remove();
  }
}

input.addEventListener('input', debounce(autocomplete, 500));
