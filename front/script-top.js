let table = document.getElementById('table');


async function fetchUsers() {
  try {
    const response = await fetch('/users');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

(async () => {
  const users = await fetchUsers();
  users.sort((a, b) => b.earned - a.earned);
  console.log(users)
  /*const headerRow = table.insertRow();
  const nameHeader = headerRow.insertCell();
  nameHeader.textContent = 'Имя';

  const earnedHeader = headerRow.insertCell();
  earnedHeader.textContent = 'Выиграно';*/
  /*let c = 0;
  users.forEach((user) => {
    const row = table.insertRow();
    const nameCell = row.insertCell();
    nameCell.textContent = user.name;
    console.log(++c)
    const earnedCell = row.insertCell();
    earnedCell.textContent = user.earned;
  })*/

  for (let i = 0; i < 10; i++){
    const row = table.insertRow();
    const nameCell = row.insertCell();
    nameCell.textContent = users[i].name;
    //console.log(++c)
    const earnedCell = row.insertCell();
    earnedCell.textContent = users[i].earned;
  }
})();