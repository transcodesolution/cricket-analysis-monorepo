import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MappingData } from '../database/model/mapping.model';
import { RedisService } from '../redis/redis.service';
import { RedisKey } from '../data-ingestion/dto/constant.dto';
import { Tournament } from '../database/model/tournament.model';
import { Team } from '../database/model/team.model';
import { Venue } from '../database/model/venue.model';

@Injectable()
export class DefaultEntityNameSeederService {
  constructor(@InjectModel(MappingData.name) private readonly mappedDataModel: Model<MappingData>, private readonly redisService: RedisService) { }

  async defaultLoadEntityNameToRedis() {
    const tournamentEntityCache = await this.mappedDataModel.findOne({ collectionName: Tournament.name });

    if (tournamentEntityCache) {
      await this.redisService.del(RedisKey.TOURNAMENT_NAMES);
      await this.redisService.setList(RedisKey.TOURNAMENT_NAMES, tournamentEntityCache.names);
    }

    const teamEntityCache = await this.mappedDataModel.findOne({ collectionName: Team.name });

    if (teamEntityCache) {
      await this.redisService.del(RedisKey.TEAM_NAMES);
      await this.redisService.setList(RedisKey.TEAM_NAMES, teamEntityCache.names);
    }

    const venueEntityCache = await this.mappedDataModel.findOne({ collectionName: Venue.name });

    if (venueEntityCache) {
      await this.redisService.del(RedisKey.VENUE_NAMES);
      await this.redisService.setList(RedisKey.VENUE_NAMES, venueEntityCache.names);
    }
  }
}
