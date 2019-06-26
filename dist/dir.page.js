(function(window,angular,undefined){
	'use strict';
	//D[元件] dir.description
	/**
	 * @example
	 * 	<page page-index="mbm.search.PageIndex"
	 * 	  page-count="mbm.search.PageCount"
	 * 	  page-data-count="mbm.mbmList.count"
	 * 	  page-active="mbm.getMember"
	 * 	  ng-show="mbm.mbmList.list.length"></page>
	 *
	 * 	注意:
	 *
	 * 	欄位:
	 *  pageIndex 		[必填]目前頁碼
	 *  pageDataCount 	[必填]資料總筆數
	 *  pageCount 		[選填]一頁筆數
	 *  pageActive 		[選填]點擊按鈕後行為
	 *  pageGroup 		[選填]一口氣顯示幾組頁碼
	 */
	// [S]分頁使用的服務(每一個分頁dom有自己的實體)
	app.service('Paginator',[function(){
		//目前頁碼
		this.pageIndex = 0;
		//資料總筆數
		this.pageDataCount = 0;
		//一頁筆數
		this.pageCount = 10;
		//點擊按鈕後行為
		this.pageActive = null;
		//一口氣顯示幾組頁碼
		this.pageGroup = 5;

		// [dir]顯示的陣列
		this.pageArray = [];
		// [dir]最大頁數
		this.maxPage = 0;

		// [F]啟動更換頁碼後的動作
		this.activeCallback = function(){
			// 判斷是否有設定動作
			if(this.pageActive!==null &&
			   this.pageIndex>0 &&
			   this.pageIndex<=this.maxPage &&
			   this.pageDataCount>0){
				// 有設定
				this.pageActive(this.pageIndex);
			}
			return;
		};
		// [F]重新計算頁碼刷新頁碼陣列
		this.updatePageArray = function(){
			var groupOn = 0, //目前所在群組
				numOnGroup = 0,//在群組的第幾個
				starOnArray = 0,//陣列中起始數字
				endOnArray = 0;//陣列中結束數字

			// 判斷是否有總筆數
			if(this.pageDataCount>0){
				// 清除陣列
				this.pageArray = [];
				// 如果目前頁數大於最大頁數
				if(this.pageIndex > this.maxPage){
					this.pageIndex = this.maxPage;
				}
				// 如果頁數小於1則為1
				if(this.pageIndex<1){
					this.pageIndex = 1;
				}
				// 計算現在頁數是在第幾個群組中的第幾個(0~pageGroup-1)
				numOnGroup = this.pageIndex % this.pageGroup;
				// 計算現在頁碼是在第幾個群組
				if(numOnGroup ===0 ){
					// 最後一個項目
					groupOn =( this.pageIndex - numOnGroup ) / this.pageGroup;
				}else{
					// 要多加一群組
					groupOn =( this.pageIndex - numOnGroup ) / this.pageGroup + 1;
				}
				// 陣列第一個項目
				starOnArray = (groupOn-1) * this.pageGroup + 1;
				// 陣列最後一個項目
				endOnArray = starOnArray+this.pageGroup;

				// 產生陣列
				for(var i = starOnArray; i<endOnArray;i++){
					if(i<=this.maxPage){
						this.pageArray.push(i);
					}
					if(i>this.maxPage){
						break;
					}

				}
			}

			return this.pageArray;

		};
		// [F]取得最大頁數
		this.getMaxPage = function(){
			var lastPageRow = this.pageDataCount % this.pageCount;
			// 判斷是否有總筆數
			if(this.pageDataCount>0){
				// 判斷最後一頁筆數數目
				if(lastPageRow === 0){
					// 為零
					this.maxPage = (this.pageDataCount - ( lastPageRow )) / this.pageCount ;
				}else{
					// 不為零
					this.maxPage = (this.pageDataCount - ( lastPageRow )) / this.pageCount + 1;
				}
			}

			return this.maxPage;
		};
		// [F]點擊頁碼
		this.changePage = function(nowPage){
			nowPage = parseInt(nowPage) || 0;//parseInt(this.pageIndex);
			// 判斷目前頁碼是否合法
			if(nowPage>0 && nowPage<=this.maxPage && this.pageDataCount>0){
				// 判斷頁碼是否有更改
				if(nowPage!==this.pageIndex){
					// 有
					// 設定目前頁碼
					this.pageIndex = nowPage;
					// 重新計算頁碼
					this.updatePageArray();
				}
				// 不管有沒有更改頁碼都要啟動callback
				// 啟動更換頁碼後的動作
				this.activeCallback();
			}
			return;
		};
		// [F]回到第一頁
		this.goToFirst = function(){
			// 點擊頁碼
			this.changePage(1);
			return;
		};
		// [F]回到最後一頁
		this.goToLast = function(){
			// 刷新頁碼陣列
			this.changePage(this.maxPage);
			return;
		};
		// [F]init
		this.init = function(){
			// 取得最大頁數
			this.getMaxPage();
			// 重新計算頁碼刷新頁碼陣列
			this.updatePageArray();
		};

	}]);
	app
	.directive('page',[function(){
		return {
			restrict: 'E',
			scope: {
				pageIndex: '=',//目前頁碼
				pageDataCount: '=',//資料總筆數
				pageCount: '=?',//一頁筆數
				pageActive: '=?',//點擊按鈕後行為
				pageGroup: '=?',//一口氣顯示幾組頁碼
			},
			transclude: true,//多設定,在這個元件沒有作用
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
								'<li class="page-fast">跳到: ' +
									'<input type="text" ng-model="pageIndex" size="2" class="page-fast-input" ng-change="Paginator.changePage(pageIndex)"> / ' +
									'<i ng-bind="Paginator.maxPage"></i>' +
								'</li>' +
							'</ul>' +
					  '</div>',
			controller: function($scope,Paginator){

				// 載入服務
				$scope.Paginator = Paginator;
				// 目前頁碼
				Paginator.pageIndex = $scope.pageIndex;
				// 資料總筆數
				Paginator.pageDataCount = $scope.pageDataCount;
				// 一頁筆數
				Paginator.pageCount = $scope.pageCount;
				// 點擊按鈕後行為
				Paginator.pageActive = $scope.pageActive || null;
				// 一口氣顯示幾組頁碼(預設為5個)
				Paginator.pageGroup = $scope.pageGroup || 5;


				// init
				Paginator.init();

				// 監聽目前頁碼跟資料總筆數
				$scope.$watchGroup(['pageIndex','pageDataCount'],function(newV,oldV){
					// newV[0] -> $scope.pageIndex
					// newV[1] -> $scope.pageDataCount
					// 更新目前所在頁碼
					Paginator.pageIndex = newV[0];
					// 更新總筆數
					Paginator.pageDataCount = newV[1];
					// 如果資料總筆數有更改
					if(newV[1]!==oldV[1]){
						// 取得最大頁數
						Paginator.getMaxPage();
						// 如果總頁數減少
						if(Paginator.pageIndex > Paginator.maxPage){
							// 更新目前所在頁碼
							Paginator.pageIndex = Paginator.maxPage;
							// 重新取得該頁內容
							Paginator.changePage(Paginator.pageIndex);

						}

					}
					// 重新計算頁碼刷新頁碼陣列
					Paginator.updatePageArray();
				});
			}

		};
	}]);


})(window,window.angular);
