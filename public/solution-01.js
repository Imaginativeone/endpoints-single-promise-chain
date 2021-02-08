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
  let correctedUsers = organizedData[0];

  // correctedUsers.map((user) => {
  //   console.log('corrected-user', user);
  // });

  console.log('Connect the corrected users to the corrected hobbies');
  console.log('First, iterate through the hobbies, to see what I have');

  let correctedHobbies = organizedData[1];

  // correctedHobbies.map((hobby) => {
  //   console.log('corrected-hobby', hobby);
  // })

  // var myFirstObjArray = [{foo: 1, bar: 1}, {foo: 3, bar: 3}, {foo: 4, bar: 5}],
  // mySecondObjArray = [{foo: 2}, {foo: 4}, {foo: 5}],
  
  // firstArray  = myFirstObjArray.filter(o=> !mySecondObjArray.some(i=> i.foo === o.foo));
  // secondArray = mySecondObjArray.filter(o=> !myFirstObjArray.some(i=> i.foo === o.foo));
  
  // console.log(firstArray.map(o=> {return {'foo' :  o.foo}}))
  // console.log(secondArray.map(o=> {return {'foo' :  o.foo}}))
  
  let usersWithoutHobbies   = correctedUsers    .filter(o => !correctedHobbies.some(i => i.user_id === o.id));
  let hobbiesWithoutUsers   = correctedHobbies  .filter(o => !correctedUsers  .some(i => i.id === o.user_id));
  
  console.log('Updated Users with no hobbies', usersWithoutHobbies);
  console.log('Updated Hobbies with no users', hobbiesWithoutUsers);
  
  let usersWithHobbies = correctedUsers.map(user => {
    user.hobbies = correctedHobbies.filter((hobby) => {
      if (user.id === hobby.user_id) {
        return hobby;
      }
    })
    return user;
  })
  
  console.log('Updated Users WITH hobbies', usersWithHobbies);
  
  let correctedFavorites = organizedData[2];
  let favoritesWithoutUsers = correctedFavorites.filter(o => !correctedUsers  .some(i => i.id === o.user_id));
  console.log('Updated Favorites with no users', favoritesWithoutUsers);
  
  let usersWithHobbiesAndFavorites = usersWithHobbies.map((user) => {
    
    user.favorites = correctedFavorites.filter((favorite) => {
      if (user.id === favorite.user_id) {
        return favorite;
      }
    })
    return user;
  })

  console.log('Updated Users with hobbies and favorites', usersWithHobbiesAndFavorites);

  // correctedUsers.map((user) => {
    
  //   correctedHobbies.map((hobby) => {

  //     if (user.id === hobby.user_id) {
  //       console.log(`YES-MATCH | user.id: ${ user.id } | hobby.user_id: ${ hobby.user_id }`);
  //     } else {
  //       console.log(`NON-MATCH | user.id: ${ user.id } | hobby.user_id: ${ hobby.user_id } id: ${ hobby.id } name: ${ hobby.name }`);
  //       // console.log('hobby', hobby);
  //     }

  //   })
  // })

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
