Houdinivar Houdini = window.Houdini = $.Houdini = Houdini || {}
Houdini.activate = {}
Houdini.activate.data = {
	// Edit this with your recaptcha v3 site key
	reCAPTCHA_site_key : "",

	base_url : 'https://create.cpback.net',
}

$.Houdini.activate.cookie = {};
$.Houdini.activate.cookie.read = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


$.formElements = Houdini.activate.elements = function () {
	$.formElements = $.Houdini.activate.elements = {
		formId: $("input[name=form_id]"),

		loader: $("#processing-overlay"),

		errorBox: $('.oops-error-overlay'),
		errorHead: $('.oops-error-header'),
		errorTxt: $('.oops-error-txt'),

		tipBox: $('.tip-box'),
		tipTxt: $('.tip-inner'),

		paperdoll: $('#activate-paper-doll')
	}
}

Houdini.activate.ajax = function(request, data) {
	request = {
		url: $.Houdini.activate.data.base_url + '/ajax/?action=' + encodeURIComponent(request),
		type: 'post',
		data: data,
		error: function(e){
			console.info("uri request failed:" + request);
			console.log(e);

			$.Houdini.activate.error("Unable to contact register server. Contact CPBack support.");
		},
		success: function(r) {
			if (!!!r) {
				console.info("uri returned no data:" + request);
				console.log(r);

				$.Houdini.activate.error("Unable to contact register server. Contact CPBack support.");
			}
		}
	};

	return $.ajax(request);
}

Houdini.activate.error = function (txt, errors) {
	txt = txt || "Herbert ate all the puffles, ugh!";
	errors = errors || [];
	$.formElements.loader.fadeOut();
	var errorLI = '';
	for (i = 0; i < errors.length; i++) {
		errorLI += '<li>'+errors[i]+'</li>';
	}

	$.formElements.errorTxt.html('<h3>'+txt+'</h3><ul>'+errorLI+'</ul>');
	$.formElements.errorBox.fadeIn();
}

$.Houdini.activate.setup = function() {
	params={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=decodeURIComponent(v)});
	if (!!!params['u'] || !!!params['k']) {
		$.Houdini.activate.error("Someone ate all the data", ['Unable to fetch username and activation code, please try again or contact support.']);
		$.formElements.loader.fadeOut();

		throw "invalid activation data";
	}

	$("#edit-activationcode").val(params['k']);
	$("#edit-name").val(params['u']);

	$("#edit-next").off('click').on("click", function(e){
		e.preventDefault();

		$.when($(".form-1").fadeOut()).then(function(){$(".form-2").fadeIn();});
		$.formElements.tipTxt.html('<p>Players found not following the rules risk being banned.</p>');
	});

	$("#edit-activate").off('click').on("click", function(e){
		e.preventDefault();

		$.Houdini.activate.randomSongQuote();

		$('.ov-title').text("Captcha verification");
		$.formElements.loader.fadeIn();

		grecaptcha.execute($.Houdini.activate.data.reCAPTCHA_site_key, {action: 'login'}).then(function(token) {
			$('.ov-title').text("Activating");
			$.Houdini.activate.ajax('activate', {formId: $.formElements.formId.val(), k: $("#edit-activationcode").val(), u: $("#edit-name").val(), 'captcha-response': token}).success(function(r){
				if (!!r.response.error) {
					$.Houdini.activate.error("Looks like we got lost on our way back from Utipoia:", r.response.error);
				} else {
					var texts = ['YAY!', 'WooHoo!', 'Wahoo!', 'Wee!', 'Yee-Haw!', 'Yipeeeee!', 'YEAH!', 'Puffle-cious!', 'Snowy-PaRTYYY!'];
					// registered successfully!
					$.Houdini.activate.error("Account activated successfully! You can now rock-a-party, whatcha waitin for?");
					$(".oops-error-header").text(texts[Math.floor(Math.random()*texts.length)]);
					$('.oops-error-overlay').attr('class', 'oops-error-overlay oops-message message-1');
					$("#block-system-main").fadeOut();
				}
				$.formElements.loader.fadeOut();
			});
		});
	});
}

