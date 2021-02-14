Promise.all([tryUrl('/users'), tryUrl('/hobbies'), tryUrl('/favorites')])
.then((data) => {

  console.log('First data', data);
  // We want to map through the first array, which is data[0]
  
  const hobbies = data[1];
  
  // data[0].forEach((user, i) => {
    
  //   user.hobbies = data[1].filter((hobby) => {
  //     return hobby.user_id === user.id;
  //   })

  //   user.favorites = data[2].filter((favorite) => {
  //     return favorite.user_id === user.id;
  //   })

  // })

  data[0] = correctUsers(data[0], 'PA')
  data[1] = correctHobbies(data[1]),
  data[2] = correctFavorites(data[2])

  console.log('corrected data', data);

  return data;
})
.then(data => Promise.all(
  [
    tryUrl('/updateUsers', data[0], 'post'), 
    tryUrl('/updateHobbies', data[1], 'post'), 
    tryUrl('/updateFavorites', data[2],  'post')
  ]))
  .then(updatedData => {
    console.log('updatedData', updatedData);
    return updatedData;
  })
  .then((data) => {

    data[0].forEach((user) => {

      user.hobbies = data[1].filter((hobby) => {
        return hobby.user_id === user.id;
      })

    });

  })

  function simParents(children, childName) {
    return children.reduce(function(parents, child, i) {
      const parent = {
        id: children[i]['user_id'],
        [childName]: child
      };
      parents[i] = parent;
      return parents;
    }, []);
  }

  function tryUrl(url, data, method='get') { 
    return fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) || null })
    .then(res => res.json())
  }
  
  function correctUsers(users, state) {
    return users.filter((user) => { 
      if (!user.state) {
        user.state = state;
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
  