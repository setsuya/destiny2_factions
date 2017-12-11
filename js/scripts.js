$(document).ready(function(){
	if(localStorage.lang){
		lang = localStorage.lang;
		$("#language_flag").attr("src", "img/" + lang + ".png");
	}else{
		lang = "en-US";
		$("#language_flag").attr("src", "img/" + lang + ".png");
	}

	if(!localStorage.timer_interval){
		localStorage.timer_interval = "5";
	}

	if(!localStorage.show_xp_numbers){
		localStorage.show_xp_numbers = "off";
	}

	$("input[name=refresh_interval], input[name=show_xp]").removeAttr("checked");

	$("#time_" + localStorage.timer_interval + "min").attr("checked", "checked");
	timer_time = (parseInt(localStorage.timer_interval) * 60) * 1000;

	$("#xp_" + localStorage.show_xp_numbers).attr("checked", "checked");

	if(localStorage.repeat_timer){
		repeat_timer = localStorage.repeat_timer === "true";
	}
	
	if(localStorage.curr_ver){
		$("#manifest_ver > span").text(localStorage.curr_ver);
	}

	$(".section_title > span, #reload_info_off span, #auto_reload_off span, #ramen_donate > p, #string_warning, #string_clan_xp, #string_github, #string_translate, #string_show_xp_numbers, #string_option_on, #string_option_off, #string_show_refresh_interval, #string_apply").each(function(){
		$(this).html(langs[lang][$(this).attr("id")]);
	});

	$("meta[property='og:description']").attr("content", langs[lang].string_share);

	original_button_position = $("#reload_div").offset().top;

	checkManifestVersion();
});

var jszip = new JSZip();
var sql = window.SQL;
var lang_array = ["en", "pt-br"];
var lang_files = {};
var langs_db = {};
var counter = 0;
var lang = "";
var repeat_timer = false;
var timer_start_time = 0;
var timer_id = 0;
var timer_time = 300000;
var original_button_position = 0;
var version = "";

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
	1761642340: 0, //Iron Banner
	2677528157: 0  //Follower of Osiris
};

