const link = document.createElement('link');
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
link.rel = 'stylesheet';
document.head.appendChild(link);
const linkFont = document.createElement('link');
linkFont.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap';
linkFont.rel = 'stylesheet';
document.head.appendChild(linkFont);
// Add 'Add to Playlist' button on contest problem pages
if (window.location.href.includes('/contest/') && window.location.href.includes('/problem/')) {
    const addButton = document.createElement('button');
    addButton.innerHTML = '<h5 style="margin-top: 0;">Add</h5>';
    addButton.classList.add('add-button');  // Use the class from CSS file
    
    const problemHeader = document.querySelector('.problemindexholder .title');
    
    if (problemHeader) {
        const problemNameWithIndex = problemHeader.textContent.trim();  // Extract problem name
        const problemName = problemNameWithIndex.split(". ")[1];
        problemHeader.appendChild(addButton);

        addButton.onclick = function() {
            const pathSegments = window.location.pathname.split('/');
            const contestId = pathSegments[pathSegments.length - 3];
            const problemIndex = pathSegments[pathSegments.length - 1];
            const problemId = `${contestId}/${problemIndex}`;
            console.log('Adding problem:', problemId);
            
            chrome.storage.local.get({ playlist: [] }, function(data) {
                const { playlist } = data;
                
                // Check if the problem is already in the playlist
                if (playlist.some(item => item.id === problemId)) {
                    alert('This problem is already in your playlist!');
                    return;
                }

                // Create an object with problem ID and name
                const newProblem = { id: problemId, name: problemName };

                const updatedPlaylist = [...playlist, newProblem];  // Add the new problem
                chrome.storage.local.set({ playlist: updatedPlaylist }, function() {
                    alert('Problem added to playlist!');
                });
            });
        };
    } else {
        console.error('Problem title element not found.');
    }
}

if (window.location.href.includes('/problemset/problem')) {
    const addButton = document.createElement('button');
    addButton.innerHTML = '<h5 style="margin-top: 0;">Add</h5>';
    addButton.classList.add('add-button');  // Use the class from CSS file
    
    const problemHeader = document.querySelector('.problemindexholder .title');
    
    if (problemHeader) {
        const problemNameWithIndex = problemHeader.textContent.trim();  // Extract problem name
        const problemName = problemNameWithIndex.split(". ")[1];
        problemHeader.appendChild(addButton);

        addButton.onclick = function() {
            const pathSegments = window.location.pathname.split('/');
            const contestId = pathSegments[pathSegments.length - 2];
            const problemIndex = pathSegments[pathSegments.length - 1];
            const problemId = `${contestId}/${problemIndex}`;
            console.log('Adding problem:', problemId);
            
            chrome.storage.local.get({ playlist: [] }, function(data) {
                const { playlist } = data;
                
                // Check if the problem is already in the playlist
                if (playlist.some(item => item.id === problemId)) {
                    alert('This problem is already in your playlist!');
                    return;
                }

                // Create an object with problem ID and name
                const newProblem = { id: problemId, name: problemName };

                const updatedPlaylist = [...playlist, newProblem];  // Add the new problem
                chrome.storage.local.set({ playlist: updatedPlaylist }, function() {
                    alert('Problem added to playlist!');
                });
            });
        };
    } else {
        console.error('Problem title element not found.');
    }
}

