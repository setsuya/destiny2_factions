$(document).ready(function(){
	if(localStorage.lang){
		lang = localStorage.lang;
		$("#language_flag").attr("src", "img/" + lang + ".png");
	}else{
		lang = "en-US";
		$("#language_flag").attr("src", "img/" + lang + ".png");
	}

	if(localStorage.repeat_timer){
		repeat_timer = localStorage.repeat_timer === "true";
	}

	$(".section_title > span, #reload_info_off span, #auto_reload_off span, #ramen_donate > p, #string_warning, #string_clan_xp, #string_github").each(function(){
		$(this).html(langs[lang][$(this).attr("id")]);
	});

	$("meta[property='og:description']").attr("content", langs[lang].string_share);

	original_button_position = $("#reload_buttons").offset().top;
});

var lang = "";
var repeat_timer = false;
var timer_start_time = 0;
var timer_id = 0;
var timer_time = 300000;
var original_button_position = 0;

var factions_xp = {
	  24856709: 0, //Leviathan
	 469305170: 0, //The Nine
	 611314723: 0, //Vanguard Tactical
	 697030790: 0, //The Crucible
	 828982195: 0, //Fragmented Researcher
	1021210278: 0, //Gunsmith
	1660497607: 0, //Exodus Black AI
	3231773039: 0, //Vanguard Research
	4196149087: 0, //Field Commander
	4235119312: 0, //Dead Zone Scout
	1714509342: 0, //Future War Cult
	2105209711: 0, //New Monarchy
	3398051042: 0, //Dead Orbit
	1761642340: 0  //Iron Banner
};

var langs = {
	"en-US": {
		  "string_characters": "Characters", 
			 "string_rewards": "Clan Rewards", 
			 "string_clan_xp": "Clan XP", 
		  "string_milestones": "Milestones", 
			"string_factions": "Factions", 
			 "string_loading": "Loading...", 
			  "string_hunter": "Hunter", 
			   "string_titan": "Titan", 
			 "string_warlock": "Warlock", 
			   "string_level": "Level", 
				"string_male": "Male", 
			  "string_female": "Female", 
				 "string_exo": "Exo", 
			   "string_human": "Human", 
			  "string_awoken": "Awoken", 
		  "string_total_time": "Total play time", 
			 "string_refresh": "Refresh", 
		"string_auto_refresh": "Auto", 
		"string_refresh_time": "(Refreshing automatically every 5 minutes.)", 
			  "string_legend": "Legend", 
		 "string_legend_desc": "Your ongoing deeds add to your legend. Progress to your next Bright Engram.", 
			   "string_error": "User not found or error occurred.<br />Please try again.", 
			 "string_warning": "<p>Destiny Faction Checker needs access to your inventory to be able to show faction experience from tokens and materials in your possession. You can still use this tool, only it won't show when you have enough materials for a rank up with the factions. In order to make this information publicly available you need to follow some simple steps.</p><p>Go to <b>Bungie.net</b> and log into your account. Then go to <b>Settings</b> &gt; <b>Privacy</b> and check the option that says &quot;<b>Show my non-equipped Inventory</b>&quot;.</p><p>After this is done, enter your information again and enjoy.</p>", 
			  "string_donate": "PayPal me some spicy ramen!", 
			  "string_github": "Check me out on", 
			   "string_share": "Keep track of your characters' progress with your clan, milestones and factions in Destiny 2."
		
	}, 
	"pt-BR": {
		  "string_characters": "Personagens", 
			 "string_rewards": "Prêmios de Clã", 
			 "string_clan_xp": "EXP Clã", 
		  "string_milestones": "Marcos", 
			"string_factions": "Facções", 
			 "string_loading": "Carregando...", 
			  "string_hunter": "Caçador", 
			   "string_titan": "Titã", 
			 "string_warlock": "Arcano", 
			   "string_level": "Nível", 
				"string_male": "Macho", 
			  "string_female": "Fêmea", 
				 "string_exo": "Exo", 
			   "string_human": "Humano", 
			  "string_awoken": "Desperto", 
		  "string_total_time": "Tempo de jogo total", 
			 "string_refresh": "Atualizar", 
			  "string_legend": "Lenda", 
		 "string_legend_desc": "Os seus atos de bravura se somam a sua lenda. Progresso até o seu próximo Engrama Brilhante.", 
		"string_auto_refresh": "Auto", 
		"string_refresh_time": "(Atualizando automaticamente a cada 5 minutos.)", 
			   "string_error": "Usuário não encontrado ou erro ocorrido.<br />Por favor tente novamente.", 
			 "string_warning": "<p>Destiny Faction Checker precisa de acesso ao seu inventário para poder exibir experiência de facções a partir de medalhas e materiais na sua posse. Você ainda pode utilizar esta ferramenta, ela apenas não irá dizer quando você possuir materiais suficientes para subir de nível com as facções. Para deixar essa informação disponível publicamentevocê precisa seguir alguns simples passos.</p><p>Vá até <b>Bungie.net</b> e acesse sua conta. Então vá até <b>Configurações</b> &gt; <b>Privacidade</b> e marque a opção que diz &quot;<b>Mostrar meu Inventário não equipado</b>&quot;.</p><p>Após fazer isso, coloque suas informações novamente e aproveite.</p>", 
			  "string_donate": "Me pague um ramen apimentado pelo PayPal!", 
			  "string_github": "Dê uma olhada no meu", 
			   "string_share": "Acompanhe o progresso dos seus personagens com seu clã, marcos e facções em Destiny 2."
	}
};

