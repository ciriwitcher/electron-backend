async function login() {
  const key = document.getElementById('accessKey').value.trim();

  if (!key) {
    showModal('Error', 'Please enter the access key.');
    return;
  }

  try {
    const response = await fetch('postgresql://postgres:ynnOQeAoEPlneWRRxeoGDRFKRgNMtAYG@crossover.proxy.rlwy.net:10229/railway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      loadDashboard(); 
    } else {
      showModal('Access Denied', data.message || 'Wrong key.');
    }
  } catch (error) {
    showModal('Network Error', 'An unexpected error occurred.');
    console.error(error);
  }
}
