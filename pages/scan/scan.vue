<template>
	<view>
		<!-- ios扫码速度快于安卓 -->
	</view>
</template>
<script>
	var barcode = null;
	export default {
		data() {
			return {
				flash: false, //是否打开摄像头
				title: this.$t('scan.title'), //标题
				tips: this.$t('scan.tips'), //要在扫码界面自定义的内容
				light: this.$t('scan.light'), //手电筒
				album:  this.$t('scan.album'), //相册
				cancel: this.$t('scan.cancel'), //取消相册选择
				error: this.$t('scan.error') //扫码失败
			};
		},
		onLoad(d) {
			let pages = getCurrentPages(); //getCurrentPages() 函数用于获取当前页面栈的实例
			let page = pages[pages.length - 1];
			// #ifdef APP-PLUS
			plus.navigator.setFullscreen(true); //设置应用是否全屏显示
			let currentWebview = page.$getAppWebview(); //$getAppWebview() 可以得到当前webview的对象实例，从而实现对 webview 更强大的控制。
			this.createBarcode(currentWebview); //创建二维码窗口
			this.createView(currentWebview); //创建界面
			// #endif
		},
		methods: {
			// 从相册中选择图片
			galleryImg() {
				let _this=this
				plus.gallery.pick(function(path) {
					_this.scanImg(path) //成功选择
				}, function(e) {
					//用户取消选择
					_this.tip(_this.$t('scan.cancel'))
					 barcode.start(); //开始扫码识别
				}, {
					filter: "image"
				});
			},

			// 从图片中扫码识别 
			scanImg(path) {
				let _this=this
				plus.barcode.scan(path, function(type, result) {
					_this.onmarked(type, result)
				}, function(e) {
					_this.tip(_this.$t('scan.error'))
					barcode.start(); //识别失败后ios会卡住，重启扫码
				});
			},

			// 扫码成功回调
			onmarked(type, result) {
				let text = '未知: ';
				switch (type) {
					case plus.barcode.QR:
						text = 'QR: ';
						break;
					case plus.barcode.EAN13:
						text = 'EAN13: ';
						break;
					case plus.barcode.EAN8:
						text = 'EAN8: ';
						break;
				}
				// 这里自己处理成功后的逻辑
				plus.navigator.setFullscreen(false); //关闭全屏显示 
				uni.navigateBack({
					delta: 1 //返回到上一页
				});
				this.$eventHub.$emit("scanResult", {
					result: result //发送数据
				});
				barcode.close();
			},
			// 创建二维码窗口
			createBarcode(currentWebview) {
				// 创建扫码识别控件对象
				barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
					top: '0',
					left: '0',
					width: '100%',
					height: '100%',
					scanbarColor: '#1DA7FF',
					position: 'static',
					frameColor: '#1DA7FF'
				});
				barcode.onmarked = this.onmarked; //扫码成功回调
				barcode.setFlash(this.flash); //操作闪光灯
				currentWebview.append(barcode); //把扫码控件添加到页面
				barcode.start(); //开始扫码识别
			},
			// 创建操作按钮及tips
			createView(currentWebview) {
				// nativeObj管理系统原生对象。
				// 创建返回原生按钮
				let _this = this;
				let backView = new plus.nativeObj.View('backView', {
						top: '0px',
						left: '0px',
						height: '40px',
						width: '40px'
					},
					[{
						tag: 'img',
						id: 'backBar',
						src: 'static/backBar.png',
						position: {
							top: '10px',
							left: '5px',
							width: '35px',
							height: '35px'
						}
					}]);
				// 创建打开相册按钮
				let albumView = new plus.nativeObj.View('albumView', {
						top: '0px',
						left: '78%',
						height: '40px',
						width: '70px'
					},
					[{
						tag: 'font',
						id: 'openAlbum',
						text: _this.album,
						textStyles: {
							size: '18px',
							color: '#ffffff'
						},
						position: {
							top: '10px',
							left: '10px',
							width: '70px',
							height: '40px'
						}
					}]);
				// 创建打开手电筒的按钮
				let scanBarView = new plus.nativeObj.View('scanBarView', {
						top: '60%',
						left: '40%',
						height: '10%',
						width: '20%'

					},
					[{
							tag: 'img',
							id: 'scanBar',
							src: 'static/scanBar.png',
							position: {
								width: '28%',
								left: '36%',
								height: '30%'
							}
						},
						{
							tag: 'font',
							id: 'font',
							text: _this.light,
							textStyles: {
								size: '10px',
								color: '#ffffff'
							},
							position: {
								top: '5px',
								width: '80%',
								left: '10%'
							}
						}
					]);

				// 创建文本内容
				let content = new plus.nativeObj.View('content', {
						top: '0px',
						left: '0px',
						height: '100%',
						width: '100%'
					},
					[{
							tag: 'font',
							id: 'scanTitle',
							text: _this.title,
							textStyles: {
								size: '18px',
								color: '#ffffff'
							},
							position: {
								top: '10px',
								left: '0px',
								width: '100%',
								height: '40px'
							}
						},
						{
							tag: 'font',
							id: 'scanTips',
							text: _this.tips,
							textStyles: {
								size: '14px',
								color: '#ffffff',
								whiteSpace: 'normal'
							},
							position: {
								top: '90px',
								left: '10%',
								width: '80%',
								height: 'wrap_content'
							}
						}

					]);
				backView.interceptTouchEvent(true); //是否拦截View控件的触屏事件
				scanBarView.interceptTouchEvent(true);
				currentWebview.append(content); //添加内容到页面
				currentWebview.append(scanBarView);
				currentWebview.append(backView);
				currentWebview.append(albumView);
				backView.addEventListener("click", function(e) { //给返回按钮添加事件监听
					uni.navigateBack({
						delta: 1 //返回上一级
					});
					barcode.close(); //关闭扫码
					plus.navigator.setFullscreen(false); //关闭全屏显示

				}, false);
				albumView.addEventListener("click", function(e) { //给打开相册按钮添加事件监听
					_this.galleryImg()
				}, false);
				scanBarView.addEventListener("click", function(e) { //点亮手电筒事件控制
					_this.flash = !_this.flash;
					if (_this.flash) {
						scanBarView.draw([{
								tag: 'img',
								id: 'scanBar',
								src: 'static/yellow-scanBar.png',
								position: {
									width: '28%',
									left: '36%',
									height: '30%'
								}
							},
							{
								tag: 'font',
								id: 'font',
								text: _this.light,
								textStyles: {
									size: '10px',
									color: '#ffffff'
								},
								position: {
									top: '5px',
									width: '80%',
									left: '10%'
								}
							}
						]);
					} else {
						scanBarView.draw([{
								tag: 'img',
								id: 'scanBar',
								src: 'static/scanBar.png',
								position: {
									width: '28%',
									left: '36%',
									height: '30%'
								}
							},
							{
								tag: 'font',
								id: 'font',
								text: _this.light,
								textStyles: {
									size: '10px',
									color: '#ffffff'
								},
								position: {
									top: '5px',
									width: '80%',
									left: '10%'
								}
							}
						])
					}
					if (barcode) {
						barcode.setFlash(_this.flash);
					}
				}, false)

			}
		},
		onBackPress() {
			// #ifdef APP-PLUS
			// 返回时退出全屏
			barcode.close();
			plus.navigator.setFullscreen(false);
			// #endif
		},
		onUnload() {
			plus.navigator.setFullscreen(false);
		}


	};
</script>

<style scoped>
</style>
