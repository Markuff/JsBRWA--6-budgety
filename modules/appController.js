
import budgetController from './budgetController.js';
import uiController from './uiController.js';
import { CONSTS_STRINGS } from './parameters.js';

let appController;

appController = (function(budgetCtrl, uiCtrl) {
    
    let ctrlAddItem,
        ctrlEdit,
        ctrlManageItem,
        ctrlSetEventsListeners,
        ctrlUpdateBudget,
        ctrlUpdateItems,
        ctrlUpdateItemsPercentages;

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
            itemData,
            listItemDomId,
            listItemId,
            listItemType,
            listItemEventChecker,
            splitForId;

        // Validation for diferentiation of e.target on Chrome and FireFox browsers
        e.target.tagName === CONSTS_STRINGS.STRINGS.BUTTON ? absoluteTarget = e.target : absoluteTarget = e.target.parentNode;
        listItemDomId = absoluteTarget.parentNode.parentNode.parentNode.id;
        listItemEventChecker = absoluteTarget.parentNode.className;

        if (listItemDomId) {
            splitForId = listItemDomId.split(CONSTS_STRINGS.STRINGS.HYPHEN);
            listItemId = parseInt(splitForId[1]);
            listItemType = splitForId[0];
            itemData = budgetCtrl.getItemFromData(listItemId, listItemType);
        }

        if (listItemEventChecker === CONSTS_STRINGS.STRINGS.ITEM_DELETE) {
            // Delete item
            budgetCtrl.deleteItemFromData(listItemId, listItemType);
            uiCtrl.deleteListItem(listItemDomId);
        } else {
            // Update item
            ctrlEdit =  {
                id: itemData.id,
                type: listItemType
            };

            uiCtrl.openOverlay(itemData.description, ctrlEdit.type, itemData.value);
        }

        ctrlUpdateBudget();
        ctrlUpdateItemsPercentages();
    };

    ctrlSetEventsListeners = function() {
        //CONSTS_STRINGS = uiCtrl.getConstsStrings();

        // e references event being passed
        document.addEventListener(CONSTS_STRINGS.EVENTS.KEYUP, function(e) {
            if (e.keyCode === 13 || e.which === 13 || e.key === CONSTS_STRINGS.STRINGS.ENTER) {
                ctrlAddItem();
            }

            if (e.keyCode === 27 || e.which === 27 || e.key === CONSTS_STRINGS.STRINGS.ESCAPE) {
                uiCtrl.closeOverlay();
            }
        });
        document.querySelector(CONSTS_STRINGS.CLASSES.ADD_BTN).addEventListener(CONSTS_STRINGS.EVENTS.CLICK, ctrlAddItem);
        document.querySelector(CONSTS_STRINGS.CLASSES.CONTAINER).addEventListener(CONSTS_STRINGS.EVENTS.CLICK, ctrlManageItem);
        document.querySelector(CONSTS_STRINGS.CLASSES.ADD_TYPE).addEventListener(CONSTS_STRINGS.EVENTS.CHANGE, uiCtrl.changeType);
        document.getElementById(CONSTS_STRINGS.STRINGS.CLOSE).addEventListener(CONSTS_STRINGS.EVENTS.CLICK, uiCtrl.closeOverlay);
        document.getElementById(CONSTS_STRINGS.STRINGS.UPDATE).addEventListener(CONSTS_STRINGS.EVENTS.CLICK, ctrlUpdateItems);
    };

    ctrlUpdateBudget = function() {
        let budgetResults;

        budgetCtrl.calculateBudget();
        budgetResults = budgetCtrl.getBudget();
        uiCtrl.displayBudget(budgetResults);
    };

    ctrlUpdateItems = function() {
        let dataCurrentItem,
            overlayParams;

        dataCurrentItem = budgetCtrl.getItemFromData(ctrlEdit.id, ctrlEdit.type);
        overlayParams = uiCtrl.getInputOverlay();

        if (overlayParams.description !== dataCurrentItem.description || overlayParams.value !== dataCurrentItem.value) {
            budgetCtrl.updateItemOnData(overlayParams.description, ctrlEdit.id, ctrlEdit.type, overlayParams.value);
            uiCtrl.updateListItem(overlayParams.description, ctrlEdit.id, ctrlEdit.type, overlayParams.value);
            ctrlUpdateBudget();
            ctrlUpdateItemsPercentages();
            uiCtrl.closeOverlay();
        }
    }

    ctrlUpdateItemsPercentages = function() {
        let percentages;

        budgetCtrl.calculatePercentages();
        percentages = budgetCtrl.getPercentages();
        uiCtrl.displayPercentages(percentages);
    };
    return  {
        init: function() {
            uiCtrl.displayBudget({
                totalBudget: 0,
                totalExpence: 0,
                totalIncome: 0,
                totalPercentage: -1
            });
            uiCtrl.displayDate();
            ctrlSetEventsListeners();
        },
        // Not for production, just for testing , REMOVE AT THE END
        testing: function() {
            budgetCtrl.testing();
        },
        jsonData: function() {
            budgetCtrl.getDataFromJson();
        }
    }
})(budgetController, uiController);

appController.init();

// Not for production, just for testing , REMOVE AT THE END
appController.testing();
appController.jsonData();
