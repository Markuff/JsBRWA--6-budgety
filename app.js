
let appController,
    budgetController,
    uiController;

budgetController = (function() {
    let calculateTotal,
        data,
        Expense,
        Income,
        STRINGS;

    data = {
        allItems: {
            exp: [],
            inc: []
        },
        budgetTotal: 0,
        // -1 denotes non existance at this point, no percentage if there are no values
        percentage: -1,
        totals: {
            exp: 0,
            inc:0
        }
    };

    STRINGS = {
        EXP: 'exp',
        INC: 'inc'
    };

    Expense = function(desc, id, val) {
        this.description = desc;
        this.id = id;
        this.percentage = -1;
        this.value = val;
    };

    Expense.prototype.calcPercentages = function(totalIncome) {
        if(totalIncome  > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    Income = function(desc, id, val) {
        this.description = desc;
        this.id = id;
        this.value = val;
    };

    calculateTotal = function(typeOfTotal) {
        let total;

        total = 0;

        data.allItems[typeOfTotal].forEach(function(currentTotalValue) {
            total += currentTotalValue.value;
        });

        data.totals[typeOfTotal] = total;
    };

    return {
        addItemToData: function(itemDesc, itemType, itemValue) {
            let newItem,
                uniqueId;

            if (data.allItems[itemType].length > 0) {   
                uniqueId = data.allItems[itemType][data.allItems[itemType].length - 1].id + 1;
            } else {
                uniqueId = 0;
            }

            if (itemType === STRINGS.EXP) {
                newItem = new Expense(itemDesc, uniqueId, itemValue);
            } else if (itemType === STRINGS.INC) {
                newItem = new Income(itemDesc, uniqueId, itemValue);
            }

            data.allItems[itemType].push(newItem);
            return newItem;
        },
        calculateBudget: function() {
            calculateTotal(STRINGS.EXP);
            calculateTotal(STRINGS.INC);

            data.budgetTotal = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentages(data.totals.inc);
            })
        },
        deleteItemFromData: function(itemId, itemType) {
            let idsArray,
                indexFromArray;

            idsArray = data.allItems[itemType].map(function(currentListItem) {
                return currentListItem.id;
            });

            indexFromArray = idsArray[itemId];

            if (indexFromArray !== -1) {
                data.allItems[itemType].splice(indexFromArray, 1);
            }
        },
        getBudget: function() {
            return {
                totalBudget: data.budgetTotal,
                totalExpence: data.totals.exp,
                totalIncome: data.totals.inc,
                totalPercentage: data.percentage
            };
        },
        getPercentages: function() {
            let allPercentages;

            allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });

            return allPercentages;
        },
        /*
        // Not for production, just for testing , REMOVE AT THE END
        testing: function() {
            console.log(data);
        }
        */
    };
})();

uiController = (function() {
    let CONSTS_STRINGS,
        formatNumbers,
        nodeListForEach;
    
    CONSTS_STRINGS = {
        CLASSES: {
            ADD_BTN: '.add__btn',
            ADD_DESCRIPTION: '.add__description',
            ADD_TYPE: '.add__type',
            ADD_VALUE: '.add__value',
            BUDGET_LABEL: '.budget__value',
            BUDGET_EXPENSE_LABEL: '.budget__expenses--value',
            BUDGET_INCOME_LABEL: '.budget__income--value',
            BUDGET_PERCENTAGE_LABEL: '.budget__expenses--percentage',
            BUDGET_TITLE_MONTH:'.budget__title--month',
            CONTAINER: '.container',
            EXPENSE_ITEM_PERCENTAGE: '.item__percentage',
            EXPENSES_LIST_CONTAINER: '.expenses__list',
            INCOMES_LIST_CONTAINER: '.income__list',
            UPDATE_DESCRIPTION: '.update__description',
            UPDATE_VALUE: '.update__value'
        },
        EVENTS: {
            CHANGE: 'change',
            CLICK: 'click',
            KEYUP: 'keyup'
        },
        HTML: {
            EXPENSE: '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__update"><button class="item__update--btn"><i class="ion-ios-settings"></i></button></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>',
            INCOME: '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__update"><button class="item__update--btn"><i class="ion-ios-settings"></i></button></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        },
        PARAMETERS: {
            BEFORE_END: 'beforeend'
        },
        STRINGS: {
            BLOCK: 'block',
            BUTTON: 'BUTTON',
            CLOSE: 'close',
            ENTER: 'Enter',
            ESCAPE: 'Escape',
            EXP: 'exp',
            HYPHEN: '-',
            INC: 'inc',
            ITEM_DELETE: 'item__delete',
            ITEM_UPDATE: 'item__update',
            MINUS: '-',
            NONE: 'none',
            OVERLAY: 'overlay',
            PERCENTAGE_LESS_THAN_ONE: '---',
            PLUS: '+',
            RED: 'red',
            RED_FOCUS: 'red-focus',
            REPLACE_DESCRIPTION: '%description%',
            REPLACE_ID: '%id%',
            REPLACE_VALUE: '%value%',
            UPDATE: 'update'
        }
    };

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
                months,
                now,
                year;

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            
            document.querySelector(CONSTS_STRINGS.CLASSES.BUDGET_TITLE_MONTH).textContent = `${months[month]} | ${year}`;
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
        getConstsStrings: function() {
            return CONSTS_STRINGS;
        },
        getInput: function() {
            return {
                description: document.querySelector(CONSTS_STRINGS.CLASSES.ADD_DESCRIPTION).value,
                // type is either "inc" or "exp", values from the select options input
                type: document.querySelector(CONSTS_STRINGS.CLASSES.ADD_TYPE).value,
                value: parseFloat(document.querySelector(CONSTS_STRINGS.CLASSES.ADD_VALUE).value)
            }
        },
        openOverlay: function(description, type, value) {
            document.getElementById(CONSTS_STRINGS.STRINGS.OVERLAY).style.display = CONSTS_STRINGS.STRINGS.BLOCK;
            document.querySelector(CONSTS_STRINGS.CLASSES.UPDATE_DESCRIPTION).value = description;
            document.querySelector(CONSTS_STRINGS.CLASSES.UPDATE_VALUE).value = value;
        },
        unFormatNumbers: function(string) {
            let strNum,
                value;

            strNum = string.split(' ')[1];
            value = (strNum.length <= 6) ? strNum : `${strNum.slice(0, strNum.length - 7)}${strNum.slice(strNum.length - 6)}`;

            return  value;
        }
    }
})();