// Profile page code (for playlist)
if (window.location.href.includes('/profile/')) {
    const updateAndRenderPlaylist = () => {
        const menu = document.querySelector(".second-level-menu");
        chrome.storage.local.get(['solvedProblems', 'playlist', 'bookmarkedProblems'], function(data) {
            let { solvedProblems = [], playlist = [], bookmarkedProblems = [] } = data;

            const pageContent = document.querySelector('#pageContent');

            const playlistSection = document.createElement('div');
            playlistSection.classList.add('playlist-section');
            
            
            const shuffleButton = document.createElement('button');
            shuffleButton.innerHTML = '<i class="fas fa-random"></i>';
            shuffleButton.classList.add('shuffle-button');
            shuffleButton.onclick = function() {
                console.log('playlist lenght',playlist.length);
                for (let i = playlist.length - 1; i > 0; i--) {
                    const randomIndex = Math.floor(Math.random() * (i+1));
                    console.log(randomIndex);
                    [playlist[i], playlist[randomIndex]] = [playlist[randomIndex], playlist[i]];
                }
                chrome.storage.local.set({ playlist: playlist }, updateAndRenderPlaylist);
            };

            playlistSection.appendChild(shuffleButton);

            const playlistContainer = document.createElement('div');
            playlistContainer.classList.add('playlist-container');
            playlistContainer.innerHTML = '<h5 style="font-weight: 300; padding-bottom: 4px;">Pseudo Random Practice</h5>';
            
            if (playlist.length === 0) {
                playlistSection.innerHTML += '<p>No problems in your playlist.</p>';
            } else {
                let cnt = 0;
                playlist.forEach(problemId => {
                    const problemItem = document.createElement('div');
                    problemItem.classList.add('problem-item');

                    const problemLink = document.createElement('a');
                    problemLink.href = `/contest/${problemId["id"].split('/')[0]}/problem/${problemId["id"].split('/')[1]}`;
                    problemLink.innerHTML = `${problemId.name}`;
                    problemLink.classList.add('problem-link');
                    
                    const isSolved = solvedProblems.some(solved => solved.id === problemId.id);

                    if (isSolved) {
                        problemLink.classList.add('solved-problem');
                        // problemLink.innerHTML += ' (Solved)';
                    }

                    const removeButton = document.createElement('button');
                    // removeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>'; 
                    removeButton.innerHTML = '<img src="https://codeforces.com/codeforces.org/s/50148/images/actions/delete.png" width="16" height="16">'; 
                    removeButton.classList.add('remove-button');
                    removeButton.onclick = function() {
                        chrome.storage.local.get({ playlist: [] }, function(data) {
                            // Filter out the problem object by comparing IDs
                            const updatedPlaylist = data.playlist.filter(problem => problem.id !== problemId.id);
                            chrome.storage.local.set({ playlist: updatedPlaylist }, updateAndRenderPlaylist);
                        });
                    };

                    const bookmarkButton = document.createElement('button');
                    const isBookmarked = bookmarkedProblems.some(bookmarked => bookmarked.id === problemId.id);
                    // bookmarkButton.innerHTML = isBookmarked ? '<i class="fas fa-bookmark"></i>' : '<i class="far fa-bookmark"></i>'; 
                    bookmarkButton.innerHTML = isBookmarked ? '<img src="https://codeforces.com/codeforces.org/s/50148/images/icons/star_yellow_16.png" width="16" height="16">' : '<img src="https://codeforces.com/codeforces.org/s/50148/images/icons/star_gray_16.png" width="16" height="16">'; 
                    bookmarkButton.classList.add('bookmark-button');
                    bookmarkButton.onclick = function() {
                        chrome.storage.local.get({ bookmarkedProblems: [] }, function(data) {
                            const currentlyBookmarked = data.bookmarkedProblems.some(bookmarked => bookmarked.id === problemId.id);
                            const updatedBookmarkedProblems = currentlyBookmarked 
                            ? data.bookmarkedProblems.filter(bookmarked => bookmarked.id !== problemId.id)
                            : [...data.bookmarkedProblems, { id: problemId.id, name: problemId.name }]; // Ensure the new entry is an object
                
                            chrome.storage.local.set({ bookmarkedProblems: updatedBookmarkedProblems }, updateAndRenderPlaylist);
                        });
                    };

                    if(isSolved)
                    {
                        problemItem.style.backgroundColor = '#d4edc9';

                    }
                    else {
                        if(cnt%2) problemItem.style.backgroundColor = '#ffffff';
                    }
                    cnt = cnt + 1;

                    // problemLink.style.color = isSolved ? 'green' : (isBookmarked ? '#e0b710' : 'blue');

                    problemItem.appendChild(problemLink);
                    problemItem.appendChild(removeButton);
                    problemItem.appendChild(bookmarkButton);
                    
                    playlistContainer.appendChild(problemItem);
                });
            }

            playlistSection.appendChild(playlistContainer);
            pageContent.replaceChildren(menu, playlistSection);
        });
    };

    const tabContainer = document.querySelector('.second-level-menu-list');
    if (tabContainer) {
        const playlistTab = document.createElement('li');
        const playlistLink = document.createElement('a');
        playlistLink.href = '#playlist';
        playlistLink.innerHTML = 'My Playlist';
        playlistTab.appendChild(playlistLink);
        tabContainer.appendChild(playlistTab);

        playlistLink.onclick = function(event) {
            event.preventDefault();
            updateAndRenderPlaylist();
        };
    }
}
