import * as i0 from '@angular/core';
import { Pipe, EventEmitter, forwardRef, TemplateRef, Component, ViewEncapsulation, ViewChild, Input, Output, ContentChild, NgModule } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime } from 'rxjs/operators';
import * as i2 from '@angular/forms';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

class HighlightPipe {
    transform(text, search, searchKeyword) {
        let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        pattern = pattern.split(' ').filter((t) => {
            return t.length > 0;
        }).join('|');
        const regex = new RegExp(pattern, 'gi');
        if (!search) {
            return text;
        }
        if (searchKeyword) {
            const name = text[searchKeyword].replace(regex, (match) => `<b>${match}</b>`);
            // copy original object
            const textCopied = { ...text };
            // set bold value into searchKeyword of copied object
            textCopied[searchKeyword] = name;
            return textCopied;
        }
        else {
            return search ? text.replace(regex, (match) => `<b>${match}</b>`) : text;
        }
    }
}
HighlightPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: HighlightPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
HighlightPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: HighlightPipe, name: "highlight" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: HighlightPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'highlight'
                }]
        }] });

/**
 * Keyboard events
 */
const isArrowUp = keyCode => keyCode === 38;
const isArrowDown = keyCode => keyCode === 40;
const isArrowUpDown = keyCode => isArrowUp(keyCode) || isArrowDown(keyCode);
const isEnter = keyCode => keyCode === 13;
const isBackspace = keyCode => keyCode === 8;
const isDelete = keyCode => keyCode === 46;
const isESC = keyCode => keyCode === 27;
const isTab = keyCode => keyCode === 9;
class AutocompleteComponent {
    constructor(elementRef, renderer) {
        this.renderer = renderer;
        this.query = ''; // search query
        this.filteredList = []; // list of items
        this.historyList = []; // list of history items
        this.isHistoryListVisible = true;
        this.selectedIdx = -1;
        this.toHighlight = '';
        this.notFound = false;
        this.isFocused = false;
        this.isOpen = false;
        this.isScrollToEnd = false;
        this.overlay = false;
        this.manualOpen = undefined;
        this.manualClose = undefined;
        // @Inputs
        /**
         * Data of items list.
         * It can be array of strings or array of objects.
         */
        this.data = [];
        this.placeholder = '';
        this.heading = '';
        /**
         * Heading text of history list.
         * If it is null then history heading is hidden.
         */
        this.historyHeading = 'Recently selected';
        this.historyListMaxNumber = 15; // maximum number of items in the history list.
        this.notFoundText = 'Not found'; // set custom text when filter returns empty result
        /**
         * The minimum number of characters the user must type before a search is performed.
         */
        this.minQueryLength = 1;
        /**
         * Focus first item in the list
         */
        this.focusFirst = false;
        // @Output events
        /** Event that is emitted whenever an item from the list is selected. */
        this.selected = new EventEmitter();
        /** Event that is emitted whenever an input is changed. */
        this.inputChanged = new EventEmitter();
        /** Event that is emitted whenever an input is focused. */
        this.inputFocused = new EventEmitter();
        /** Event that is emitted whenever an input is cleared. */
        this.inputCleared = new EventEmitter();
        /** Event that is emitted when the autocomplete panel is opened. */
        this.opened = new EventEmitter();
        /** Event that is emitted when the autocomplete panel is closed. */
        this.closed = new EventEmitter();
        /** Event that is emitted when scrolled to the end of items. */
        this.scrolledToEnd = new EventEmitter();
        /**
         * Propagates new value when model changes
         */
        this.propagateChange = () => {
        };
        this.onTouched = () => {
        };
        this.elementRef = elementRef;
    }
    /**
     * Writes a new value from the form model into the view,
     * Updates model
     */
    writeValue(value = '') {
        this.query = this.selectedValueRender !== undefined ? this.selectedValueRender(value) : this.defaultWriteValue(value);
    }
    defaultWriteValue(value) {
        return value && !this.isTypeString(value) ? value[this.searchKeyword] : value;
    }
    /**
     * Registers a handler that is called when something in the view has changed
     */
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    /**
     * Registers a handler specifically for when a control receives a touch event
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Event that is called when the value of an input element is changed
     */
    onChange(event) {
        this.propagateChange(event.target.value);
    }
    /**
     * Event that is called when the control status changes to or from DISABLED
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        this.initEventStream();
        this.handleScroll();
    }
    /**
     * Set initial value
     * @param value
     */
    setInitialValue(value) {
        if (this.initialValue) {
            this.select(value);
        }
    }
    /**
     * Update search results
     */
    ngOnChanges(changes) {
        this.setInitialValue(this.initialValue);
        if (changes &&
            changes.data &&
            Array.isArray(changes.data.currentValue)) {
            this.handleItemsChange();
            if (!changes.data.firstChange && this.isFocused) {
                this.handleOpen();
            }
        }
    }
    /**
     * Items change
     */
    handleItemsChange() {
        this.isScrollToEnd = false;
        if (!this.isOpen) {
            return;
        }
        this.filteredList = this.data;
        this.notFound = !this.filteredList || this.filteredList.length === 0;
        // Filter list when updating data and panel is open
        if (this.isOpen) {
            this.filterList();
        }
    }
    /**
     * Filter data
     */
    filterList() {
        this.selectedIdx = -1;
        this.initSearchHistory();
        if (this.query != null && this.data) {
            this.toHighlight = this.query;
            this.filteredList = this.customFilter !== undefined ? this.customFilter([...this.data], this.query) : this.defaultFilterFunction();
            // If [focusFirst]="true" automatically focus the first match
            if (this.filteredList.length > 0 && this.focusFirst) {
                this.selectedIdx = 0;
            }
        }
        else {
            this.notFound = false;
        }
    }
    /**
     * Default filter function, used unless customFilter is provided
     */
    defaultFilterFunction() {
        return this.data.filter((item) => {
            if (typeof item === 'string') {
                // string logic, check equality of strings
                return item.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }
            else if (typeof item === 'object' && item instanceof Object) {
                // object logic, check property equality
                return item[this.searchKeyword] ? item[this.searchKeyword].toLowerCase().indexOf(this.query.toLowerCase()) > -1 : "";
            }
        });
    }
    /**
     * Check if item is a string in the list.
     * @param item
     */
    isTypeString(item) {
        return typeof item === 'string';
    }
    /**
     * Select item in the list.
     * @param item
     */
    select(item) {
        this.query = !this.isTypeString(item) ? item[this.searchKeyword] : item;
        this.isOpen = true;
        this.overlay = false;
        this.selected.emit(item);
        this.propagateChange(item);
        if (this.initialValue) {
            // check if history already exists in localStorage and then update
            const history = window.localStorage.getItem(`${this.historyIdentifier}`);
            if (history) {
                let existingHistory = JSON.parse(localStorage[`${this.historyIdentifier}`]);
                if (!(existingHistory instanceof Array))
                    existingHistory = [];
                // check if selected item exists in existingHistory
                if (!existingHistory.some((existingItem) => !this.isTypeString(existingItem)
                    ? existingItem[this.searchKeyword] == item[this.searchKeyword] : existingItem == item)) {
                    existingHistory.unshift(item);
                    localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(existingHistory));
                    // check if items don't exceed max allowed number
                    if (existingHistory.length >= this.historyListMaxNumber) {
                        existingHistory.splice(existingHistory.length - 1, 1);
                        localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(existingHistory));
                    }
                }
                else {
                    // if selected item exists in existingHistory swap to top in array
                    if (!this.isTypeString(item)) {
                        // object logic
                        const copiedExistingHistory = existingHistory.slice(); // copy original existingHistory array
                        const selectedIndex = copiedExistingHistory.map((el) => el[this.searchKeyword]).indexOf(item[this.searchKeyword]);
                        copiedExistingHistory.splice(selectedIndex, 1);
                        copiedExistingHistory.splice(0, 0, item);
                        localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(copiedExistingHistory));
                    }
                    else {
                        // string logic
                        const copiedExistingHistory = existingHistory.slice(); // copy original existingHistory array
                        copiedExistingHistory.splice(copiedExistingHistory.indexOf(item), 1);
                        copiedExistingHistory.splice(0, 0, item);
                        localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(copiedExistingHistory));
                    }
                }
            }
            else {
                this.saveHistory(item);
            }
        }
        else {
            this.saveHistory(item);
        }
        this.handleClose();
    }
    /**
     * Document click
     * @param e event
     */
    handleClick(e) {
        let clickedComponent = e.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
                if (this.filteredList.length) {
                    this.handleOpen();
                }
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.handleClose();
        }
    }
    /**
     * Handle body overlay
     */
    handleOverlay() {
        this.overlay = false;
    }
    /**
     * Scroll items
     */
    handleScroll() {
        this.renderer.listen(this.filteredListElement.nativeElement, 'scroll', () => {
            this.scrollToEnd();
        });
    }
    /**
     * Define panel state
     */
    setPanelState(event) {
        if (event) {
            event.stopPropagation();
        }
        // If controls are untouched
        if (typeof this.manualOpen === 'undefined'
            && typeof this.manualClose === 'undefined') {
            this.isOpen = false;
            this.handleOpen();
        }
        // If one of the controls is untouched and other is deactivated
        if (typeof this.manualOpen === 'undefined'
            && this.manualClose === false
            || typeof this.manualClose === 'undefined'
                && this.manualOpen === false) {
            this.isOpen = false;
            this.handleOpen();
        }
        // if controls are touched but both are deactivated
        if (this.manualOpen === false && this.manualClose === false) {
            this.isOpen = false;
            this.handleOpen();
        }
        // if open control is touched and activated
        if (this.manualOpen) {
            this.isOpen = false;
            this.handleOpen();
            this.manualOpen = false;
        }
        // if close control is touched and activated
        if (this.manualClose) {
            this.isOpen = true;
            this.handleClose();
            this.manualClose = false;
        }
    }
    /**
     * Manual controls
     */
    open() {
        this.manualOpen = true;
        this.isOpen = false;
        this.handleOpen();
    }
    close() {
        this.manualClose = true;
        this.isOpen = true;
        this.handleClose();
    }
    focus() {
        this.handleFocus(event);
    }
    clear() {
        this.remove(event);
    }
    /**
     * Remove search query
     */
    remove(e) {
        e.stopPropagation();
        this.query = '';
        this.inputCleared.emit();
        this.propagateChange(this.query);
        this.setPanelState(e);
        if (this.data && !this.data.length) {
            this.notFound = false;
        }
    }
    /**
     * Initialize historyList search
     */
    initSearchHistory() {
        this.isHistoryListVisible = false;
        if (this.historyIdentifier && !this.query) {
            const history = window.localStorage.getItem(`${this.historyIdentifier}`);
            if (history) {
                this.isHistoryListVisible = true;
                this.filteredList = [];
                this.historyList = history ? JSON.parse(history) : [];
            }
            else {
                this.isHistoryListVisible = false;
            }
        }
        else {
            this.isHistoryListVisible = false;
        }
    }
    handleOpen() {
        if (this.isOpen || this.isOpen && !this.isLoading) {
            return;
        }
        // If data exists
        if (this.data && this.data.length) {
            this.isOpen = true;
            this.overlay = true;
            this.filterList();
            this.opened.emit();
        }
    }
    handleClose() {
        if (!this.isOpen) {
            this.isFocused = false;
            return;
        }
        this.isOpen = false;
        this.overlay = false;
        this.filteredList = [];
        this.selectedIdx = -1;
        this.notFound = false;
        this.isHistoryListVisible = false;
        this.isFocused = false;
        this.closed.emit();
    }
    handleFocus(e) {
        this.searchInput.nativeElement.focus();
        if (this.isFocused) {
            return;
        }
        this.inputFocused.emit(e);
        // if data exists then open
        if (this.data && this.data.length) {
            this.setPanelState(e);
        }
        this.isFocused = true;
    }
    scrollToEnd() {
        if (this.isScrollToEnd) {
            return;
        }
        const scrollTop = this.filteredListElement.nativeElement
            .scrollTop;
        const scrollHeight = this.filteredListElement.nativeElement
            .scrollHeight;
        const elementHeight = this.filteredListElement.nativeElement
            .clientHeight;
        const atBottom = elementHeight != 0 && Math.abs(scrollHeight - elementHeight - scrollTop) < 1;
        if (atBottom) {
            this.scrolledToEnd.emit();
            this.isScrollToEnd = true;
        }
    }
    /**
     * Initialize keyboard events
     */
    initEventStream() {
        this.inputKeyUp$ = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(map((e) => e));
        this.inputKeyDown$ = fromEvent(this.searchInput.nativeElement, 'keydown').pipe(map((e) => e));
        this.listenEventStream();
    }
    /**
     * Listen keyboard events
     */
    listenEventStream() {
        // key up event
        this.inputKeyUp$
            .pipe(filter(e => !isArrowUpDown(e.keyCode) &&
            !isEnter(e.keyCode) &&
            !isESC(e.keyCode) &&
            !isTab(e.keyCode)), debounceTime(this.debounceTime)).subscribe(e => {
            this.onKeyUp(e);
        });
        // cursor up & down
        this.inputKeyDown$.pipe(filter(e => isArrowUpDown(e.keyCode))).subscribe(e => {
            e.preventDefault();
            this.onFocusItem(e);
        });
        // enter keyup
        this.inputKeyUp$.pipe(filter(e => isEnter(e.keyCode))).subscribe(e => {
            //this.onHandleEnter();
        });
        // enter keydown
        this.inputKeyDown$.pipe(filter(e => isEnter(e.keyCode))).subscribe(e => {
            this.onHandleEnter();
        });
        // ESC
        this.inputKeyUp$.pipe(filter(e => isESC(e.keyCode), debounceTime(100))).subscribe(e => {
            this.onEsc();
        });
        // TAB
        this.inputKeyDown$.pipe(filter(e => isTab(e.keyCode))).subscribe(e => {
            this.onTab();
        });
        // delete
        this.inputKeyDown$.pipe(filter(e => isBackspace(e.keyCode) || isDelete(e.keyCode))).subscribe(e => {
            this.onDelete();
        });
    }
    /**
     * on keyup == when input changed
     * @param e event
     */
    onKeyUp(e) {
        this.notFound = false; // search results are unknown while typing
        // if input is empty
        if (!this.query) {
            this.notFound = false;
            this.inputChanged.emit(e.target.value);
            this.inputCleared.emit();
            this.setPanelState(e);
        }
        // note that '' can be a valid query
        if (!this.query && this.query !== '') {
            return;
        }
        // if query >= to minQueryLength
        if (this.query.length >= this.minQueryLength) {
            this.inputChanged.emit(e.target.value);
            this.filterList();
            // If no results found
            if (!this.filteredList.length && !this.isLoading) {
                this.notFoundText ? this.notFound = true : this.notFound = false;
            }
            if (this.data && !this.data.length) {
                this.isOpen = true;
            }
        }
    }
    /**
     * Keyboard arrow top and arrow bottom
     * @param e event
     */
    onFocusItem(e) {
        // move arrow up and down on filteredList or historyList
        if (!this.historyList.length || !this.isHistoryListVisible) {
            // filteredList
            const totalNumItem = this.filteredList.length;
            if (e.key === 'ArrowDown') {
                let sum = this.selectedIdx;
                sum = (this.selectedIdx === null) ? 0 : sum + 1;
                this.selectedIdx = (totalNumItem + sum) % totalNumItem;
                this.scrollToFocusedItem(this.selectedIdx);
            }
            else if (e.key === 'ArrowUp') {
                if (this.selectedIdx == -1) {
                    this.selectedIdx = 0;
                }
                this.selectedIdx = (totalNumItem + this.selectedIdx - 1) % totalNumItem;
                this.scrollToFocusedItem(this.selectedIdx);
            }
        }
        else {
            // historyList
            const totalNumItem = this.historyList.length;
            if (e.key === 'ArrowDown') {
                let sum = this.selectedIdx;
                sum = (this.selectedIdx === null) ? 0 : sum + 1;
                this.selectedIdx = (totalNumItem + sum) % totalNumItem;
                this.scrollToFocusedItem(this.selectedIdx);
            }
            else if (e.key === 'ArrowUp') {
                if (this.selectedIdx == -1) {
                    this.selectedIdx = 0;
                }
                this.selectedIdx = (totalNumItem + this.selectedIdx - 1) % totalNumItem;
                this.scrollToFocusedItem(this.selectedIdx);
            }
        }
    }
    /**
     * Scroll to focused item
     * * @param index
     */
    scrollToFocusedItem(index) {
        let listElement = null;
        // Define list element
        if (!this.historyList.length || !this.isHistoryListVisible) {
            // filteredList element
            listElement = this.filteredListElement.nativeElement;
        }
        else {
            // historyList element
            listElement = this.historyListElement.nativeElement;
        }
        const items = Array.prototype.slice.call(listElement.childNodes).filter((node) => {
            if (node.nodeType === 1) {
                // if node is element
                return node.className.includes('item');
            }
            else {
                return false;
            }
        });
        if (!items.length) {
            return;
        }
        const listHeight = listElement.offsetHeight;
        const itemHeight = items[index].offsetHeight;
        const visibleTop = listElement.scrollTop;
        const visibleBottom = listElement.scrollTop + listHeight - itemHeight;
        const targetPosition = items[index].offsetTop;
        if (targetPosition < visibleTop) {
            listElement.scrollTop = targetPosition;
        }
        if (targetPosition > visibleBottom) {
            listElement.scrollTop = targetPosition - listHeight + itemHeight;
        }
    }
    /**
     * Select item on enter click
     */
    onHandleEnter() {
        // click enter to choose item from filteredList or historyList
        if (this.selectedIdx > -1) {
            if (!this.historyList.length || !this.isHistoryListVisible) {
                // filteredList
                this.query = !this.isTypeString(this.filteredList[this.selectedIdx])
                    ? this.filteredList[this.selectedIdx][this.searchKeyword]
                    : this.filteredList[this.selectedIdx];
                this.saveHistory(this.filteredList[this.selectedIdx]);
                this.select(this.filteredList[this.selectedIdx]);
            }
            else {
                // historyList
                this.query = !this.isTypeString(this.historyList[this.selectedIdx])
                    ? this.historyList[this.selectedIdx][this.searchKeyword]
                    : this.historyList[this.selectedIdx];
                this.saveHistory(this.historyList[this.selectedIdx]);
                this.select(this.historyList[this.selectedIdx]);
            }
        }
        this.isHistoryListVisible = false;
        this.handleClose();
    }
    /**
     * Esc click
     */
    onEsc() {
        this.searchInput.nativeElement.blur();
        this.handleClose();
    }
    /**
     * Tab click
     */
    onTab() {
        this.searchInput.nativeElement.blur();
        this.handleClose();
    }
    /**
     * Delete click
     */
    onDelete() {
        this.isOpen = true;
    }
    /**
     * Select item to save in localStorage
     * @param selected
     */
    saveHistory(selected) {
        if (this.historyIdentifier) {
            // check if selected item exists in historyList
            if (!this.historyList.some((item) => !this.isTypeString(item)
                ? item[this.searchKeyword] == selected[this.searchKeyword] : item == selected)) {
                this.saveHistoryToLocalStorage([selected, ...this.historyList]);
                // check if items don't exceed max allowed number
                if (this.historyList.length >= this.historyListMaxNumber) {
                    this.historyList.splice(this.historyList.length - 1, 1);
                    this.saveHistoryToLocalStorage([selected, ...this.historyList]);
                }
            }
            else {
                // if selected item exists in historyList swap to top in array
                if (!this.isTypeString(selected)) {
                    // object logic
                    const copiedHistoryList = this.historyList.slice(); // copy original historyList array
                    const selectedIndex = copiedHistoryList.map((item) => item[this.searchKeyword]).indexOf(selected[this.searchKeyword]);
                    copiedHistoryList.splice(selectedIndex, 1);
                    copiedHistoryList.splice(0, 0, selected);
                    this.saveHistoryToLocalStorage([...copiedHistoryList]);
                }
                else {
                    // string logic
                    const copiedHistoryList = this.historyList.slice(); // copy original historyList array
                    copiedHistoryList.splice(this.historyList.indexOf(selected), 1);
                    copiedHistoryList.splice(0, 0, selected);
                    this.saveHistoryToLocalStorage([...copiedHistoryList]);
                }
            }
        }
    }
    /**
     * Save item in localStorage
     * @param selected
     */
    saveHistoryToLocalStorage(selected) {
        window.localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(selected));
    }
    /**
     * Remove item from localStorage
     * @param index
     * @param e event
     */
    removeHistoryItem(index, e) {
        e.stopPropagation();
        this.historyList = this.historyList.filter((v, i) => i !== index);
        this.saveHistoryToLocalStorage(this.historyList);
        if (this.historyList.length == 0) {
            window.localStorage.removeItem(`${this.historyIdentifier}`);
            this.filterList();
        }
    }
    /**
     * Reset localStorage
     * @param e event
     */
    resetHistoryList(e) {
        e.stopPropagation();
        this.historyList = [];
        window.localStorage.removeItem(`${this.historyIdentifier}`);
        this.filterList();
    }
}
AutocompleteComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: AutocompleteComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
AutocompleteComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.1", type: AutocompleteComponent, selector: "ng-autocomplete", inputs: { data: "data", searchKeyword: "searchKeyword", placeholder: "placeholder", heading: "heading", initialValue: "initialValue", historyIdentifier: "historyIdentifier", historyHeading: "historyHeading", historyListMaxNumber: "historyListMaxNumber", notFoundText: "notFoundText", isLoading: "isLoading", debounceTime: "debounceTime", disabled: "disabled", minQueryLength: "minQueryLength", focusFirst: "focusFirst", customFilter: "customFilter", selectedValueRender: "selectedValueRender", itemTemplate: "itemTemplate", notFoundTemplate: "notFoundTemplate" }, outputs: { selected: "selected", inputChanged: "inputChanged", inputFocused: "inputFocused", inputCleared: "inputCleared", opened: "opened", closed: "closed", scrolledToEnd: "scrolledToEnd" }, host: { listeners: { "document:click": "handleClick($event)" }, classAttribute: "ng-autocomplete" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutocompleteComponent),
            multi: true
        }
    ], queries: [{ propertyName: "customTemplate", first: true, predicate: TemplateRef, descendants: true }], viewQueries: [{ propertyName: "searchInput", first: true, predicate: ["searchInput"], descendants: true }, { propertyName: "filteredListElement", first: true, predicate: ["filteredListElement"], descendants: true }, { propertyName: "historyListElement", first: true, predicate: ["historyListElement"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"autocomplete-container\" aria-owns=\"suggestions suggestions-history\" [attr.aria-expanded]=\"isOpen\"\n     [ngClass]=\"{ 'active': isOpen}\">\n  <div class=\"input-container\">\n    <input #searchInput\n           type=\"text\"\n           attr.aria-label=\"{{placeholder}}\"\n           aria-autocomplete=\"list\"\n           role=\"combobox\"\n           placeholder={{placeholder}}\n           [(ngModel)]=query\n           (input)=\"onChange($event)\"\n           (focus)=handleFocus($event)\n           (blur)=onTouched($event)\n           [disabled]=\"disabled\"\n           autocomplete=\"off\">\n    <div class=\"x\" *ngIf=\"query && !isLoading && !disabled\" (click)=\"remove($event)\">\n      <i class=\"material-icons\" aria-label=\"Close\">close</i>\n    </div>\n    <!--Loading mask-->\n    <div class=\"sk-fading-circle\" *ngIf=\"isLoading\">\n      <div class=\"sk-circle1 sk-circle\"></div>\n      <div class=\"sk-circle2 sk-circle\"></div>\n      <div class=\"sk-circle3 sk-circle\"></div>\n      <div class=\"sk-circle4 sk-circle\"></div>\n      <div class=\"sk-circle5 sk-circle\"></div>\n      <div class=\"sk-circle6 sk-circle\"></div>\n      <div class=\"sk-circle7 sk-circle\"></div>\n      <div class=\"sk-circle8 sk-circle\"></div>\n      <div class=\"sk-circle9 sk-circle\"></div>\n      <div class=\"sk-circle10 sk-circle\"></div>\n      <div class=\"sk-circle11 sk-circle\"></div>\n      <div class=\"sk-circle12 sk-circle\"></div>\n    </div>\n  </div>\n\n  <!--FilteredList items-->\n  <div class=\"suggestions-container\" id=\"suggestions\" role=\"listbox\"\n       [ngClass]=\"{ 'is-hidden': isHistoryListVisible, 'is-visible': !isHistoryListVisible}\">\n    <!--FilteredList heading-->\n    <div class=\"heading\" *ngIf=\"filteredList.length > 0 && heading\">\n      <div class=\"text\">{{heading}}</div>\n    </div>\n\n    <ul #filteredListElement>\n      <li *ngFor=\"let item of filteredList; let idx = index\" class=\"item\">\n        <!--string logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='isTypeString(item)'\n             (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate;  context: { $implicit: item | highlight: toHighlight }\">\n          </ng-container>\n        </div>\n        <!--object logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='!isTypeString(item)'\n             (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate; context: { $implicit: item | highlight: toHighlight : searchKeyword }\">\n          </ng-container>\n        </div>\n      </li>\n    </ul>\n  </div>\n\n  <!--HistoryList items-->\n  <div class=\"suggestions-container\" id=\"suggestions-history\" role=\"listbox\"\n       [ngClass]=\"{ 'is-hidden': !isHistoryListVisible, 'is-visible': isHistoryListVisible}\">\n    <!--HistoryList heading-->\n    <div class=\"heading\" *ngIf=\"historyList.length > 0 && historyHeading\">\n      <div class=\"text\">{{historyHeading}}</div>\n      <div class=\"x\" (click)=\"resetHistoryList($event)\">\n        <i class=\"material-icons\" aria-label=\"Delete\">delete</i>\n      </div>\n    </div>\n\n    <ul #historyListElement>\n      <li *ngFor=\"let item of historyList; let idx = index\" class=\"item\">\n        <!--string logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='isTypeString(item)' (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate;  context: { $implicit: item }\">\n          </ng-container>\n        </div>\n        <!--object logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='!isTypeString(item)' (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate; context: { $implicit: item }\">\n          </ng-container>\n        </div>\n        <div class=\"x\" (click)=\"removeHistoryItem(idx, $event)\">\n          <i class=\"material-icons\" aria-label=\"Close\">close</i>\n        </div>\n      </li>\n    </ul>\n  </div>\n\n  <!--Not found-->\n  <div class=\"not-found\" *ngIf=\"isLoading ? !isLoading && notFound : notFound\">\n    <ng-container\n      *ngTemplateOutlet=\"notFoundTemplate;  context: { $implicit: notFoundText  }\">\n    </ng-container>\n  </div>\n</div>\n<div class=\"autocomplete-overlay\" *ngIf=\"overlay\" (click)=\"handleOverlay()\"></div>\n", styles: ["@import\"https://fonts.googleapis.com/icon?family=Material+Icons\";.ng-autocomplete{width:600px}.autocomplete-container{box-shadow:0 1px 3px #0003,0 1px 1px #00000024,0 2px 1px -1px #0000001f;position:relative;overflow:visible;height:40px}.autocomplete-container .input-container input{font-size:14px;box-sizing:border-box;border:none;box-shadow:none;outline:none;background-color:#fff;color:#000000de;width:100%;padding:0 15px;line-height:40px;height:40px}.autocomplete-container .input-container input:disabled{background-color:#eee;color:#666}.autocomplete-container .input-container .x{position:absolute;right:10px;margin:auto;cursor:pointer;top:50%;transform:translateY(-50%)}.autocomplete-container .input-container .x i{color:#0000008a;font-size:22px;vertical-align:middle}.autocomplete-container .suggestions-container{position:absolute;width:100%;background:white;height:auto;box-shadow:0 2px 5px #00000040;box-sizing:border-box}.autocomplete-container .suggestions-container ul{padding:0;margin:0;max-height:240px;overflow-y:auto}.autocomplete-container .suggestions-container ul li{position:relative;list-style:none;padding:0;margin:0;cursor:pointer}.autocomplete-container .suggestions-container ul li a{padding:14px 15px;display:block;text-decoration:none;color:#333;cursor:pointer;color:#000000de;font-size:15px}.autocomplete-container .suggestions-container ul li:hover,.autocomplete-container .suggestions-container .complete-selected{background-color:#9e9e9e2e}.autocomplete-container .suggestions-container .heading{position:relative;padding:10px 15px;border:solid 1px #f1f1f1}.autocomplete-container .suggestions-container .heading .text{font-size:.85em}.autocomplete-container .suggestions-container .x{position:absolute;right:10px;margin:auto;cursor:pointer;top:50%;transform:translateY(-50%)}.autocomplete-container .suggestions-container .x i{color:#0000008a;font-size:18px;vertical-align:middle}.autocomplete-container .suggestions-container.is-hidden{visibility:hidden}.autocomplete-container .suggestions-container.is-visible{visibility:visible}.autocomplete-container .not-found{padding:0 .75em;border:solid 1px #f1f1f1;background:white}.autocomplete-container .not-found div{padding:.4em 0;font-size:.95em;line-height:1.4;border-bottom:1px solid rgba(230,230,230,.7)}.autocomplete-container.active{z-index:999}.highlight{font-weight:700}.autocomplete-overlay{position:fixed;background-color:transparent;width:100%;height:100%;top:0;right:0;bottom:0;left:0;z-index:50}input[type=text]::-ms-clear{display:none}.sk-fading-circle{width:20px;height:20px;position:absolute;right:10px;top:0;bottom:0;margin:auto}.sk-fading-circle .sk-circle{width:100%;height:100%;position:absolute;left:0;top:0}.sk-fading-circle .sk-circle:before{content:\"\";display:block;margin:0 auto;width:15%;height:15%;background-color:#333;border-radius:100%;animation:sk-circleFadeDelay 1.2s infinite ease-in-out both}.sk-fading-circle .sk-circle2{transform:rotate(30deg)}.sk-fading-circle .sk-circle3{transform:rotate(60deg)}.sk-fading-circle .sk-circle4{transform:rotate(90deg)}.sk-fading-circle .sk-circle5{transform:rotate(120deg)}.sk-fading-circle .sk-circle6{transform:rotate(150deg)}.sk-fading-circle .sk-circle7{transform:rotate(180deg)}.sk-fading-circle .sk-circle8{transform:rotate(210deg)}.sk-fading-circle .sk-circle9{transform:rotate(240deg)}.sk-fading-circle .sk-circle10{transform:rotate(270deg)}.sk-fading-circle .sk-circle11{transform:rotate(300deg)}.sk-fading-circle .sk-circle12{transform:rotate(330deg)}.sk-fading-circle .sk-circle2:before{animation-delay:-1.1s}.sk-fading-circle .sk-circle3:before{animation-delay:-1s}.sk-fading-circle .sk-circle4:before{animation-delay:-.9s}.sk-fading-circle .sk-circle5:before{animation-delay:-.8s}.sk-fading-circle .sk-circle6:before{animation-delay:-.7s}.sk-fading-circle .sk-circle7:before{animation-delay:-.6s}.sk-fading-circle .sk-circle8:before{animation-delay:-.5s}.sk-fading-circle .sk-circle9:before{animation-delay:-.4s}.sk-fading-circle .sk-circle10:before{animation-delay:-.3s}.sk-fading-circle .sk-circle11:before{animation-delay:-.2s}.sk-fading-circle .sk-circle12:before{animation-delay:-.1s}@keyframes sk-circleFadeDelay{0%,39%,to{opacity:0}40%{opacity:1}}\n"], directives: [{ type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], pipes: { "highlight": HighlightPipe }, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: AutocompleteComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-autocomplete', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => AutocompleteComponent),
                            multi: true
                        }
                    ], encapsulation: ViewEncapsulation.None, host: {
                        '(document:click)': 'handleClick($event)',
                        'class': 'ng-autocomplete'
                    }, template: "<div class=\"autocomplete-container\" aria-owns=\"suggestions suggestions-history\" [attr.aria-expanded]=\"isOpen\"\n     [ngClass]=\"{ 'active': isOpen}\">\n  <div class=\"input-container\">\n    <input #searchInput\n           type=\"text\"\n           attr.aria-label=\"{{placeholder}}\"\n           aria-autocomplete=\"list\"\n           role=\"combobox\"\n           placeholder={{placeholder}}\n           [(ngModel)]=query\n           (input)=\"onChange($event)\"\n           (focus)=handleFocus($event)\n           (blur)=onTouched($event)\n           [disabled]=\"disabled\"\n           autocomplete=\"off\">\n    <div class=\"x\" *ngIf=\"query && !isLoading && !disabled\" (click)=\"remove($event)\">\n      <i class=\"material-icons\" aria-label=\"Close\">close</i>\n    </div>\n    <!--Loading mask-->\n    <div class=\"sk-fading-circle\" *ngIf=\"isLoading\">\n      <div class=\"sk-circle1 sk-circle\"></div>\n      <div class=\"sk-circle2 sk-circle\"></div>\n      <div class=\"sk-circle3 sk-circle\"></div>\n      <div class=\"sk-circle4 sk-circle\"></div>\n      <div class=\"sk-circle5 sk-circle\"></div>\n      <div class=\"sk-circle6 sk-circle\"></div>\n      <div class=\"sk-circle7 sk-circle\"></div>\n      <div class=\"sk-circle8 sk-circle\"></div>\n      <div class=\"sk-circle9 sk-circle\"></div>\n      <div class=\"sk-circle10 sk-circle\"></div>\n      <div class=\"sk-circle11 sk-circle\"></div>\n      <div class=\"sk-circle12 sk-circle\"></div>\n    </div>\n  </div>\n\n  <!--FilteredList items-->\n  <div class=\"suggestions-container\" id=\"suggestions\" role=\"listbox\"\n       [ngClass]=\"{ 'is-hidden': isHistoryListVisible, 'is-visible': !isHistoryListVisible}\">\n    <!--FilteredList heading-->\n    <div class=\"heading\" *ngIf=\"filteredList.length > 0 && heading\">\n      <div class=\"text\">{{heading}}</div>\n    </div>\n\n    <ul #filteredListElement>\n      <li *ngFor=\"let item of filteredList; let idx = index\" class=\"item\">\n        <!--string logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='isTypeString(item)'\n             (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate;  context: { $implicit: item | highlight: toHighlight }\">\n          </ng-container>\n        </div>\n        <!--object logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='!isTypeString(item)'\n             (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate; context: { $implicit: item | highlight: toHighlight : searchKeyword }\">\n          </ng-container>\n        </div>\n      </li>\n    </ul>\n  </div>\n\n  <!--HistoryList items-->\n  <div class=\"suggestions-container\" id=\"suggestions-history\" role=\"listbox\"\n       [ngClass]=\"{ 'is-hidden': !isHistoryListVisible, 'is-visible': isHistoryListVisible}\">\n    <!--HistoryList heading-->\n    <div class=\"heading\" *ngIf=\"historyList.length > 0 && historyHeading\">\n      <div class=\"text\">{{historyHeading}}</div>\n      <div class=\"x\" (click)=\"resetHistoryList($event)\">\n        <i class=\"material-icons\" aria-label=\"Delete\">delete</i>\n      </div>\n    </div>\n\n    <ul #historyListElement>\n      <li *ngFor=\"let item of historyList; let idx = index\" class=\"item\">\n        <!--string logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='isTypeString(item)' (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate;  context: { $implicit: item }\">\n          </ng-container>\n        </div>\n        <!--object logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='!isTypeString(item)' (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate; context: { $implicit: item }\">\n          </ng-container>\n        </div>\n        <div class=\"x\" (click)=\"removeHistoryItem(idx, $event)\">\n          <i class=\"material-icons\" aria-label=\"Close\">close</i>\n        </div>\n      </li>\n    </ul>\n  </div>\n\n  <!--Not found-->\n  <div class=\"not-found\" *ngIf=\"isLoading ? !isLoading && notFound : notFound\">\n    <ng-container\n      *ngTemplateOutlet=\"notFoundTemplate;  context: { $implicit: notFoundText  }\">\n    </ng-container>\n  </div>\n</div>\n<div class=\"autocomplete-overlay\" *ngIf=\"overlay\" (click)=\"handleOverlay()\"></div>\n", styles: ["@import\"https://fonts.googleapis.com/icon?family=Material+Icons\";.ng-autocomplete{width:600px}.autocomplete-container{box-shadow:0 1px 3px #0003,0 1px 1px #00000024,0 2px 1px -1px #0000001f;position:relative;overflow:visible;height:40px}.autocomplete-container .input-container input{font-size:14px;box-sizing:border-box;border:none;box-shadow:none;outline:none;background-color:#fff;color:#000000de;width:100%;padding:0 15px;line-height:40px;height:40px}.autocomplete-container .input-container input:disabled{background-color:#eee;color:#666}.autocomplete-container .input-container .x{position:absolute;right:10px;margin:auto;cursor:pointer;top:50%;transform:translateY(-50%)}.autocomplete-container .input-container .x i{color:#0000008a;font-size:22px;vertical-align:middle}.autocomplete-container .suggestions-container{position:absolute;width:100%;background:white;height:auto;box-shadow:0 2px 5px #00000040;box-sizing:border-box}.autocomplete-container .suggestions-container ul{padding:0;margin:0;max-height:240px;overflow-y:auto}.autocomplete-container .suggestions-container ul li{position:relative;list-style:none;padding:0;margin:0;cursor:pointer}.autocomplete-container .suggestions-container ul li a{padding:14px 15px;display:block;text-decoration:none;color:#333;cursor:pointer;color:#000000de;font-size:15px}.autocomplete-container .suggestions-container ul li:hover,.autocomplete-container .suggestions-container .complete-selected{background-color:#9e9e9e2e}.autocomplete-container .suggestions-container .heading{position:relative;padding:10px 15px;border:solid 1px #f1f1f1}.autocomplete-container .suggestions-container .heading .text{font-size:.85em}.autocomplete-container .suggestions-container .x{position:absolute;right:10px;margin:auto;cursor:pointer;top:50%;transform:translateY(-50%)}.autocomplete-container .suggestions-container .x i{color:#0000008a;font-size:18px;vertical-align:middle}.autocomplete-container .suggestions-container.is-hidden{visibility:hidden}.autocomplete-container .suggestions-container.is-visible{visibility:visible}.autocomplete-container .not-found{padding:0 .75em;border:solid 1px #f1f1f1;background:white}.autocomplete-container .not-found div{padding:.4em 0;font-size:.95em;line-height:1.4;border-bottom:1px solid rgba(230,230,230,.7)}.autocomplete-container.active{z-index:999}.highlight{font-weight:700}.autocomplete-overlay{position:fixed;background-color:transparent;width:100%;height:100%;top:0;right:0;bottom:0;left:0;z-index:50}input[type=text]::-ms-clear{display:none}.sk-fading-circle{width:20px;height:20px;position:absolute;right:10px;top:0;bottom:0;margin:auto}.sk-fading-circle .sk-circle{width:100%;height:100%;position:absolute;left:0;top:0}.sk-fading-circle .sk-circle:before{content:\"\";display:block;margin:0 auto;width:15%;height:15%;background-color:#333;border-radius:100%;animation:sk-circleFadeDelay 1.2s infinite ease-in-out both}.sk-fading-circle .sk-circle2{transform:rotate(30deg)}.sk-fading-circle .sk-circle3{transform:rotate(60deg)}.sk-fading-circle .sk-circle4{transform:rotate(90deg)}.sk-fading-circle .sk-circle5{transform:rotate(120deg)}.sk-fading-circle .sk-circle6{transform:rotate(150deg)}.sk-fading-circle .sk-circle7{transform:rotate(180deg)}.sk-fading-circle .sk-circle8{transform:rotate(210deg)}.sk-fading-circle .sk-circle9{transform:rotate(240deg)}.sk-fading-circle .sk-circle10{transform:rotate(270deg)}.sk-fading-circle .sk-circle11{transform:rotate(300deg)}.sk-fading-circle .sk-circle12{transform:rotate(330deg)}.sk-fading-circle .sk-circle2:before{animation-delay:-1.1s}.sk-fading-circle .sk-circle3:before{animation-delay:-1s}.sk-fading-circle .sk-circle4:before{animation-delay:-.9s}.sk-fading-circle .sk-circle5:before{animation-delay:-.8s}.sk-fading-circle .sk-circle6:before{animation-delay:-.7s}.sk-fading-circle .sk-circle7:before{animation-delay:-.6s}.sk-fading-circle .sk-circle8:before{animation-delay:-.5s}.sk-fading-circle .sk-circle9:before{animation-delay:-.4s}.sk-fading-circle .sk-circle10:before{animation-delay:-.3s}.sk-fading-circle .sk-circle11:before{animation-delay:-.2s}.sk-fading-circle .sk-circle12:before{animation-delay:-.1s}@keyframes sk-circleFadeDelay{0%,39%,to{opacity:0}40%{opacity:1}}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { searchInput: [{
                type: ViewChild,
                args: ['searchInput']
            }], filteredListElement: [{
                type: ViewChild,
                args: ['filteredListElement']
            }], historyListElement: [{
                type: ViewChild,
                args: ['historyListElement']
            }], data: [{
                type: Input
            }], searchKeyword: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], heading: [{
                type: Input
            }], initialValue: [{
                type: Input
            }], historyIdentifier: [{
                type: Input
            }], historyHeading: [{
                type: Input
            }], historyListMaxNumber: [{
                type: Input
            }], notFoundText: [{
                type: Input
            }], isLoading: [{
                type: Input
            }], debounceTime: [{
                type: Input
            }], disabled: [{
                type: Input
            }], minQueryLength: [{
                type: Input
            }], focusFirst: [{
                type: Input
            }], customFilter: [{
                type: Input
            }], selectedValueRender: [{
                type: Input
            }], selected: [{
                type: Output
            }], inputChanged: [{
                type: Output
            }], inputFocused: [{
                type: Output
            }], inputCleared: [{
                type: Output
            }], opened: [{
                type: Output
            }], closed: [{
                type: Output
            }], scrolledToEnd: [{
                type: Output
            }], itemTemplate: [{
                type: Input
            }], notFoundTemplate: [{
                type: Input
            }], customTemplate: [{
                type: ContentChild,
                args: [TemplateRef]
            }] } });

class AutocompleteLibModule {
}
AutocompleteLibModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: AutocompleteLibModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AutocompleteLibModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: AutocompleteLibModule, declarations: [AutocompleteComponent, HighlightPipe], imports: [CommonModule,
        FormsModule], exports: [AutocompleteComponent, HighlightPipe] });
AutocompleteLibModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: AutocompleteLibModule, imports: [[
            CommonModule,
            FormsModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: AutocompleteLibModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule
                    ],
                    declarations: [AutocompleteComponent, HighlightPipe],
                    exports: [AutocompleteComponent, HighlightPipe]
                }]
        }] });

/*
 * Public API Surface of autocomplete-lib
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AutocompleteComponent, AutocompleteLibModule, HighlightPipe };
//# sourceMappingURL=angular-ng-autocomplete.mjs.map
