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
  console.log(updatedData)
  return updatedData;
})
.then((organizedData) => {

  console.log('organizedData', organizedData);

  console.log('Iterate through the corrected users');
  
  console.log('Connect the corrected users to the corrected hobbies');
  console.log('First, iterate through the hobbies, to see what I have');
  
  let correctedUsers        = organizedData[0];
  let correctedHobbies      = organizedData[1];
  let correctedFavorites    = organizedData[2];

  let hobbiesWithoutUsers   = correctedHobbies  .filter(h => !correctedUsers.some(user => user.id === h.user_id));
  let favoritesWithoutUsers = correctedFavorites.filter(f => !correctedUsers.some(user => user.id === f.user_id));
  
  console.log('Updated Hobbies with no users', hobbiesWithoutUsers);
  console.log('Updated Favorites with no users', favoritesWithoutUsers);
  
  let usersWithHobbies = correctedUsers.map(user => {

    user.hobbies = correctedHobbies.filter((hobby) => {
      if (user.id === hobby.user_id) {
        return hobby;
      }
    })
    return user;
  })
  
  console.log('Updated Users WITH hobbies', usersWithHobbies);
  
  let usersWithHobbiesAndFavorites = usersWithHobbies.map((user) => { 
    user.favorites = correctedFavorites.filter(favorite => {user.id === favorite.user_id })
    return user;
  })

  console.log('Updated Users with hobbies and favorites', usersWithHobbiesAndFavorites);

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