function randomIcon(){
	icons = ["24856709", "469305170", "611314723", "697030790", "1021210278", "1714509342", "2105209711", "3231773039", "3398051042", "1761642340"];
	random_num = Math.floor(Math.random() * icons.length);
	
	$("[rel='icon']").attr("href", "img/favicons/" + icons[random_num] + ".png");
}

function scrollRefreshButtons(){
	window_scroll_top = $(window).scrollTop();
	new_reload_position = 0;

	if(window_scroll_top < original_button_position){
		new_reload_position = 0;

		$("#reload_buttons").removeClass("reload_hover");
	}else{
		new_reload_position = window_scroll_top - original_button_position + 50;

		$("#reload_buttons").addClass("reload_hover");

		if(new_reload_position < 0){
			new_reload_position = 0;

			$("#reload_buttons").removeClass("reload_hover");
		}
	}

	$("#reload_buttons").stop(false, false).animate({top: new_reload_position}, 300, "linear");
}

function createTimeout(timer_value){
	clearTimeout(timer_id);
	timer_id = setTimeout(function(){$("#reload_info").click();}, timer_value);
}

function checkRefresh(){
	timer_refresh_time = new Date().getTime();

	if(repeat_timer == true){
		if((timer_refresh_time - timer_start_time) >= timer_time){
			$("#reload_info").click();
		}else{
			createTimeout((timer_refresh_time - timer_start_time));
		}
	}
}

function changeLanguage(){
	if(lang == "en-US"){
		lang = "pt-BR";
	}else{
		lang = "en-US";
	}

	localStorage.lang = lang;
	location.reload();
}

function toggleNetworks(){
	if(!$("#networks").is(":visible")){
		$("#networks").slideDown();
	}else{
		$("#networks").slideUp();
	}
}

function changeNetwork(network){
	$("#networks").slideToggle();
	$("#networks > div").show();
	$(network).hide();
	$("#network").fadeOut(150, function(){$("#network").attr("class", $(network).attr("class"));}).fadeIn();
	$("#network_selector").attr("data-network", $(network).attr("data-network"));
}

function toggleAutoReload(toggle_value, membership_type, membership_id, character_id, character){
	script_text = $("#auto_reload").attr("onclick");

	if(toggle_value == "off"){
		$("#auto_reload").attr("class", "repeat_off").attr("onclick", script_text.replace("off", "on"));
		clearTimeout(timer_id);
		$("#interval_info").slideToggle("medium", function(){$(this).text("");});
		repeat_timer = false;
	}else{
		$("#auto_reload").attr("class", "repeat_on").attr("onclick", script_text.replace("on", "off"));
		timer_start_time = new Date().getTime();
		createTimeout(timer_time);
		$("#interval_info").text(langs[lang].string_refresh_time).slideToggle("medium");
		repeat_timer = true;
	}

	localStorage.repeat_timer = repeat_timer;
}

