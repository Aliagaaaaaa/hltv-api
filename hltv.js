import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';
import * as teamParsers from './parsers/getTeamParsers.js';

class HLTV {

  static gotInstance = gotScraping;
  static loggingEnabled = false;

  static enableLogging(enabled = true) {
    this.loggingEnabled = enabled;
  }

  static log(message, level = 'log') {
    if (this.loggingEnabled) {
      console[level](`[HLTV API] ${message}`);
    }
  }

  static async getTeam(teamId) {
    const numericTeamId = parseInt(teamId, 10);

    if (isNaN(numericTeamId)) {
      this.log(`Error: Team ID '${teamId}' is not a valid number.`, 'error');
      return null;
    }

    const url = `https://www.hltv.org/team/${numericTeamId}/-`;
    this.log(`Fetching team data for ID ${numericTeamId} from: ${url}`);

    try {
      const response = await this.gotInstance(url);

      this.log(`Request to ${response.url} completed (Status Code: ${response.statusCode})`);

      if (response.statusCode < 200 || response.statusCode >= 300) {
         this.log(`Error: Received non-2xx Status Code ${response.statusCode} for ${response.url}`, 'error');
         return null;
      }

      this.log('Parsing HTML response...');
      const $ = cheerio.load(response.body);

      const errorBoxExists = $('.standard-box.error-status').length > 0;
      if (errorBoxExists) {
          this.log(`Team ID ${numericTeamId} not found (Detected 404 page structure). URL: ${response.url}`, 'warn');
          return null;
      }


      this.log(`Attempting to parse team details for ID ${numericTeamId}`);
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

      this.log(`Successfully parsed team data for ID ${numericTeamId}: ${teamData.name}`);
      return teamData;

    } catch (error) {
      this.log(`Error fetching or processing team data for ID ${numericTeamId}: ${error.message}`, 'error');
      if (error.response) {
          this.log(`Status Code: ${error.response.statusCode}`, 'error');
          this.log(`Response URL: ${error.response.url}`, 'error');
      } else if (error.request) {
          this.log("Request was made but no response received.", 'error');
      }
      return null;
    }
  }
}

export default HLTV;