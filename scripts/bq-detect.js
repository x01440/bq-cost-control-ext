// The Google Cloud Console BigQuery status structure is
// <div class='query-validation-status'>
//   <button>Check mark for query status</button>
//   <div class='ng-star-inserted'>Query size here</div>
// </div>
const MAX_QUERY_SIZE = 500000 // In MB.
const NUMBER_REGEX = /[0-9]+\.[0-9]+/
const UNITS_REGEX = /[MB]|GB/
const MUTATION_OBSERVER_CONFIG = { attributes: true, childList: true, subtree: true };
const QUERY_MESSAGE_DIV_CLASS = 'query-validation-status';
const QUERY_RUN_BUTTON_CLASS = 'bqui-test-run-query';
const observers = {}; // {key: {node, observer, button}}
let elementCount = 0; // Unique identifier to map elements.

// Swallow logs if the console isn't available.
// The extension won't run without the console if it uses the console object.
const logger = {
    log: function(message) {
        if (console) {
            console.log(message);
        }
    }
}

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

function findMessageElementsAndAttachObserver() {
    // Select the nodes that will be observed for mutations.
    const targetNodes = document.getElementsByClassName(QUERY_MESSAGE_DIV_CLASS);
    
    for (const node of targetNodes) {
        let skipObserver = false;
        for (e in observers) {
            if (observers[e].node === node) {
                skipObserver = true;
            }
        }
        if (!skipObserver) {
            elementCount++;
            attachObserver(node, elementCount);
        }
    }

    // Check observers to see if the elements still exist. If not, remove
    // the observer from the object.
    let observersToDelete = []; // Keys of observers to delete.
    for (e in observers) {

    }

    // Reattach observers every 5 seconds to account for queries being run,
    // new tabs, and the fact that the query message DIV is destroyed on
    // each query run.
    logger.log('bq$: observer count ' + String(elementCount));
    logger.log('bq$: attached observers, trying again in 5s');
    setTimeout(findMessageElementsAndAttachObserver, 5000);
}

function attachObserver(targetNode, elementCount) {
    if (targetNode) {
        // console.log('targetNode', targetNode);
        // Try to get the button associated with the query message.
        // TODO This is brittle. Try to find a better way.
        const buttons = targetNode
            .parentElement
            .parentElement
            .parentElement
            .parentElement
            .parentElement
            .getElementsByClassName(QUERY_RUN_BUTTON_CLASS);
        const runButton = buttons[0];

        const callback = (mutationList, observer) => {
            if (mutationList && mutationList.length > 0) {
                const sizeOfQuery = getSizeOfQuery(targetNode);
                logger.log('bq$: Size of query: ' + String(sizeOfQuery) + ' MB');
                if (previousQuerySize != sizeOfQuery) {
                    if (sizeOfQuery > MAX_QUERY_SIZE) {
                        runButton.disabled = true;
                        chrome.runtime.sendMessage({message: 'invalidQuery'});
                    } else {
                        runButton.disabled = false;
                    }
                }
                previousQuerySize = sizeOfQuery;
            }
        };

        const observer = new MutationObserver(callback);
        // Save the observer to eventually remove it to avoid memory leaks.
        observers[elementCount] = {node: targetNode, observer: observer};
        observer.observe(targetNode, MUTATION_OBSERVER_CONFIG);
    }
}

findMessageElementsAndAttachObserver();
