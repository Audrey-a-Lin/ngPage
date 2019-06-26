var app = angular.module('pageExample',[]);


app.controller('mainCtrl',['$scope',function($scope){
	var m = this;
	m.test1 = {
		PageIndex: 1,
		PageCount: 10,
		pageTotalCount: 10,
		clickPage: function(nowPage){
			m.test1.PageIndex = nowPage;
			return;
		}
	};
}]);