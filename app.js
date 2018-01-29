$(function () {
  function initSort() {
    $(".column").sortable({
      cursor: "move",
      connectWith: ".column",
      handle: ".list-header",
      helper: "clone",
      placeholder: "ui-sortable-placeholder",
      revert: true
    }); //sorterar tables
  }
  initSort();

  function initSortCard() {
    $(".list-cards").sortable({
      cursor: "move",
      connectWith: ".list-cards",
      helper: "clone",
      placeholder: "placeholder-cards",
      revert: true
    }); //sorterar korten
  }
  initSortCard();

  function addList(event) {
    event.preventDefault(); // Don't actually submit the form, silly

    var formData = $(event.target).offsetParent().find("form").serializeArray();

    var newColumn = `<div class="column">
        <div class="list">
            <div class="list-header">
                ${formData[0].value}
                <button class="button delete">
                    X
                </button>
            </div>
            <ul class="list-cards">
            </ul>
        </div>
    </div>`;

    $(".board").append(newColumn);
    // init the sorting again after adding new lists/columns
    initSort();
  }

  dialog = $("#list-creation-dialog").dialog({
    autoOpen: false,
    height: 200,
    width: 270,
    modal: true,
    buttons: {
      Save: addList,
      Cancel: function () {
        dialog.dialog("close");
      }
    }
  }); //lägg till ett nytt tabel

  $("#new-list").click(function () {
    dialog.dialog("open"); //öppnar table create dialog
  });

  $("body").on("click", ".list-header .delete", function (event) {
    $(event.target).closest(".column").remove();
  });

  $(".new-card").submit(function (event) {
    event.preventDefault(); // Don't actually submit the form, silly
    var formData = $(event.target).serializeArray();
    $(event.target).find("input").val("");

    var newCard = `<li class="card">
        <span class="card-title">${formData[0].value}</span>
        <span class="card-due"></span>
        <button class="button delete">X</button>    
        <button class="button info">i</button>  
    </div>`;

    $(event.target).closest(".add-new").before(newCard);
  });

  $("body").on("click", ".list-cards .card .delete", function (event) {
    $(event.target).parent().remove();
  });

  $(document).on({
    click: function () {
      $('#dialog-overlay').removeClass('hide');
      $('#dialog')
        .data("cardEl", $(event.target).parent()) // This magically sets the form we clicked on, as a data object ON the dialog
        .dialog({
          open: function () {
            this.clickedCardEl = $(this).data().cardEl;
            var dialogTitelInput = $(this).find('input[name="title"]');
            var dialogDueInput = $(this).find('input[name="due"]');
            
            // Load values from the card we clicked into the dialog inputs
            dialogTitelInput.val(this.clickedCardEl.find('.card-title').text()); 
            dialogDueInput.val(this.clickedCardEl.find('.card-due').text());
          },
          buttons: {
            Save: function () {
              var newDue = $("#datepicker").datepicker("option", "dateFormat", "yy-mm-dd" ).val();
              var newTitle = $(this).find('form').serializeArray()[0].value;
              // On the card we clicked set the title to the new value 
              this.clickedCardEl.find('.card-title').text(newTitle);
              // On the card we clicked set the due date to the new value
              this.clickedCardEl.find('.card-due').text(newDue);
              // Close
              $(this).dialog("close");
            },
            Cancel: function () {
              $(this).dialog("close");
            }
          }
        });

      $('.ui-button').on('click', function () {
        $('#dialog-overlay').addClass('hide');

      });


      $('#dialog-overlay').on('click', function () {
        $('#dialog').dialog('close');
        $(this).addClass('hide');
      });

    }
  }, '.info');

  $(function () {
    $("#datepicker").datepicker({
      dateFormat: 'yy-mm-dd',
      showOn: "button",
      buttonImage: "calendar.gif",
      buttonImageOnly: true,
      buttonText: "Select date",
      onSelect: function () {
        var dateObject = $(this).datepicker('getDate');
      }
    });
  });

});