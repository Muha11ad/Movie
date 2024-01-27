'use strict'

movies.splice(50)

let loading = `<div class='flex space-x-2 justify-center items-center h-screen'>
<span class='sr-only'>Loading...</span>
 <div class='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
<div class='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
<div class='h-8 w-8 bg-white rounded-full animate-bounce'></div>
</div>`



// -----LINKING HTML-----
const category = document.querySelector('#category'),
      mainContent = document.querySelector('.main-content'),
      searchPanel = document.querySelector('#searchpanel'),
      isName = document.querySelector('#isname'),
      searchBtn = document.querySelector('#search-btn'),
      bookMarkBtn = document.querySelector('#bookMark'),
      bookMarkList = document.querySelector('#bookmark-list'),
      count = document.querySelector('#count'),
      rating = document.querySelector('#rating')
      

// -----LINKING HTML-----

//  -----Minimalaze start-----
const db = movies.map((item)=>{
    return{
        title: item.title,
        year:   item.year,
        category: item.categories,
        id: item.imdbId,
        rating: item.imdbRating,
        time: `${Math.trunc(item.runtime/60)}h, ${item.runtime%60}m`,
        summary: item.summary,
        youtube: `https://www.youtube.com/embed/${item.youtubeId}`,
        maxImg: item.bigThumbnail,
        minImg: item.smallThumbnail,
        language: item.language
    
    }
})
//  -----Minimalaze end-----

//  ----- Render db start-----
function render(dbr){
  mainContent.innerHTML = '';
dbr.forEach(item => {
    const card = document.createElement('div')
    card.setAttribute(
        'class',
        'card shadow-xl bg-white w-[300px] h-[500px] rounded-xl overflow-hidden hover:scale-95 cursor-pointer')

    card.innerHTML = 
    `<img src="${item.maxImg}" alt="${item.title}" class="mb-2 w-full" />
    <div class="card-body px-5">
        <h1 class="text-green-700 text-lg font-bold uppercase">
        ${item.title}
        </h1>
        <ul>
            <li><strong>Year:</strong>${item.year}</li>
            <li class='break-words'><strong>Category:</strong>${item.category}</li>
            <li><strong>Language:</strong>${item.language}</li>
            <li><strong>Runtime:</strong>${item.time}</li>
            <li><strong>Rating:</strong> <strong class="text-red-500">${item.rating}</strong></li>
        </ul>
        <div class="flex w-full justify-between mt-4">
            <button class="bg-red-500 text-white px-2 py-2 rounded focus:ring-2 focus:ring-red-400">
            <a href="${item.youtube}" target="_blank">
            Watch
            </a>
            </button>
            <button class="bg-sky-400 text-white px-2 py-2 rounded focus:ring-2 focus:ring-sky-400" data-view="${item.id}">
                Read more
            </button>
            <button  class="bookmarks bg-red-500 text-white px-2 py-2 rounded focus:ring-2 focus:ring-red-400" data-id="${item.id}">
                Bookmark
            </button>
        </div>
    </div>`;
    mainContent.appendChild(card)
});
}
render(db)
//  ----- Render db end-----

// -----find element start-----
const findFilm = (e, filmType, rating)=>
{
  return db.filter((item)=>{
    return (
      item.title.toLowerCase().match(e)&&
      item.rating >=rating &&
      item.category.includes(filmType)
      )
})}

// -----header search starts-----
searchPanel.addEventListener('keyup',(e)=>{
  mainContent.innerHTML =loading;
  let inputValue = e.target.value.toLowerCase();
  let regex = new RegExp(inputValue,'g')
  let result = findFilm(regex);
  setTimeout(()=>{
    render(result)
  },500)
})
// -----header search ends-----

// -----aside starts-----
searchBtn.addEventListener('click',(e)=>{
  mainContent.innerHTML =loading;
  e.preventDefault();
  let inputValue = isName.value.toLowerCase();
  let ratingValue = rating.value;
  let filmType = category.value;

  let regex = new RegExp(inputValue,'g')
  let result = findFilm(regex,filmType,ratingValue);
  setTimeout(()=>{
    render(result)
  },500)
})
// -----aside ends-----




// -----find element end-----

// -----Category start-----
function categories(dbr) {
  const normalizeCateg = [];

  dbr.forEach((item) => {
    item.category.forEach((el) => {
      if (!normalizeCateg.includes(el)) {
        normalizeCateg.push(el);
      }
    });
  });

  normalizeCateg.sort();

  normalizeCateg.forEach((item) => {
    const option = document.createElement("option");
    option.innerHTML = item;
    category.append(option);
  });
}
categories(db)
// -----Category end-----

// -----FILTER BY CATEGORY start -----
category.addEventListener('change', (e)=>{
    const selected = e.target.value;
    const filtered = db.filter((item) => item.category.includes(selected))
    mainContent.innerHTML = ''
    render(filtered)
})
// -----FILTER BY CATEGORY end -----


bookMarkBtn.addEventListener('click',()=>{
  bookMarkList.classList.toggle('swipe')
})

let bookMarkListtt = [];
mainContent.addEventListener('click',(e)=>{
  if(e.target.classList.contains('bookmarks')){
    let id = e.target.getAttribute('data-id')
    let film = db.filter((item)=>{
      return item.id === id
    })
    if(!bookMarkListtt.includes(film[0])){
      bookMarkListtt.push(film[0])
      counter()
    }
  }
})

function counter(){
  bookMarkList.innerHTML='';
  count.textContent = bookMarkListtt.length
  bookMarkListtt.forEach((bookmark)=>{
    const card = document.createElement('div')
    card.setAttribute(
        'class',
        'card shadow-xl bg-white rounded-xl overflow-hidden p-2 w-[230px] h-[250px] flex flex-col items-center')

    card.innerHTML = 
    `<img src="${bookmark.maxImg}" alt="${bookmark.title}" class="mb-2 w-full" />
        <h1 class="text-green-700 mb-[10px]">
        ${bookmark.title.length}
        </h1>
        <button class="bg-red-500 text-white px-2 py-1 rounded focus:ring-2 focus:ring-red-400">
            <a href="${bookmark.youtube}" target="_blank">
            Watch
            </a>
            </button>
        `
        bookMarkList.append(card)
      })
}
counter()

