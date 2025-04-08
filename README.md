# HLTV API Scraper

A JavaScript library for scraping data from HLTV.org, providing easy access to team profiles, match information, and more.

## Installation

```bash
SOON
```

## Usage

Import the `HLTV` class and use its static methods to access different HLTV data endpoints:

```javascript
import { HLTV } from 'hltv-api-scraper';

const team = await HLTV.getTeam(6667); // Example: FaZe
console.log(team);

```

## Methods

### `HLTV.getTeam(teamId)`

Fetches detailed information about a specific team using their HLTV ID.

**Parameters:**
- `teamId` (number): The HLTV identifier for the team

**Returns:**
- Promise that resolves to a team data object or `null` if the request fails

**Response Schema:**

```javascript
// Example response for HLTV.getTeam(6667)
{
  team_id: 6667,
  name: "FaZe",
  country: {
    name: "Europe",
    code: "EU"
  },
  social_media: {
    twitter: "https://www.twitter.com/i/user/535756639",
    instagram: "https://www.instagram.com/fazeclan",
    twitch: "https://www.twitch.tv/FaZe"
  },
  rankings: {
    hltv_world: {
      rank: 8,
      link: "https://www.hltv.org/ranking/teams/2025/april/7/details/6667"
    },
    valve_regional: {
      rank: 9,
      link: "https://www.hltv.org/valve-ranking/teams?teamId=6667"
    }
  },
  statistics: {
    average_player_age: 28,
    core_weeks_in_top30: 213,
    current_win_streak: 2,
    win_rate_last_3m: 55.6
  },
  coach: {
    name: "Filip",
    nickname: "NEO",
    nationality: "Poland",
    profile_url: "https://www.hltv.org/coach/165/neo",
    stats: {
      time_on_team: "1 year 8 months",
      maps_coached: 309,
      trophies: 4,
      winrate_percentage: 59
    }
  },
  players: [
    {
      name: "Håvard",
      nickname: "rain",
      nationality: "Norway",
      status: "STARTER",
      profile_url: "https://www.hltv.org/player/8183/rain",
      stats: {
        time_on_team: "9 years 2 months",
        maps_played: 1764,
        rating_2_1: 1.01
      }
    },
    // ... additional players
  ]
}
```

**Notes:**
- Any field might be `null` if the data couldn't be found or parsed from HLTV
- The entire response will be `null` if the team couldn't be found or the request failed

### `HLTV.enableLogging(enabled)`

Enables or disables console logging for debugging purposes. Logging is disabled by default.

**Parameters:**
- `enabled` (boolean, optional): Set to `true` to enable logging, `false` to disable. Defaults to `true`.

**Example:**
```javascript
import { HLTV } from 'hltv-api-scraper';

// Enable logging
HLTV.enableLogging();
// or explicitly
HLTV.enableLogging(true);

// Later, disable logging if needed
HLTV.enableLogging(false);

// Now fetch data with logging enabled
const team = await HLTV.getTeam(6667);
```

When enabled, detailed logs about requests and parsing will appear in the console.

## Additional Methods

More methods will be added in future releases:
- `HLTV.getPlayer(playerId)` - Get player profile information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Use it for whatever, i don't care

## Disclaimer

This package is not affiliated with or endorsed by HLTV.org. Use this responsibly and in accordance with HLTV's terms of service.