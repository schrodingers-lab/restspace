export const displayPhone = (phoneNumber: string) => {
  if (!phoneNumber) return '';
  if (phoneNumber?.length < 4) return phoneNumber;
  return `${'*'.repeat(phoneNumber.length - 4)}${phoneNumber.slice(-4)}`;
};

export const displayLevelColor = incident => {
  if (
    incident.stolenvehicle ||
    incident.breakenter ||
    incident.propertydamage ||
    incident.violencethreat ||
    incident.theft
  )
    return  '#f15a24'; //'primary';
  if (incident.loitering || incident.disturbance || incident.suspicious || incident.unfamiliar)
    return '#edb576'; //'secondary';
  return 'gray';
};


export const displayCoverImage = (cover_image_url) => {
   return  cover_image_url ? cover_image_url : "/imgs/default_cover_image.png"
}