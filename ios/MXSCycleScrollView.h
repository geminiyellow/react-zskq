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
//  MXSCycleScrollView.h
//
//
//  Created by fangmi-huangchengda on 15/10/21.
//
//  Modified by AndyWu on 17/02/10
//
//


#import <UIKit/UIKit.h>

@protocol MXSCycleScrollViewDelegate;
@protocol MXSCycleScrollViewDatasource;

@interface MXSCycleScrollView : UIView<UIScrollViewDelegate>
{
    NSInteger _totalPages;
    NSInteger _curPage;
}

@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) NSMutableArray *curViews;
@property (nonatomic, assign) NSInteger currentPage;

/// 是否循环显示数据
@property (nonatomic, assign) BOOL isCircular;

@property (nonatomic, weak, setter = setDataSource:) id<MXSCycleScrollViewDatasource> datasource;
@property (nonatomic, weak, setter = setDelegate:) id<MXSCycleScrollViewDelegate> delegate;

/// 设置初始化页数
- (void)setCurrentSelectPage:(NSInteger)selectPage;

- (void)reloadData;
//- (void)setViewContent:(UIView *)view atIndex:(NSInteger)index;

@end


@protocol MXSCycleScrollViewDelegate <NSObject>

@optional
- (void)didClickPage:(MXSCycleScrollView *)csView atIndex:(NSInteger)index;
- (void)scrollviewDidChangeNumber;

@end


@protocol MXSCycleScrollViewDatasource <NSObject>

@required
- (NSInteger)numberOfPages:(MXSCycleScrollView*)scrollView;
- (UIView *)pageAtIndex:(NSInteger)index andScrollView:(MXSCycleScrollView*)scrollView;

@end