appController = (function(budgetCtrl, uiCtrl) {
    let ctrlAddItem,
        ctrlManageItem,
        ctrlSetEventsListeners,
        ctrlUpdateBudget,
        ctrlUpdateItemsPercentages,
        CTRL_STRINGS;

    ctrlAddItem = function() {
        let input,
            newItem;

        input = uiCtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItemToData(input.description, input.type, input.value);

            uiCtrl.addListItem(newItem, input.type);
            uiCtrl.clearFields();
            ctrlUpdateBudget();
            ctrlUpdateItemsPercentages();
        }
    };

    ctrlManageItem = function(e) {
        let absoluteTarget,
            description,
            listItemDomId,
            listItemId,
            listItemType,
            listItemEventChecker,
            splitForId,
            value;

        // Validation for diferentiation of e.target on Chrome and FireFox browsers
        e.target.tagName === CTRL_STRINGS.STRINGS.BUTTON ? absoluteTarget = e.target : absoluteTarget = e.target.parentNode;

        description = absoluteTarget.parentNode.parentNode.parentNode.childNodes[0].textContent;
        listItemDomId = absoluteTarget.parentNode.parentNode.parentNode.id;
        listItemEventChecker = absoluteTarget.parentNode.className;
        value = parseInt(uiCtrl.unFormatNumbers(absoluteTarget.parentNode.parentNode.textContent));

        if (listItemDomId) {
            splitForId = listItemDomId.split(CTRL_STRINGS.STRINGS.HYPHEN);
            listItemId = parseInt(splitForId[1]);
            listItemType = splitForId[0];
        }

        if (listItemEventChecker === CTRL_STRINGS.STRINGS.ITEM_DELETE) {
            // Delete item
            budgetCtrl.deleteItemFromData(listItemId, listItemType);
            uiCtrl.deleteListItem(listItemDomId);
        } else if (listItemEventChecker === CTRL_STRINGS.STRINGS.ITEM_UPDATE) {
            // Update item
            uiCtrl.openOverlay(description, listItemType, value);
        }

        ctrlUpdateBudget();
        ctrlUpdateItemsPercentages();
    };

    ctrlSetEventsListeners = function() {
        CTRL_STRINGS = uiCtrl.getConstsStrings();

        // e references event being passed
        document.addEventListener(CTRL_STRINGS.EVENTS.KEYUP, function(e) {
            if (e.keyCode === 13 || e.which === 13 || e.key === CTRL_STRINGS.STRINGS.ENTER) {
                ctrlAddItem();
            }

            if (e.keyCode === 27 || e.which === 27 || e.key === CTRL_STRINGS.STRINGS.ESCAPE) {
                uiCtrl.closeOverlay();
            }
        });
        document.querySelector(CTRL_STRINGS.CLASSES.ADD_BTN).addEventListener(CTRL_STRINGS.EVENTS.CLICK, ctrlAddItem);
        document.querySelector(CTRL_STRINGS.CLASSES.CONTAINER).addEventListener(CTRL_STRINGS.EVENTS.CLICK, ctrlManageItem);
        document.querySelector(CTRL_STRINGS.CLASSES.ADD_TYPE).addEventListener(CTRL_STRINGS.EVENTS.CHANGE, uiCtrl.changeType);
        document.getElementById(CTRL_STRINGS.STRINGS.CLOSE).addEventListener(CTRL_STRINGS.EVENTS.CLICK, uiCtrl.closeOverlay);
        //document.getElementById(CTRL_STRINGS.STRINGS.UPDATE).addEventListener(CTRL_STRINGS.EVENTS.CLICK, !!!!!EVENT MISSING HERE!!!!!); PENDING
    };

    ctrlUpdateBudget = function() {
        let budgetResults;

        budgetCtrl.calculateBudget();
        budgetResults = budgetCtrl.getBudget();
        uiCtrl.displayBudget(budgetResults);
    };

    ctrlUpdateItemsPercentages = function() {
        let percentages;

        budgetCtrl.calculatePercentages();
        percentages = budgetCtrl.getPercentages();
        uiCtrl.displayPercentages(percentages);
    };

    return {
        init: function() {
            uiCtrl.displayBudget({
                totalBudget: 0,
                totalExpence: 0,
                totalIncome: 0,
                totalPercentage: -1
            });

            uiCtrl.displayDate();
            ctrlSetEventsListeners();
        }
    }
})(budgetController, uiController);

appController.init();
