console.log("Vtiger SmartFix: Content script injected");

// Function to detect ticket data from the page
function getTicketData() {
  // Vtiger ticket pages usually have a specific structure
  // This is a simplified version that tries to grab common ticket fields
  const ticketTitle = document.querySelector(".page-header [data-name='ticket_title']")?.textContent || 
                      document.title;
  const description = document.querySelector(".fieldValue [data-name='description']")?.textContent || "";
  const status = document.querySelector(".fieldValue [data-name='ticketstatus']")?.textContent || "";
  
  if (description || ticketTitle) {
    return {
      title: ticketTitle.trim(),
      description: description.trim(),
      status: status.trim(),
      url: window.location.href
    };
  }
  return null;
}

// Injects the "Analyze" button if on a ticket page
function injectAnalyzeButton() {
  if (document.getElementById("smartfix-analyze-btn")) return;

  const header = document.querySelector(".detailViewContainer .detailViewTitle") || 
                 document.querySelector(".page-header");
                 
  if (header) {
    const btn = document.createElement("button");
    btn.id = "smartfix-analyze-btn";
    btn.innerText = "✨ Analyze with SmartFix";
    btn.style.cssText = `
      margin-left: 10px;
      padding: 6px 12px;
      background-color: #0658D4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: background 0.2s;
    `;
    
    btn.onmouseover = () => btn.style.backgroundColor = "#0047b3";
    btn.onmouseout = () => btn.style.backgroundColor = "#0658D4";
    
    btn.onclick = () => {
      const data = getTicketData();
      chrome.runtime.sendMessage({ type: "OPEN_SIDE_PANEL", data });
    };

    header.appendChild(btn);
  }
}

// Watch for DOM changes to inject the button (Vtiger is often SPA-like)
const observer = new MutationObserver(injectAnalyzeButton);
observer.observe(document.body, { childList: true, subtree: true });

injectAnalyzeButton();
