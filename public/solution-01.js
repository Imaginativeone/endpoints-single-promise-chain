const assignmentResult = Promise.all(
  [
    usersPromise      = fetch('/users',     { method: 'get', headers: { 'Content-Type': 'application/json'}}).then((res) => res.json()),
    hobbiesPromise    = fetch('/hobbies',   { method: 'get', headers: { 'Content-Type': 'application/json'}}).then((res) => res.json()),
    favoritesPromise  = fetch('/favorites', { method: 'get', headers: { 'Content-Type': 'application/json'}}).then((res) => res.json())
  ]
)
.then((data) => {

  console.log('data', data);
  return data;

})
.then(data => Promise.all(
  [
    correctUsers(data[0]),
    correctHobbies(data[1]),
    correctFavorites(data[2])
  ])
)
.then()

console.log('assignmentResult', assignmentResult);

function correctUsers(users) {
  users.filter((user) => {
    if (!user.state) {
      user.state = "PA";
    }
    return user;
  })
  console.log('corrected_users', users);
  return users;
}

function correctHobbies(hobbies) {
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
  console.log('corrected_hobbies', hobbies);
  return hobbies;
}

function correctFavorites(favorites) {
  favorites.filter((favorite) => {
    if (!favorite.type) {
      favorite.type = "other"
      return favorite;
    }
  })
  console.log('favorites', favorites);
  return favorites;
}
