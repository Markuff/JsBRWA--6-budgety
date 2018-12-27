
const CONSTS_STRINGS = {
    CLASSES: {
        ADD_BTN: '.add__btn',
        ADD_DESCRIPTION: '.add__description',
        ADD_TYPE: '.add__type',
        ADD_VALUE: '.add__value',
        CLOSE_OVERLAY_BTN: '.close__overlay--btn',
        BUDGET_LABEL: '.budget__value',
        BUDGET_EXPENSE_LABEL: '.budget__expenses--value',
        BUDGET_INCOME_LABEL: '.budget__income--value',
        BUDGET_PERCENTAGE_LABEL: '.budget__expenses--percentage',
        BUDGET_TITLE_MONTH:'.budget__title--month',
        CONTAINER: '.container',
        EXPENSE_ITEM_PERCENTAGE: '.item__percentage',
        EXPENSES_LIST_CONTAINER: '.expenses__list',
        INCOMES_LIST_CONTAINER: '.income__list',
        UPDATE_BTN: '.update--btn',
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
    OTHER: {
        MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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
        MONTH: 'month',
        NONE: 'none',
        OVERLAY: 'overlay',
        PERCENTAGE_LESS_THAN_ONE: '---',
        PLUS: '+',
        RED: 'red',
        RED_BACKGROUND: 'red-background',
        RED_FOCUS: 'red-focus',
        REPLACE_DESCRIPTION: '%description%',
        REPLACE_ID: '%id%',
        REPLACE_VALUE: '%value%',
        UPDATE: 'update',
        YEAR: 'year'
    }
};

export { CONSTS_STRINGS }