function checkEnter(e){
	if(e.which == 13){
		searchPlayer();
		$("#player_name").blur();
	}
}

function toggleSection(section){
	$(section).next().slideToggle(300, function(){original_button_position = $("#reload_buttons").offset().top;});
	$(section).find(".arrow_symbol").toggleClass("closed");

	if($(section).find(".arrow_symbol").hasClass("closed")){
		$(section).find(".arrow_symbol").html("&#9655;");

		if($(section).find("#string_characters").length > 0){
			if($(".character").hasClass("character_selected")){
				char_image = $(".character_selected").attr("data-emblem");
				char_level = $(".character_selected > .character_level").text().replace(langs[lang].string_level + " ", langs[lang].string_level.substr(0, 1));
				char_light = $(".character_selected > .character_power").text();

				$("#small_character").html("[<img src=\"https://www.bungie.net" + char_image + "\" />/" + char_level + "/" + char_light + "]");
			}
		}

		if($(section).find("#string_rewards").length > 0){
			engrams = 0;
			exp_percentage = 0;

			$(".acquired_engram").each(function(){
				engrams++;
			});

			progress = $("#clan_contribution > p:last").text().substr(1).split("/");
			exp_percentage = (parseInt(progress[0])/parseInt(progress[1])) * 100;

			$("#small_clan").html("[" + engrams + "/" + exp_percentage + "%]");
		}

		if($(section).find("#string_milestones").length > 0){
			completed_milestones = $("#milestone_list > .milestone_completed").length;
			total_milestones = $("#milestone_list > .milestone").length;

			$("#small_milestone").html("[" + completed_milestones + "/" + total_milestones + "]");
		}

		if($(section).find("#string_factions").length > 0){
			factions = 0;

			$(".faction_outline").each(function(){
				factions++;
			});

			$("#small_faction").html("[" + factions + "]");
		}
	}else{
		$(section).find(".arrow_symbol").html("&#9661;");

		if($(section).find("#string_characters").length > 0){
			$("#small_character").html("");
		}

		if($(section).find("#string_rewards").length > 0){
			$("#small_clan").html("");
		}

		if($(section).find("#string_milestones").length > 0){
			$("#small_milestone").html("");
		}

		if($(section).find("#string_factions").length > 0){
			$("#small_faction").html("");
		}
	}
}

function openAllSections(){
	$(".closed").each(function(){
		$(this).parent().click();
	});
}

function zeroPad(number, size){
	number = number.toString();

	if(number.length < size){
		for(i = 0; i < (size - number.length); i++){
			number = "0" + number;
		}
	}

	return number;
}

function searchPlayer(){
	if($("#player_name").val() != ""){
		openAllSections();

		platform = $("#network_selector").attr("data-network");
		player = encodeURIComponent($("#player_name").val());

		$("#char_list, #prog_factions, #milestone_list").html("");
		$("#reload_buttons").html("<div id=\"reload_info_off\"><p>" + langs[lang].string_refresh + "</p></div><div id=\"auto_reload_off\" class=\"repeat_off\"><p>" + langs[lang].string_auto_refresh + "</p></div>");
		$("#reward_list > div").removeClass("acquired_engram");
		$("#clan_contribution > div").removeClass("checked");
		$("#clan_contribution > p:last").html(":0000/5000");
		$("#string_warning").slideUp();
		$("#char_list").html("<p class=\"loader\">" + langs[lang].string_loading + "</p>");

		return $.ajax({
			url: "https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/" + platform + "/" + player + "/", 
			type: "GET", 
			beforeSend: function(xhr){xhr.setRequestHeader("X-API-Key", "983e6af736df45cb8ef8f283e0d4720d");},
			success: function(data){
				if(data.Response.length != 0){
					$.when(getProfile(data.Response[0].membershipId, data.Response[0].membershipType))
						.then(function(){
							if(!$("#char_list .loader").hasClass("error")){
								$("#char_list .loader").remove();
							}
						});
				}else{
					$("#char_list").html("<p class=\"loader error\">" + langs[lang].string_error + "</p>");
				}
			}
		});
	}
}

