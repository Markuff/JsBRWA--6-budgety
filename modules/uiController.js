import { CONSTS_STRINGS } from './parameters.js';

let uiController;

uiController = (function() {
    let formatNumbers,
        nodeListForEach;

    formatNumbers = function(number, type) {
        let decimal,
            integer,
            sign,
            splittedNumber;

        number = Math.abs(number);
        number = number.toFixed(2);
        splittedNumber = number.split('.');
        decimal = splittedNumber[1];
        integer = splittedNumber[0];

        if (integer.length > 3) {
            integer = `${integer.substr(0, integer.length - 3)},${integer.substr(integer.length - 3, 3)}`;
        }

        type === CONSTS_STRINGS.STRINGS.EXP ? sign = CONSTS_STRINGS.STRINGS.MINUS : sign = CONSTS_STRINGS.STRINGS.PLUS;

        return `${sign} ${integer}.${decimal}`;
    };

    nodeListForEach = function(list, callback) {
        for(let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        addListItem: function(obj, type) {
            let listItemContainer,
                listItemHTML,
                listItemHTMLData;

            if (type === CONSTS_STRINGS.STRINGS.EXP) {
                listItemContainer = CONSTS_STRINGS.CLASSES.EXPENSES_LIST_CONTAINER;
                listItemHTML = CONSTS_STRINGS.HTML.EXPENSE;
            } else if (type === CONSTS_STRINGS.STRINGS.INC) {
                listItemContainer = CONSTS_STRINGS.CLASSES.INCOMES_LIST_CONTAINER;
                listItemHTML = CONSTS_STRINGS.HTML.INCOME;
            }

            listItemHTMLData = listItemHTML.replace(CONSTS_STRINGS.STRINGS.REPLACE_DESCRIPTION, obj.description);
            listItemHTMLData = listItemHTMLData.replace(CONSTS_STRINGS.STRINGS.REPLACE_ID, obj.id);
            listItemHTMLData = listItemHTMLData.replace(CONSTS_STRINGS.STRINGS.REPLACE_VALUE, formatNumbers(obj.value, type));

            document.querySelector(listItemContainer).insertAdjacentHTML(CONSTS_STRINGS.PARAMETERS.BEFORE_END, listItemHTMLData);
        },
        changeType: function() {
            let button,
                fields;

            button = document.querySelector(CONSTS_STRINGS.CLASSES.ADD_BTN);
            fields = document.querySelectorAll(`${CONSTS_STRINGS.CLASSES.ADD_DESCRIPTION},${CONSTS_STRINGS.CLASSES.ADD_TYPE},${CONSTS_STRINGS.CLASSES.ADD_VALUE}`);

            button.classList.toggle(CONSTS_STRINGS.STRINGS.RED);
            nodeListForEach(fields, function(current) {
                current.classList.toggle(CONSTS_STRINGS.STRINGS.RED_FOCUS);
            });
        },
        clearFields: function() {
            let listArray,
                listFields;

            // listFields is a list not an array
            listFields = document.querySelectorAll(`${CONSTS_STRINGS.CLASSES.ADD_DESCRIPTION} , ${CONSTS_STRINGS.CLASSES.ADD_VALUE}`);
            // By using the Array prototype methods we can trick the list into an Array
            listArray = Array.prototype.slice.call(listFields);

            listArray.forEach(function(currentArrayValue, currentIndex, fullArray) {
                currentArrayValue.value = "";
            });

            listArray[0].focus();
        },
        closeOverlay: function() {
            document.getElementById(CONSTS_STRINGS.STRINGS.OVERLAY).style.display = CONSTS_STRINGS.STRINGS.NONE;
        },
        deleteListItem: function(selectorId) {
            let element;

            element = document.getElementById(selectorId);
            element.parentNode.removeChild(element);
        },
        displayBudget: function(obj) {
            let type;

            obj.totalBudget > 0 ? type = CONSTS_STRINGS.STRINGS.INC : type = CONSTS_STRINGS.STRINGS.EXP;

            document.querySelector(CONSTS_STRINGS.CLASSES.BUDGET_LABEL).textContent = formatNumbers(obj.totalBudget, type);
            document.querySelector(CONSTS_STRINGS.CLASSES.BUDGET_EXPENSE_LABEL).textContent = formatNumbers(obj.totalExpence, CONSTS_STRINGS.STRINGS.EXP);
            document.querySelector(CONSTS_STRINGS.CLASSES.BUDGET_INCOME_LABEL).textContent = formatNumbers(obj.totalIncome, CONSTS_STRINGS.STRINGS.INC);

            if (obj.totalPercentage > 0) {
                document.querySelector(CONSTS_STRINGS.CLASSES.BUDGET_PERCENTAGE_LABEL).textContent = `${obj.totalPercentage}%`;
            } else {
                document.querySelector(CONSTS_STRINGS.CLASSES.BUDGET_PERCENTAGE_LABEL).textContent = CONSTS_STRINGS.STRINGS.PERCENTAGE_LESS_THAN_ONE;
            }
        },
        displayDate: function() {
            let month,
                now,
                year;
            
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            year = year.toString();

            document.getElementById(CONSTS_STRINGS.STRINGS.MONTH).options[month].selected = true;

            for (let element in document.getElementById(CONSTS_STRINGS.STRINGS.YEAR).options) {
                if (document.getElementById(CONSTS_STRINGS.STRINGS.YEAR).options[element].value === year) {
                    document.getElementById(CONSTS_STRINGS.STRINGS.YEAR).options[element].selected = true;
                }
            };

            return {
                selectedMonth: CONSTS_STRINGS.OTHER.MONTHS[month],
                selectedYear: year.toString()
            };
        },
        displayPercentages: function(percentages) {
            let fields;

            fields = document.querySelectorAll(CONSTS_STRINGS.CLASSES.EXPENSE_ITEM_PERCENTAGE);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = `${percentages[index]}%`;
                } else {
                    current.textContent = CONSTS_STRINGS.STRINGS.PERCENTAGE_LESS_THAN_ONE;
                }
            });
        },
        getDate: function() {
            return {
                selectedMonth: document.getElementById(CONSTS_STRINGS.STRINGS.MONTH).value,
                selectedYear: document.getElementById(CONSTS_STRINGS.STRINGS.YEAR).value
            }
        },
        getInput: function() {
            return {
                description: document.querySelector(CONSTS_STRINGS.CLASSES.ADD_DESCRIPTION).value,
                // type is either "inc" or "exp", values from the select options input
                type: document.querySelector(CONSTS_STRINGS.CLASSES.ADD_TYPE).value,
                value: parseFloat(document.querySelector(CONSTS_STRINGS.CLASSES.ADD_VALUE).value)
            }
        },
        getInputOverlay: function() {
            return {
                description: document.querySelector(CONSTS_STRINGS.CLASSES.UPDATE_DESCRIPTION).value,
                value: parseInt(document.querySelector(CONSTS_STRINGS.CLASSES.UPDATE_VALUE).value)
            }
        },
        openOverlay: function(desc, type, val) {
            if (type === CONSTS_STRINGS.STRINGS.EXP) {
                document.querySelector(CONSTS_STRINGS.CLASSES.CLOSE_OVERLAY_BTN).classList.toggle(CONSTS_STRINGS.STRINGS.RED);
                document.querySelector(CONSTS_STRINGS.CLASSES.UPDATE_BTN).classList.toggle(CONSTS_STRINGS.STRINGS.RED_BACKGROUND);
                document.querySelector(CONSTS_STRINGS.CLASSES.UPDATE_DESCRIPTION).classList.toggle(CONSTS_STRINGS.STRINGS.RED_FOCUS);
                document.querySelector(CONSTS_STRINGS.CLASSES.UPDATE_VALUE).classList.toggle(CONSTS_STRINGS.STRINGS.RED_FOCUS);
            }

            document.getElementById(CONSTS_STRINGS.STRINGS.OVERLAY).style.display = CONSTS_STRINGS.STRINGS.BLOCK;
            document.querySelector(CONSTS_STRINGS.CLASSES.UPDATE_DESCRIPTION).value = desc;
            document.querySelector(CONSTS_STRINGS.CLASSES.UPDATE_VALUE).value = val;
        },
        updateListItem: function(desc, id, type, val) {
            let item;

            item = document.getElementById(`${type}-${id}`).children;
            item[0].textContent = desc;
            item[1].children[0].textContent = formatNumbers(val, type);
        }
    }
})();

export default uiController