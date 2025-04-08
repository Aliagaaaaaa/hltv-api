export function parseTeamName($) {
    return $('.profile-team-name').first().text().trim() || null;
  }
  
  export function parseCountry($) {
    const countryDiv = $('.team-country');
    const flagImg = countryDiv.find('img.flag');
    const name = flagImg.attr('title');
    const src = flagImg.attr('src');
    const code = src ? src.split('/').pop().replace('.gif', '') : null;
    return name && code ? { name, code } : null;
  }
  
  export function parseSocialMedia($) {
    const socialLinks = {};
    $('.socialMediaButtons a').each((i, el) => {
      const href = $(el).attr('href');
      if (!href) return;
  
      if (href.includes('twitter.com') || href.includes('x.com')) {
        socialLinks.twitter = href;
      } else if (href.includes('twitch.tv')) {
        socialLinks.twitch = href;
      } else if (href.includes('instagram.com')) {
        socialLinks.instagram = href;
      }
    });
    return Object.keys(socialLinks).length > 0 ? socialLinks : null;
  }
  
  export function parseRankings($) {
    const rankings = {
      hltv_world: null,
      valve_regional: null,
    };
    $('.profile-team-stat').each((i, el) => {
      const element = $(el);
      const text = element.text();
      const linkElement = element.find('a').first();
      const rankText = linkElement.text().trim().replace('#', '');
      const rank = parseInt(rankText, 10);
      const link = linkElement.attr('href');
  
      if (text.includes('World ranking')) {
        rankings.hltv_world = {
          rank: isNaN(rank) ? null : rank,
          link: link ? `https://www.hltv.org${link}` : null
        };
      } else if (text.includes('Valve ranking')) {
          const fullLink = link ? `https://www.hltv.org${link}` : null;
          rankings.valve_regional = {
              rank: isNaN(rank) ? null : rank,
              link: fullLink,
          };
      }
    });
  
    if (!rankings.hltv_world?.rank) rankings.hltv_world = null;
    if (!rankings.valve_regional?.rank) rankings.valve_regional = null;
  
    return (rankings.hltv_world || rankings.valve_regional) ? rankings : null;
  }
  
  export function parseStatistics($) {
    const stats = {
      average_player_age: null,
      core_weeks_in_top30: null,
      current_win_streak: null,
      win_rate_last_3m: null,
    };
  
    $('.profile-team-stat').each((i, el) => {
      const element = $(el);
      const text = element.text();
      const valueElement = element.find('span.right');
  
      if (text.includes('Average player age')) {
        const ageText = valueElement.text().trim();
        stats.average_player_age = parseFloat(ageText) || null;
      } else if (text.includes('Weeks in top30 for core')) {
         const weeksText = valueElement.text().trim();
         stats.core_weeks_in_top30 = parseInt(weeksText, 10);
         if (isNaN(stats.core_weeks_in_top30)) stats.core_weeks_in_top30 = 0;
      }
    });
  
     $('.highlighted-stats-box').first().find('.highlighted-stat').each((i, el) => {
          const statElement = $(el);
          const value = statElement.find('.stat').text().trim();
          const description = statElement.find('.description').text().trim();
  
          if (description.includes('Current win streak')) {
              const streak = parseInt(value, 10);
              stats.current_win_streak = isNaN(streak) ? null : streak;
          } else if (description.includes('Win rate')) {
              const rate = parseFloat(value.replace('%', ''));
              stats.win_rate_last_3m = isNaN(rate) ? null : rate;
          }
     });
  
      if (stats.average_player_age === null &&
          stats.core_weeks_in_top30 === 0 &&
          stats.current_win_streak === null &&
          stats.win_rate_last_3m === null) {
          return null;
      }
  
    return stats;
  }
  
  export function parseCoach($) {
      const coachRow = $('.coach-table tbody tr').first();
      if (coachRow.length === 0) return null;
  
      const coachLinkElement = coachRow.find('.playersBox-playernick-image');
      const coachStatsCells = coachRow.find('td');
  
      if (coachLinkElement.length === 0 || coachStatsCells.length < 5) return null;
  
      const profileUrl = coachLinkElement.attr('href');
      const nickname = coachLinkElement.find('.playersBox-playernick .text-ellipsis').text().trim();
      const fullName = coachLinkElement.find('.playerBox-bodyshot').attr('title');
      const nationalityFlag = coachLinkElement.find('.flag');
      const nationality = nationalityFlag.attr('title');
      const timeOnTeam = $(coachStatsCells[1]).text().trim();
      const mapsCoachedText = $(coachStatsCells[2]).text().trim();
      const trophiesText = $(coachStatsCells[3]).text().trim();
      const winrateText = $(coachStatsCells[4]).text().trim().replace('%','');
  
      const mapsCoached = parseInt(mapsCoachedText, 10);
      const trophies = parseInt(trophiesText, 10);
      const winrate = parseFloat(winrateText);
  
      return {
          name: fullName ? fullName.split('\'')[0].trim() : null,
          nickname: nickname || null,
          nationality: nationality || null,
          profile_url: profileUrl ? `https://www.hltv.org${profileUrl}` : null,
          stats: {
              time_on_team: timeOnTeam || null,
              maps_coached: isNaN(mapsCoached) ? null : mapsCoached,
              trophies: isNaN(trophies) ? 0 : trophies,
              winrate_percentage: isNaN(winrate) ? null : winrate,
          }
      };
  }
  
  export function parsePlayers($) {
    const players = [];
    $('.players-table tbody tr').each((i, el) => {
      const row = $(el);
      const playerLinkElement = row.find('.playersBox-playernick-image');
      const statsCells = row.find('td');
  
      if (playerLinkElement.length === 0 || statsCells.length < 5) return;
  
      const profileUrl = playerLinkElement.attr('href');
      const nickname = playerLinkElement.find('.playersBox-playernick .text-ellipsis').text().trim();
      const fullName = playerLinkElement.find('.playerBox-bodyshot').attr('title');
      const nationalityFlag = playerLinkElement.find('.flag');
      const nationality = nationalityFlag.attr('title');
      const status = $(statsCells[1]).find('.player-status').text().trim() || 'Active';
      const timeOnTeam = $(statsCells[2]).text().trim();
      const mapsPlayedText = $(statsCells[3]).text().trim();
      const ratingText = $(statsCells[4]).text().trim();
  
      const cleanRatingText = ratingText.replace('**', '').trim();
      const rating = cleanRatingText === '-' ? null : parseFloat(cleanRatingText);
      const mapsPlayed = parseInt(mapsPlayedText, 10);
  
  
      players.push({
          name: fullName ? fullName.split('\'')[0].trim() : null,
          nickname: nickname || null,
          nationality: nationality || null,
          status: status,
          profile_url: profileUrl ? `https://www.hltv.org${profileUrl}` : null,
          stats: {
              time_on_team: timeOnTeam || null,
              maps_played: isNaN(mapsPlayed) ? null : mapsPlayed,
              rating_1_0: isNaN(rating) ? null : rating
          }
      });
    });
    return players.length > 0 ? players : null;
  }