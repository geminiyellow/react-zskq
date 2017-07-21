//
//  ____    ___   _        ___  _____  ____  ____  ____
// |    \  /   \ | T      /  _]/ ___/ /    T|    \|    \
// |  o  )Y     Y| |     /  [_(   \_ Y  o  ||  o  )  o  )
// |   _/ |  O  || l___ Y    _]\__  T|     ||   _/|   _/
// |  |   |     ||     T|   [_ /  \ ||  _  ||  |  |  |
// |  |   l     !|     ||     T\    ||  |  ||  |  |  |
// l__j    \___/ l_____jl_____j \___jl__j__jl__j  l__j
//
//
//	Powered by Polesapp.com
//
//
//  MXSCycleScrollView.m
//
//
//  Created by fangmi-huangchengda on 15/10/21.
//
//  Modified by AndyWu on 17/02/10
//
//

#import "MXSCycleScrollView.h"
#import "UIColor+HcdCustom.h"
#import "HcdConstant.h"

@implementation MXSCycleScrollView

@synthesize currentPage = _curPage;

#pragma mark - init method

- (id)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    [self addSubview:self.scrollView];
  }
  return self;
}

#pragma mark - UIScrollViewDelegate

- (void)scrollViewDidScroll:(UIScrollView *)aScrollView {
  int y = aScrollView.contentOffset.y;
  NSInteger page = aScrollView.contentOffset.y / ((self.bounds.size.height / 5));
  
  if (y > 2 * (self.bounds.size.height / 5)) {
    _curPage = [self validPageValue:_curPage + 1];
    [self loadData];
  }
  if (y <= 0) {
    _curPage = [self validPageValue:_curPage - 1];
    [self loadData];
  }
  if (page > 1 || page <= 0) {
    [self setAfterScrollShowView:aScrollView andCurrentPage:1];
  }
  if ([self.delegate respondsToSelector:@selector(scrollviewDidChangeNumber)]) {
    [self.delegate scrollviewDidChangeNumber];
  }
}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView {
  [self setAfterScrollShowView:scrollView andCurrentPage:1];
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
  [self.scrollView setContentOffset:CGPointMake(0, (self.bounds.size.height / 5)) animated:YES];
  [self setAfterScrollShowView:scrollView andCurrentPage:1];
  if ([self.delegate respondsToSelector:@selector(scrollviewDidChangeNumber)]) {
    [self.delegate scrollviewDidChangeNumber];
  }
}

- (void)scrollViewWillBeginDecelerating:(UIScrollView *)scrollView {
  [self setAfterScrollShowView:scrollView andCurrentPage:1];
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
  [self.scrollView setContentOffset:CGPointMake(0, (self.bounds.size.height / 5)) animated:YES];
  [self setAfterScrollShowView:scrollView andCurrentPage:1];
  if ([self.delegate respondsToSelector:@selector(scrollviewDidChangeNumber)]) {
    [self.delegate scrollviewDidChangeNumber];
  }
}

#pragma mark - private methods

// 设置初始化页数
- (void)setCurrentSelectPage:(NSInteger)selectPage {
  _curPage = selectPage;
}

- (void)reloadData {
  _totalPages = [self.datasource numberOfPages:self];
  if (_totalPages == 0) {
    return;
  }
  [self loadData];
}

- (void)loadData {
  // 从scrollView上移除所有的subview
  NSArray *subViews = [self.scrollView subviews];
  if([subViews count] != 0) {
    [subViews makeObjectsPerformSelector:@selector(removeFromSuperview)];
  }
	
  [self getDisplayImagesWithCurpage:_curPage];
  
  for (int i = 0; i < 7; i++) {
    UIView *v = [self.curViews objectAtIndex:i];
    v.frame = CGRectOffset(v.frame, 0, v.frame.size.height * i );
    [self.scrollView addSubview:v];
  }
  [self.scrollView setContentOffset:CGPointMake(0, (self.bounds.size.height / 5))];
}

