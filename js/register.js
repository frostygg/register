var Houdini = window.Houdini = $.Houdini = Houdini || {}
Houdini.create = {}
Houdini.create.data = {
	// Edit this with your recaptcha v3 site key
	reCAPTCHA_site_key : "",
	color: 1,

	base_url : 'https://create.cpback.net',
	inputs: ['edit-name', 'edit-pass', 'edit-email'],
	labelStyle : {
		'edit-name': 'left: -165px;',
		'edit-pass': 'left: -170px;',
		'edit-email': 'left: -120px;',
	},
	inputTips : {
		'edit-name': '<p>Choose a name for your penguin! <br> Make sure it is within 4 to 12 characters long and only contains letters, numbers, and spaces.</p>',
		'edit-pass': '<p>Make sure your password is secure, <b>minimum 8 characters long.</b> Using punctuations should help it secure too.</p>',
		'edit-email': '<p>Enter your email address to <b>verify</b> and <b>activate</b> your account<p>',
	}
}

$.formElements = Houdini.create.elements = function () {
	$.formElements = $.Houdini.create.elements = {
		formId: $("input[name=form_id]"),
		anonToken: $("input[name=anon_token]"),
		loader: $("#processing-overlay"),
		errorBox: $('.oops-error-overlay'),
		errorHead: $('.oops-error-header'),
		errorTxt: $('.oops-error-txt'),
		tipBox: $('.tip-box'),
		tipTxt: $('.tip-inner'),

		input_name: $("#edit-name"),
		input_pass: $("#edit-pass"),
		input_email: $("#edit-email"),
		input_term: $('#edit-terms'),

		input_color: $('input[name=color]'),
		paperdoll: $('#penguin-paper-doll')
	}
}

$.Houdini.create.cookie = {};
$.Houdini.create.cookie.read = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

Houdini.create.ajax = function(request, data) {
	request = {
		url: $.Houdini.create.data.base_url + '/ajax/?action=' + encodeURIComponent(request),
		type: 'post',
		data: data,
		error: function(e){
			console.info("uri request failed:" + request);
			console.log(e);

			$.Houdini.create.error("Grub! Unable to contact register server. Contact CPBack support.");
		},
		success: function(r) {
			if (!!!r) {
				console.info("uri returned no data:" + request);
				console.log(r);

				$.Houdini.create.error("Grub! Unable to contact register server. Contact CPBack support.");
			}
		}
	};

	return $.ajax(request);
}

Houdini.create.error = function (txt, errors) {
	txt = txt || "Grub! Herbert yeeted all the puffles.";
	errors = errors || [];
	$.formElements.loader.fadeOut();
	var errorLI = '';
	for (i = 0; i < errors.length; i++) {
		errorLI += '<li>'+errors[i]+'</li>';
	}

	$.formElements.errorTxt.html('<h3>'+txt+'</h3><ul>'+errorLI+'</ul>');
	$.formElements.errorBox.fadeIn();
}

Houdini.create.inputErrorMsg = function (error) {
	tags = [];
	for(var e in error) {
		$('#'+e).addClass('error-msg');
		$('#'+e).html('<div class="field-error">'+error[e]+'</div>');
		tags.push('#'+e);
	}

	$(tags.join(',')).fadeIn();
}

Houdini.create.validateResponse = function (r) {
	if (!!r.response.error) {
		tags = []
		tags2 = [];
		for(var e in r.response.error) {
			var errorTag = $("#"+e);
			var error = r.response.error[e];

			tags.push("#"+e);
			tags2.push("#edit-"+e.slice(0, -6));

			if (error.length == 1) {
				errorTag.text(error);
				continue;
			}

			errorLI = ''
			for (i = 0; i < error.length; i++) {
				errorLI += '<li>'+error[i]+'</li>';
			}
			errorTag.html("<p>Fix the following to continue:</p><ul>"+errorLI+"</ul>")
		}

		tags2 = tags2.join(',');
		tags = tags.join(',')
		$(tags2).removeClass('progress-disabled');
		$(tags2).removeAttr('disabled');
		$(tags).fadeIn();
		$(tags).addClass("error-msg");
		$(tags2).addClass('error');
	}

	if (!!r.response.valid) {
		a = r.response.valid.join(',');

		$(a).addClass('valid');
		$(a).removeClass('progress-disabled');
		$(a).removeAttr('disabled');
	}

	$.Houdini.create.invalidate();
}

