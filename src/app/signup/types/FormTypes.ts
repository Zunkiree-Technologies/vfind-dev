export type FormDataType = {
    jobTypes:string;
    openToOtherTypes: string;
    startTime: string;
    startDate: string;
    jobSearchStatus: string;
     shiftPreferences: string[];
    qualification: string ;
    otherQualification: string;
    workingInHealthcare: string;
    experience: string;
    organisation: string;
    locationPreference: string;
    preferredLocations: string[];
    certifications: string[];
    residencyStatus: string;
    visaType: string;
    visaDuration: string;
    workHoursRestricted: string;
    maxWorkHours: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    postcode: string;
    currentResidentialLocation?: string;
    termsAccepted: boolean;
    visibilityStatus: string;
    photoIdFile: File | null;
};

export interface StepProps {
    formData: FormDataType;
    handleChange: <K extends keyof FormDataType>(field: K, value: FormDataType[K]) => void;
    handleCheckboxChange: <K extends keyof FormDataType>(field: K, value: string) => void;
}