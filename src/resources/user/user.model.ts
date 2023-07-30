import { Schema, model, Types } from 'mongoose';

type UserRoles = ('Admin' | 'Employee' | 'Manager')[];

type Province =
  | 'Alberta'
  | 'British Columbia'
  | 'Manitoba'
  | 'New Brunswick'
  | 'Newfoundland and Labrador'
  | 'Northwest Territories'
  | 'Nova Scotia'
  | 'Nunavut'
  | 'Ontario'
  | 'Prince Edward Island'
  | 'Quebec'
  | 'Saskatchewan'
  | 'Yukon';

type StatesUS =
  | 'Alabama'
  | 'Alaska'
  | 'Arizona'
  | 'Arkansas'
  | 'California'
  | 'Colorado'
  | 'Connecticut'
  | 'Delaware'
  | 'Florida'
  | 'Georgia'
  | 'Hawaii'
  | 'Idaho'
  | 'Illinois'
  | 'Indiana'
  | 'Iowa'
  | 'Kansas'
  | 'Kentucky'
  | 'Louisiana'
  | 'Maine'
  | 'Maryland'
  | 'Massachusetts'
  | 'Michigan'
  | 'Minnesota'
  | 'Mississippi'
  | 'Missouri'
  | 'Montana'
  | 'Nebraska'
  | 'Nevada'
  | 'New Hampshire'
  | 'New Jersey'
  | 'New Mexico'
  | 'New York'
  | 'North Carolina'
  | 'North Dakota'
  | 'Ohio'
  | 'Oklahoma'
  | 'Oregon'
  | 'Pennsylvania'
  | 'Rhode Island'
  | 'South Carolina'
  | 'South Dakota'
  | 'Tennessee'
  | 'Texas'
  | 'Utah'
  | 'Vermont'
  | 'Virginia'
  | 'Washington'
  | 'West Virginia'
  | 'Wisconsin'
  | 'Wyoming';

type CanadianPostalCode = `${string}${string}${string} ${string}${string}${string}`;
type USPostalCode = `${string}${string}${string}${string}${string}`;
type PostalCode = CanadianPostalCode | USPostalCode;
type PhoneNumber =
  `+(${string})(${string}${string}${string}) ${string}${string}${string}-${string}${string}${string}${string}`;
type Country = 'Canada' | 'United States';

type Department =
  | 'Executive Management'
  | 'Administrative'
  | 'Sales and Marketing'
  | 'Information Technology'
  | 'Repair Technicians'
  | 'Field Service Technicians'
  | 'Logistics and Inventory'
  | 'Customer Service'
  | 'Quality Control'
  | 'Training and Development'
  | 'Janitorial and Maintenance'
  | 'Security';

type StoreLocation = 'Calgary' | 'Edmonton' | 'Vancouver';
type ExecutiveManagement =
  | 'Chief Executive Officer'
  | 'Chief Operations Officer'
  | 'Chief Financial Officer'
  | 'Chief Technology Officer'
  | 'Chief Marketing Officer';

type AdministrativeDepartment =
  | 'Office Manager'
  | 'Administrative Assistant'
  | 'Human Resources Manager'
  | 'Accountant';

type SalesAndMarketing =
  | 'Sales Manager'
  | 'Marketing Manager'
  | 'Sales Representative'
  | 'Digital Marketing Specialist';

type InformationTechnology =
  | 'IT Manager'
  | 'Network Administrator'
  | 'Systems Administrator'
  | 'IT Support Specialist'
  | 'Database Administrator';

type RepairTechnicians =
  | 'Electronics Repair Technician'
  | 'Computer Repair Technician'
  | 'Smartphone Repair Technician'
  | 'Tablet Repair Technician'
  | 'Audio/Video Equipment Repair Technician';

type FieldServiceTechnicians = 'On-Site Repair Technician' | 'Mobile Device Technician';

type LogisticsAndInventory = 'Warehouse Manager' | 'Inventory Clerk' | 'Delivery Driver';

type CustomerService = 'Customer Service Representative' | 'Technical Support Specialist';

type QualityControl = 'Quality Assurance Inspector' | 'Testing and Diagnostics Specialist';

type TrainingAndDevelopment = 'Technical Trainer';

type JanitorialAndMaintenance = 'Janitor/Cleaner';

type Security = 'Security Guard';

type JobPosition =
  | ExecutiveManagement
  | AdministrativeDepartment
  | SalesAndMarketing
  | InformationTechnology
  | RepairTechnicians
  | FieldServiceTechnicians
  | LogisticsAndInventory
  | CustomerService
  | QualityControl
  | TrainingAndDevelopment
  | JanitorialAndMaintenance
  | Security;

type PreferredPronouns = 'He/Him' | 'She/Her' | 'They/Them' | 'Other' | 'Prefer not to say';

type UserSchema = {
  username: string;
  password: string;
  email: string;

  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  preferredPronouns: PreferredPronouns;
  profilePictureUrl: string;
  dateOfBirth: NativeDate;

  contactNumber: PhoneNumber;
  address: {
    addressLine: string;
    city: string;
    province: Province;
    state: StatesUS;
    postalCode: PostalCode;
    country: Country;
  };

  jobPosition: JobPosition;
  department: Department;
  storeLocation: StoreLocation;

  emergencyContact: {
    fullName: string;
    phoneNumber: PhoneNumber;
  };
  startDate: NativeDate;
  roles: UserRoles;
  active: boolean;
};

type UserDocument = UserSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const userSchema = new Schema<UserSchema>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    middleName: {
      type: String,
      required: false,
      default: '',
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    preferredName: {
      type: String,
      required: false,
      default: '',
    },
    preferredPronouns: {
      type: String,
      required: false,
      default: 'Prefer not to say',
    },
    profilePictureUrl: {
      type: String,
      required: false,
      default: '',
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },

    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    address: {
      addressLine: {
        type: String,
        required: [true, 'Address line 1 is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      province: {
        type: String,
        required: false,
        default: '',
      },
      state: {
        type: String,
        required: false,
        default: '',
      },
      postalCode: {
        type: String,
        required: [true, 'Postal code is required'],
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
    },

    jobPosition: {
      type: String,
      required: [true, 'Job position is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    storeLocation: {
      type: String,
      required: [true, 'Store location is required'],
    },

    emergencyContact: {
      fullName: {
        type: String,
        required: [true, 'Emergency contact full name is required'],
      },
      phoneNumber: {
        type: String,
        required: [true, 'Emergency contact number is required'],
      },
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    roles: {
      type: [String],
      required: false,
      default: ['Employee'],
    },
    active: {
      type: Boolean,
      required: [true, 'Active status is required'],
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<UserDocument>('User', userSchema);

export { UserModel };
export type {
  UserSchema,
  UserDocument,
  UserRoles,
  PostalCode,
  PhoneNumber,
  Country,
  JobPosition,
  Department,
  Province,
  PreferredPronouns,
  StatesUS,
  StoreLocation,
};
