;$(function(){
	// 获取函数封装
	function getData(type,$page){
		$.ajax({
			url:'http://apis.baidu.com/showapi_open_bus/channel_news/search_news',
			headers:{
				apikey:'5e7ac277afe4a93180724c96a31781ab'
			},
			data:{
				channelName:type,
				page:$page
			},
			success:function(res){
				
				var data = res.showapi_res_body.pagebean.contentlist;
				if(data.length==0){
					$('section').append('<p>抱歉API接口错误，没有数据返回</p>');
					return;
				}else{
					setTimeout(unloading,1000);
				}
				$(data).map(function(idx,val){
					var imgLen = val.imageurls.length;
					var $div = $('<div>').addClass('list');
					var $a  = $('<a>').attr({'href':val.link});
					$div.append($a);
					var $h2 = $('<h2>').html(val.title);
					var $p = $("<p><span class='source'>"+val.source+"</span><span class='pubdate'>"+ val.pubDate+"</span></p>");
					if(imgLen==1){
						$a.addClass('item item-thumbnail-left');
						 $('<img>').attr({'src':val.imageurls[0].url}).appendTo($a);
						$h2.appendTo($a);
						$p.appendTo($a);
					}else if(imgLen == 0){
						$a.addClass('item');
						$h2.appendTo($a);
						$p.appendTo($a);
					}else if(imgLen >= 3){
						$a.addClass('item');
						$h2.appendTo($a);
						var $ul = $('<ul>');
						var fram = document.createDocumentFragment();
						for(var i=0;i<3;i++){
							var $img = $('<img>').attr({'src':val.imageurls[i].url});
							$('<li>').addClass('pic').append($img).appendTo($(fram));
						}
						$(fram).appendTo($ul);
						$ul.appendTo($a);
						$p.appendTo($a);
					}
					$('section').append($div);
					
				})
			}
		})
	}
	


	var type = '国内最新';
	getData(type,1);
	// 点击新闻列表，更换类型
	$('div.newsItem').on('touchstart',function(){
		$('section').html('');
		$('div.newsItem').removeClass('active');
		$(this).addClass('active');
		type = $(this).html();
		getData(type,1);
	})
	
	$('.load_list').map(function(idx,val){
		$(this).css({'transform':'rotateZ('+ 45*idx+'deg) translateY(20rem) '})
	})

	// 下拉到底部刷新数据
	function loading(){
		$('.loading').show();
		$('div.loading>div').css('animation','run 2s linear infinite');
	}
	
	function unloading(){
		$('.loading').hide();
		$('.loading>div').css('anmation','');
	}
	// 返回顶部
	var $dom = $('div.scrollTop');
	var count = 0;//滚动次数
	var $page = 1;//页数
	$(window).scroll(function(){
		var $topHeight = $(this).scrollTop();
		if($topHeight >= $(this).height()){
			$dom.show();
		}else{
			$dom.hide();
		}
		if($topHeight >= $(document).height()-$(window).height()){
			count++;
			console.log('已经到底')
			if(count >=2){
				count=0;
				$page++;
				getData(type,$page);
				loading();
			}
		}
	})
	// 返回顶部
	$dom.on('touchstart',function(){

		$('html,body').animate({'scrollTop':0});
	})
});