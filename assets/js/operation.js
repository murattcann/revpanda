
let spinner = '<img src="./assets/images/loader.gif" class="loader">';
let warningAlert = '<div class="alert alert-warning">No recorded data yet.</div>';
// const enums to specify some string values once
const GET_ITEMS = "getItems";
const RECORD_ITEM = "saveItem";
const ALL_VARIABLE = "all";
const NUMERIC_VARIABLE = "numeric";

$(function(){
    let tables = [
        "a",
        "b",
        "c"
    ];
    
    setTimeout(() => {
        $.each(tables,(index, value) => {
            loadData(value);
        });
    }, 750);
});

/**
 * Loads rows from database for each related table card
 * @param string tableName
 * @param string orderColumn
 * @param string orderDirection
 */
function loadData(tableName, orderColumn="id", orderDirection = "DESC"){

    let tableCardWrapper = $('.listingCardWrapper[data-for="'+tableName+'"]');
    let tableCard = tableCardWrapper.find(".listing-card");
    let tableCardBody = tableCard.find(".card-body");
    let listWrapper = tableCard.find("ul");
 
    tableCardBody.html(spinner);  
    $.ajax({
        type: "POST",
        url: './action.php',
        dataType: "json",
        data : { 
            action: GET_ITEMS,
            table:tableName,
            orderColumn:orderColumn,
            orderDirection:orderDirection,
        },
        success: function(response){
           
            
            if(response.rowCount > 0 ){
                 tableCardBody.addClass("d-none");
                 listWrapper.removeClass("d-none");
                 let htmlStr = '';
                 $.each(response.rows, ( index, value) => {
                    htmlStr += `<li class="list-group-item">${value.table_value}</li>`;
                 });
                 listWrapper.html(htmlStr);
            }else{
                tableCardBody.html(warningAlert);
                listWrapper.addClass("d-none");
                
            }
        }
    });
}

$(document).on("keyup input",  ".inputRow input", function(){
    
    let _this = $(this);
    let value = $(this).val().trim();
    let button = $(this).parent().find(".btn");
    let variableType = $(this).data("type");

    // check string  correction for numeric value if variable type selected as numeric
    if(variableType === NUMERIC_VARIABLE && /\D/g.test(value))
    {
        _this.val(value.replace(/\D/g,''));
    }
    if(value.length > 0 ) button.prop("disabled", false);
    else button.prop("disabled", true);
 
})


$(document).on("click",  ".btnSave", function(){
    let _this = $(this);
    let input = _this.parent().find("input");
    let value = input.val().trim();
    let targetTable= _this.data("table");
    
    $(_this.prop("disabled", true));
    $.ajax({
        type: "POST",
        url: './action.php',
        dataType: "json",
        data : { 
            action: RECORD_ITEM,
            table:targetTable,
            tableValue:value,
        },
        success: function(response){
           
            if(response.status == 201 ){
                input.val('');
                loadData(targetTable);
            }else{
                 alert("An error occured, please try again...");               
            }
        }
    });

   
})

$(document).on("click", ".listingButtons button", function(){
    let _this = $(this);
    let targetTable = _this.data("table").split(","); // table values can be multiple(["a", "b"]) or singular (["a"]) 
    let column = _this.data("column");
    let direction = _this.data("direction");

    $(".listingCardWrapper").addClass("d-none");

    $.each(targetTable, (index, value) => {
        let currentWrapper = $('.listingCardWrapper[data-for="'+value+'"]');
        currentWrapper.removeClass("d-none");
        currentWrapper.css("order", index); // sets cards sort order by current table name. To see click 3th show button.
        
        //loads related datas from database
        loadData(value, column, direction);
    })
});



