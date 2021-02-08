Promise.all([tryUrl('/users'), tryUrl('/hobbies'), tryUrl('/favorites')])
.then((data) => {
  data[0] = correctUsers(data[0])
  data[1] = correctHobbies(data[1]),
  data[2] = correctFavorites(data[2])
  return data;
})
.then(data => Promise.all([tryUrl('/updateUsers', data[0], 'post'), tryUrl('/updateHobbies', data[1], 'post'), tryUrl('/updateFavorites', data[2],  'post')]))
.then(updatedData => {

  updatedData[0].map((user) => {
    console.log('user', user.name);
    updatedData[1].map((hobby) => {
      if (user.id === hobby.user_id) { 
        console.log('hobby', hobby);
      }
    })
  });

  // console.log(updatedData);
  return updatedData;
})
.then((finalData) => {

  finalData.forEach((datum) => {

    console.log('datum', datum);

  })

})

function tryUrl(url, data, method='get') {

  body = (method==='post') ? JSON.stringify(data) : null;
  
  return fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: body })
  .then(res => res.json())

}

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
