import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';
import * as teamParsers from './parsers/getTeamParsers.js';

class HLTV {

  static gotInstance = gotScraping;

  static async getTeam(teamId) {
    const numericTeamId = parseInt(teamId, 10);

    if (isNaN(numericTeamId)) {
      console.error(`[HLTV Static] Error: Team ID '${teamId}' is not a valid number.`);

      return null;
    }

    const url = `https://www.hltv.org/team/${numericTeamId}/-`;
    console.log(`[HLTV Static] Fetching team data for ID ${numericTeamId} from: ${url}`);

    try {

      const response = await this.gotInstance(url);
      console.log(`[HLTV Static] Request to ${response.url} successful (Status Code: ${response.statusCode})`);

      if (response.statusCode < 200 || response.statusCode >= 300) {
         console.error(`[HLTV Static] Error: Status Code ${response.statusCode} for ${response.url}`);
         return null;
      }

      console.log('[HLTV Static] Parsing HTML...');
      const $ = cheerio.load(response.body);

      if ($('title').text().includes('Page not found') || $('.bgPadding', '.standard-box').text().includes('Team not found')) {
          console.error(`[HLTV Static] Error: Page indicates Team ID ${numericTeamId} not found.`);
          return null;
      }


      const teamData = {
        team_id: numericTeamId,
        name: teamParsers.parseTeamName($),
        country: teamParsers.parseCountry($),
        social_media: teamParsers.parseSocialMedia($),
        rankings: teamParsers.parseRankings($),
        statistics: teamParsers.parseStatistics($),
        coach: teamParsers.parseCoach($),
        players: teamParsers.parsePlayers($),
      };

      if (!teamData.name) {
          console.error(`[HLTV Static] Error: Could not parse team name for ID ${numericTeamId}. URL: ${url}`);
          return null;
      }



      return teamData;

    } catch (error) {
      console.error(`[HLTV Static] Error fetching or parsing team data for ID ${numericTeamId}:`, error.message);
       if (error.response) {
          console.error(`[HLTV Static] Status Code: ${error.response.statusCode}`);
          console.error(`[HLTV Static] Response URL: ${error.response.url}`);
       } else if (error.request) {
           console.error("[HLTV Static] Request made but no response received.");
       }
      return null;
    }
  }

}


export default HLTV;