Houdini.create.invalidate = function() {
	inputs = ['input_name', 'input_pass', 'input_email'];

	validated = 1;

	for(i = 0; i < inputs.length; i++) {
		inp = $.formElements[inputs[i]];

		if (!inp.hasClass('valid'))
			validated *= 0;
	}

	validated *= $('label[for=edit-terms]').hasClass('checked');

	if (!validated) {
		$('#edit-submit').addClass('disabled');
		$('#edit-submit').attr('disabled', '');
		$('.preventer').attr('style', 'display: block;');
	} else {
		$('#edit-submit').removeClass('disabled');
		$('#edit-submit').removeAttr('disabled');
		$('.preventer').attr('style', 'display: none;');
	}
}

Houdini.create.setup = function() {
	for(i = 0; i < $.Houdini.create.data.inputs.length; i++) {
		var inp = $.Houdini.create.data.inputs[i];

		$("#"+inp).off('focusin').on('focusin', function() {
			$("label[for="+this.id+"]").attr('style', $.Houdini.create.data.labelStyle[this.id]);
			$.formElements.tipTxt.html($.Houdini.create.data.inputTips[this.id]);
			$.formElements.tipBox.fadeIn();
			$(this).removeClass("valid").removeClass('error');

			//$.Houdini.create['click-' + this.id.slice(5)]();
			$.Houdini.create.invalidate();
		});

		$('#'+inp).off('blur').on('blur', function(){
			a = ["You couldn't get a fan if it was hangin' from the ceilin.", "Back of the back, back of the back. Who on Barbie D? Everybody. Who you gotta see? Honestly, on my odyssey. I'm the baddest B, I don't even know how to speak", "I'm throwing shade like it's sunny.", "I'm in my own lane, you ain't in my category.", "These (girls) couldn’t test me even if their name was Pop Quiz.", "Yo, people will love you and support you when it's beneficial. I'ma forgive, I won't forget, but I'ma dead the issue.", "Not that I don't got good vision, but I don't see competition.", "I’m Angelina, you Jennifer. Come on (girl), you see where Brad at.", "I look like 'ye' and you look like 'no'.", "But if you're ugly it's a no text zone.", "If you are my rival, then that means you're suicidal.", "Shout out to my haters, Sorry that you couldn't faze me.", "Trash talk to 'em then I put 'em in a Hefty.", "Like I mean I don't even know why you girls bother at this point. Like give up, it's me, I win, you lose.", "All these haters mad because I'm so established.", "Competition? why yes I would love some.", "If I'm fake I ain't notice, cause my money ain't.", "You can hate me, but why knock my hustle? I'ma be the queen, no matter how they shuffle.", "Let me make this clear, I'm not difficult, I'm just 'bout my business." , "I'm feelin' myself." , "Excuse me honey, but nobody's in my lane." , "Put me on a dollar cause I'm who they trust in." , "I don’t say “Hi”, I say “Keys to the Benz.”" , "I've been hot since flip phones", "Running this game for 5 years. Guess that's why my feet hurt." , "Hotter than a middle eastern climate." , "My money’s so tall that my Barbies gotta climb it.", "No, I'm not lucky, I'm blessed, yes." , "I ain't gotta compete with a single soul.", "'X' in the box, cause ain't nobody checking me." , "Excuse me, I'm sorry, I'm really such a lady." , "Honestly I gotta stay as fly as I can be.", "Cherish these nights, cherish these people. Life is a movie, but there will never be a sequel.", "I’m with some hood girls lookin’ back at it.", "We dope girls, we flawless. We the poster girls for all this.", "Pretty gang, always keep them (boys) on geek.", "The night is still young, and so are we!", "If you ain’t on the team, you playin’ for team D, ’Cause we A-listers, we paid sisters.", "Pretty (girls) only could get in my posse.", "Cause we the mean girls, y-yes we so fetch.", "We fresh to death, down to the shoes.", "Ain't at no wedding but all my girls cake tops.", "Got a whole bunch of pretty gang in my clique.", "Clap for the heavyweight champ, me, But I couldn't do it all alone, WE.", "Put your drinks up, It's a celebration every time we link up.", "I'm with some flawless (girls) because they be mobbin' pretty.", "I never worry, life is a journey. I just wanna enjoy the ride.", "Tonight is the night that I'ma get twisted." , "I’mma keep it movin', be classy and graceful.", "So make sure the stars is what you aim for, make mistakes though.", "And we gon' hangover the next day. But we will remember this day.", "My only motto in my life is don't lose." , "Take me, or leave me, I'll never be perfect. Believe me, I'm worth it.", "I believe that life is a prize, but to live doesn't mean you're alive.", "I wish that I could have this moment for life.", "If I scream, if I cry, It's only 'cause I feel alive.", "I can't believe it, it's so amazing. This club is heating, this party's blazing.", "It's so amazing, I figured out this world is ours for the taking.", "I am not a girl that can ever be defined.", "I got next, I'm gonna shine.", "This is my moment I just feel so alive." ];
			$.formElements.tipTxt.html(a[Math.floor(Math.random()*a.length)]);

			val = $(this).val();
			error = $('#' + this.id.slice(5) + '-error');
			error.fadeOut();
			error.html('');

			if (val == '') {
				$("label[for="+this.id+"]").attr('style', '');
				return;
			}

			$(this).addClass("progress-disabled");
			$(this).attr("disabled", "");

			// validate this input
			data = {};
			data[this.id.slice(5)] = val;
			$.Houdini.create.ajax('validate', data).success($.Houdini.create.validateResponse);
			$.Houdini.create.invalidate();
		});
	}

	$('label[for=edit-pass-show]').off('click').on('click', function() {
		password_visible = $.formElements.input_pass.attr('type') == 'text';
		if (password_visible) {
			$.formElements.input_pass.attr('type', 'password');
			$('label[for=edit-pass-show]').html('Show password: <span class="sp-val off">Off</span>');
		} else {
			$.formElements.input_pass.attr('type', 'text');
			$('label[for=edit-pass-show]').html('Show password: <span class="sp-val on">On</span>');
		}
	})

	$.formElements.input_color.on('focusin', function() {
		$.formElements.paperdoll.attr('class', 'paperdoll color-'+($(this).val()));
		$.Houdini.create.data.color = $(this).val();

		$('.paperdoll').find('.option').removeClass('checked');
		$('label[for=edit-color-'+$(this).val()+']').addClass('checked');

		$.Houdini.create.invalidate();
	});

	$.formElements.input_term.off('click').on('click', function(){
		label = $('label[for=edit-terms]');
		checked = label.attr('class').indexOf('checked') > -1;

		if (checked) label.removeClass('checked');
		else label.addClass('checked');

		$.Houdini.create.invalidate();
	});

	$("#edit-submit").off('click').on("click", function(e){
		e.preventDefault();

		$.Houdini.create.randomSongQuote();

		$('.ov-title').text("Captcha verification");
		$.formElements.loader.fadeIn();

		grecaptcha.execute($.Houdini.create.data.reCAPTCHA_site_key, {action: 'login'}).then(function(token) {
			$('.ov-title').text("Signup request");
			$.Houdini.create.ajax('create-user', {formId: $.formElements.formId.val(), color: $.Houdini.create.data.color, 'captcha-response': token}).success(function(r){
				if (!!r.response.error) {
					$.Houdini.create.error("Looks like we got lost on our way to Eden:", r.response.error);
				} else {
					var texts = ['Yay!', 'Woohoo!', 'All right!', 'Hooray!', 'Pure ice!'];
					// registered successfully!
					$.Houdini.create.error("Account successfully registered! Lastly, ask your parents to check their email and follow the instructions to activate your account.");
					$(".oops-error-header").text(texts[Math.floor(Math.random()*texts.length)]);
					$('.oops-error-overlay').attr('class', 'oops-error-overlay oops-message message-1');
					$("#block-system-main").fadeOut();
				}
				$.formElements.loader.fadeOut();
			});
		});
	});

}

