document.addEventListener('DOMContentLoaded', function() {

    var docElem = document.documentElement;
    var kanban = document.querySelector('.kanban-demo');
    var board = kanban.querySelector('.board');
    var itemContainers = Array.prototype.slice.call(kanban.querySelectorAll('.board-column-content'));
    var columnGrids = [];
    var dragCounter = 0;
    var boardGrid;

    itemContainers.forEach(function(container) {

        var muuri = new Muuri(container, {
            items: '.board-item',
            layoutDuration: 400,
            layoutEasing: 'ease',
            dragEnabled: true,
            dragSort: function () {
                return columnGrids;
            },
            dragSortInterval: 0,
            dragContainer: document.body,
            dragReleaseDuration: 400,
            dragReleaseEasing: 'ease'
        })
        .on('dragStart', function(item) {
            ++dragCounter;
            docElem.classList.add('dragging');
            item.getElement().style.width = item.getWidth() + 'px';
            item.getElement().style.height = item.getHeight() + 'px';
        })
        .on('dragEnd', function(item) {
            if (--dragCounter < 1) {
                docElem.classList.remove('dragging');
            }
        })
        .on('dragReleaseEnd', function(item) {
            item.getElement().style.width = '';
            item.getElement().style.height = '';
            columnGrids.forEach(function(muuri) {
                muuri.refreshItems();
            });
        })
        .on('layoutStart', function() {
            boardGrid.refreshItems().layout();
        });

        columnGrids.push(muuri);

    });

    boardGrid = new Muuri(board, {
        layoutDuration: 400,
        layoutEasing: 'ease',
        dragEnabled: true,
        dragSortInterval: 0,
        // dragStartPredicate: {
        //   handle: '.board-column-header'
        // },
        dragStartPredicate: function(item, e) {
            var its = boardGrid.getItems(),
                idx = its.indexOf(item);
            // prevent first and last items from being dragged. 
            if (idx === 0 || idx === its.length-1) {
                return false;
            }
            // for other items use the default drag start predicate passing the custom options:
            return Muuri.ItemDrag.defaultStartPredicate(item, e, {handle: '.board-column-header'});
        },
        dragReleaseDuration: 400,
        dragReleaseEasing: 'ease'
    });

});