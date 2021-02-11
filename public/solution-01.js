Promise.all([tryUrl('/users'), tryUrl('/hobbies'), tryUrl('/favorites')])
.then((data) => {
  data[0] = correctUsers(data[0])
  data[1] = correctHobbies(data[1]),
  data[2] = correctFavorites(data[2])
  return data;
})
.then(data => Promise.all(
  [
    tryUrl('/updateUsers', data[0], 'post'), 
    tryUrl('/updateHobbies', data[1], 'post'), 
    tryUrl('/updateFavorites', data[2],  'post')]))

  .then(updatedData => { 
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

    const organizedData = users_hobs.concat(simParents(hobsnousers, 'hobbies'), simParents(favsnousers, 'favorites'));
    
    // organizedData.sort((a, b) => {
    //     return a.user_id - b.user_id;
    //   }
    // );
    
    organizedData.sort((a, b) => {
        return a.id - b.id;
      }
    );

    console.log(organizedData); // Output
    
    const hf = combo(hobsnousers, favsnousers);

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
  