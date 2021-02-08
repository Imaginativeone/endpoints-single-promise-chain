const assignmentResult = Promise.all([
  // All Users
  fetch('/users', { method: 'get', headers: { 'Content-Type': 'application/json'}})
    .then(res => res.json()),
    
  fetch('/hobbies', { method: 'get', headers: { 'Content-Type': 'application/json'}})
    .then(res => res.json()),

  fetch('/favorites', { method: 'get', headers: { 'Content-Type': 'application/json'}})
    .then(res => res.json()),

    // Correct Users
  fetch('/users', { method: 'get', headers: { 'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then((users) => {

      const corrected_users = users.filter((user) => { 
        if (!user.state) {
          user.state = "PA"
          return user;
        }
      })
      return corrected_users;
    })
    // Post the corrected users
    .then(users => fetch('/updateUsers', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(users)})
    .then(res => res.json())
  ),
  // Corrected Hobbies
  fetch('/hobbies', { method: 'get', headers: { 'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then((hobbies) => {
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
      return corrected_hobbies;
    })
    // Post the corrected hobbies
    .then(hobbies => 
      fetch('/updateHobbies', { method: 'post', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(hobbies)} )
      .then(res => res.json())
    ),
  // Corrected favorites  
  fetch('/favorites', { method: "get", headers: { 'Content-Type': 'application/json'} })
    .then(response => response.json())
    .then((favorites) => {
      corrected_favorites = favorites.filter((favorite) => {
        if (!favorite.type) {
          favorite.type = "other"
          return favorite;
        }
      })
      return corrected_favorites;
    })
    // Post corrected favorites
    .then(favorites => 
      fetch('/updateFavorites', { method: 'post', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(favorites)} )
      .then(res => res.json())
    ),
  ])
.then((assignmentResult) => {

  // These promise results are here so that I don't have to fetch again.
  const [
    users,
    hobbies,
    favorites,
    corrected_users, 
    corrected_hobbies, 
    corrected_favorites] = assignmentResult;

  // Coordinate hobbies
  users.map(user => {
    user.hobbies = hobbies.filter(hobby => hobby.user_id == user.id);
    return user;
  })

  // Coordinate favorites
  users.map(user => {
    user.favorites = favorites.filter(favorite => favorite.user_id == user.id);
    return user;
  })
  
  // Integrate corrected users
  users.map(user => {
    corrected_users.filter((c_user) => {
      if (user.id == c_user.id) {
        // Replace user's state with corrected state
        user.state = c_user.state;
        user.last_modified = c_user.last_modified;
      }
      
    })
    return user;
  })
  
  // Integrate Corrected Hobbies
  users.map(user => {
    corrected_hobbies.filter((c_hobby) => {
      if ((user.id == c_hobby.user_id) && (c_hobby.last_modified.indexOf('now') !== -1)) {
        user.hobbies.forEach((userHobby, index) => {
          if (userHobby.id === c_hobby.id) {
            user.hobbies[index] = c_hobby;
          }
        })
      }
    })
    return corrected_hobbies;
  })

  // Integrate Corrected Favorites
  users.map(user => {
    corrected_favorites.filter((c_favorite) => {
      if ((user.id == c_favorite.user_id) && 
          (c_favorite.last_modified !== undefined) && 
          (c_favorite.last_modified !== "") && 
          (c_favorite.last_modified.indexOf('now') !== -1)) {
        user.favorites.forEach((userFavorite, index) => {
          if (userFavorite.id === c_favorite.id) {
            user.favorites[index] = c_favorite;
          }
        })
      }
    })
    return corrected_favorites;
  })  
  return assignmentResult;
})

console.log('assignmentResult', assignmentResult);

// DO NOT DELETE THIS!  
function reset() { fetch('/reset'); }
