import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BattingStyle, BowlingStyleType, Gender, PlayerRole } from '@cricket-analysis-monorepo/constants';

@Schema({ timestamps: true, versionKey: false })
export class Player {
  @Prop()
  name: string;

  @Prop({ type: String, enum: PlayerRole, index: true })
  role: PlayerRole;

  @Prop({ type: [{ id: { type: Types.ObjectId, index: true }, capNumber: { type: Number } }] })
  teams: { id: string, capNumber: number }[];

  @Prop()
  shortName: string;

  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @Prop()
  dob: string;

  @Prop()
  profilePictureUrl: string;

  @Prop({ type: String, index: true })
  uniqueId: string;

  @Prop({ type: String, enum: BowlingStyleType, index: true })
  bowlingStyle: BowlingStyleType;

  @Prop({ type: String, enum: BattingStyle, index: true })
  battingStyle: BattingStyle;

  @Prop({ type: Object })
  debut: object;

  @Prop()
  aboutMe: string;

  constructor() {
    this.name = '';
    this.role = PlayerRole.ALL_ROUND;
    this.teams = [{ id: "", capNumber: 0 }];
    this.shortName = '';
    this.gender = Gender.MALE;
    this.dob = '';
    this.profilePictureUrl = '';
    this.uniqueId = '';
    this.bowlingStyle = BowlingStyleType.LAG;
    this.battingStyle = BattingStyle.RIGHT_HAND;
    this.debut = {};
    this.aboutMe = '';
  }
}

export const PlayerSchema = SchemaFactory.createForClass(Player);