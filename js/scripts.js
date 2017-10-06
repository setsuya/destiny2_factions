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

	$(".section_title > span, #ramen_donate > p, #string_warning").each(function(){
		$(this).html(langs[lang][$(this).attr("id")]);
	});
});

var lang = "";
var repeat_timer = false;
var timer_start_time = 0;
var timer_id = 0;
var timer_time = 300000;

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
	3398051042: 0  //Dead Orbit
};

var langs = {
	"en-US": {
		  "string_characters": "Characters", 
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
		     "string_refresh": "Refresh", 
		"string_auto_refresh": "Auto", 
		"string_refresh_time": "(Refreshing automatically every 5 minutes.)", 
		       "string_error": "User not found or error occurred.<br />Please try again.", 
		     "string_warning": "<p>Destiny Faction Checker needs access to your inventory to be able to show faction experience from tokens and materials in your possession. You can still use this tool, only it won't show when you have enough materials for a rank up with the factions. In order to make this information publicly available you need to follow some simple steps.</p><p>Go to <b>Bungie.net</b> and log into your account. Then go to <b>Settings</b> &gt; <b>Privacy</b> and check the option that says &quot;<b>Show my non-equipped Inventory</b>&quot;.</p><p>After this is done, enter your information again and enjoy.</p>", 
		      "string_donate": "PayPal me some spicy ramen!"
		
	}, 
	"pt-BR": {
		  "string_characters": "Personagens", 
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
		     "string_refresh": "Atualizar", 
		"string_auto_refresh": "Auto", 
		"string_refresh_time": "(Atualizando automaticamente a cada 5 minutos.)", 
		       "string_error": "Usuário não encontrado ou erro ocorrido.<br />Por favor tente novamente.", 
		     "string_warning": "<p>Destiny Faction Checker precisa de acesso ao seu inventário para poder exibir experiência de facções a partir de medalhas e materiais na sua posse. Você ainda pode utilizar esta ferramenta, ela apenas não irá dizer quando você possuir materiais suficientes para subir de nível com as facções. Para deixar essa informação disponível publicamentevocê precisa seguir alguns simples passos.</p><p>Vá até <b>Bungie.net</b> e acesse sua conta. Então vá até <b>Configurações</b> &gt; <b>Privacidade</b> e marque a opção que diz &quot;<b>Mostrar meu Inventário não equipado</b>&quot;.</p><p>Após fazer isso, coloque suas informações novamente e aproveite.</p>", 
		      "string_donate": "Me pague um ramen apimentado pelo PayPal!"
	}
};

function randomIcon(){
	icons = ["24856709", "469305170", "611314723", "697030790", "1021210278", "1714509342", "2105209711", "3231773039", "3398051042"];
	random_num = Math.floor(Math.random() * (8 + 1));
	
	$("[rel='icon']").attr("href", "img/favicons/" + icons[random_num] + ".png");
}

function createTimeout(timer_value){
	clearTimeout(timer_id);
	timer_id = setTimeout(function(){$("#reload_info").click();}, timer_value);
}

