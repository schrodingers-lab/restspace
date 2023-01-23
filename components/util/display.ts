export const displayPhone = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    if (phoneNumber?.length < 4) return phoneNumber;
    return `${'*'.repeat(phoneNumber.length - 4)}${phoneNumber.slice(-4)}`;
}