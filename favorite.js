const HOST = "https://lighthouse-user-api.herokuapp.com"
const INDEX = HOST + '/api/v1/users'
const friends = []
let filteredFriend = []
const friendsPanel = document.querySelector('#friends-list-panel')
const paginator = document.querySelector('#pagination')
const searchButton = document.querySelector('#search-button')
const searchInput = document.querySelector('#search-input')
const favoriteFriends = JSON.parse(localStorage.getItem('favoriteFriend'))
const nightMode = document.querySelector('#night-mode')
const headNav = document.querySelector('#head-nav')
const body = document.querySelector('body')
let modeDayAndNight = 'card text-light bg-dark h-100'
const FRIENDS_PER_PAGE = 18

renderFriend(getFriendsByPage(1))
renderPaginator(favoriteFriends.length)

// show personal info or remove favorite friend
friendsPanel.addEventListener('click', function personModal(event) {
  const targetId = event.target.dataset.id
  axios.get(INDEX + `/${targetId}`)
    .then(res => friendInfo(res.data))
    .catch(err => console.log(err))
  if (event.target.matches('.remove-favorite')) {
    removeFavoriteFriend(Number(event.target.dataset.id))
    console.log(event)
  }
})

// number of friends in favorite page
paginator.addEventListener('click', function paginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderFriend(getFriendsByPage(page))
})

// search friends
searchButton.addEventListener('click', function searchSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredFriend = favoriteFriends.filter(friend => {
    const name = friend.name + friend.surname
    return name.toLowerCase().includes(keyword)
  })
  // input is empty, return
  if (!filteredFriend.length) {
    return alert('Cannot find friend.')
  }
  renderPaginator(filteredFriend.length)
  renderFriend(getFriendsByPage(1))
})

nightMode.addEventListener('click', function switchDayNightMode(event) {
  console.log(event)
  if (headNav.matches('.navbar-light')) {
    headNav.setAttribute('class', 'navbar navbar-expand-lg navbar-dark bg-dark')
    body.style.backgroundColor = 'black'
    modeDayAndNight = 'card text-light bg-dark h-100'
    renderFriend(getFriendsByPage(1))
  } else if (headNav.matches('.navbar-dark')) {
    headNav.setAttribute('class', 'navbar navbar-expand-lg navbar-light bg-light')
    body.style.backgroundColor = 'white'
    modeDayAndNight = 'card text-dark bg-light h-100'
    renderFriend(getFriendsByPage(1))
  }
})

function renderFriend(data) {
  let rawHTML = ''
  data.forEach(friend => {
    rawHTML += `<div class="col">
      <div class="${modeDayAndNight}">
        <img src="${friend.avatar}" class="card-img-top" alt="..." data-id="${friend.id}" data-bs-target="#friendModal" data-bs-toggle="modal">
        <div class="card-body text-center">
          <h5 class="card-title" data-id="${friend.id}" data-bs-target="#friendModal" data-bs-toggle="modal">${friend.name + ' ' + friend.surname}</h5>
        </div>
        <div class="card-footer text-center">
         <button type="button" class="btn btn-outline-success remove-favorite" data-id="${friend.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-x-fill" viewBox="0 0 16 16">
  <path class="remove-favorite" data-id="${friend.id}" fill-rule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"/>
</svg>Remove</button>
        </div>
     </div>
   </div>`
  })
  friendsPanel.innerHTML = rawHTML
}

// modal content
function friendInfo(id) {
  const modalImage = document.querySelector('#modal-image')
  const modalName = document.querySelector('#modal-name')
  const modalGenderAge = document.querySelector('#modal-gender-age')
  const modalEmail = document.querySelector('#modal-email')
  const modalBirth = document.querySelector('#modal-birth')
  modalName.innerHTML = `<b>${id.name + ' ' + id.surname}</b>`
  modalGenderAge.innerHTML = `<b>Gender/Age: </b>` + `${id.gender + '/' + id.age}`
  modalEmail.innerHTML = `<b>Email: </b>` + `${id.email}`
  modalBirth.innerHTML = `<b>Birthday: </b>` + `${id.birthday}`
  modalImage.src = id.avatar
}

function getFriendsByPage(page) {
  const data = filteredFriend.length ? filteredFriend : favoriteFriends
  const starIndex = (page - 1) * FRIENDS_PER_PAGE
  return data.slice(starIndex, starIndex + FRIENDS_PER_PAGE)
}

// number of pages
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ''
  for (let i = 1; i <= numberOfPages; i++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// remove favorite friend
function removeFavoriteFriend(id) {
  if (!favoriteFriends) return
  let index = favoriteFriends.findIndex(friend => friend.id === id)
  if (index === -1) return
  favoriteFriends.splice(index, 1)
  localStorage.setItem('favoriteFriend', JSON.stringify(favoriteFriends))
  renderFriend(getFriendsByPage(1))
  renderPaginator(favoriteFriends.length)
}