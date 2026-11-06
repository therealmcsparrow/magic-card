// Own rig paths of the icon library: filled paths on the 24 grid, one per piece, holes by opposite winding; a spec's `own`
// list is in piece order. Cut from MDI (Pictogrammers, Apache-2.0): cctv, wind-turbine, string-lights, skull, bat. Own
// drawings (MIT, this repository): printer-3d, laser-cutter.

// Security camera (MDI "cctv"): the mount (joint disc around 16,13, arm, wall bracket) drawn first so
// the head covers the joint; the head is the camera body plus the front hood and pans around [16, 13].
export const CCTV_MOUNT = 'M16 10.5A2.5 2.5 0 0 1 17 15.29V18H22V20H17C15.9 20 15 19.1 15 18V15.29A2.5 2.5 0 0 1 16 10.5Z';
export const CCTV_HEAD_BODY = 'M8.31 9L16.44 4.28C17.45 3.7 18.74 4.05 19.33 5.06L20.71 7.46C21.3 8.47 20.95 9.76 19.94 10.35L11.81 15.04C10.86 15.59 9.63 15.26 9.08 14.31L7.58 11.71C7.03 10.75 7.36 9.53 8.31 9Z';
export const CCTV_HEAD_HOOD = 'M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62Z';

// Wind turbine (MDI "wind-turbine"): tower, then the rotor (hub with its hole, three blades) around [12, 9].
export const WIND_TURBINE = [
  'M11 11.5H13V19C15 19 15 21 15 21V22H9V21C9 21 9 19 11 19Z',
  'M9 9A3 3 0 1 0 15 9A3 3 0 1 0 9 9Z M10.5 9A1.5 1.5 0 1 1 13.5 9A1.5 1.5 0 1 1 10.5 9Z',
  'M11.69 6.03L12.5 3.44C12.5 3.44 13.09 1.53 15 2.11L13.64 6.5Z',
  'M9.13 8.18L4.67 9.63C5.31 11.53 7.2 10.9 7.2 10.9L9.27 10.23Z',
  'M14.72 10.24L16.21 11.75C16.21 11.75 17.62 13.16 16.21 14.58L13.33 11.67Z',
];

// String lights (MDI "string-lights"): the wire, then three bulbs (outline with a hole) hanging from it.
export const STRING_LIGHTS = [
  'M2 5C4 6.07 7.47 7.03 12 7.03S20 6.07 22 5V7.23C21.57 7.41 21.11 7.58 20.63 7.74C19.4 8.15 18.1 8.46 16.74 8.67C15.86 8.81 14.95 8.9 14 8.96C13.35 9 12.68 9.02 12 9.02C11.32 9.02 10.65 9 10 8.96C9.05 8.9 8.14 8.81 7.26 8.67C5.9 8.46 4.6 8.15 3.37 7.74C2.89 7.58 2.43 7.41 2 7.23Z',
  'M3.37 7.74L2.95 9.44C2.18 9.85 1.64 10.59 1.44 11.39C.905 13.57 .385 17.31 2.92 17.93C4 18.2 6 17.89 7.27 12.82C7.46 12 7.33 11.12 6.84 10.39L7.26 8.67Z M5.81 12.47C5.81 12.47 4.74 16.84 3.28 16.5C1.82 16.12 2.9 11.75 2.9 11.75S3.26 10.29 4.71 10.65 5.81 12.47 5.81 12.47Z',
  'M10 8.96V10.74C9.35 11.33 9 12.17 9 13C9 15.24 9.39 19 12 19C13.12 19 15 18.22 15 13C15 12.17 14.65 11.33 14 10.74V8.96Z M12 17.5C10.5 17.5 10.5 13 10.5 13S10.5 11.5 12 11.5 13.5 13 13.5 13 13.5 17.5 12 17.5Z',
  'M16.74 8.67L17.16 10.39C16.67 11.12 16.54 12 16.73 12.82C18 17.89 20 18.2 21.08 17.93C23.61 17.31 23.09 13.57 22.56 11.39C22.36 10.59 21.82 9.85 21.05 9.44L20.63 7.74Z M20.72 16.5C19.27 16.84 18.19 12.47 18.19 12.47S17.83 11 19.29 10.65 21.1 11.75 21.1 11.75 22.18 16.12 20.72 16.5Z',
];

// Skull (MDI "skull"): the cranium (eyes and nose are holes), then the jaw redrawn with a gap.
export const SKULL = [
  'M12 2A9 9 0 0 0 3 11C3 13.6 4.1 16 6 17.9H18C19.9 16 21 13.6 21 11A9 9 0 0 0 12 2Z M8,11A2,2 0 0,1 10,13A2,2 0 0,1 8,15A2,2 0 0,1 6,13A2,2 0 0,1 8,11Z M16,11A2,2 0 0,1 18,13A2,2 0 0,1 16,15A2,2 0 0,1 14,13A2,2 0 0,1 16,11Z M12,14L13.5,17H10.5Z',
  'M7 18.9H17V22H15V20H13V22H11V20H9V22H7Z',
];

// Bat (MDI "bat"), cut at the shoulders: the body first so the wings overlap it.
export const BAT = [
  'M10.5 11C10.5 11 11 12 12 12C13 12 13.5 11 13.5 11V12.75C13.5 14 13.4 15 12.9 15.9C12.5 16.7 12 18.5 12 18.5C12 18.5 11.5 16.7 11.1 15.9C10.6 15 10.5 14 10.5 12.75Z',
  'M0.75 8C0.75 8 5 7 8 9C8 9 8.5 12.75 10.5 12.75L11 15.2C9.9 14.95 8.4 15.45 7 15.75C7 15.75 7 12.5 3 12.5C3 12.5 2.75 9 0.75 8Z',
  'M23.25 8C23.25 8 19 7 16 9C16 9 15.5 12.75 13.5 12.75L13 15.2C14.1 14.95 15.6 15.45 17 15.75C17 15.75 17 12.5 21 12.5C21 12.5 21.25 9 23.25 8Z',
];

// 3D printer (own drawing): frame, bed, print, then the toolhead (rail, head).
export const PRINTER_3D = [
  'M3 2H21V4H3Z M4 4H6V19H4Z M18 4H20V19H18Z M2 19H22V21H2Z',
  'M6.5 17H17.5V18.5H6.5Z',
  'M8.5 14.5H15.5V17H8.5Z',
  'M6 10.5H18V12H6Z',
  'M8 8.5H12V12.5H10.9L10.4 14H9.6L9.1 12.5H8Z',
];

// Laser cutter (own drawing): case with window, lid, rail, material, laser head, beam; the spark is a RigShape.
export const LASER_CUTTER = ['M2 6H22V20H2Z M4 8V17H20V8Z', 'M3 3H21V5H3Z', 'M4 9H20V10.25H4Z', 'M5 15.25H19V16.5H5Z', 'M9 8.25H12V11.5H11.1L10.5 12.5L9.9 11.5H9Z', 'M10 12.5H11V15.25H10Z'];
export const LASER_SPARK = 'M10.5 13.4L11.05 14.7L12.35 15.25L11.05 15.8L10.5 17.1L9.95 15.8L8.65 15.25L9.95 14.7Z';
