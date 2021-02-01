const assignmentResult = Promise.all([
  // Correct Users
  fetch('/users', { method: 'get', headers: { 'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(users => {
      users.filter(individual_user => individual_user.state ? individual_user : individual_user.state = "PA")
      return users;
    })
    // Post the corrected users
    .then(users => fetch('/updateUsers', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(users)})
    .then(res => res.json())
  ),
  // Uncorrected Hobbies
  fetch('/hobbies', { method: 'get', headers: { 'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then((hobbies) => {
      hobbies.filter((hobby) => {
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
      return hobbies;
    })
    .then(hobbies => 
      fetch('/updateHobbies', { method: 'post', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(hobbies)} )
      .then(res => res.json())
    ),
  fetch('/favorites', { method: "get", headers: { 'Content-Type': 'application/json'} })
  .then(response => response.json())
  .then((favorites) => {
    console.log('favorites', favorites);
    // return favorites.map(favoriteUnit => !favoriteUnit.type ? favoriteUnit.type = "other" : favoriteUnit.type)
   
    const corrected_favorites = favorites.filter((favoriteUnit) => {
      if (!favoriteUnit.type) {
        favoriteUnit.type = "other"
        return favoriteUnit;
      }
    })

    console.log('corrected_favorites', corrected_favorites);

    fetch('/updateFavorites', { method: "post", headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(corrected_favorites) })
    .then(res => res.json())
    .then(corrected_favorites => {
      let hey = document.createElement('div');
      hey.innerHTML = JSON.stringify(corrected_favorites);
      document.getElementById('main').appendChild(hey);
    })

    return favorites;

  })
  .then((info) => {
    console.log('info', info);
  })
])

console.log('assignmentResult', assignmentResult);

// DO NOT DELETE THIS!  
function reset() {
  fetch('/reset');
}
