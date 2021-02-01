const assignmentResult = Promise.all([
  // All Users
  // fetch('/users', { method: 'get', headers: { 'Content-Type': 'application/json'}})
  //   .then(user_response => user_response.json()),
 
  // Correct Users
  fetch('/users', { method: 'get', headers: { 'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then((users) => {
      const corrected_users = users.filter((individual_user) => {
        if (!individual_user.state) {
          individual_user.state = "PA"
          return individual_user;
        }
      })
      console.log('corrected_users', corrected_users);
      // return corrected_users;
      return users;
    })

    // Post the corrected users
    .then(users => fetch('/updateUsers',
                          {
                            method: 'post',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(users)
                          })
    .then(res => res.json())
    .then(users => {
      console.log('posted users', users);
      return users;
    })
  )

//   Potential array element goes here
//   fetch('/hobbies', { method: 'get', headers: { 'Content-Type': 'application/json'}})
//     .then(hobby_response => hobby_response.json())
//     .then((hobbies) => {
   
//     const c_hobbies = hobbies.filter((hobby) => {
 
//       if(!hobby.experience) {
 
//         switch(hobby.years_played) {
 
//           case 1:
//             hobby.experience = 'beginner';
//             break;
//           case 2:
//             hobby.experience = 'advanced';
//             break;
//           case 3:
//             hobby.experience = 'expert';
//             break;
//         }
//         return hobby;
//       }
 
//     })
//     return c_hobbies;
//   })
//   .then(hobbies =>
//     fetch('/updateHobbies', { method: 'post', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(hobbies)} )
//     .then(res => res.json())
//     .then(hobbies => {
//       console.log('posted hobbies', hobbies);
//       return hobbies;
//     })
//   )
])

console.log('assignmentResult', assignmentResult);

// If I needed to find all of the hobbies for a person, I would do something like
// users.map(user => {
//   user.hobbies = hobbies.filter(hobby => hobby.user_id == user.id);
 
//   return user;
// })

// let users = [
//   {"id":2,"name":"Rob","age":40,"city":"Harrisburg","state":"Test","last_modified":""}
// ];

// let hobbies = [
//   {"id":20,"user_id":2,"name":"golf","years_played":1,"experience":"expert","last_modified":""},
//   {"id":41,"user_id":4,"name":"knitting","years_played":2,"experience":"beginner","last_modified":""}
 
// ];

// let favorites = [
//   {"id":11,"user_id":1,"name":"Corlaline","type":"new","last_modified":""},
//   {"id":22,"user_id":2,"name":"Pizza","type":"newer","last_modified":""},
//   {"id":62,"user_id":6,"name":"Ice cream","type":"newest","last_modified":""},
// ];

// fetch('/updateUsers', { method: "post", headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(users) })
//   .then(res => res.json())
//   .then(users => {
//     let hey = document.createElement('div');
//     hey.innerHTML = JSON.stringify(users);
//     document.getElementById('main').appendChild(hey);

//     return fetch('/updateHobbies', { method: "post", headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(hobbies) })
//   })
//   .then(res => res.json())
//   .then(hobbies => {
//     let hey = document.createElement('div');
//     hey.innerHTML = JSON.stringify(hobbies);
//     document.getElementById('main').appendChild(hey);
   
//     return fetch('/updateFavorites', { method: "post", headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(favorites) })
//   })
//   .then(res => res.json())
//   .then(faves => {
//     let hey = document.createElement('div');
//     hey.innerHTML = JSON.stringify(faves);
//     document.getElementById('main').appendChild(hey);
//   })

// // DO NOT DELETE THIS!  
// function reset() {
//   fetch('/reset');
// }