function getProfile(membership_id, membership_type){
	return $.ajax({
		url: "https://www.bungie.net/Platform/Destiny2/" + membership_type + "/Profile/" + membership_id + "/?components=100", 
		type: "GET", 
		beforeSend: function(xhr){xhr.setRequestHeader("X-API-Key", "983e6af736df45cb8ef8f283e0d4720d");},
		success: function(data){
			if(data.ErrorCode == 1){
				for(i = 0; i < data.Response.profile.data.characterIds.length; i++){
					getCharacter(membership_id, membership_type, data.Response.profile.data.characterIds[i]);
				}
			}else{
				$("#char_list").html("<p class=\"loader error\">" + langs[lang].string_error + "</p>");
			}
		}
	});
}

function getCharacter(membership_id, membership_type, character_id, reload_character){
	return $.ajax({
		url: "https://www.bungie.net/Platform/Destiny2/" + membership_type + "/Profile/" + membership_id + "/Character/" + character_id + "/?components=200", 
		type: "GET", 
		beforeSend: function(xhr){xhr.setRequestHeader("X-API-Key", "983e6af736df45cb8ef8f283e0d4720d");},
		success: function(data){
			character = data.Response.character.data;

			if(reload_character){
				$(".character_selected > .emblem_background").attr("src", "https://www.bungie.net" + character.emblemBackgroundPath);
				$(".character_selected > .character_power").html("<span class=\"light_symbol\">&#x2726;</span>" + character.light);
				$(".character_selected > .character_level").html(langs[lang].string_level + " " + character.baseCharacterLevel);
				$(".character_selected > .level_progression > hr").css("width", character.percentToNextLevel + "%");
				$(".character_selected").next("p").html(langs[lang].string_total_time + ": " + convertTime(character.minutesPlayedTotal));
			}else{
				showCharacterInfoBanner(character.membershipType, character.membershipId, character.characterId, character.baseCharacterLevel, character.light, character.classType, character.raceType, character.genderType, character.emblemPath, character.emblemBackgroundPath, character.percentToNextLevel, character.minutesPlayedTotal);
			}
		}
	});
}

function showCharacterInfoBanner(membership_type, membership_id, character_id, character_level, character_power, character_class, character_race, character_gender, emblem_image, background_image, next_level_progression, total_time){
	gender_list = [langs[lang].string_male, langs[lang].string_female];
	class_list = [langs[lang].string_titan, langs[lang].string_hunter, langs[lang].string_warlock];
	race_list = [langs[lang].string_human, langs[lang].string_awoken, langs[lang].string_exo];

	character = "<div class=\"character_info\"><div class=\"character\" data-emblem=\"" + emblem_image + "\" onclick=\"loadCharacterData('" + membership_type + "', '" + membership_id + "', '" + character_id + "', this)\"><img class=\"emblem_background\" src=\"https://www.bungie.net" + background_image + "\" /><p class=\"character_class\">" + class_list[character_class] + "</p><p class=\"character_power\"><span class=\"light_symbol\">&#x2726;</span>" + character_power + "</p><p class=\"character_description\">" + gender_list[character_gender] + " " + race_list[character_race] + "</p><p class=\"character_level\">" + langs[lang].string_level + " " + character_level + "</p><div class=\"level_progression\"><hr style=\"width: " + next_level_progression + "%\" /></div></div><p>" + langs[lang].string_total_time + ": " + convertTime(total_time) + "</p></div>";

	$(character).appendTo("#char_list");
	original_button_position = $("#reload_buttons").offset().top;
}

function convertTime(time){
	time = parseInt(time);

	days = Math.floor(time / 60 / 24), 2;
	hours = zeroPad(Math.floor(((time/60) % 24)), 2);
	minutes = zeroPad(time - ((hours * 60) + (days * 60 * 24)), 2);
	
	return days + "d, " + hours + ":" + minutes;
}

