const assignmentResult = Promise.all(
  [
    usersPromise      = fetch('/users',     { method: 'get', headers: { 'Content-Type': 'application/json'}}).then((res) => res.json()),
    hobbiesPromise    = fetch('/hobbies',   { method: 'get', headers: { 'Content-Type': 'application/json'}}).then((res) => res.json()),
    favoritesPromise  = fetch('/favorites', { method: 'get', headers: { 'Content-Type': 'application/json'}}).then((res) => res.json())
  ]
)
.then((data) => {
  data[0] = correctUsers(data[0])
  data[1] = correctHobbies(data[1]),
  data[2] = correctFavorites(data[2])
  return data;
})
.then((data) => { 
  const p = Promise.all([updateUsers(data[0]), updateHobbies(data[1]), updateFavorites(data[2])])
  return p;
})
.then((updatedData) => {
  console.log('Final Print', updatedData)
  return updatedData;
})
.then((data) => {
  console.log('END DATA', data);
  return data;
})

console.log('assignmentResult', assignmentResult);

function correctUsers(users) {
  const corrected_users = users.filter((user) => { 
    if (!user.state) {
      user.state = "PA"
      return user;
    }
  })
  console.log('corrected_users', corrected_users);
  // console.log('corrected_users (all?)', users);
  return corrected_users;
}

function correctHobbies(hobbies) {
  const corrected_hobbies = hobbies.filter((hobby) => {
    if(!hobby.experience) {
      switch(hobby.years_played) {
        case 1:
          hobby.experience = 'beginner';
          break;
        case 2:
          hobby.experience = 'advanced';
          break;
        case 3:
          hobby.experience = 'expert';
          break;
      }
      return hobby;
    }
  })
  console.log('corrected_hobbies', corrected_hobbies);
  // console.log('corrected_hobbies (all?)', hobbies);
  return corrected_hobbies;
  // return hobbies;
}

function correctFavorites(favorites) {
  corrected_favorites = favorites.filter((favorite) => {
    if (!favorite.type) {
      favorite.type = "other"
      return favorite;
    }
  })
  return corrected_favorites;
  // return favorites;
}

function updateUsers(users) {
  
  const f = fetch('/updateUsers', { 
      method: 'post', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(users)
    })
  .then(res => res.json())

  console.log('updated users from post fetch', f);
  // return users;
  return f;
}

function updateHobbies(hobbies) {

  const f = fetch('/updateHobbies', { 
    method: 'post', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(hobbies)
  })
  .then(res => res.json())

  console.log('updated hobbies from post fetch', f);
  // return data;
  return f;
}

function updateFavorites(favorites) {

  const f = fetch('/updateFavorites', { 
    method: 'post', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(favorites)
  })
  .then(res => res.json())

  console.log('updated hobbies from post fetch', f);
  return f;
}

// PromiseAll([usersPromise, hobbiesPromise, favoritesPromise])
//   .then(data => { 
//     data[0] = correctUsers(data[0])
//     data[1] = correctHobbies(data[1])
//     data[2] = correctFavorites(data[2])
    
//     return data
//   })
//   .then(data => PromiseAll([updateUsers, updateHobbies, updateFavorites])
//   .then(updatedData => console.log(updatedData))