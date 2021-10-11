
const HOST = "https://lighthouse-user-api.herokuapp.com"
const INDEX = HOST + '/api/v1/users'
const friends = []
let filteredFriend = []
const friendsPanel = document.querySelector('#friends-list-panel')
const paginator = document.querySelector('#pagination')
const infoImg = document.querySelector('#friend-image')
const searchButton = document.querySelector('#search-button')
const searchInput = document.querySelector('#search-input')
const FRIENDS_PER_PAGE = 18
const list = JSON.parse(localStorage.getItem('favoriteFriend')) || []

axios.get(INDEX)
  .then(res => {
    friends.push(...res.data.results)
    renderPaginator(friends.length)
    renderFriend(getFriendsByPage(1))
  })



// show target friend info & add to favorite
friendsPanel.addEventListener('click', function friendInfo(event) {
  if (event.target.matches('.add-favorite')) {
    addFavoriteFriend(Number(event.target.dataset.id))
    const favoriteBtn = document.querySelector(`#btn${event.target.dataset.id}`)
    favoriteBtn.setAttribute('class', 'btn btn-danger add-favorite favorite-button')
  } else {
    const targetfriendId = Number(event.target.dataset.id)
    const clickedFriend = []
    const targetFriendInfo = friends.find(friend => friend.id === targetfriendId)
    const modalName = document.querySelector('#modal-name')
    const modalGenderAge = document.querySelector('#modal-gender-age')
    const modalEmail = document.querySelector('#modal-email')
    const modalBirth = document.querySelector('#modal-birth')
    clickedFriend.push(targetFriendInfo)
    infoImg.innerHTML = `<img src="${clickedFriend[0].avatar}" alt="" class="img-fluid">`
    modalName.innerHTML = `<b>${clickedFriend[0].name + ' ' + clickedFriend[0].surname}</b>`
    modalGenderAge.innerHTML = `<b>Gender/Age: </b>` + `${clickedFriend[0].gender + '/' + clickedFriend[0].age}`
    modalEmail.innerHTML = `<b>Email: </b>` + `${clickedFriend[0].email}`
    modalBirth.innerHTML = `<b>Birthday: </b>` + `${clickedFriend[0].birthday}`
  }
})

// change page
paginator.addEventListener('click', function paginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderFriend(getFriendsByPage(page))
  swiper.update()
})

// search friends
searchButton.addEventListener('click', function searchSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredFriend = friends.filter(friend => {
    const name = friend.name + friend.surname
    return name.toLowerCase().includes(keyword)
  })

  if (!filteredFriend.length) {
    return alert('Cannot find friend.')
  }
  renderPaginator(filteredFriend.length)
  renderFriend(getFriendsByPage(1))
  swiper.update()
})


function renderFriend(data) {
  let rawHTML = ''
  data.forEach(friend => {
    rawHTML += `
      <div class="swiper-slide" >
          <img src="${friend.avatar}" data-id="${friend.id}">
          <h3 mt-1>${friend.name + ' ' + friend.surname}</h3>
            <button type="button" class="btn btn-outline-danger add-favorite favorite-button" data-id="${friend.id}" id="btn${friend.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
            <path data-id="${friend.id}" class="add-favorite" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg></button>
      </div>`
    
  })
  friendsPanel.innerHTML = rawHTML

  data.forEach(friend => {
    if (list.some(list => list.id === friend.id)) {
      const favoriteBtn = document.querySelector(`#btn${friend.id}`)
      favoriteBtn.setAttribute('class', 'btn btn-danger add-favorite favorite-button')
    }
  })
}







function getFriendsByPage(page) {
  // show searched friend or all friends
  const data = filteredFriend.length ? filteredFriend : friends
  const starIndex = (page - 1) * FRIENDS_PER_PAGE
  // number of friends in a page
  return data.slice(starIndex, starIndex + FRIENDS_PER_PAGE)
}



// total pages
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ''
  for (let i = 1; i <= numberOfPages; i++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// add favorite friend

function addFavoriteFriend(id) {
  // const list = JSON.parse(localStorage.getItem('favoriteFriend')) || []
  const friend = friends.find(friend => friend.id === id)
  if (list.some(friend => friend.id === id)) {
    return alert('已加入最愛')
  }

  list.push(friend)
  localStorage.setItem('favoriteFriend', JSON.stringify(list))
  console.log(list)
}




// 3d swiper animate
// swiper.js
let swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 600,
    modifier: 1,
    slideShadows: true,
  },
  // pagination: {
  //   el: ".swiper-pagination",
  // },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
});



