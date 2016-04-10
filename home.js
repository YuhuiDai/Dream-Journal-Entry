function loadDreams() {
	$.ajax({
		url: "/api",
		type: "GET",
		data: JSON,
		error: function(data){
			console.log(data);
		},
		success: function (data) {
			// console.log(data);
			$('#content').empty();
			if (data.noData){
				return;
			}
			dreamlist = [];
			commentlist = [];
			// console.log(data.length);
			// console.log(data[0]);
			for (var i = 0; i < data.length; i++) {
				if (data[i].doc.type == 'Dream') {
					dreamlist.push(data[i]);
				} else if (data[i].doc.type == 'comment'){
					commentlist.push(data[i]);
				}
			}
			// console.log(dreamlist);
			// console.log(commentlist);
			var sortedDream = _.sortBy(dreamlist, function (data) {return data.doc.created_at;});
			var sortedComment = _.sortBy(commentlist, function (data) {return data.doc.created_at;});
			sortedDream.forEach(function (data) {
				createContent(data.doc);
			});
			sortedComment.forEach(function (data) {
				createCommentDream(data.doc);
			});

		}
	});
}
var createCommentDream = function (data) {
	console.log(data);
	// var commentID = data._id;
	$('<p class="COMMENT">Comment: '+data.text+'</p>').appendTo("#"+data.parentID);
};

var createContent = function (data) {
	var dateObj = data.created_at;
	var mylist = dateObj.split('T');
	var newdate = mylist[0];

	var theID = data._id;
	var formID = data._id + "-form";
	var inputID = data._id + "-input";
	var commentParentID = data._id + "-comment";
	var saveID = data._id + "-save";

	template = '<div class="dream">';
	template += '<div class = "firstline"><div class="date">'+newdate+'</div>';
	template += '<div class="nickname">'+ data.nickname +'</div></div>';
	template += '<div class="secondline">';
	template += '<div class="dreamJournal">'+ data.text +'</div>';
	template += '<button class="comment" id="' + theID + '">Comment'+'</button>';
	template += '<form class="comment-form" id="'+ formID + '">';
	template += '<textarea class = "commentArea" name="note" id="' + inputID + '" placeholder="comment here"></textarea>';
	template += '<button class="save" id="'+saveID+'">SAVE</button>';
	template += '</form>';
	template += '</div><div class="commentContent" id="' + commentParentID + '"></div></div>';

	$('#content').append(template);

	$('#'+theID).click(function(){
		console.log('Clicked comment button!');
		$('#'+formID).toggle();
	});

	$ ('#'+saveID).click(function(data){
		var theComment = $('#'+inputID).val();
		console.log(theComment);
		$('#'+formID).toggle();
		var commentData = {
			type: 'comment',
			text: theComment,
			parentID: commentParentID,
			created_at: new Date(),
		};

		$('<p class="COMMENT">Comment: '+commentData.text+'</p>').appendTo("#"+commentData.parentID);
		
		saveComment(commentData);

		console.log("SAVE ME!!!!");
		return false;
		
	});
};

var saveComment = function(myObj) {
	console.log("Trying to Post");
	$.ajax({
		url: "/save",
		contentType: "application/json",
		type: "POST",
		data: JSON.stringify(myObj),
		error: function (resp) {
			console.log(resp);
			// Add an error message before the new note form.
			console.log('something is wrong');
		},
		success: function (resp) {
			console.log(myObj);
			// var htmlString = createContent(theData);
			// $("#content").append(htmlString);

			// $("#dream_entry").val("");
			// // Deselect the submit button.
			// $("#submit-button").blur();
		}
	});
};

$(document).ready(function(){
	console.log("Loaded!");
	
	loadDreams();


});