function loadCharacterData(membership_type, membership_id, character_id, character, reload_character){
	openAllSections();

	$("#prog_factions, #milestone_list").html("<p class=\"loader\">" + langs[lang].string_loading + "</p>");

	if(reload_character){
		getCharacter(membership_id, membership_type, character_id, true);
	}

	var factions = new factionXP();

	$.when(factions.populateXP(membership_type, membership_id))
		.then(function(){
			$.ajax({
				url: "https://www.bungie.net/Platform/Destiny2/" + membership_type + "/Profile/" + membership_id + "/Character/" + character_id + "/?components=202", 
				type: "GET", 
				beforeSend: function(xhr){xhr.setRequestHeader("X-API-Key", "983e6af736df45cb8ef8f283e0d4720d");},
				success: function(data){
					getMilestoneInfo(data.Response.progressions.data.milestones);
					getClanRewardsState(data.Response.progressions.data.uninstancedItemObjectives[432848324], data.Response.progressions.data.uninstancedItemObjectives[2540008660][0].progress);

					factions = data.Response.progressions.data.factions;
					factions_result = "";
					buttons_result = "<div id=\"reload_info\" onclick=\"loadCharacterData('" + membership_type + "', '" + membership_id + "', '" + character_id + "', this, true)\"><p>" + langs[lang].string_refresh + "</p></div>";

					if(repeat_timer){
						buttons_result += "<div id=\"auto_reload\" class=\"repeat_on\" onclick=\"toggleAutoReload('off')\"><p>" + langs[lang].string_auto_refresh + "</p></div><p id=\"interval_info\">" + langs[lang].string_refresh_time + "</p>";
						timer_start_time = new Date().getTime();
						createTimeout(timer_time);
					}else{
						buttons_result += "<div id=\"auto_reload\" class=\"repeat_off\" onclick=\"toggleAutoReload('on', '" + membership_type + "', '" + membership_id + "', '" + character_id + "', this)\"><p>" + langs[lang].string_auto_refresh + "</p></div><p id=\"interval_info\" style=\"display: none;\"></p>";
					}

					$("#reload_buttons").html(buttons_result).slideDown();

					legend_level = data.Response.progressions.data.progressions["2030054750"].level;
					legend_percentage = ((data.Response.progressions.data.progressions["2030054750"].progressToNextLevel / data.Response.progressions.data.progressions["2030054750"].nextLevelAt) * 100).toFixed(2);

					factions_result += "<div class=\"faction\"><div class=\"img_col\"><img class=\"faction_img\" src=\"img/factions/bright_engram.png\" /></div><div class=\"info_col\"><p class=\"faction_name\">" + langs[lang].string_legend + "</p><p class=\"faction_description\">" + langs[lang].string_legend_desc + "</p><hr /><div class=\"level_progression\"><div class=\"faction_xp_extra_left\"><div class=\"level_number\">" + (legend_level) + "</div></div><div class=\"faction_xp\"><div class=\"xp_bar\" style=\"width: " + legend_percentage + "%;\"></div></div><div class=\"faction_xp_extra_right\"><div class=\"level_number\">" + (legend_level + 1) + "</div></div></div></div></div>";

					for(faction in factions){
						$.when(getFactionInfo(faction))
							.then(function(data){
								if(!data.redacted){
									outline_class = "";
									extra_levels = "";

									next_level_percentage = ((factions[data.id].progressToNextLevel / factions[data.id].nextLevelAt) * 100).toFixed(2);

									var faction_info = new factionXP();

									remaining_experience = ((faction_info.getFactionXP(data.id) / factions[data.id].nextLevelAt) * 100).toFixed(2);
									
									if((parseFloat(remaining_experience) + parseFloat(next_level_percentage)) >= 100.00){
										extra_experience = (parseFloat(remaining_experience) + parseFloat(next_level_percentage)) - 100.00;

										if(extra_experience > 100.00){
											extra_levels = "&nbsp;+" + Math.floor(extra_experience / 100.00).toString();
										}

										remaining_experience = (100.00 - parseFloat(next_level_percentage)).toFixed(2);
										outline_class = " faction_outline";
									}

									factions_result += "<div class=\"faction" + outline_class + "\"><div class=\"img_col\"><img class=\"faction_img\" src=\"img/factions/" + data.id + ".png\" /></div><div class=\"info_col\"><p class=\"faction_name\">" + data.name + "</p><p class=\"faction_description\">" + data.description + "</p><hr /><div class=\"level_progression\"><div class=\"faction_xp_extra_left\"><div class=\"level_number\">" + (factions[data.id].level) + "</div></div><div class=\"faction_xp\"><div class=\"xp_bar\" style=\"width: " + next_level_percentage + "%;\"></div><div class=\"next_xp_bar\" style=\"width: " + remaining_experience + "%;\"></div></div><div class=\"faction_xp_extra_right\"><div class=\"level_number\">" + (factions[data.id].level + 1) + "</div><div class=\"extra_levels\">" + extra_levels + "</div></div></div></div></div>";
									$("#prog_factions").html(factions_result);
								}
							});
					}
				}
			});

			if($(character).attr("class") == "character"){
				$(".character").removeClass("character_selected");
				$(character).addClass("character_selected");
			}
		});
}