$.Houdini.activate.randomSongQuote = function() {
	quotes = `["We don't need no education;","What?s going on on the floor? I love this record baby but I can?t see straight anymore Keep it cool, what?s the name of this club? I can?t remember but it?s alright, a-alright  Just dance, gonna be okay, da da doo-doo-mmm","You change your mind like a girl changes clothes","You change your mind as often as a girl changes clothes","In the night I hear 'em talk, the coldest story ever told Somewhere far along this road he lost his soul To a woman so heartless How could you be so heartless? How could you be so heartless?","So what? I'm still a rock star!","I don't mind you coming here wasting all my time 'Cause when you're standing oh so near I kinda lose my mind","It's the end of the world as we know it","And I feel fine","Well she's my best friend's girl She's my best friend's girl but she used to be mine","Heaven ain't close in a place like this","Jesus stole my girlfriend.","Leave your body and soul at the door","I wanna rock and roll all nite and party every day","I used to rule the world","See sun rise when I gave the word","Look at the stars, Look how they shine for you, And everything you do, Yeah they were all yellow,","Help I'm Alive","My heart keeps beating like a hammer","I'll shine up the old brown shoes, put on a brand-new shirt. I'll get home early from work if you say that you love me.","Despite all my rage, I am still just a rat in a cage","Oh momma I'm in fear for my life from the long arm of the law Lawman has put an end to my running and I'm so far from my home Oh momma I can hear you a'crying you're so scared and all alone Hangman is comin' down from the gallows and I don't have very long","Accroches-toi a ton reve Accroches-toi a ton reve Quand tu vois ton bateau partir Quand tu sents -- ton coeur se briser Accroches-toi a ton reve.","A fake Jamaican took every last dime with a scam. It was worth it just to learn some sleight-of-hand.","We watched Titanic, and it didn't make us sad","Glaciers melting in the dead of night And the superstars sucked into the supermassive","Send a heartbeat to The void that cries through you Relive the pictures that have come to pass For now we stand alone The world is lost and blown And we are flesh and blood disintegrate With no more to hate","Look at him working. Darning his socks in the night when there's nobody there What does he care?","Some of them want to use you Some of them want to get used by you Some of them want to abuse you Some of them want to be abused.","Oh, I remember You driving to my house In the middle of the night I'm the one who makes you laugh When you know you're about to cry","Then you better start swimmin' Or you'll sink like a stone","Well I'm hot blooded, check it and see I got a fever of a hundred and three","Now that she's back in the atmosphere With drops of Jupiter in her hair, hey, hey, hey, hey","Hey soul sister, hey there mister, mister On the radio, stereo","Nobody wants to be the last one there","All the eyes on me in the center of the ring Just like a circus (ah, ah, ahaha-hah)","Try to hide your hand, forget how to feel","I sued Ben Affleck ... Aw, do I even need a reason?","I'm gonna do the things that I wanna do","I ain't got a thing to prove to you","I'll eat my candy with the pork and beans","Excuse my manners if I make a scene","Smiles politely back at you You stare politely right on through Some sort of window to your right","In Catholic school as vicious as Roman rule I got my knuckles bruised by a lady in black And I held my tongue as she told me 'Son fear is the heart of love' So I never went back","I'll take you to the candy shop","I'll let you lick a lollipop","So I learned to dance with a hand in my pants","(Harmonica Solo)","Is our secret safe tonight?","Hello darkness, my old friend","Mental wounds not healing Life's a bitter shame I'm going off the rails on a crazy train I'm going off the rails on a crazy train","He knelt to the ground and pulled out a ring  And said, marry me Juliet You'll never have to be alone I love you and that's all I really know I talked to your dad, go pick out a white dress It's a love story baby just say yes","Never gonna give you up Never gonna let you down Never gonna run around and desert you Never gonna make you cry Never gonna say goodbye Never gonna tell a lie and hurt you","I","Did you try to live on your own When you burned down the house and home? Did you stand too close to the fire Like a liar looking for forgiveness from a stone?","When I was a young boy,","My father took me into the city To see a marching band.  He said, 'Son when you grow up, would you be the savior of the broken, the beaten and the damned?' He said 'Will you defeat them, your demons, and all the non-believers, the plans that they have made?' 'Because one day I'll leave you, A phantom to lead you in the summer, To join The Black Parade.'","Khara Matha Khara Rath Amah Khara Rath Amah Yuddha Khara Khara Syada Rath Amah Dai Ya Khara Ki La Dan Ya Niha Ki La Khara Rath Amah Syada Ki La Khara Rath Amah Khara Dan Ya Khara Rath Amah Khara Dan Ya Khara Rath Amah Niha Ki La Khara Rath Amah Syada Ki La Khara Rath Amah Khara Khara Matha Khara Rath Amah Khara Dan Ya Khara Rath Amah Niha Ki La Khara Rath Amah Syada Ki La Khara Rath Amah Khara","Don't say goodnight Say you're gonna stay forever","They took the credit for your second symphony. Rewritten by machine and new technology, and now I understand the problems you can see.","But do you recall the most famous reindeer of all?","Hope my boyfriend don't mind it.","Play that funky music right boy.","Every breath you take Every move you make Every bond you break Every step you take I'll be watching you","Everything ends.","Mother told me, yes, she told me I'd meet girls like you. She also told me, 'Stay away, you'll never know what you'll catch.' Just the other day I heard a soldier falling off some Indonesian junk that's going round.","Rock and Roller cola wars, I can't take it anymore","Black and orange stray cat sittin' on a fence Ain't got enough dough to pay the rent I'm flat broke but I don't care I strut right by with my tail in the air","She's a mixed up son of a bitch yeah yeah","smoked my last cigarette sat in bed for awhile thought of your face and that brought me a smile wanted another one fell back asleep instead woke and found you sitting there on the bed","Watch 'em run amuck, Catch 'em as they fall, Never know your luck When there's a free for all, Here a little dip' There a little touch' Most of them are goners So they won't miss much!","You can speak your mind But not on my time","Every night in my dreams I see you, I feel you That is how I know you go on","If you feel lost and on your own And far from home You're never alone, you know Just think of your friends  The ones who care They all will be waiting there with love to share And your heart will lead you home","Exit light Enter night Take my hand We're off to never-never land","You may be right I may be crazy But it just might be a lunatic you're looking for Turn out the light Don't try to save me","Welcome MÂ´sierSit yourself downAnd meet the bestInnkeeper in town  ","","Jai Ho Jai Ho I got (I got) shivers (shivers), When you touch my face, I'll make you hot, Get what you got, I'll make you wanna say (Jai Ho)","Tell me, princess, now when did  You last let your heart decide?","But you'll be sorry when I'm dead And all this guilt will be on your head I guess you'd call it suicide But I'm too full to swallow my pride","At least out loud, I won't say I'm in love ","He was born a pauper to a pawn on a Christmas day When the New York Times said God is dead","So dance, your final dance. 'Cause this is, your final chance.","Are we human or are we dancer?","Time is never time at all.","The more you change the less you feel.","And you know youre never sure. But you're sure you could be right.","And the embers never fade in your city by the lake. The place where you were born.","Believe, believe in me, believe. Believe in the resolute urgency of now. And if you believe theres not a chance tonight. Tonight, so bright. Tonight.","We'll crucify the insincere tonight. We'll make things right, we'll feel it all tonight. We'll find a way to offer up the night tonight. The indescribable moments of your life tonight. The impossible is possible tonight. Believe in me as I believe in you, tonight.","We never knew what friends we had Until we came to Leningrad","Picture yourself in a boat on a river,With tangerine trees and marmalade skiesSomebody calls you, you answer quite slowly,A girl with kaleidoscope eyes.Cellophane flowers of yellow and green,Towering over your head.Look for the girl with the sun in her eyes,And she's gone.   ","","I know I'm searching for something Something so undefined That it can only be seen By the eyes of the blind","Come Mr. DJ song pon de replay","Ooh, the wheel in the sky keeps on turnin'","Cause I'm Slim Shady, yes I'm the real Shady All you other Slim Shadys are just imitating So won't the real Slim Shady please stand up, please stand up, please stand up?","Uno dos tres cuatro cinco cinco seÃƒï¿½Ã¯Â¿Â½Ãƒï¿½Ã‚Â­s","Show me how to lie You're getting better all the time","Let's make this complicated Thinking is overrated","Kristy, are you doing okay?","I Gotta Feeling.","A heart attackackackackackack","Don't go breaking my heart I couldn't if I tried","I'll feel better when the winter's gone","I was a quick wit boy  Diving too deep for coins  All of your street light eyes  Wide on my plastic toys  Then when the cops closed the fair  I cut my long baby hair  Stole me a dog-eared map  And called for you everywhere   Have I found you, Flightless Bird;  Jealous, weeping?  Or lost you, American Mouth;  Big Pill, looming?   Now I'm a fat house cat  Nursing my sore, blunt tongue  Watching the warm poison rats  Crawl through the wide fence cracks  Pissing on magazine photos  Those fishing lures thrown in the cold and clean  Blood of Christ mountain stream ","  Have I found you?, Flightless Bird; Grounded, bleeding?  Or lost you, American Mouth;  Big Pill, stuck going down"]`
	quotes = JSON.parse(quotes);
	random_quote = quotes[Math.floor(Math.random()*quotes.length)];

	$.formElements.tipTxt.html('<p>'+random_quote+'</p>');
	$.formElements.tipBox.fadeIn();
}

$( function () {
	$.Houdini.activate.elements();
	$.Houdini.activate.setup();

	grecaptcha.ready(function() {
		grecaptcha.execute($.Houdini.activate.data.reCAPTCHA_site_key, {action: 'homepage'}).then(function(token) {
			// initiate activation
			$.Houdini.activate.ajax('init', {'captcha-response': token}).success(function(r){
				console.info("Activation initiated");
				console.log("Activation data");
				console.log(r);

				if (!!r.response.error) {
					console.info("Signup initiation failed!");
					$.Houdini.activate.error('Unable to authenticate captcha. Contact CPPS support:', r.response.error)
				}

				$.formElements.formId.val(r.response.formId);
				$.Timeline.activate.randomSongQuote();
				$.formElements.loader.fadeOut();

			});
		});
	});
});
