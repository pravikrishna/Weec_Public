(function ($) {
    if (typeof String.prototype.endsWith != 'function') {
        String.prototype.endsWith = function (str) {
            return this.substring(this.length - str.length, this.length) === str;
        }
    };
    $.fn.searchFn = function (options) {
        
		$(this).keyup(function(){
			  if($(this).val().length >= 0){
				  //var searchString = $(this).val();
				  var params = [];
				  var searchParent = $('.searchFnRoot');
				  if(searchParent){
					  var elementList = $(this).closest('section').find('div.searchFnField');
					  $(elementList).each(function (index) {
						  $(this).closest('div.card').parent().show();
						  var searchString = $('.searchFnRoot').find('input[id="search_box"]').val();
						  var regex = /(<([^>]+)>)/ig;
						  var txtVal = $(this)[0].innerHTML.replace(regex, "");
						  if(String(txtVal.trim().replace('\n','')).toLowerCase().indexOf(searchString) <0){
							  $(this).closest('div.card').parent().hide();
						  }
						  
					  }, params);
				  }
			  }
		});
     
    };
}(jQuery));