



// Example using fetch to log a search term
async function logSearchTerm(userId, searchTerm) {
    const response = await fetch('http://localhost:8080/api/user-tracking/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, searchTerm }),
      credentials: 'include'
    });
    if (response.ok) {
      console.log('Search term logged');
    } else {
      console.error('Failed to log search term');
    }
  }
  
  // Example using fetch to log a clicked product
  async function logClickedProduct(userId, productId) {
    const response = await fetch('http://localhost:8080/api/user-tracking/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId }),
        credentials: 'include'
    });
    if (response.ok) {
      console.log('Product click logged');
    } else {
      console.error('Failed to log product click');
    }
  }


module.exports = { logSearchTerm, logClickedProduct };