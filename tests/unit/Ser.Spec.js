// Unit test of Paginator service

describe('Test max page in Paginator service',function(){
	var compile,mockBackend,rootScope,paginator;

	beforeEach(module('pageExample'));
	// Inject $compile service
	beforeEach(inject(function($compile,$httpBackend,$rootScope,Paginator){
		compile = $compile;
		mockBackend = $httpBackend;
		rootScope = $rootScope;
		paginator = Paginator;
	}));		

	it('maxPage-1.Page total count equal to 9, max page should be 1',function(){
		
		var page = {
				PageIndex: 1,
				PageCount: 10,
				pageTotalCount: 9,
				clickPage: function(nowPage){
					console.log(nowPage);
				}
			};
		paginator.pageIndex = page.PageIndex;
		paginator.pageTotalCount = page.pageTotalCount;
		paginator.getMaxPage();
		//Expect
		expect(paginator.maxPage).toEqual(1);
	});
	it('maxPage-2.Page total count equal to 10, max page should be 1',function(){
		
		var page = {
				PageIndex: 1,
				PageCount: 10,
				pageTotalCount: 10,
				clickPage: function(nowPage){
					console.log(nowPage);
				}
			};
		paginator.pageIndex = page.PageIndex;
		paginator.pageTotalCount = page.pageTotalCount;
		paginator.getMaxPage();
		//Expect
		expect(paginator.maxPage).toEqual(1);
	});
	it('maxPage-3.Page total count equal to 11, max page should be 2',function(){
		
		var page = {
				PageIndex: 1,
				PageCount: 10,
				pageTotalCount: 11,
				clickPage: function(nowPage){
					console.log(nowPage);
				}
			};
		paginator.pageIndex = page.PageIndex;
		paginator.pageTotalCount = page.pageTotalCount;
		paginator.getMaxPage();
		//Expect
		expect(paginator.maxPage).toEqual(2);
	});
	it('maxPage-4.Page total count equal to 0, max page should be 0',function(){
		
		var page = {
				PageIndex: 0,
				PageCount: 10,
				pageTotalCount: 0,
				clickPage: function(nowPage){
					console.log(nowPage);
				}
			};
		paginator.pageIndex = page.PageIndex;
		paginator.pageTotalCount = page.pageTotalCount;
		paginator.getMaxPage();
		//Expect
		expect(paginator.maxPage).toEqual(0);
	});
}); 

describe('Test page group in Paginator service',function(){
	var compile,mockBackend,rootScope,paginator;

	beforeEach(module('pageExample'));
	// Inject $compile service
	beforeEach(inject(function($compile,$httpBackend,$rootScope,Paginator){
		compile = $compile;
		mockBackend = $httpBackend;
		rootScope = $rootScope;
		paginator = Paginator;
	}));		

	it('pageGroup-1.Page total count equal to 50, and now on page 1, page array should be [1,2,3,4,5]',function(){
		
		var page = {
				PageIndex: 1,
				PageCount: 10,
				pageTotalCount: 50,
				clickPage: function(nowPage){
					console.log(nowPage);
				}
			};
		paginator.pageIndex = page.PageIndex;
		paginator.pageTotalCount = page.pageTotalCount;
		paginator.init();
		//Expect
		expect(paginator.pageArray).toEqual([1,2,3,4,5]);
	});
	it('pageGroup-2.Page total count equal to 49, and now on page 1, page array should be [1,2,3,4,5]',function(){
		
		var page = {
				PageIndex: 1,
				PageCount: 10,
				pageTotalCount: 50,
				clickPage: function(nowPage){
					console.log(nowPage);
				}
			};
		paginator.pageIndex = page.PageIndex;
		paginator.pageTotalCount = page.pageTotalCount;
		paginator.init();
		//Expect
		expect(paginator.pageArray).toEqual([1,2,3,4,5]);
	});
	it('pageGroup-3.Page total count equal to 49, and now on page 6, page array should be [6]',function(){
		
		var page = {
				PageIndex: 6,
				PageCount: 10,
				pageTotalCount: 51,
				clickPage: function(nowPage){
					console.log(nowPage);
				}
			};
		paginator.pageIndex = page.PageIndex;
		paginator.pageTotalCount = page.pageTotalCount;
		paginator.init();
		//Expect
		expect(paginator.pageArray).toEqual([6]);
	});
}); 