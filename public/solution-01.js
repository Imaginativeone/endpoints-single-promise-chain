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
.then(data => Promise.all([updateUsers(data[0]), updateHobbies(data[1]), updateFavorites(data[2])]))
.then((updatedData) => { 
  // console.log(updatedData)
  return updatedData;
})
.then((orgData) => {

  let hobsnousers = orgData[1].filter(h => !orgData[0].some(user => user.id === h.user_id));
  let favsnousers = orgData[2].filter(f => !orgData[0].some(user => user.id === f.user_id));

  orgData[0].map((user) => {
    user.user_id = user.id;
    return user;
  })
  
  let users_hobs = orgData[0].map(user => {
    user.hobbies = orgData[1].filter(hobby => hobby.user_id === user.id)
    return user;
  })
  
  let users_favs = orgData[0].map((user) => { 
    user.favorites = orgData[2].filter(favorite => { 
      if (user.id == favorite.user_id) {
        user.favorites = favorite;
        return favorite;
      }
    })
    return user;
  })

  const organizedData = users_hobs.concat(hobsnousers, favsnousers);
  
  organizedData.sort((a, b) => {
      return a.user_id - b.user_id;
    }
  );

  console.log(organizedData); // Output

})

function correctUsers(users) {
  return users.filter((user) => { 
    if (!user.state) {
      user.state = "PA"
      return user;
    }
  })
}

function correctHobbies(hobbies) {
  return hobbies.filter(hobby => {
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
}

function correctFavorites(favorites) {
  return favorites.filter((favorite) => {
    if (!favorite.type) {
      favorite.type = "other"
      return favorite;
    }
  })
}

function updateUsers(users) {  
  return fetch('/updateUsers', { 
      method: 'post', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(users)
    })
  .then(res => res.json())
}

function updateHobbies(hobbies) {
  return fetch('/updateHobbies', { 
    method: 'post', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(hobbies)
  })
  .then(res => res.json())
}

function updateFavorites(favorites) {
  return fetch('/updateFavorites', { 
    method: 'post', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(favorites)
  })
  .then(res => res.json())
}
