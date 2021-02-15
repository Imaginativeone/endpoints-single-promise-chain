Promise.all([tryUrl('/users'), tryUrl('/hobbies'), tryUrl('/favorites')])
.then((data) => {

  console.log('First data', data);
  
  const hobbies = data[1];

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
      user.favorites = data[2].filter((favorite) => {
        return favorite.user_id === user.id;
      })
    });
    return data;
  })
  .then((orgData) => {

    console.log('orgData', orgData);
    parentUserArray = [];

    orgData[0].forEach((arrayElement, i) => {

      // Create a Parent-set of users
      // Apply a Parent-set of users
      const parentUser = {};
      console.log('arrayElement', arrayElement);
      
      // If the element is an updated non-simulated user do this
      if (!arrayElement.user_id) { // non-simulated users
        
        // Parent-set-user gets the id
        parentUser.id = arrayElement.id;
        // console.log('parentUser.id', parentUser.id);

        parentUser.name = arrayElement.name;

        parentUser.last_updated = arrayElement.last_modified;

        // Parent-set-user gets the hobbies (array)
        parentUser.hobbies = arrayElement.hobbies;
        // console.log('parentUser.hobbies', parentUser.hobbies);
        
        // Parent-set-user gets the favorites (array)
        parentUser.favorites = arrayElement.favorites;
        // console.log('parentUser.favorites', parentUser.favorites);

        // Add this parentUser to a collection
        parentUserArray.push(parentUser);
        // console.log('parentUserArray: unit', parentUserArray);

      } else { // simulated users

        // console.log('arrayElement', arrayElement[i], i);

      }
    });

    console.log('parentUserArray', parentUserArray);

    // If the element is an updated simulated user, do this
      // Parent-set-user gets the user_id
      // Parent-set-user gets the hobbies (array)
        // If the item(s) in this array appear in the non-simulated user's hobbies array, then skip
      // Parent-set-user gets the favorites (array)
        // If the item(s) in this array appear in the non-simulated user's favorites array, then skip
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
  