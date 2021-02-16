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
    const hobs = addTypeFlag(orgData[1], 'updatedHobby');
    const favs = addTypeFlag(orgData[2], 'updatedFavorite');

    const data = usrs.concat(hobs, favs);
    console.log('combined data', data);

    let genObject = {};

    let result = data.reduce((accumulator, element) => {

      let genId = element.user_id ? element.user_id : element.id;

      if (element.infotype === 'updatedUser') {
        genObject[element.id] = {
          id: element.id,
          name: element.name,
          last_updated: element.last_modified,
        }
        if (element.hobbies.length)   genObject[element.id].hobbies   = element.hobbies;
        if (element.favorites.length) genObject[element.id].favorites = element.favorites;
      }

      if (element.infotype === 'updatedHobby') {
        genObject[element.user_id] = {
          id: element.user_id,
          hobbies: element
        }
      }

      if (element.infotype === 'updatedFavorite') {
        genObject[element.user_id] = {
          id: element.user_id,
          favorites: element
        }

      }
      
      accumulator.push(genObject[genId]);
      return accumulator;

    }, [])
    .sort((a, b) => a.id-b.id);

    let o = {};
    const result1 = result.reduce((r, el) => {

      let e = el.id;
      
      const hobArray = [];
      const favArray = [];

      if (!o[e]) {

        o[e] = {};
        o[e].id = el.id;

        if (el.name)         o[e].name = el.name;
        if (el.last_updated) o[e].last_updated = el.last_updated;

        if (el.hobbies   !== undefined) { 
          hobArray.push(el.hobbies);
          o[e].hobbies = hobArray;
        };
        
        if (el.favorites !== undefined) { 
          favArray.push(el.favorites);
          o[e].favorites = favArray; 
        };
        r.push(o[e]);

      } else {

        // TODO: Current Development, refactor into a function
        preserveArray(o[e].hobbies,   o[e].favorites, el.hobbies);
        // preserveArray(o[e].favorites, o[e].hobbies,   el.favorites);

        preserveArray(o[e].favorites, o[e].hobbies, el.favorites);

        if (el.favorites) {
          // console.log('el.favorites', el.favorites);
          if (o[e].hobbies) {
            favArray.push(el.favorites);
            o[e].favorites = favArray;
          }
        }

      }
      return r;
    }, [])

    console.log('result', result);
    console.log('result1', result1);
    console.log('orgData', orgData);

  })

  // TODO: Current Development, Why doesn't this alrady work?
  function preserveArrayF(newArray, existingArray, content) {
    
    const _array = [];
    
    if (newArray && existingArray && content) {
      console.log('Preserving Array', newArray, existingArray, content);
    } else {
      console.log('**********');
    }

    // console.log('content', content);

    if (content) {
      console.log('Content exists', content);

      if (existingArray) {
        console.log('An existingArray exists', existingArray);
        _array.push(existingArray);
        console.log('localArray', _array);
      }

    }

  }


  function preserveArray(newArray, existingArray, content) {

    const _array = [];

    if (newArray && existingArray && content) {
      // console.log('Preserving Array', newArray, existingArray, content);
    } else {
      // console.log('**********');
    }

    // // console.log('content', content);
    
    if (content) {
      
      // console.log('Content exists', content);
      
      if (existingArray) {

        // console.log('An existingArray exists', existingArray);
        // _array.push(existingArray);
        // console.log('localArray', _array);
        // console.log(newArray.join() + 'sent back');
        
        newArray = content;

        // newArray = _array;

      } else {

        // // console.log('Non-existing Array');

      }
    }

  }

  function addTypeFlag(array, type) {
    array.map((item) => {      
      item.infotype = type;
    });
    return array;
  }

  // function simParents(children, childName) {

  //   return children.reduce(function(parents, child, i) {

  //     // console.log('simParents: child', child);

  //     const parent = {
  //       id: children[i]['user_id'],
  //       [childName]: child
  //     };

  //     // parents[i] = parent;
  //     parents.push(parent);
  //     return parents;

  //   }, []);
  // }

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
  