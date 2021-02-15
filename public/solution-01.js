Promise.all([tryUrl('/users'), tryUrl('/hobbies'), tryUrl('/favorites')])
.then((data) => {

  // console.log('First data', data);
  
  const hobbies = data[1];

  data[0] = correctUsers(data[0], 'PA')
  data[1] = correctHobbies(data[1]),
  data[2] = correctFavorites(data[2])

  // console.log('corrected data', data);

  return data;
})
.then(data => Promise.all(
  [
    tryUrl('/updateUsers', data[0], 'post'), 
    tryUrl('/updateHobbies', data[1], 'post'), 
    tryUrl('/updateFavorites', data[2],  'post')
  ]))
  .then(updatedData => {
    // console.log('updatedData', updatedData);
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

    const usrs = orgData[0];
    const hobs = simParents(orgData[1], 'hobbies');
    const favs = simParents(orgData[2], 'favorites');

    const allData = usrs.concat(hobs, favs);

    console.log('hobs', hobs);

    let seen = {};

    data = allData.filter(function(entry) {

      let previous;

      // console.log('entry', entry);
      // console.log('entry.label', entry.label);
      // console.log('entry.id', entry.id);

      // console.log('previous', previous);
      // console.log('seen', seen);

      // Have we seen this label before?
      if (seen.hasOwnProperty(entry.id)) {

        // console.log('seen.hasOwnProperty', seen.hasOwnProperty(entry.id));

        // Yes, grab it and add this data to it
        previous = seen[entry.id];
        console.log('previous = seen[entry.id]', previous);
        
        
        let entryProperties = Object.getOwnPropertyNames(entry);
        // console.log('entryProperties', entryProperties);
        
        let entryProperty = entryProperties[1];
        entry.entryProperty = entryProperty;
        
        console.log('entryProperties[1]', entryProperty);
        console.log('entry.entryProperty', entry[entryProperty]);
        // console.log('new properties', Object.getOwnPropertyNames(entry));
        
        console.log('allData', allData);

        return false;

      }

      seen[entry.id] = entry;

      return true;

    })

    console.log('orgData: data', data);

    // console.log('ph', ph);
    console.log('hello', orgData);

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
  