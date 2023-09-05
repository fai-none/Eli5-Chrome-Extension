// Function to create popup at specified x, y coordinates with given text
function createPopup(text, x, y) {
    const existingPopup = document.getElementById('custom-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const popup = document.createElement('div');
    popup.id = 'custom-popup';
    popup.style.position = 'absolute';
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.padding = '10px';
    popup.style.backgroundColor = 'turquoise';
    popup.style.color = 'black';
    popup.style.fontFamily = 'monospace';
    popup.style.border = '0.5px solid #ccc';
    popup.style.zIndex = 10000;
  
    popup.innerText = text;
  
    document.body.appendChild(popup);
  }
  
  // Function to send selected text to Flask server
  async function sendTextToPython(text) {
    const url = 'http://127.0.0.1:5001/process_text';
    const payload = { selectedText: text };
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.result;
    } else {
      throw new Error('Failed to fetch');
    }
  }
  
  // Event listener for mouseup event to capture selected text
  document.addEventListener('mouseup', function (event) {
    const selectedText = window.getSelection().toString().trim();
  
    if (selectedText.length > 0) {
      sendTextToPython(selectedText)
        .then((response) => {
          createPopup(`${response}`, event.pageX, event.pageY);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  });
  