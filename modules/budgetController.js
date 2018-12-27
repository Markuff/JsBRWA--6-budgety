
import { CONSTS_STRINGS } from './parameters.js';

let budgetController;

budgetController = (function() {
    let calculateTotal,
        data,
        dataComplete,
        dataReserve,
        Expense,
        Income,
        processData;

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
            inc: 0
        }
    };
    dataComplete = {};
    dataReserve = {};

    Expense = function(desc, id, val) {
        this.description = desc;
        this.id = id;
        this.percentage = -1;
        this.value = val;
    };

    Income = function(desc, id, val) {
        this.description = desc;
        this.id = id;
        this.value = val;
    };

    Expense.prototype.calcPercentages = function(totalIncome) {
        if (totalIncome  > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    calculateTotal = function(typeOfTotal) {
        let total;

        total = 0;

        data.allItems[typeOfTotal].forEach(function(currentTotalValue) {
            total += currentTotalValue.value;
        });

        data.totals[typeOfTotal] = total;
    };

    processData = function(dataFromJson) {
        dataComplete = dataFromJson;
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

            if (itemType === CONSTS_STRINGS.STRINGS.EXP) {
                newItem = new Expense(itemDesc, uniqueId, itemValue);
            } else if (itemType === CONSTS_STRINGS.STRINGS.INC) {
                newItem = new Income(itemDesc, uniqueId, itemValue);
            }

            data.allItems[itemType].push(newItem);
            return newItem;
        },
        calculateBudget: function() {
            calculateTotal(CONSTS_STRINGS.STRINGS.EXP);
            calculateTotal(CONSTS_STRINGS.STRINGS.INC);

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
        getDataFromDate: function(oldMonth, oldYear, newMonth, newYear) {
            let lowerCaseMonth;

            dataReserve = {
                data: data,
                month: oldMonth,
                year: oldYear
            };
            lowerCaseMonth = newMonth.toLowerCase();

            return dataComplete.years[newYear].months[lowerCaseMonth].allItems;
        },
        getDataFromJson: function() {
            let request,
                requestedData;

            request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    requestedData = JSON.parse(request.responseText);
                    processData(requestedData);
                }
            }
            request.open('GET', '../json/content.json', true);
            request.send();
        },
        getItemFromData: function(itemId, itemType) {
            return data.allItems[itemType][itemId];
        },
        getPercentages: function() {
            let allPercentages;

            allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });

            return allPercentages;
        },
        updateItemOnData: function(desc, id, type, val) {
            data.allItems[type][id].description = desc;
            data.allItems[type][id].value = val;
        },
        testing: function() {
            console.log(data);
        }
    };
})();

export default budgetController
