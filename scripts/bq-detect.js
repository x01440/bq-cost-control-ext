// The Google Cloud Console BigQuery status structure is
// <div class='query-validation-status'>
//   <button>Check mark for query status</button>
//   <div class='ng-star-inserted'>Query size here</div>
// </div>
const statusElement = document.querySelector(".query-validation-status");
const MAX_QUERY_SIZE = 1; // In MB.
const NUMBER_REGEX = /[0-9]+\.[0-9]+/
const UNITS_REGEX = /[MB]|GB/

if (statusElement) {
    const childElements = statusElement.children;
    if (childElements.length > 0 && childElements[1]) {
        const queryLengthText = childElements[1].innerText;
        const size = queryLengthText.match(NUMBER_REGEX);
        if (size.length > 0) {
            let sizeVal = parseFloat(size);
            const queryUnits = queryLengthText.match(UNITS_REGEX);
            if (queryUnits.length > 0) {
                calculatedUnits = queryUnits[0];
                if (calculatedUnits === 'GB') {
                    sizeVal = sizeVal * 1000;
                }
            }
            const button = document.getElementsByClassName('bqui-test-run-query')[0];
            if (sizeVal > MAX_QUERY_SIZE) {
                button.disabled = true;
            } else {
                button.disabled = false;
            }
        }

    }
}
