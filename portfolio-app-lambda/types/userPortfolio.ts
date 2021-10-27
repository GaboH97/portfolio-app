interface UserPortfolio {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto: string
    title: string;
    description: string;
    experienceSummary: string;
    userId?: string;
    username?: string;
}

type EditableUserPortfolio = Partial<Omit<UserPortfolio, 'id'>>;