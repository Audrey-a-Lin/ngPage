(function(window,angular,undefined){
	'use strict';
	//D[Directive] dir.description
	
	// [S]Service of pagination
	app.service('Paginator',[function(){
		//now page
		this.pageIndex = 0;
		//total rows of all data
		this.pageTotalCount = 0;
		//Rows of one page
		this.pageCount = 10;
		//Callback of click page button
		this.pageActive = null;
		//Counts of one page group
		this.pageGroup = 5;

		// [dir]Showed array data 
		this.pageArray = [];
		// [dir]Max page number
		this.maxPage = 0;

		// [F]Actived callback after page change
		this.activeCallback = function(){
			// Check if set callback or not 
			if(this.pageActive!==null &&
			   this.pageIndex>0 &&
			   this.pageIndex<=this.maxPage &&
			   this.pageTotalCount>0){
				// Set
				this.pageActive(this.pageIndex);
			}
			return;
		};
		// [F]Recount showed page array data 
		this.updatePageArray = function(){
			var groupOn = 0, //Group now on 
				numOnGroup = 0,//nth of Group
				starOnArray = 0,//Start of page array data
				endOnArray = 0;//End of page array data

			// Check if has data
			if(this.pageTotalCount>0){
				// Clear array
				this.pageArray.length = 0;//[] todo
				// If Page now on over max page
				if(this.pageIndex > this.maxPage){
					this.pageIndex = this.maxPage;
				}
				// If page under 1 (first page)
				if(this.pageIndex<1){
					this.pageIndex = 1;
				}
				// Count group of page now on(0~pageGroup-1)
				numOnGroup = this.pageIndex % this.pageGroup;
				// Check group now on 
				if(numOnGroup ===0 ){
					// Last 
					groupOn =( this.pageIndex - numOnGroup ) / this.pageGroup;
				}else{
					// Add 1 more
					groupOn =( this.pageIndex - numOnGroup ) / this.pageGroup + 1;
				}
				// First item in array
				starOnArray = (groupOn-1) * this.pageGroup + 1;
				// Last item in array
				endOnArray = starOnArray+this.pageGroup;

				// Generate array
				for(var i = starOnArray; i<endOnArray;i++){
					if(i<=this.maxPage){
						this.pageArray.push(i);
					}
					// Over max page will not be generated
					if(i>this.maxPage){
						break;
					}

				}
			}

			return this.pageArray;

		};
		// [F]Get max page number
		this.getMaxPage = function(){
			var lastPageRow = this.pageTotalCount % this.pageCount;
			// Check if total rows over 1
			if(this.pageTotalCount>0){
				// Check rows of Last page
				if(lastPageRow === 0){
					// If equal to 0
					this.maxPage = (this.pageTotalCount - ( lastPageRow )) / this.pageCount ;
				}else{
					// Not equal to 0
					this.maxPage = (this.pageTotalCount - ( lastPageRow )) / this.pageCount + 1;
				}
			}

			return this.maxPage;
		};
		// [F]Click page button
		this.changePage = function(nowPage){
			nowPage = parseInt(nowPage) || 0;
			// Check if page now on is legal
			if(nowPage>0 && nowPage<=this.maxPage && this.pageTotalCount>0){
				// Check if page has changed or not
				if(nowPage!==this.pageIndex){
					// Changed
					// Reset page now on
					this.pageIndex = nowPage;
					// Recount page
					this.updatePageArray();
				}
				// No matter if has changed page or not, callback will run
				this.activeCallback();
			}
			return;
		};
		// [F]Back to First page
		this.goToFirst = function(){
			// Click page
			this.changePage(1);
			return;
		};
		// [F]Back to last page
		this.goToLast = function(){
			// Click max page
			this.changePage(this.maxPage);
			return;
		};
		// [F]initial
		this.init = function(){
			// Get max page number
			this.getMaxPage();
			// ReCount and refresh page array
			this.updatePageArray();
		};

	}]);
	// [D]Page Directive
	/**
	 * @example
	 * 	<page page-index="m.search.PageIndex"
	 * 	  	  page-count="m.search.PageCount"
	 * 	  	  page-total-count="m.search.count"
	 * 	  	  page-active="m.search.getPageData"></page>
	 *
	 * 	Notice: --
	 * 	The serve will response total rows of data and data rows on now page
	 *
	 * 	Fields:
	 *  	pageIndex 		[required]Page now on
	 *  	pageTotalCount 	[required]Total rows of all data
	 *  	pageCount 		[Optional]Rows of one page
	 *  	pageActive 		[Optional]Callback of click page button (default arguments: nowPage)
	 *  	pageGroup 		[Optional]Counts of one page group(default: 5)
	 */
	app
	.directive('page',[function(){
		return {
			restrict: 'E',
			scope: {
				pageIndex: '=',//Page now on
				pageTotalCount: '=',//Total rows of all data
				pageCount: '=?',//Counts of one page
				pageActive: '=?',//Callback of page click
				pageGroup: '=?',//Counts of one page group
			},
			replace: true,
			template: '<div class="page">'+
							'<ul class="page-list">'+
								'<li class="page-item page-item--first" '+
									'ng-click="Paginator.goToFirst()" '+
									'ng-class="{\'page-item--dis\': pageIndex === 1}"></li>' +
								'<li class="page-item page-item--prev" ' +
									'ng-click="Paginator.changePage(pageIndex-1)" ' +
									'ng-class="{\'page-item--dis\': pageIndex === 1}"></li>' +
								'<li class="page-item" ng-repeat="item in Paginator.pageArray track by $index" ' +
									'ng-bind="item" ' +
									'ng-click="Paginator.changePage(item)" ' +
									'ng-class="{\'page-item--on\': item === pageIndex}"></li>' +
								'<li class="page-item page-item--next" ' +
									'ng-click="Paginator.changePage(pageIndex+1)" ' +
									'ng-class="{\'page-item--dis\': pageIndex === Paginator.maxPage}"></li>' +
								'<li class="page-item page-item--last" ' +
									'ng-click="Paginator.goToLast()" ' +
									'ng-class="{\'page-item--dis\': pageIndex === Paginator.maxPage}"></li>' +
								'<li class="page-fast">GO: ' +
									'<input type="text" ng-model="pageIndex" size="2" class="page-fast-input" ng-change="Paginator.changePage(pageIndex)"> / ' +
									'<i ng-bind="Paginator.maxPage"></i>' +
								'</li>' +
							'</ul>' +
					  '</div>',
			controller: function($scope,Paginator){
				// Load service
				$scope.Paginator = Paginator;
				// Set page now on
				Paginator.pageIndex = $scope.pageIndex;
				// Set total rows of all data
				Paginator.pageTotalCount = $scope.pageTotalCount;
				// Set counts of one page
				Paginator.pageCount = $scope.pageCount;
				// Set callback of page click
				Paginator.pageActive = $scope.pageActive || null;
				// Set counts of one page group(default: 5)
				Paginator.pageGroup = $scope.pageGroup || 5;


				// init
				Paginator.init();

				// Watch now page and total rows of all data
				$scope.$watchGroup(['pageIndex','pageTotalCount'],function(newV,oldV){
					// newV[0] -> $scope.pageIndex
					// newV[1] -> $scope.pageTotalCount
					// Update page now on
					Paginator.pageIndex = newV[0];
					// Update total rows of all data
					Paginator.pageTotalCount = newV[1];
					// If total rows of data has changed
					if(newV[1]!==oldV[1]){
						// Get max page again
						Paginator.getMaxPage();
						// If total rows become less 
						if(Paginator.pageIndex > Paginator.maxPage){
							// Update page now on
							Paginator.pageIndex = Paginator.maxPage;
							// Request content of page now on again
							Paginator.changePage(Paginator.pageIndex);

						}

					}
					// Recount page and refresh page array data
					Paginator.updatePageArray();
				});
			}

		};
	}]);


})(window,window.angular);
