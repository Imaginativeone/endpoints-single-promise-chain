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

    console.log('orgData', orgData);

    const usrs = addTypeFlag(orgData[0], 'updatedUser');
    // const hobs = simParents(orgData[1], 'hobby');
    // const favs = simParents(orgData[2], 'favorite');

    const hobs = addTypeFlag(orgData[1], 'updatedHobby');
    const favs = addTypeFlag(orgData[2], 'updatedFavorite');

    const data = usrs.concat(hobs, favs);
    console.log('combined data', data);

    let genObject = {};

    let result = data.reduce((accumulator, element) => {

      let id;

      // Take the first object in the array called data
      if (element.infotype === 'updatedUser') {

        id = element.id;

        genObject[element.id] = {
          id: element.id,
          last_updated: element.last_modified,
        }

        // TODO: ternary operator
        if (element.hobbies.length < 1) {
        } else {
          genObject[element.id].hobbies = element.hobbies;
        }

        // TODO: ternary operator
        if (element.favorites.length < 1) {
        } else {
          genObject[element.id].favorites = element.favorites;
        }

        // console.log('updated user');
        // console.log('genObject', genObject[element.id]);

      }

      if (element.infotype === 'updatedHobby') {

        id = element.user_id;

        genObject[element.user_id] = {
          id: element.user_id,
          hobbies: element
        }
        // console.log('updated hobby');
        // console.log('genObject', genObject[element.user_id]);

      }
      if (element.infotype === 'updatedFavorite') {

        id = element.user_id;

        genObject[element.user_id] = {
          id: element.user_id,
          favorites: element
        }
        // console.log('updated favorite');
        // console.log('genObject', genObject[element.user_id]);
      }
      
      // console.log('object', object);
      
      accumulator.push(genObject[id]);
      // console.log('accumulator', accumulator);

      return accumulator;

    }, [])
    .sort((a, b) => a.id-b.id);

    let o = {};
    const result1 = result.reduce((r, el) => {

      // console.log('el', el);

      let e = el.id;
      // console.log('e', e);

      if (!o[e]) {
        o[e] = {};
        o[e].id = el.id;
        o[e].hobbies = el.hobbies;
        o[e].favorites = el.favorites;
        r.push(o[e]);
      } else {

        if (el.hobbies) {
          console.log('el.favorites', el.hobbies);
          if (o[e].favorites) {
            console.log('Add to this', o[e]);
            o[e].hobbies = el.hobbies;
          }
        }

        if (el.favorites) {
          console.log('el.favorites', el.favorites);
          if (o[e].hobbies) {
            console.log('Add to this', o[e]);
            o[e].favorites = el.favorites;
          }
        }

      }
      return r;
    }, [])

    // console.log('organizedData', organizedData);

    console.log('result', result);
    console.log('result1', result1);
    console.log('orgData', orgData);

  })

  function addTypeFlag(array, type) {
    array.map((item) => {      
      item.infotype = type;
    });
    return array;
  }

  function simParents(children, childName) {

    return children.reduce(function(parents, child, i) {

      // console.log('simParents: child', child);

      const parent = {
        id: children[i]['user_id'],
        [childName]: child
      };

      // parents[i] = parent;
      parents.push(parent);
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
  