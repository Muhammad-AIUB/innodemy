const isUpcomingWebinar = (date: string): boolean => {
    return new Date(date) > new Date();
};

export default isUpcomingWebinar;
