import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { AnalyticsService } from "../data-ingestion/utils/analytics.service";
import { MatchInfo } from "../database/model/match-info.model";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class AnalyticsReCalculationStartupScriptService {
    constructor(private readonly analyticService: AnalyticsService, @InjectModel(MatchInfo.name) private readonly matchInfoModel: Model<MatchInfo>, private readonly configService: ConfigService) {
        const runOnStartup = this.configService.get('RUN_ANALYTICS_RECALCULATION_ON_STARTUP');

        if (runOnStartup === "true") {
            this.runScript().catch((error) => {
                Logger.error("Error running startup script:", error);
            });
        }
    }

    async runScript() {
        let count = 0;
        const matches = await this.matchInfoModel.find();
        for (const match of matches) {
            const analytics = await this.analyticService.generateAnalyticsForMatch(match.match_id.toString());
            if (analytics) {
                Logger.log(`Analytics updated for match ID: ${match.match_id}`);
                count += 1;
                Logger.log("total analytics updated", count);
            } else {
                Logger.log(`Failed to update analytics for match ID: ${match.match_id}`);
            }
        }
    }
}