function checkRefresh(){
	timer_refresh_time = new Date().getTime();

	if(((timer_refresh_time - timer_start_time) >= timer_time) && (repeat_timer == true)){
		$("#reload_info").click();
	}else{
		createTimeout((timer_refresh_time - timer_start_time));
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

function changeNetwork(){
	if($("#network_selector").attr("data-network") == "2"){
		$("#networks").animate({"left": "-45px"});
		$("#network_selector").attr("data-network", "1");
	}else{
		$("#networks").animate({"left": "0"});
		$("#network_selector").attr("data-network", "2");
	}
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

function searchPlayer(){
	if($("#player_name").val() != ""){
		platform = $("#network_selector").attr("data-network");
		player = $("#player_name").val();

		$("#char_list, #prog_factions").html("");
		$("#char_list").html("<p class=\"loader\">" + langs[lang].string_loading + "</p>");

		return $.ajax({
			url: "https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/" + platform + "/" + player + "/", 
			type: "GET", 
			beforeSend: function(xhr){xhr.setRequestHeader("X-API-Key", "983e6af736df45cb8ef8f283e0d4720d");},
			success: function(data){
				if(data.Response.length != 0){
					$.when(getProfile(data.Response[0].membershipId, data.Response[0].membershipType))
						.then(function(){
							$("#char_list .loader").remove();
						});
				}else{
					$("#char_list").html("<p class=\"loader\">" + langs[lang].string_error + "</p>");
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
			for(i = 0; i < data.Response.profile.data.characterIds.length; i++){
				getCharacter(membership_id, membership_type, data.Response.profile.data.characterIds[i]);
			}
		}
	});
}

function getCharacter(membership_id, membership_type, character_id){
	return $.ajax({
		url: "https://www.bungie.net/Platform/Destiny2/" + membership_type + "/Profile/" + membership_id + "/Character/" + character_id + "/?components=200", 
		type: "GET", 
		beforeSend: function(xhr){xhr.setRequestHeader("X-API-Key", "983e6af736df45cb8ef8f283e0d4720d");},
		success: function(data){
			character = data.Response.character.data;
			showCharacterInfoBanner(character.membershipType, character.membershipId, character.characterId, character.baseCharacterLevel, character.light, character.classType, character.raceType, character.genderType, character.emblemPath, character.emblemBackgroundPath, character.percentToNextLevel);
		}
	});
}

function showCharacterInfoBanner(membership_type, membership_id, character_id, character_level, character_power, character_class, character_race, character_gender, emblem_image, background_image, next_level_progression){
	gender_list = [langs[lang].string_male, langs[lang].string_female];
	class_list = [langs[lang].string_titan, langs[lang].string_hunter, langs[lang].string_warlock];
	race_list = [langs[lang].string_human, langs[lang].string_awoken, langs[lang].string_exo];

	character = "<div class=\"character\" onclick=\"loadCharacterData('" + membership_type + "', '" + membership_id + "', '" + character_id + "', this)\"><img class=\"emblem_background\" src=\"http://bungie.net" + background_image + "\" /><p class=\"character_class\">" + class_list[character_class] + "</p><p class=\"character_power\"><span class=\"light_symbol\">&#x2726;</span>" + character_power + "</p><p class=\"character_description\">" + gender_list[character_gender] + " " + race_list[character_race] + "</p><p class=\"character_level\">" + langs[lang].string_level + " " + character_level + "</p><div class=\"level_progression\"><hr style=\"width: " + next_level_progression + "%\" /></div></div>";

	$(character).appendTo("#char_list");
}

function loadCharacterData(membership_type, membership_id, character_id, character){
	$("#prog_factions").html("<p class=\"loader\">" + langs[lang].string_loading + "</p>");

	var factions = new factionXP();

	$.when(factions.populateXP(membership_type, membership_id))
		.then(function(){
			$.ajax({
				url: "https://www.bungie.net/Platform/Destiny2/" + membership_type + "/Profile/" + membership_id + "/Character/" + character_id + "/?components=202", 
				type: "GET", 
				beforeSend: function(xhr){xhr.setRequestHeader("X-API-Key", "983e6af736df45cb8ef8f283e0d4720d");},
				success: function(data){
					factions = data.Response.progressions.data.factions;
					factions_result = "<div id=\"reload_info\" onclick=\"loadCharacterData('" + membership_type + "', '" + membership_id + "', '" + character_id + "', this)\"><p>" + langs[lang].string_refresh + "</p></div>";

					if(repeat_timer){
						factions_result += "<div id=\"auto_reload\" class=\"repeat_on\" onclick=\"toggleAutoReload('off')\"><p>" + langs[lang].string_auto_refresh + "</p></div><p id=\"interval_info\">" + langs[lang].string_refresh_time + "</p>";
						timer_start_time = new Date().getTime();
						createTimeout(timer_time);
					}else{
						factions_result += "<div id=\"auto_reload\" class=\"repeat_off\" onclick=\"toggleAutoReload('on', '" + membership_type + "', '" + membership_id + "', '" + character_id + "', this)\"><p>" + langs[lang].string_auto_refresh + "</p></div><p id=\"interval_info\" style=\"display: none;\"></p>";
					}

					for(faction in factions){
						$.when(getFactionInfo(faction))
							.then(function(data){
								if(!data.redacted){
									outline_class = "";

									next_level_percentage = ((factions[data.id].progressToNextLevel / factions[data.id].nextLevelAt) * 100).toFixed(2);

									var faction_info = new factionXP();

									remaining_experience = ((faction_info.getFactionXP(data.id) / factions[data.id].nextLevelAt) * 100).toFixed(2);
									
									if((parseFloat(remaining_experience) + parseFloat(next_level_percentage)) >= 100.00){
										remaining_experience = (100.00 - parseFloat(next_level_percentage)).toFixed(2);
										outline_class = " faction_outline";
									}

									factions_result += "<div class=\"faction" + outline_class + "\"><div class=\"img_col\"><img class=\"faction_img\" src=\"img/factions/" + data.id + ".png\" /></div><div class=\"info_col\"><p class=\"faction_name\">" + data.name + "</p><p class=\"faction_description\">" + data.description + "</p><hr /><div class=\"level_progression\"><div class=\"level_number\">" + (factions[data.id].level) + "</div><div class=\"faction_xp\"><div class=\"xp_bar\" style=\"width: " + next_level_percentage + "%;\"></div><div class=\"next_xp_bar\" style=\"width: " + remaining_experience + "%;\"></div></div><div class=\"level_number\">" + (factions[data.id].level + 1) + "</div></div></div></div>";
									$("#prog_factions").html(factions_result);
								}
							});
					}

					$("#prog_factions .loader").remove();
				}
			});

			if($(character).attr("class") == "character"){
				$(".character").removeClass("character_selected");
				$(character).addClass("character_selected");
			}
		});
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
			3398051042: 0  //Dead Orbit
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
						2959556799: {"xp": 100,  "faction": 3398051042}  //Dead Orbit Token
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
