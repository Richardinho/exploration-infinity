const results = [
  { name: 'Rich' },
  { name: 'Bab' },
  { name: 'Alice'},
  { name: 'Sam' },
  { name: 'Mike' },
  { name: 'Bob' },
  { name: 'Sally' },
  { name: 'Lucy' },
  { name: 'Rebecca' },
  { name: 'Cenk' },
  { name: 'Anita' },
  { name: 'matthew' },
  { name: 'Alex' }
];

function sortResults(results) {
  return results.slice(0).sort((a, b) => {
    a = a.name.toLowerCase();
    b = b.name.toLowerCase();

    if (a > b) {
      return 1;
    } else if(a < b) {
      return -1;
    }
    return 0;
  });
}

const resultsService = {
  getResults: (query) => {
    const limit = query.limit || 5;
    const offset = query.offset || 0;

    return sortResults(results).slice(offset, limit); 
  }
}

module.exports = resultsService;
