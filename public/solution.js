const assignmentResult = Promise.all([
  // Correct Users
  fetch('/users', { method: 'get', headers: { 'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then((users) => {

      const corrected_users = users.filter((user) => { 
        // const userState = !user.state ? user.state = "PA" : user
        // console.log('userState', userState);
        if (!user.state) {
          user.state = "PA"
          console.log(`user: ${ user.name } (${ user.id }) was updated`);
          return user;
        }
      })

      console.log('corrected_users', corrected_users);
      return corrected_users;

    })
    // Post the corrected users
    .then(users => fetch('/updateUsers', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(users)})
    .then(res => res.json())
  ),
  // Hobbies
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
      // return hobbies;
      return corrected_hobbies;
    })
    .then(hobbies => 
      fetch('/updateHobbies', { method: 'post', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(hobbies)} )
      .then(res => res.json())
    ),
  fetch('/favorites', { method: "get", headers: { 'Content-Type': 'application/json'} })
  .then(response => response.json())
  .then((favorites) => {

    corrected_favorites = favorites.filter((favorite) => {
      if (!favorite.type) {
        favorite.type = "other"
        return favorite;
      }
    })

    // return favorites;
    return corrected_favorites;

  })
])

console.log('assignmentResult', assignmentResult);

// DO NOT DELETE THIS!  
function reset() {
  fetch('/reset');
}
