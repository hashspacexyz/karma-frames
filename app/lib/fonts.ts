export const nyghtSerifMedium = await fetch(
  "https://assets-devrel.s3.ap-south-1.amazonaws.com/OCS/NyghtSerif-Medium.ttf"
).then((res) => res.arrayBuffer())

export const nyghtSerifBold = await fetch(
  "https://assets-devrel.s3.ap-south-1.amazonaws.com/OCS/NyghtSerif-Bold.ttf"
).then((res) => res.arrayBuffer())