function randomIcon(){
	icons = ["24856709", "469305170", "611314723", "697030790", "1021210278", "1714509342", "2105209711", "3231773039", "3398051042", "1761642340", "2677528157"];
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
		$("#interval_info").text(langs[lang].string_refresh_time.replace("XXX", localStorage.timer_interval)).slideToggle("medium");
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
	$(section).next().slideToggle(300, function(){original_button_position = $("#reload_div").offset().top;});
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

function showOptions(){
	$("#options").fadeIn("fast", function(){$("#options_contents").slideDown();});
}

function saveOptions(){
	localStorage.show_xp_numbers = $("input[name=show_xp]:checked").attr("data-display-xp");
	localStorage.timer_interval = $("input[name=refresh_interval]:checked").attr("data-interval");

	timer_time = (parseInt(localStorage.timer_interval) * 60) * 1000;

	if(localStorage.show_xp_numbers == "on"){
		$(".xp_numbers").addClass("numbers_on").removeClass("numbers_off");
	}else{
		$(".xp_numbers").addClass("numbers_off").removeClass("numbers_on");
	}

	$("#options_contents").slideUp(function(){$("#options").fadeOut("fast");});
}

function checkManifestVersion(){
	$.ajax({
		url: "https://www.bungie.net/Platform/Destiny2/Manifest/", 
		type: "GET", 
		beforeSend: function(xhr){xhr.setRequestHeader("X-API-Key", "983e6af736df45cb8ef8f283e0d4720d");},
		success: function(data){
			version = data.Response.version;

			for(language in lang_array){
				db_url = data.Response.mobileWorldContentPaths[lang_array[language]];

				if(!(("db_name_" + lang_array[language]) in localStorage) || localStorage["db_name_" + lang_array[language]] != db_url.substr(db_url.lastIndexOf("/") + 1)){
					langs_db[lang_array[language]] = db_url;
				}
			}

			if(Object.keys(langs_db).length > 0){
				getManifestDBs(langs_db);
			}
		}
	});
}

function getManifestDBs(urls){
	$("<div id=\"overlay\"><div id=\"overlay_contents\"><p>" + langs[lang].string_updating_info + "</p><p>" + langs[lang].string_downloading_info + " <span id=\"download_progress\"></span></p></div></div>").appendTo("body").fadeIn("slow", function(){$("#overlay_contents").slideDown();});

	for(url in urls){
		url_string = "https://www.bungie.net" + urls[url];

		JSZipUtils.getBinaryContent(url_string, function(err, data){
			jszip.loadAsync(data)
				.then(function(result){
					lang_files = Object.keys(result.files);
					
					if(lang_files.length == Object.keys(urls).length){
						for(i = 0; i < lang_files.length; i++){
							jszip.file(result.files[Object.keys(result.files)[i]].name).async("uint8array")
								.then(function(data){
									getTableData(data);
								});
						}
					}
				});
			});
		
		localStorage["db_name_" + url] = urls[url].substr(urls[url].lastIndexOf("/") + 1);
	}
}

function getTableData(database){
	db = new sql.Database(database);

	tables = ["DestinyFactionDefinition", "DestinyMilestoneDefinition"];

	for(table in tables){
		res = db.exec("SELECT * FROM " + tables[table]);
		items = res[0].values;
		result_string = "";

		for(item in items){
			result_string += "[" + items[item][0] + ", " + JSON.stringify(items[item][1]) + "], ";
		}

		result_string = "[" + result_string.substr(0, result_string.lastIndexOf(", ")) + "]";
		localStorage[tables[table] + "_" + lang_array[counter]] = result_string;
	}

	counter++;

	if(counter == Object.keys(langs_db).length){
		localStorage.curr_ver = version;
		$("#manifest_ver > span").text(version);
		$("#download_progress").html(langs[lang].string_update_done).parents("#overlay_contents").delay(2000).slideUp(function(){$("#overlay").fadeOut("slow");});
	}
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
				$(".character_selected > .level_progression_char > hr").css("width", character.percentToNextLevel + "%");
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

	character = "<div class=\"character_info\"><div class=\"character\" data-emblem=\"" + emblem_image + "\" onclick=\"loadCharacterData('" + membership_type + "', '" + membership_id + "', '" + character_id + "', this)\"><img class=\"emblem_background\" src=\"https://www.bungie.net" + background_image + "\" /><p class=\"character_class\">" + class_list[character_class] + "</p><p class=\"character_power\"><span class=\"light_symbol\">&#x2726;</span>" + character_power + "</p><p class=\"character_description\">" + gender_list[character_gender] + " " + race_list[character_race] + "</p><p class=\"character_level\">" + langs[lang].string_level + " " + character_level + "</p><div class=\"level_progression_char\"><hr style=\"width: " + next_level_progression + "%\" /></div></div><p>" + langs[lang].string_total_time + ": " + convertTime(total_time) + "</p></div>";

	$(character).appendTo("#char_list");
	original_button_position = $("#reload_div").offset().top;
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

					factions_result += "<div class=\"faction\"><div class=\"img_col\"><img class=\"faction_img\" src=\"img/factions/bright_engram.png\" /></div><div class=\"info_col\"><p class=\"faction_name\">" + langs[lang].string_legend + "</p><p class=\"faction_description\">" + langs[lang].string_legend_desc + "</p><hr /><div class=\"level_progression\"><div class=\"faction_xp_extra_left\"><div class=\"level_number\">" + (legend_level) + "</div></div><div class=\"faction_xp\"><p class=\"xp_numbers numbers_" + localStorage.show_xp_numbers + "\">" + data.Response.progressions.data.progressions["2030054750"].progressToNextLevel + "/" + data.Response.progressions.data.progressions["2030054750"].nextLevelAt + "</p><div class=\"xp_bar\" style=\"width: " + legend_percentage + "%;\"></div></div><div class=\"faction_xp_extra_right\"><div class=\"level_number\">" + (legend_level + 1) + "</div></div></div></div></div>";

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

									factions_result += "<div class=\"faction" + outline_class + "\"><div class=\"img_col\"><img class=\"faction_img\" src=\"img/factions/" + data.id + ".png\" /></div><div class=\"info_col\"><p class=\"faction_name\">" + data.name + "</p><p class=\"faction_description\">" + data.description + "</p><hr /><div class=\"level_progression\"><div class=\"faction_xp_extra_left\"><div class=\"level_number\">" + (factions[data.id].level) + "</div></div><div class=\"faction_xp\"><p class=\"xp_numbers numbers_" + localStorage.show_xp_numbers + "\">" + factions[data.id].progressToNextLevel + "/" + factions[data.id].nextLevelAt + "</p><div class=\"xp_bar\" style=\"width: " + next_level_percentage + "%;\"></div><div class=\"next_xp_bar\" style=\"width: " + remaining_experience + "%;\"></div></div><div class=\"faction_xp_extra_right\"><div class=\"level_number\">" + (factions[data.id].level + 1) + "</div><div class=\"extra_levels\">" + extra_levels + "</div></div></div></div></div>";
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
	data = JSON.parse(localStorage["DestinyFactionDefinition_" + langs[lang].id]);

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
}

function getMilestoneInfo(milestones){
	data = JSON.parse(localStorage["DestinyMilestoneDefinition_" + langs[lang].id]);
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

							if(total_quests < quests_length && milestones[milestone].availableQuests[milestone_quest].questItemHash == quest && milestone_info.milestoneType > 2){
								milestones_contents += "<div class=\"milestone\"><p>" + milestone_info.displayProperties.name + "</p></div>";
							}
						}
					}
				}
			}
		}
	}

	$("#milestone_list").html(milestones_contents);
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
			1761642340: 0, //Iron Banner
			2677528157: 0  //Follower of Osiris
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
						1305274547: {"xp": 250,  "faction": 828982195},  //Phaseglass Needle
						 685157383: {"xp": 75,   "faction": 1021210278}, //Gunsmith Materials
						 685157381: {"xp": 25,   "faction": 1021210278}, //Weapon Telemetry
						3201839676: {"xp": 100,  "faction": 1660497607}, //Nessus Token
						2949414982: {"xp": 50,   "faction": 1660497607}, //Quantized Datalattice
						3487922223: {"xp": 250,  "faction": 1660497607}, //Microphasic Datalattice
						3957264072: {"xp": 1000, "faction": 3231773039}, //Vanguard Research Token
						 494493680: {"xp": 100,  "faction": 4196149087}, //Archology Token
						 461171930: {"xp": 50,   "faction": 4196149087}, //Alkane Spores
						2014411539: {"xp": 250,  "faction": 4196149087}, //Alkane Dust
						2640973641: {"xp": 100,  "faction": 4235119312}, //EDZ Token
						 478751073: {"xp": 50,   "faction": 4235119312}, //Dusklight Crystal
						 950899352: {"xp": 250,  "faction": 4235119312}, //Dusklight Shard
						1270564331: {"xp": 100,  "faction": 1714509342}, //FWC Token
						2270228604: {"xp": 100,  "faction": 2105209711}, //New Monarchy Token
						2959556799: {"xp": 100,  "faction": 3398051042}, //Dead Orbit Token
						1873857625: {"xp": 100,  "faction": 1761642340}, //Iron Banner Token
						3022799524: {"xp": 100,  "faction": 2677528157}, //Mercury Token
						  49145143: {"xp": 50,   "faction": 2677528157}, //Simulation Seed
						2386485406: {"xp": 250,  "faction": 2677528157}  //Simulation Bloom
					};

					for(item in items){
						for(faction_item in faction_items){
							if(items[item].itemHash == parseInt(faction_item)){
								factions_xp[(faction_items[faction_item].faction).toString()] += items[item].quantity * faction_items[faction_item].xp;
							}
						}
					}
				}else{
					$("#string_warning").slideDown(function(){original_button_position = $("#reload_div").offset().top});
					
				}
			}
		});
	}

	this.getFactionXP = function(faction_id){
		return factions_xp[faction_id];
	}
}
