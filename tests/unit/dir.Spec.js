// Unit test of directive
describe('1-Directive rendering',function(){

	var compile,mockBackend,rootScope;

	beforeEach(module('pageExample'));
	// Inject $compile service
	beforeEach(inject(function($compile,$httpBackend,$rootScope){
		compile = $compile;
		mockBackend = $httpBackend;
		rootScope = $rootScope;
	}));
	
	it('1-1. Should render HTML based on scope correctly',function(){
		var scope = rootScope.$new();// Build variable scope 
		scope.page = {
			PageIndex: 1,
			PageCount: 10,
			pageTotalCount: 10,
			clickPage: function(nowPage){
				console.log(nowPage);
			}
		};

		// Build instance of directive
		var element = compile('<page page-index="page.PageIndex"' +
							  ' page-count="page.PageCount"' +
							  ' page-total-count="page.pageTotalCount" ' +
							  ' page-active="page.clickPage"></page>')(scope);
		// Run digest loop
		scope.$digest();
		// Check
		expect(element.html()).toEqual('<ul class="page-list"><li class="page-item page-item--first page-item--dis" ng-click="Paginator.goToFirst()" ng-class="{\'page-item--dis\': pageIndex === 1}"></li><li class="page-item page-item--prev page-item--dis" ng-click="Paginator.changePage(pageIndex-1)" ng-class="{\'page-item--dis\': pageIndex === 1}"></li><!-- ngRepeat: item in Paginator.pageArray track by $index --><li class="page-item ng-binding ng-scope page-item--on" ng-repeat="item in Paginator.pageArray track by $index" ng-bind="item" ng-click="Paginator.changePage(item)" ng-class="{\'page-item--on\': item === pageIndex}">1</li><!-- end ngRepeat: item in Paginator.pageArray track by $index --><li class="page-item page-item--next page-item--dis" ng-click="Paginator.changePage(pageIndex+1)" ng-class="{\'page-item--dis\': pageIndex === Paginator.maxPage}"></li><li class="page-item page-item--last page-item--dis" ng-click="Paginator.goToLast()" ng-class="{\'page-item--dis\': pageIndex === Paginator.maxPage}"></li><li class="page-fast">GO: <input type="text" ng-model="pageIndex" size="2" class="page-fast-input ng-pristine ng-untouched ng-valid ng-not-empty" ng-change="Paginator.changePage(pageIndex)"> / <i ng-bind="Paginator.maxPage" class="ng-binding">1</i></li></ul>');
	});

});


describe('2-Directive Behavior',function(){
	var compile,mockBackend,rootScope;

	beforeEach(module('pageExample'));

	// Inject service
	beforeEach(inject(function($compile,$httpBackend,$rootScope){
		compile = $compile;
		mockBackend = $httpBackend;
		rootScope = $rootScope;
	}));

	it('Should have functions and some data on scope correctly',function(){
		
		var scope = rootScope.$new();// Build variable scope 

		var scopeClickCalled = '';//Store click result

		scope.page = {
			PageIndex: 1,
			PageCount: 10,
			pageTotalCount: 10,
			pageGroup: 5,
			clickPage: function(nowPage){
				scopeClickCalled = nowPage;
				return nowPage;
			}
		};

		
		// Build instance of directive
		var element = compile('<page page-index="page.PageIndex"' +
							  ' page-count="page.PageCount"' +
							  ' page-total-count="page.pageTotalCount" ' +
							  ' page-group="page.pageGroup" ' +
							  ' page-active="page.clickPage"></page>')(scope);
		// Run digest loop
		scope.$digest();

		// Get isolated scope inside directive
		var compiledElementScope = element.isolateScope();
		// Test scope parameters
		expect(compiledElementScope.pageIndex)
			.toEqual(scope.page.PageIndex);
		expect(compiledElementScope.pageCount)
			.toEqual(scope.page.PageCount);
		expect(compiledElementScope.pageTotalCount)
			.toEqual(scope.page.pageTotalCount);
		expect(compiledElementScope.pageGroup)
			.toEqual(scope.page.pageGroup);
		// Test page click even
		expect(compiledElementScope.pageActive(compiledElementScope.pageIndex))
			.toEqual(1);
	});
});
