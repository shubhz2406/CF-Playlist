document.getElementById('checkProfileButton').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: 'checkProfile' }, function(response) {
      console.log(response.status);
      alert(response.status); // Optional: Alert the user with the response
  });
});
