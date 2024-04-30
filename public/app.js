function fetchUsers() {
    fetch('http://localhost:3030/labs')
    .then(response => {
      //console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Assuming the server responds with JSON
    })
      .then(data => {
// Check if data is an array (valid JSON)
if (!Array.isArray(data)) {
  throw new Error('Invalid JSON format');
}

        console.log('Data received:', data); // Log the data received
        const usersDiv = document.getElementById('users');
        usersDiv.innerHTML = ''; // Clear existing content
        /*data.for(user => {
          const temp=user.temp;
          const humid=user.humid;
          const p = document.createElement('p');
          p.textContent = `temp: ${user.temp}, humid: ${user.humid}`;
          usersDiv.appendChild(p);
        });*/
        if (data.length > 0) {
          const user = data[data.length - 1]; // Get the last element
          const p = document.createElement('p');
          p.textContent = `temp: ${user.temp}, humid: ${user.humid}`;
          usersDiv.appendChild(p);
      }
      })
      .catch(error => {
        console.error('Error:', error);
        const usersDiv = document.getElementById('users');
        usersDiv.innerHTML = '<p>Error loading users. Please try again later.</p>';
      });      
  }
  
  // Fetch users initially and then every 60 seconds
  fetchUsers();
  //setInterval(fetchUsers, 60000);
  