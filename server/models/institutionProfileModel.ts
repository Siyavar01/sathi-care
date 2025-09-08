import { Schema, model, Document, Types } from 'mongoose';

export interface IInstitutionProfile extends Document {
  user: Types.ObjectId;
  institutionName: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  website?: string;
}

const institutionProfileSchema = new Schema<IInstitutionProfile>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
    institutionName: { type: String, required: true },
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    contactEmail: { type: String, required: true },
    website: { type: String },
  },
  { timestamps: true }
);

const InstitutionProfile = model<IInstitutionProfile>('InstitutionProfile', institutionProfileSchema);

export default InstitutionProfile;