$.Houdini.create.randomSongQuote = function() {
	quotes = `["We don't need no education;","What?s going on on the floor? I love this record baby but I can?t see straight anymore Keep it cool, what?s the name of this club? I can?t remember but it?s alright, a-alright  Just dance, gonna be okay, da da doo-doo-mmm","You change your mind like a girl changes clothes","You change your mind as often as a girl changes clothes","In the night I hear 'em talk, the coldest story ever told Somewhere far along this road he lost his soul To a woman so heartless How could you be so heartless? How could you be so heartless?","So what? I'm still a rock star!","I don't mind you coming here wasting all my time 'Cause when you're standing oh so near I kinda lose my mind","It's the end of the world as we know it","And I feel fine","Well she's my best friend's girl She's my best friend's girl but she used to be mine","Heaven ain't close in a place like this","Jesus stole my girlfriend.","Leave your body and soul at the door","I wanna rock and roll all nite and party every day","I used to rule the world","See sun rise when I gave the word","Look at the stars, Look how they shine for you, And everything you do, Yeah they were all yellow,","Help I'm Alive","My heart keeps beating like a hammer","I'll shine up the old brown shoes, put on a brand-new shirt. I'll get home early from work if you say that you love me.","Despite all my rage, I am still just a rat in a cage","Oh momma I'm in fear for my life from the long arm of the law Lawman has put an end to my running and I'm so far from my home Oh momma I can hear you a'crying you're so scared and all alone Hangman is comin' down from the gallows and I don't have very long","Accroches-toi a ton reve Accroches-toi a ton reve Quand tu vois ton bateau partir Quand tu sents -- ton coeur se briser Accroches-toi a ton reve.","A fake Jamaican took every last dime with a scam. It was worth it just to learn some sleight-of-hand.","We watched Titanic, and it didn't make us sad","Glaciers melting in the dead of night And the superstars sucked into the supermassive","Send a heartbeat to The void that cries through you Relive the pictures that have come to pass For now we stand alone The world is lost and blown And we are flesh and blood disintegrate With no more to hate","Look at him working. Darning his socks in the night when there's nobody there What does he care?","Some of them want to use you Some of them want to get used by you Some of them want to abuse you Some of them want to be abused.","Oh, I remember You driving to my house In the middle of the night I'm the one who makes you laugh When you know you're about to cry","Then you better start swimmin' Or you'll sink like a stone","Well I'm hot blooded, check it and see I got a fever of a hundred and three","Now that she's back in the atmosphere With drops of Jupiter in her hair, hey, hey, hey, hey","Hey soul sister, hey there mister, mister On the radio, stereo","Nobody wants to be the last one there","All the eyes on me in the center of the ring Just like a circus (ah, ah, ahaha-hah)","Try to hide your hand, forget how to feel","I sued Ben Affleck ... Aw, do I even need a reason?","I'm gonna do the things that I wanna do","I ain't got a thing to prove to you","I'll eat my candy with the pork and beans","Excuse my manners if I make a scene","Smiles politely back at you You stare politely right on through Some sort of window to your right","In Catholic school as vicious as Roman rule I got my knuckles bruised by a lady in black And I held my tongue as she told me 'Son fear is the heart of love' So I never went back","I'll take you to the candy shop","I'll let you lick a lollipop","So I learned to dance with a hand in my pants","(Harmonica Solo)","Is our secret safe tonight?","Hello darkness, my old friend","Mental wounds not healing Life's a bitter shame I'm going off the rails on a crazy train I'm going off the rails on a crazy train","He knelt to the ground and pulled out a ring  And said, marry me Juliet You'll never have to be alone I love you and that's all I really know I talked to your dad, go pick out a white dress It's a love story baby just say yes","Never gonna give you up Never gonna let you down Never gonna run around and desert you Never gonna make you cry Never gonna say goodbye Never gonna tell a lie and hurt you","I","Did you try to live on your own When you burned down the house and home? Did you stand too close to the fire Like a liar looking for forgiveness from a stone?","When I was a young boy,","My father took me into the city To see a marching band.  He said, 'Son when you grow up, would you be the savior of the broken, the beaten and the damned?' He said 'Will you defeat them, your demons, and all the non-believers, the plans that they have made?' 'Because one day I'll leave you, A phantom to lead you in the summer, To join The Black Parade.'","Khara Matha Khara Rath Amah Khara Rath Amah Yuddha Khara Khara Syada Rath Amah Dai Ya Khara Ki La Dan Ya Niha Ki La Khara Rath Amah Syada Ki La Khara Rath Amah Khara Dan Ya Khara Rath Amah Khara Dan Ya Khara Rath Amah Niha Ki La Khara Rath Amah Syada Ki La Khara Rath Amah Khara Khara Matha Khara Rath Amah Khara Dan Ya Khara Rath Amah Niha Ki La Khara Rath Amah Syada Ki La Khara Rath Amah Khara","Don't say goodnight Say you're gonna stay forever","They took the credit for your second symphony. Rewritten by machine and new technology, and now I understand the problems you can see.","But do you recall the most famous reindeer of all?","Hope my boyfriend don't mind it.","Play that funky music right boy.","Every breath you take Every move you make Every bond you break Every step you take I'll be watching you","Everything ends.","Mother told me, yes, she told me I'd meet girls like you. She also told me, 'Stay away, you'll never know what you'll catch.' Just the other day I heard a soldier falling off some Indonesian junk that's going round.","Rock and Roller cola wars, I can't take it anymore","Black and orange stray cat sittin' on a fence Ain't got enough dough to pay the rent I'm flat broke but I don't care I strut right by with my tail in the air","She's a mixed up son of a bitch yeah yeah","smoked my last cigarette sat in bed for awhile thought of your face and that brought me a smile wanted another one fell back asleep instead woke and found you sitting there on the bed","Watch 'em run amuck, Catch 'em as they fall, Never know your luck When there's a free for all, Here a little dip' There a little touch' Most of them are goners So they won't miss much!","You can speak your mind But not on my time","Every night in my dreams I see you, I feel you That is how I know you go on","If you feel lost and on your own And far from home You're never alone, you know Just think of your friends  The ones who care They all will be waiting there with love to share And your heart will lead you home","Exit light Enter night Take my hand We're off to never-never land","You may be right I may be crazy But it just might be a lunatic you're looking for Turn out the light Don't try to save me","Welcome MÂ´sierSit yourself downAnd meet the bestInnkeeper in town  ","","Jai Ho Jai Ho I got (I got) shivers (shivers), When you touch my face, I'll make you hot, Get what you got, I'll make you wanna say (Jai Ho)","Tell me, princess, now when did  You last let your heart decide?","But you'll be sorry when I'm dead And all this guilt will be on your head I guess you'd call it suicide But I'm too full to swallow my pride","At least out loud, I won't say I'm in love ","He was born a pauper to a pawn on a Christmas day When the New York Times said God is dead","So dance, your final dance. 'Cause this is, your final chance.","Are we human or are we dancer?","Time is never time at all.","The more you change the less you feel.","And you know youre never sure. But you're sure you could be right.","And the embers never fade in your city by the lake. The place where you were born.","Believe, believe in me, believe. Believe in the resolute urgency of now. And if you believe theres not a chance tonight. Tonight, so bright. Tonight.","We'll crucify the insincere tonight. We'll make things right, we'll feel it all tonight. We'll find a way to offer up the night tonight. The indescribable moments of your life tonight. The impossible is possible tonight. Believe in me as I believe in you, tonight.","We never knew what friends we had Until we came to Leningrad","Picture yourself in a boat on a river,With tangerine trees and marmalade skiesSomebody calls you, you answer quite slowly,A girl with kaleidoscope eyes.Cellophane flowers of yellow and green,Towering over your head.Look for the girl with the sun in her eyes,And she's gone.   ","","I know I'm searching for something Something so undefined That it can only be seen By the eyes of the blind","Come Mr. DJ song pon de replay","Ooh, the wheel in the sky keeps on turnin'","Cause I'm Slim Shady, yes I'm the real Shady All you other Slim Shadys are just imitating So won't the real Slim Shady please stand up, please stand up, please stand up?","Uno dos tres cuatro cinco cinco seÃƒï¿½Ã¯Â¿Â½Ãƒï¿½Ã‚Â­s","Show me how to lie You're getting better all the time","Let's make this complicated Thinking is overrated","Kristy, are you doing okay?","I Gotta Feeling.","A heart attackackackackackack","Don't go breaking my heart I couldn't if I tried","I'll feel better when the winter's gone","I was a quick wit boy  Diving too deep for coins  All of your street light eyes  Wide on my plastic toys  Then when the cops closed the fair  I cut my long baby hair  Stole me a dog-eared map  And called for you everywhere   Have I found you, Flightless Bird;  Jealous, weeping?  Or lost you, American Mouth;  Big Pill, looming?   Now I'm a fat house cat  Nursing my sore, blunt tongue  Watching the warm poison rats  Crawl through the wide fence cracks  Pissing on magazine photos  Those fishing lures thrown in the cold and clean  Blood of Christ mountain stream ","  Have I found you?, Flightless Bird; Grounded, bleeding?  Or lost you, American Mouth;  Big Pill, stuck going down"]`
	quotes = JSON.parse(quotes);
	random_quote = quotes[Math.floor(Math.random()*quotes.length)];

	$.formElements.tipTxt.html('<p>'+random_quote+'</p>');
	$.formElements.tipBox.fadeIn();
}

$( function () {
	$.Houdini.create.elements();
	$.Houdini.create.setup();

	grecaptcha.ready(function() {
		grecaptcha.execute($.Houdini.create.data.reCAPTCHA_site_key, {action: 'homepage'}).then(function(token) {
			// initiate register
			$.Houdini.create.ajax('init', {'captcha-response': token}).success(function(r){
				console.info("Sign up initiated");
				console.log("Signup init data");
				console.log(r);

				if (!!r.response.error) {
					console.info("Signup initiation failed!");
					$.Houdini.create.error('Unable to authenticate captcha. Contact CPBack support:', r.response.error)
				}

				$.formElements.formId.val(r.response.formId);
				$.formElements.anonToken.val(CryptoJS.MD5($.Houdini.create.cookie.read("PHPSESSID")).toString());
				$.formElements.loader.fadeOut();

			});
		});
	});
});