- (void)getDisplayImagesWithCurpage:(NSInteger)page {
  NSInteger pre1 = [self validPageValue:_curPage - 1];
  NSInteger pre2 = [self validPageValue:_curPage];
  NSInteger pre3 = [self validPageValue:_curPage + 1];
  NSInteger pre4 = [self validPageValue:_curPage + 2];
  NSInteger pre5 = [self validPageValue:_curPage + 3];
  NSInteger pre = [self validPageValue:_curPage + 4];
  NSInteger last = [self validPageValue:_curPage + 5];
  
  [self.curViews removeAllObjects];
  [self.curViews addObject:[self.datasource pageAtIndex:pre1 andScrollView:self]];
  [self.curViews addObject:[self.datasource pageAtIndex:pre2 andScrollView:self]];
  [self.curViews addObject:[self.datasource pageAtIndex:pre3 andScrollView:self]];
  [self.curViews addObject:[self.datasource pageAtIndex:pre4 andScrollView:self]];
  [self.curViews addObject:[self.datasource pageAtIndex:pre5 andScrollView:self]];
  [self.curViews addObject:[self.datasource pageAtIndex:pre andScrollView:self]];
  [self.curViews addObject:[self.datasource pageAtIndex:last andScrollView:self]];
}

- (NSInteger)validPageValue:(NSInteger)value {
  if(value < 0 ) value = _totalPages + value;
  if(value == _totalPages + 1) value = 1;
  if (value == _totalPages + 2) value = 2;
  if(value == _totalPages + 3) value = 3;
  if (value == _totalPages + 4) value = 4;
  if(value == _totalPages) value = 0;
  return value;
}

//- (void)setViewContent:(UIView *)view atIndex:(NSInteger)index {
//  if (index == _curPage) {
//    [_curViews replaceObjectAtIndex:1 withObject:view];
//    for (int i = 0; i < 7; i++) {
//      UIView *v = [self.curViews objectAtIndex:i];
//      v.userInteractionEnabled = YES;
//      v.frame = CGRectOffset(v.frame, 0, v.frame.size.height * i);
//      [self.scrollView addSubview:v];
//    }
//  }
//}

- (void)setAfterScrollShowView:(UIScrollView*)scrollview  andCurrentPage:(NSInteger)pageNumber {
  UILabel *oneLabel = (UILabel *)[[scrollview subviews] objectAtIndex:pageNumber];
	oneLabel.font = REGULAR_FONT;
  [oneLabel setTextColor:[UIColor colorWithRed:0 / 255.0 green:0 / 255.0 blue:0 / 255.0 alpha:0.4]];

  UILabel *twoLabel = (UILabel *)[[scrollview subviews] objectAtIndex:pageNumber + 1];
	twoLabel.font = REGULAR_FONT;
  [twoLabel setTextColor:[UIColor colorWithRed:0 / 255.0 green:0 / 255.0 blue:0 / 255.0 alpha:0.7]];
  
  UILabel *currentLabel = (UILabel *)[[scrollview subviews] objectAtIndex:pageNumber + 2];
	currentLabel.font = BOLD_FONT;
  [currentLabel setTextColor:[UIColor blackColor]];
  
  UILabel *threeLabel = (UILabel *)[[scrollview subviews] objectAtIndex:pageNumber + 3];
	threeLabel.font = REGULAR_FONT;
  [threeLabel setTextColor:[UIColor colorWithRed:0 / 255.0 green:0 / 255.0 blue:0 / 255.0 alpha:0.7]];

  UILabel *fourLabel = (UILabel *)[[scrollview subviews] objectAtIndex:pageNumber + 4];
	fourLabel.font = REGULAR_FONT;
  [fourLabel setTextColor:[UIColor colorWithRed:0 / 255.0 green:0 / 255.0 blue:0 / 255.0 alpha:0.4]];
}

#pragma mark - getters and setters

- (UIScrollView *)scrollView {
  if (_scrollView == nil) {
    _scrollView = [[UIScrollView alloc] initWithFrame:self.bounds];
    _scrollView.delegate = self;
    _scrollView.contentSize = CGSizeMake(self.bounds.size.width, (self.bounds.size.height / 5) * 7);
    _scrollView.contentOffset = CGPointMake(0, (self.bounds.size.height / 5));
    _scrollView.showsHorizontalScrollIndicator = NO;
    _scrollView.showsVerticalScrollIndicator = NO;
  }
  return _scrollView;
}

- (NSMutableArray *)curViews {
  if (_curViews == nil) {
    _curViews = [[NSMutableArray alloc] init];
  }
  return _curViews;
}

- (void)setDataSource:(id<MXSCycleScrollViewDatasource>)datasource {
  _datasource = datasource;
  [self reloadData];
}

@end
