"use strict";

document.addEventListener("DOMContentLoaded", function() {

    const docElem       = document.documentElement,
          section       = document.querySelector(".demo-section"),
          board         = section.querySelector(".board"),
          item_containers = Array.prototype.slice.call(section.querySelectorAll(".board-column-content")),
          headers       = Array.prototype.slice.call(section.querySelectorAll(".board-column-header"));
    
    let columnGrids = [],
        dragCounter = 0,
        boardGrid;

    for(let i = 0, l = headers.length; i < l; i++) {
        let header = headers[i];
        header.addEventListener("dblclick", function() {
            let parent = header.parentNode;
            if(parent.classList.contains("expanded")) {
                //parent.style.width = "220px";
                parent.style.width = "14%";
                parent.classList.remove("expanded");
            } else {
                //parent.style.width = "464px"; // (220px width * 2) + (12px margin * 2)
                parent.style.width = "30%"; // (14% width * 2) + (1% margin * 2)
                parent.classList.add("expanded");
            }
            columnGrids[i].refreshItems().layout();
            boardGrid.refreshItems().layout();
        });
    }


    item_containers.forEach(function(container) {

        let muuri = new Muuri(container, {
            items: ".board-item",
            layoutDuration: 400,
            layoutEasing: "ease",
            dragEnabled: true,
            dragSort: function() {
                return columnGrids;
            },
            dragSortInterval: 0,
            dragContainer: document.body,
            dragReleaseDuration: 400,
            dragReleaseEasing: 'ease'
        })
        .on("dragStart", function(item) {
            ++dragCounter;
            docElem.classList.add("dragging");
            item.getElement().style.width = item.getWidth() + "px";
            item.getElement().style.height = item.getHeight() + "px";
        })
        .on("dragEnd", function(item) {
            if (--dragCounter < 1) {
                docElem.classList.remove("dragging");
            }
        })
        .on("dragReleaseEnd", function(item) {
            item.getElement().style.width = "";
            item.getElement().style.height = "";
            columnGrids.forEach(function(columnGrid) {
                columnGrid.refreshItems();
            });
        })
        .on("layoutStart", function() {
            boardGrid.refreshItems().layout();
        });

        columnGrids.push(muuri);
    });


    boardGrid = new Muuri(board, {
        layoutDuration: 400,
        layoutEasing: "ease",
        dragEnabled: true,
        dragSortInterval: 0,
        // dragStartPredicate: {
        //   handle: ".board-column-header"
        // },
        dragStartPredicate: function(item, e) {
            var its = boardGrid.getItems(),
                idx = its.indexOf(item);
            // prevent first and last items from being dragged
            // if (idx === 0 || idx === its.length-1) {
            //     return false;
            // }
            // prevent first item from being dragged
            if (idx === 0) {
                return false;
            }
            // for other items use the default drag start predicate passing the custom options:
            return Muuri.ItemDrag.defaultStartPredicate(item, e, {handle: ".board-column-header"});
        },
        dragReleaseDuration: 400,
        dragReleaseEasing: "ease"
    });

});