function getClanRewardsState(rewards_info, contribution){
	for(reward in rewards_info){
		if(rewards_info[reward].complete){
			$("#clan_" + rewards_info[reward].objectiveHash).addClass("acquired_engram");
		}else{
			$("#clan_" + rewards_info[reward].objectiveHash).removeClass("acquired_engram");
		}
	}

	if(contribution){
		$("#clan_contribution > p:last").text(":" + zeroPad(contribution, 4) + "/5000");

		if(contribution == 5000){
			$(".checkbox").addClass("checked");
		}else{
			$(".checkbox").removeClass("checked");
		}
	}else{
		$("#clan_contribution > p:last").text(":0000/5000");

		$(".checkbox").removeClass("checked");
	}
}

function getFactionInfo(faction_id){
	return $.get("destiny_2_faction_db_" + lang + ".json").then(function(data){
		for(faction in data){
			faction_info = JSON.parse(data[faction][1]);

			if(faction_info.hash == faction_id){
				result = {};

				result["id"] = faction_id;

				if(faction_info.displayProperties.icon){
					result["image"] = "https://www.bungie.net" + faction_info.displayProperties.icon;
				}else{
					result["image"] = "none.png";
				}

				result["name"] = faction_info.displayProperties.name;
				result["description"] = faction_info.displayProperties.description;
				result["redacted"] = faction_info.redacted;

				return result;
			}
		}
	});
}

function getMilestoneInfo(milestones){
	return $.get("destiny_2_milestone_db_" + lang + ".json").then(function(data){
		milestones_contents = "";

		for(item in data){
			milestone_info = JSON.parse(data[item][1]);

			for(milestone in milestones){
				if(milestone_info.hash == milestones[milestone].milestoneHash){
					for(quest in milestone_info.quests){
						if(milestones[milestone].availableQuests){
							if(milestones[milestone].availableQuests.length == 1){
								if(milestones[milestone].availableQuests[0].questItemHash == quest && milestone_info.milestoneType > 2 && milestones[milestone].availableQuests[0].status.started){
									if(milestone_info.quests[quest].displayProperties){
										if(milestones[milestone].availableQuests[0].status.completed){
											if(!milestones[milestone].availableQuests[0].status.redeemed){
												milestones_contents += "<div class=\"milestone milestone_completed\"><p>" + milestone_info.quests[quest].displayProperties.name + "</p></div>";
											}
										}else{
											milestones_contents += "<div class=\"milestone\"><p>" + milestone_info.quests[quest].displayProperties.name + "</p></div>";
										}
									}
								}
							}else{
								total_quests = 0;
								quests_length = milestones[milestone].availableQuests.length;

								for(milestone_quest in milestones[milestone].availableQuests){
									if(milestones[milestone].availableQuests[milestone_quest].status.completed){
										total_quests++;
									}
								}

								if(total_quests < quests_length && milestones[milestone].availableQuests[milestone_quest].questItemHash == quest && milestone_info.milestoneType > 2 && milestones[milestone].availableQuests[0].status.started){
									milestones_contents += "<div class=\"milestone\"><p>" + milestone_info.displayProperties.name + "</p></div>";
								}
							}
						}
					}
				}
			}
		}

		$("#milestone_list").html(milestones_contents);
	});
}

