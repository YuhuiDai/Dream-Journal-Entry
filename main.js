var alchemyApiKey = 'b8ec824e3b00343d78b9062e1c3da891a4db52a6';
var alchemySentiment;

function alchemy(theObj){
  
  $.ajax({
    url: 'https://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment',
    dataType: 'jsonp',
    jsonp: 'jsonp',
    type: 'POST',
    data: {
      apikey: alchemyApiKey,
      text: theObj.text,
     outputMode: 'json'
    },
    error: function (data) {
      console.log('alchemy ajax call error');
    },
    success: function (data) {
		console.log('alchemy ajax call success');
		alchemySentiment = data.docSentiment.type;

		//;
		theObj.sentiment = sentimentResponse(alchemySentiment);
		console.log(theObj);

		saveRecord(theObj);

    }
  });
}

function sentimentResponse(alchemySentiment){
	if (alchemySentiment == 'positive') {
		console.log('positive');
		return 'sweet dream';
	} else if (alchemySentiment == 'negative') {
		console.log('negative');
		return 'bad dream';
	} else {
		console.log('neutral');
		return 'could-be-better dream';
	}
}

var createContent = function (data) {
	var dateObj = data.created_at;
	console.log(dateObj);
	var mylist = dateObj.split('T');
	var newdate = mylist[0];
	template = '<div class="dream">';
	template += '<div class="subtext"><strong>'+newdate+'</strong></div>';
	template += '<div class="subtext"><strong>'+ data.nickname +'</strong></div>';
	template += '<div class="subtext"><strong>'+ data.sentiment +'</strong></div>';
	template += '<div class="subtext">'+ data.text +'</div>';
	template += '</div>';

	return template;
};

var addContent = function(data) {
	var dateObj = data.created_at;
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	newdate = year + "/" + month + "/" + day;
	template = '<div class="dream">';
	template += '<div class="subtext"><strong>'+newdate+'</strong></div>';
	template += '<div class="subtext"><strong>'+ data.nickname +'</strong></div>';
	template += '<div class="subtext"><strong>'+ data.sentiment +'</strong></div>';
	template += '<div class="subtext">'+ data.text +'</div>';
	template += '</div>';

	return template;

};

function saveRecord (theData) {

	theData.namespace = window.user;
	console.log("Trying to Post");
	$.ajax({
		url: "/save",
		contentType: "application/json",
		type: "POST",
		data: JSON.stringify(theData),
		error: function (resp) {
			console.log(resp);
			// Add an error message before the new note form.
			$("#dreams").prepend("<p><strong>Something broke.</strong></p>");
		},
		success: function (resp) {
			console.log(resp);
			var htmlString = addContent(theData);
			$("#content").append(htmlString);

			$("#dream_entry").val("");
			// Deselect the submit button.
			$("#submit-button").blur();
		}
	});
}

function loadNotes() {
	$.ajax({
		url: "/api/"+window.user,
		type: "GET",
		data: JSON,
		error: function(resp){
			console.log("wrong");
		},
		success: function (resp) {
			console.log("gotit!");
			$("#content").empty();

			if (resp.noData){
				return;
			}

			var sorted = _.sortBy(resp, function (data) { return data.doc.created_at;});
			sorted.forEach(function (data) {
				var htmlString = createContent(data.doc);
				$('#content').append(htmlString);
			});
		}
	});
}

console.log("here");
$(document).ready(function(){
	console.log("Loaded!");
	
	loadNotes();

	$("#dreams").submit(function () {
		
		var dreamData = {
			type: "Dream",
			nickname: window.user,
			text: $("#dream_entry").val(),
			created_at: new Date(),
		};
		console.log(window.user);
		alchemy(dreamData);
				

		//Return false to prevent the form from submitting itself
		return false;
	});
});
