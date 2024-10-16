console.log('Background script is running!');

// Function to fetch solved problems
function fetchSolvedProblems(handle) {
  fetch(`https://codeforces.com/api/user.status?handle=${handle}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'OK') {
        const solvedProblems = data.result
          .filter(submission => submission.verdict === 'OK')
          .map(submission => ({
            id: `${submission.problem.contestId}/${submission.problem.index}`,
            name: `${submission.problem.name}`
          }));

        chrome.storage.local.set({ solvedProblems }, function() {
          console.log('Solved problems updated!', solvedProblems);
        });
      } else {
        console.error('Error in API response:', data);
      }
    })
    .catch(err => console.error('Error fetching solved problems:', err));
}

// Function to get the handle from the active tab URL
function getHandleFromActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const url = tabs[0]?.url;
    if (url && url.includes('codeforces.com/profile/')) {
      const handle = url.split('/').pop();  // Extract the handle from the URL
      console.log('Extracted handle:', handle);
      fetchSolvedProblems(handle);
    } else {
      console.log('User is not on a Codeforces profile page or handle not found.');
      chrome.storage.local.set({ solvedProblems: [] }, function() {
        console.log('Cleared solved problems since handle not found.');
      });
    }
  });
}

// Listen for a click on a specific action (like a button in a popup)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkProfile') {
    getHandleFromActiveTab();
    sendResponse({ status: 'Profile check initiated.' });
  }
});

// Create an alarm to fetch problems periodically (optional)
chrome.alarms.create('fetchSolvedProblems', { periodInMinutes: 60 });
