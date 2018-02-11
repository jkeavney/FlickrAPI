
function jsonFlickrFeed(json) {
	var datastore = json;

	$.each(json.items, function(i, item) {
		item.author_url = 'https://www.flickr.com/photos/' + item.author_id;
		item.author = item.author.split('("')[1].replace('")', '');
		if (item.tags !== '') {
			item.tags = '<div>Tags:<br>' + item.tags.replace(' ', ', ') + '</div>';
		} else {
			item.tags = '';
		};
		item.description = item.description.split('/></a></p>')[1];
	});
	
	function filterFeed(json) {
		filter = $('#filter').val().toLowerCase(),
		filter = filter.split(' ');
		$('#images').empty();

		if ($.isArray(filter) === true) {

			$.each(json.items, function(i, item) {
				var display = true;
			
				$.each(filter, function(i, value) {
			
					if (value !== '') {
						tags = item.tags.toLowerCase();
						title = item.title.toLowerCase();
			
						if ((tags.indexOf(value) < 0) && (title.indexOf(value) < 0)) {
							display = false;
						};
					};
				});
			
				if (display === true) {
					renderItem(item);
				};
			});
		}
	}

	function renderItem(item) {
		$('<div class="col-sm-6 col-md-4 col-lg-3 p-2"><div class="card">' +
		'<div class="media-wrap"><img class="card-img-top" src="' + item.media.m + '" alt="' + item.title +'" /></div>' +
		'<div class="card-body">' +
		'<div class="mb-2"><a href="' + item.link + '">' + item.title +'</a>' +
		'<span> by </span>' +
		'<a href="' + item.author_url + '">' + item.author +'</a></div>' +
		'<div mb-2>' + item.description + '</div>' +
		item.tags +
		'</div></div></div>').appendTo('#images');
	};

	$('#filter').on('keyup paste', function() {
		filterFeed(datastore);
	});

	$(document).ready(function() {
		$.each(json.items, function(i, item) {
			renderItem(item);
		});
	});

	$('#images').on('click','img', function() {
		$('#overlay').find('img').attr('src', $(this).attr('src').replace('_m', ''));
		$('#overlay').css('display', 'flex');
	});

	$('#overlay').click(function() {
		$(this).hide();
	});
};

$(document).ready(function() {
	$.ajax({
		url: 'https://api.flickr.com/services/feeds/photos_public.gne?format=json',
		dataType: 'jsonp',
		data: { "format": "json" }
	});
});
