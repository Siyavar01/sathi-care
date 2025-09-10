export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface ISessionType {
  _id: string;
  type: string;
  duration: number;
  price: number;
  isProBono: boolean;
}

export interface IProfessional {
  _id: string;
  user: IUser;
  title: 'Therapist' | 'Psychiatrist';
  bio: string;
  specializations: string[];
  experience: number;
  offersProBono: boolean;
  sessionTypes: ISessionType[];
  isVerified: boolean;
  profilePictureUrl: string;
  languages: string[];
  acceptsInstitutionalOutreach: boolean;
  availability: {
    day: string;
    timeSlots: {
      startTime: string;
      endTime: string;
      sessionTypeId: string;
    }[];
  }[];
  credentials: {
    name: string;
    url: string;
  }[];
}

export interface IInstitutionProfile {
  _id: string;
  user: IUser;
  institutionName: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  website?: string;
}

export interface IConnectionRequest {
  _id: string;
  institution: IInstitutionProfile;
  professional: IProfessional;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface IAppointment {
  _id: string;
  user: IUser;
  professional: IProfessional;
  sessionDetails: ISessionType;
  appointmentDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentId?: string;
  videoRoomUrl?: string;
  createdAt: string;
}