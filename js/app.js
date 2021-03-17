const container = document.querySelector(".data-container");
const filterContainer = document.querySelector('.filter')
const btnContainer = document.querySelector('.btn-container')
const deleteSound = document.getElementById('deleteSound')
const addSound = document.getElementById('addSound')

//fetch data from local JSON file
const fetchData = async() => {
    const response = await fetch("../data.json");
    try {
        const data = await response.json();
        return data;
    } catch {
        throw new Error("Unable fetch data");
    }
};

//define search query for filtering
let filter = {
    role: "",
    level: "",
    languages: [],
    tools: [],
};

//define filter buttons to show buttons on filter container
let filterButtons = []

//display json data using ternary operator and bind it to container
const displayData = (filteredData) => {
        container.innerHTML = "";
        filteredData.map((item) => {
                    card = `<div class="${item.new && item.featured ? "line card" : "card"}" id='${item.id}'>
                <div class="left">
                    <div class="logo"><img src="${item.logo}"/></div>
                        <div class="info">
                            <span class="company">${item.company} </span>
                            ${item.new ? `<span class="new">new!</span>` : ""}
                            ${item.featured ? `<span class="featured">featured</span>` : ""}
                                    <p class="position">${item.position}</p>
                                    <p class="dot">${item.postedAt} / ${item.contract} / ${item.location}</p>
                                </div>
                            </div>
                            <div class="horizon"></div>
                            <div class="buttons">
                                <button id="role">${item.role}</button>
                                <button id="level">${item.level}</button>
            ${item.languages.map((lang) => { return `<button id="lang">${lang}</button>` }).join('')}
            ${item.tools.map((tool) => { return `<button id="tool">${tool}</button>` }).join('')}
                            </div >
                        </div > `
    container.innerHTML += card
  })

  // add events to card buttons
  const roleBtn = document.querySelectorAll("#role");
  const levelBtn = document.querySelectorAll("#level");
  const langBtn = document.querySelectorAll("#lang");
  const toolBtn = document.querySelectorAll("#tool");

  roleBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filter.role = e.target.innerHTML;
      addSound.play()
      if (!filterContainer.classList.contains('isVisible')) filterContainer.classList.add('isVisible')
      if (!filterButtons.includes(e.target.innerHTML)) filterButtons.push(e.target.innerHTML)
      displayFilterButtons(filterButtons, filter)
      buildFilter(filter)
    })
  })

  levelBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filter.level = e.target.innerHTML;
      addSound.play()
      if (!filterContainer.classList.contains('isVisible')) filterContainer.classList.add('isVisible')
      if (!filterButtons.includes(e.target.innerHTML)) filterButtons.push(e.target.innerHTML)
      displayFilterButtons(filterButtons, filter)
      buildFilter(filter);
    });
  });

  langBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      addSound.play()
      if (!filterContainer.classList.contains('isVisible')) filterContainer.classList.add('isVisible')
      if (filter.languages.includes(e.target.innerHTML)) return;
      filter.languages.push(e.target.innerHTML);
      if (!filterButtons.includes(e.target.innerHTML)) filterButtons.push(e.target.innerHTML)
      displayFilterButtons(filterButtons, filter)
      buildFilter(filter);
    });
  });

  toolBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      addSound.play()
      if (!filterContainer.classList.contains('isVisible')) filterContainer.classList.add('isVisible')
      if (filter.tools.includes(e.target.innerHTML)) return;
      filter.tools.push(e.target.innerHTML);
      if (!filterButtons.includes(e.target.innerHTML)) filterButtons.push(e.target.innerHTML)
      displayFilterButtons(filterButtons, filter)
      buildFilter(filter);
    });
  });
};

//show filter buttons on container
const displayFilterButtons = (filterButtons, filter) => {
  btnContainer.innerHTML = ''

  filterButtons.map(btn => {
    element = `<div class="btn" id="${btn}"><button>${btn}</button><span class="sp">x</span></div>`
    btnContainer.innerHTML += element
  })

  document.querySelectorAll('.sp').forEach(btn => {
    btn.addEventListener('click', e => {
      deleteSound.play()
      //remove element from DOM
      btn.parentNode.parentNode.removeChild(btn.parentNode)
      //remove element from filterButtons array
      const id = btn.parentNode.id
      const index = filterButtons.indexOf(id)
      if (index > -1) {
        filterButtons.splice(index, 1)
      }
      if (filterButtons.length === 0) filterContainer.classList.remove('isVisible')
      //after removing filter data again
      if (filter.role === id) {
        filter.role = ''
        buildFilter(filter)
      } else if (filter.level === id) {
        filter.level = ''
        buildFilter(filter)
      } else if (filter.languages.indexOf(id) > -1) {
        filter.languages.splice(filter.languages.indexOf(id), 1)
        buildFilter(filter)
      } else if (filter.tools.indexOf(id) > -1) {
        filter.tools.splice(filter.tools.indexOf(id), 1)
        buildFilter(filter)
      }
    })
  })
}

//clear filter container and remove visibility
document.getElementById('clear').addEventListener('click', (e) => {
  deleteSound.play()
  filterButtons = []
  filter = {}
  buildFilter(filter)
  filterContainer.classList.remove('isVisible')
  e.preventDefault()
})

//building seach query
buildFilter = (filter) => {
  let query = {};
  for (let keys in filter) {
    if (filter[keys].length > 0) {
      query[keys] = filter[keys];
    }
  }
  filterData(query);
};

filterData = async (query) => {
  const data = await fetchData();
  const filteredData = data.filter((item) => {
    for (let key in query) {
      if (
        (!query[key].includes(item[key]) && typeof query[key] == "string") ||
        (typeof query[key] == "object" && !findCommon(query[key], item[key]))
      ) {
        return false;
      }
    }
    return true;
  });
  displayData(filteredData);
};

//function for find common elements in tools and languages array
function findCommon(arr1, arr2) {
  return arr1.some((x) => arr2.includes(x));
}

//display json file on page load
filterData();