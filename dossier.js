(function() {
	if (getVisiblePage() == "dossier") {
		$("#content").html("<h1>" + getUserNation().replaceAll("_", " ").toTitleCase() + "'s Dossier</h1>");
		
		$("#content").html("<div id='nation_dossier'><h1>National Dossier</h1></div><div id='region_dossier'><h1>Regional Dossier</h1></div>");
		$("#region_dossier").hide();

		$(document.body).click(function(event) {
			var nation;
			if ($(event.target).attr("class") == "dossier_element") {
				nation = $(event.target).attr("id");
			} else {
				nation = $(event.target).parents(".dossier_element").attr("id");
			}
			if (nation && nation != "last_nation_element") {
				if (typeof $("#iframe-" + nation).html() == "undefined") {
					$("#" + nation).html($("#" + nation).html() + "<div id='iframe-" + nation + "' style='margin-top:5px; height: 500px; border: 2px solid black; display: block; background: white; margin-left: -32px; border-radius: 6px;'><iframe style='width: 100%; height: 495px;' src='http://nationstates.net/nation=" + nation + "?hideBanner=true&hideFooter=true&hidePanel=true&hideFlag=true'/></div>");
					$("#iframe-" + nation).hide();
				}
				$("#iframe-" + nation).animate({ height: 'toggle'}, 800);
			}
		});
		
		var currentPage = 0;
		var atEndOfDossier = false;
		loadDossierPage = function(animate) {
			if (atEndOfDossier) {
				return;
			}
			var nations = []
			$.get("page=dossier?start=" + (currentPage * 15), function(html) {
				var nationsHtml = "";
				$(html).find("table:first").find("tbody").find("tr").each(function() {
					var nation;
					var flag;
					var waMember = $(this).html().contains("WA Delegate") || $(this).html().contains("WA Member");
					if ($(this).children().length == 3) {
						nation = $($(this).children()[2]).html();
						flag = "http://www.nationstates.net/images/flags/exnation.png";
					} else {
						nation = $(this).find(".nlink").attr("href").substring(7);
						flag = $(this).find(".smallflag").attr("src");
					}
					nations.push(nation);
					nationsHtml += "<div id='" + nation + "' class='dossier_element'" + (animate ? "style='display:none;'" : "") + "><div><img class='smallflag' src='" + flag + "'><a style='font-weight:bold' target='_blank' href='http://nationstates.net/nation=" + nation + "'>" + nation.replaceAll("_", " ").toTitleCase() + "</a>"
					if (waMember) {
						nationsHtml += "<div class='wa_status' style='height:25px;padding-left:19px; border:none;margin-bottom: -8px;margin-left: 20px;'></div>";
					}
					if ($(this).children().length == 5) {
						var activityHtml = $($(this).children()[4]).html();
						var lastActivity = activityHtml.substring(0, activityHtml.indexOf("<br>"));
						var region = $($($(this).children()[4]).children()[1]).attr("href").substring(7);
						var formattedRegion = region.replaceAll(" ", "_").toLowerCase();
						nationsHtml += "<div class='last_activity'>" + lastActivity + "</div><div class='region_activity'><a target='_blank' href='/region=" + formattedRegion + "'>" + region + "</a></div>";
						$.get("http://capitalistparadise.com/api/regionflag/?region=" + formattedRegion, function(json) {
							for (var regionName in json) {
								var flag = json[regionName];
								if (flag != null && flag.length > 0) {
									var regionDiv = $("#" + nation).find(".region_activity");
									regionDiv.html("<img class='smallflag' src='" + flag + "'/>" + regionDiv.html());
								}
							}
						});
					}
					nationsHtml += "</div></div>";
				});
				if (nationsHtml.length == 0) {
					nationsHtml = "<div id='last_nation_element' style='text-align: center;font-weight: bold;' class='dossier_element'>End of Dossier</div>";
					atEndOfDossier = true;
				}
				$("#nation_dossier").append(nationsHtml);
				if (animate) {
					for (var i = 0; i < nations.length; i++) {
						$("#" + nations[i]).hide().animate({ height: 'toggle', 'min-height': 'toggle' }, 800);
					}
				}
			});
		}
		loadDossierPage(false);
		
		$(window).scroll(function handleInfiniteScroll() {
			if ($(window).scrollTop() + 400 > ($(document).height() - $(window).height())) {
				currentPage += 1;
				loadDossierPage(true);
			}
		});
	}
})();