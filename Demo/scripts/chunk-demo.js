"use strict";

document.addEventListener("DOMContentLoaded", function() {

    const _slice           = Array.prototype.slice,
          doc_elem         = document.documentElement,
          ////////////////////////////////////////////////////////////////////////////////////
          menu_sections    = document.getElementById("menu_sections"),
          m_sections_items = _slice.call(menu_sections.querySelectorAll("li")),
          sections         = _slice.call(document.querySelectorAll("section")),
          ////////////////////////////////////////////////////////////////////////////////////
          board            = document.querySelector(".board"),
          item_containers  = _slice.call(board.querySelectorAll(".board-column-content")),
          headers          = _slice.call(board.querySelectorAll(".board-column-header"));

    let columnGrids = [],
        dragCounter = 0,
        boardGrid;

///////////////////////////////////////////////////////////////////////////////////////////
    // console.log("sections.length: " + sections.length);
    // sections.forEach(function(sect) {
    //     console.log("section.id: " + sect.getAttribute("id"));
    // });
///////////////////////////////////////////////////////////////////////////////////////////


    // remove 'active' class from all menu-sections items
    function resetMSItems() {
        m_sections_items.forEach(function(ms_item) {
            ms_item.classList.remove('active');
        });
    }

    // remove 'active' class from all sections
    function resetSections() {
        sections.forEach(function(sect) {
            sect.classList.remove('active');
        });
    }

    // initialize menu-sections items
    m_sections_items.forEach(function(ms_item) {
        ms_item.addEventListener("click", function() {
            if(ms_item.classList.contains('active')) {
                return;
            } else {
                const idparts = ms_item.getAttribute("id").split("_");
                resetSections();
                document.getElementById("s_"+idparts[1]).classList.add("active");
                resetMSItems();
                ms_item.classList.add('active');
                //console.log("ms_item CLICK on ID: " + ms_item.getAttribute("id") + " (" + ms_item.getAttribute("title") + ")");
                //console.log("idparts[1]: " + idparts[1]);
            }
        });
    });







//    sections.forEach(function(section) {

        // initialize bundle headers
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


        // initialize bundle items
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
                doc_elem.classList.add("dragging");
                item.getElement().style.width  = item.getWidth() + "px";
                item.getElement().style.height = item.getHeight() + "px";
            })
            .on("dragEnd", function(item) {
                if (--dragCounter < 1) {
                    doc_elem.classList.remove("dragging");
                }
            })
            .on("dragReleaseEnd", function(item) {
                item.getElement().style.width  = "";
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


        // initialize boards
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

//    });

});
