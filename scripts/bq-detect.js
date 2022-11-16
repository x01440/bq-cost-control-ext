// The Google Cloud Console BigQuery status structure is
// <div class='query-validation-status'>
//   <button>Check mark for query status</button>
//   <div class='ng-star-inserted'>Query size here</div>
// </div>
const MAX_QUERY_SIZE = 20; // In MB.
const NUMBER_REGEX = /[0-9]+\.[0-9]+/
const UNITS_REGEX = /[MB]|GB/

function getSizeOfQuery(statusElement) {
    const childElements = statusElement.children;
    if (childElements.length > 0 && childElements[1]) {
        const queryLengthText = childElements[1].innerText;
        const size = queryLengthText.match(NUMBER_REGEX);
        if (size && size.length > 0) {
            let sizeVal = parseFloat(size);
            const queryUnits = queryLengthText.match(UNITS_REGEX);
            if (queryUnits.length > 0) {
                calculatedUnits = queryUnits[0];
                if (calculatedUnits === 'GB') {
                    sizeVal = sizeVal * 1000;
                }
            }
            return sizeVal;
        } else {
            return -1; // Error or no query to execute.
        }
    }
}

let hasAttachedObserver = false;
let previousQuerySize = 0;
function attachObserver() {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('.query-validation-status');
    const messageContainer = document.querySelector('.cfc-action-bar-layout-region.cfc-action-bar-section-right');

    if (targetNode && !hasAttachedObserver) {
        console.log('targetNode', targetNode);
        const config = { attributes: true, childList: true, subtree: true };

        const callback = (mutationList, observer) => {
            if (mutationList && mutationList.length > 0) {
                const sizeOfQuery = getSizeOfQuery(targetNode);
                console.log('Size of query: ' + String(sizeOfQuery) + ' MB');
                if (previousQuerySize != sizeOfQuery) {
                    const button = document.getElementsByClassName('bqui-test-run-query')[0];
                    if (sizeOfQuery > MAX_QUERY_SIZE) {
                        button.disabled = true;
                    } else {
                        button.disabled = false;
                    }
                }
                previousQuerySize = sizeOfQuery;
                // Add a closure to grab every tab query status field and
                // update the mutation listener for each
                // This can start by disabling all of the buttons.
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
        hasAttachedObserver = true;
    } else {
        console.log('*** Checking in 5 sec for query status...');
        setTimeout(attachObserver, 5000);
    }
}

attachObserver();


// How to change an icon.
//chrome.browserAction.setIcon({path:'images/newicon.png'});

// DIV with query message, may not disappear between queries:
// div.cfc-action-bar-layout-region.cfc-action-bar-section-right.ng-star-inserted

