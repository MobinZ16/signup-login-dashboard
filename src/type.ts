export interface PersonalInfo{
    userName: string;
    email: string;
    password: string;
    confirmPassword: string
}

export interface PersonalInfoErrors {
    userName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

