Promise.all([tryUrl('/users'), tryUrl('/hobbies'), tryUrl('/favorites')])
.then((data) => {

  console.log(data);
  // We want to map through the first array, which is data[0]
  
  const hobbies = data[1];
  
  data[0].forEach((user, i) => {
    
    user.hobbies = data[1].filter((hobby) => {
      return hobby.user_id === user.id;
    })

    user.favorites = data[2].filter((favorite) => {
      return favorite.user_id === user.id;
    })

  })
  
  // const hobbies_not_connected_to_users = data[1].filter((hobs, i, all_hobs) => { // hobbies not connected to users

  //   // We want to find where hobs.user_id !== user.id
  //   console.log('users[i]', users[i]);
  //   console.log('hobs', hobs);
  //   // return hobs.user_id === users[i].id;
  //   // return hobs;

  // })
  // console.log('Hello World');
  // console.log('hobbies_not_connected_to_users', hobbies_not_connected_to_users);

  data[0] = correctUsers(data[0], 'PA')
  data[1] = correctHobbies(data[1]),
  data[2] = correctFavorites(data[2])
  return data;
})
.then(data => Promise.all(
  [
    tryUrl('/updateUsers', data[0], 'post'), 
    tryUrl('/updateHobbies', data[1], 'post'), 
    tryUrl('/updateFavorites', data[2],  'post')]
    )
  )

  .then(updatedData => { 
    // console.log(updatedData)
    return updatedData;
  })
  .then((orgData) => {

    // console.log('orgData', orgData);

    // let hobsnousers = orgData[1].filter(h => !orgData[0].some(user => user.id === h.user_id));
    // let favsnousers = orgData[2].filter(f => !orgData[0].some(user => user.id === f.user_id));

    // const justUsers = orgData[0].map((user) => {
    //   user.user_id = user.id;
    //   return user;
    // })

    // console.log('justUsers', justUsers);

    // let users_hobs = orgData[0].map(user => {
    //   user.hobbies = orgData[1].filter(hobby => hobby.user_id === user.id)
    //   return user;
    // })
    // console.log('users_hobs', users_hobs);
    // let users_favs = orgData[0].map((user) => { 
    //   user.favorites = orgData[2].filter(favorite => { 
    //     if (user.id == favorite.user_id) {
    //       user.favorites = favorite;
    //       return favorite;
    //     }
    //   })
    //   return user;
    // })

    // const organizedData = users_hobs.concat(simParents(hobsnousers, 'hobbies'), simParents(favsnousers, 'favorites'));
    
    // // organizedData.sort((a, b) => {
    // //     return a.user_id - b.user_id;
    // //   }
    // // );
    
    // organizedData.sort((a, b) => {
    //     return a.id - b.id;
    //   }
    // );

    // console.log(organizedData); // Output
    
    // const hf = combo(hobsnousers, favsnousers);

  })

  function combo(h, f) {

    const ph = simParents(h, 'hobbies');
    const pf = simParents(f, 'favorites');

    let hobbyArray = [];
    let hobbiesArray = [];
    let favoritesArray = [];

    console.log (ph, pf);

    const simUser = [{
      hobbies: hobbyArray,
      favorites: favoritesArray
    }]
    
    ph.map((hobby) => {
      
      simUser.id = hobby.id;
      simUser.hobbies = hobbyArray;

      
      hobbyArray.push(hobby);
      
      pf.map((favorite) => {
        
        simUser.favorites = favoritesArray;
        favoritesArray.push(favorite);
        favoritesArray = [];
        
        
      })
      console.log('simUser', simUser);
      hobbyArray = [];
    })

  }
  
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
  