function factionXP(){
	this.populateXP = function(membership_type, membership_id){
		factions_xp = {
			  24856709: 0, //Leviathan
			 469305170: 0, //The Nine
			 611314723: 0, //Vanguard Tactical
			 697030790: 0, //The Crucible
			 828982195: 0, //Fragmented Researcher
			1021210278: 0, //Gunsmith
			1660497607: 0, //Exodus Black AI
			3231773039: 0, //Vanguard Research
			4196149087: 0, //Field Commander
			4235119312: 0, //Dead Zone Scout
			1714509342: 0, //Future War Cult
			2105209711: 0, //New Monarchy
			3398051042: 0, //Dead Orbit
			1761642340: 0  //Iron Banner
		};

		return $.ajax({
			url: "https://www.bungie.net/Platform/Destiny2/" + membership_type + "/Profile/" + membership_id + "/?components=102", 
			type: "GET", 
			beforeSend: function(xhr){xhr.setRequestHeader("X-API-Key", "983e6af736df45cb8ef8f283e0d4720d");},
			success: function(data){
				if("data" in data.Response.profileInventory){
					$("#string_warning").slideUp();

					items = data.Response.profileInventory.data.items;

					faction_items = {
						1505278293: {"xp": 100,  "faction": 24856709},   //Callus Token
						 885593286: {"xp": 100,  "faction": 469305170},  //Emissary Token
						3899548068: {"xp": 100,  "faction": 611314723},  //Vanguard Token
						 183980811: {"xp": 100,  "faction": 697030790},  //Crucible Token
						3825769808: {"xp": 100,  "faction": 828982195},  //Io Token 
						3756389242: {"xp": 50,   "faction": 828982195},  //Phaseglass Spire
						1305274547: {"xp": 100,  "faction": 828982195},  //Phaseglass Needle
						 685157383: {"xp": 75,   "faction": 1021210278}, //Gunsmith Materials
						 685157381: {"xp": 25,   "faction": 1021210278}, //Weapon Telemetry
						3201839676: {"xp": 100,  "faction": 1660497607}, //Nessus Token
						2949414982: {"xp": 50,   "faction": 1660497607}, //Quantized Datalattice
						3487922223: {"xp": 100,  "faction": 1660497607}, //Microphasic Datalattice
						3957264072: {"xp": 1000, "faction": 3231773039}, //Vanguard Research Token
						 494493680: {"xp": 100,  "faction": 4196149087}, //Archology Token
						 461171930: {"xp": 50,   "faction": 4196149087}, //Alkane Spores
						2014411539: {"xp": 100,  "faction": 4196149087}, //Alkane Dust
						2640973641: {"xp": 100,  "faction": 4235119312}, //EDZ Token
						 478751073: {"xp": 50,   "faction": 4235119312}, //Dusklight Crystal
						 950899352: {"xp": 100,  "faction": 4235119312}, //Dusklight Shard
						1270564331: {"xp": 100,  "faction": 1714509342}, //FWC Token
						2270228604: {"xp": 100,  "faction": 2105209711}, //New Monarchy Token
						2959556799: {"xp": 100,  "faction": 3398051042}, //Dead Orbit Token
						1873857625: {"xp": 100,  "faction": 1761642340}  //Iron Banner Token
					};

					for(item in items){
						for(faction_item in faction_items){
							if(items[item].itemHash == parseInt(faction_item)){
								factions_xp[(faction_items[faction_item].faction).toString()] += items[item].quantity * faction_items[faction_item].xp;
							}
						}
					}
				}else{
					$("#string_warning").slideDown();
				}
			}
		});
	}

	this.getFactionXP = function(faction_id){
		return factions_xp[faction_id];
	}
}
